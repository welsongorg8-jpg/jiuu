import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  platformsTable,
  usersTable,
  balancesTable,
  transactionsTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

/**
 * Generic offerwall postback handler.
 *
 * Supports two URL formats:
 *   1) /api/postback/{platformId}  — standard (platform ID in path)
 *   2) /file?pid={platformId}      — CPX Research / platforms that use a fixed path
 *
 * Param resolution (custom names first → built-in aliases):
 *   user_id   → platform.paramUserId  || user_id, uid, user
 *   amount    → platform.paramAmount  || amount, reward, payout, coins, amount_usd, amount_local
 *   txid      → platform.paramTxid    || txid, trans_id, transaction_id, offer_id, tid, oid
 *   secret    → platform.secretKey    vs  secret, hash, key, sig
 *
 * CPX Research postback URL format:
 *   https://YOUR_DOMAIN/file?pid={PLATFORM_ID}&user_id={EXT_USER_ID}&trans_id={TRANS_ID}&amount_usd={REWARD}&hash={HASH}
 */

// ─── Shared processing logic ─────────────────────────────────────────────────

async function handlePostback(
  platform: typeof platformsTable.$inferSelect,
  q: Record<string, string>,
  res: Response,
) {
  if (!platform.isEnabled) {
    res.status(403).send("ERROR: Platform disabled");
    return;
  }

  // Resolve param values: custom name first → built-in aliases
  const userId =
    (platform.paramUserId ? q[platform.paramUserId] : undefined) ??
    q.user_id ?? q.uid ?? q.user ?? "";

  const rawAmt =
    (platform.paramAmount ? q[platform.paramAmount] : undefined) ??
    q.amount ?? q.reward ?? q.payout ?? q.coins ?? q.amount_usd ?? q.amount_local ?? "";

  const txid =
    (platform.paramTxid ? q[platform.paramTxid] : undefined) ??
    q.txid ?? q.trans_id ?? q.transaction_id ?? q.offer_id ?? q.tid ?? q.oid ?? "";

  const secret = q.secret ?? q.hash ?? q.key ?? q.sig ?? "";

  if (!userId || !rawAmt || !txid) {
    logger.warn({ q, platformId: platform.id }, "Postback: missing required params");
    res.status(400).send("ERROR: Missing required params");
    return;
  }

  const amount = parseFloat(rawAmt);
  if (isNaN(amount) || amount <= 0) {
    logger.warn({ rawAmt }, "Postback: invalid amount");
    res.status(400).send("ERROR: Invalid amount");
    return;
  }

  if (platform.secretKey) {
    if (!secret || secret !== platform.secretKey) {
      logger.warn({ platformId: platform.id, secret: "***" }, "Postback: invalid secret");
      res.status(403).send("ERROR: Invalid secret");
      return;
    }
  }

  const uid = parseInt(userId);
  if (isNaN(uid)) {
    res.status(400).send("ERROR: Invalid user_id");
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, uid))
    .limit(1);

  if (!user || user.status !== "active") {
    logger.warn({ uid }, "Postback: user not found or not active");
    res.status(404).send("ERROR: User not found");
    return;
  }

  const description = `[${platform.name}] Offer #${txid}`;

  const [duplicate] = await db
    .select({ id: transactionsTable.id })
    .from(transactionsTable)
    .where(
      and(
        eq(transactionsTable.userId, uid),
        eq(transactionsTable.description, description),
      ),
    )
    .limit(1);

  if (duplicate) {
    logger.info({ uid, txid }, "Postback: duplicate transaction, ignoring");
    res.send("OK");
    return;
  }

  await db.transaction(async (tx) => {
    let [balance] = await tx
      .select()
      .from(balancesTable)
      .where(eq(balancesTable.userId, uid))
      .limit(1);

    if (!balance) {
      [balance] = await tx
        .insert(balancesTable)
        .values({ userId: uid })
        .returning();
    }

    const before = parseFloat(balance.balance);
    const after  = before + amount;

    await tx
      .update(balancesTable)
      .set({
        balance:      after.toFixed(8),
        totalEarned:  (parseFloat(balance.totalEarned) + amount).toFixed(8),
        updatedAt:    new Date(),
      })
      .where(eq(balancesTable.userId, uid));

    await tx.insert(transactionsTable).values({
      userId:        uid,
      type:          "earning",
      amount:        amount.toFixed(8),
      balanceBefore: before.toFixed(8),
      balanceAfter:  after.toFixed(8),
      description,
      status:        "completed",
    });
  });

  logger.info({ uid, amount, platform: platform.name, txid }, "Postback: credited");
  res.send("OK");
}

// ─── Helper: load platform by ID ─────────────────────────────────────────────

async function loadPlatform(platformId: number, res: Response) {
  const [platform] = await db
    .select()
    .from(platformsTable)
    .where(eq(platformsTable.id, platformId))
    .limit(1);

  if (!platform) {
    logger.warn({ platformId }, "Postback: platform not found");
    res.status(404).send("ERROR: Platform not found");
    return null;
  }

  return platform;
}

// ─── Route 1: /api/postback/:platformId  (standard) ──────────────────────────

router.get("/postback/:platformId", async (req: Request, res: Response) => {
  const platformId = parseInt(req.params.platformId as string);

  if (isNaN(platformId)) {
    logger.warn("Postback: invalid platformId");
    res.status(400).send("ERROR: Invalid platform");
    return;
  }

  const platform = await loadPlatform(platformId, res);
  if (!platform) return;

  await handlePostback(platform, req.query as Record<string, string>, res);
});

// ─── Route 2: /file  (CPX Research and platforms using a fixed path) ──────────
//
// Add pid={PLATFORM_ID} as a static param in the offerwall dashboard:
//   https://YOUR_DOMAIN/file?pid=1&user_id={EXT_USER_ID}&trans_id={TRANS_ID}&amount_usd={REWARD}&hash={HASH}

router.get("/file", async (req: Request, res: Response) => {
  const q = req.query as Record<string, string>;
  const platformId = parseInt(q.pid || "");

  if (isNaN(platformId)) {
    logger.warn({ q }, "Postback /file: missing or invalid pid param");
    res.status(400).send("ERROR: Missing pid param — add &pid={PLATFORM_ID} to the postback URL");
    return;
  }

  const platform = await loadPlatform(platformId, res);
  if (!platform) return;

  await handlePostback(platform, q, res);
});

export default router;
