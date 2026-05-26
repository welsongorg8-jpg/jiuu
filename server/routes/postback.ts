import { Router } from "express";
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
 * Generic offerwall postback endpoint.
 * Supports MyChips, Torox, OfferToro, CPX Research, Lootably, Adgate, BitLabs, and most others.
 *
 * Postback URL to enter in offerwall dashboard:
 *   https://YOUR_DOMAIN/api/postback/{platformId}?user_id={USER_ID}&amount={AMOUNT}&txid={TID}&secret=YOUR_SECRET_KEY
 *
 * Each platform can override the param names via its admin settings:
 *   paramUserId  — default: user_id      (also tries: uid, user)
 *   paramAmount  — default: amount       (also tries: reward, payout, coins, amount_usd, amount_local)
 *   paramTxid    — default: txid         (also tries: trans_id, transaction_id, offer_id, tid, oid)
 *
 * Built-in aliases are always checked as fallback so existing platforms are never broken.
 * CPX Research uses: trans_id (txid), amount_usd (amount), hash (secret)
 */
router.get("/postback/:platformId", async (req, res) => {
  const platformId = parseInt(req.params.platformId as string);

  if (isNaN(platformId)) {
    logger.warn("Postback: invalid platformId");
    res.status(400).send("ERROR: Invalid platform");
    return;
  }

  const [platform] = await db
    .select()
    .from(platformsTable)
    .where(eq(platformsTable.id, platformId))
    .limit(1);

  if (!platform) {
    logger.warn({ platformId }, "Postback: platform not found");
    res.status(404).send("ERROR: Platform not found");
    return;
  }

  if (!platform.isEnabled) {
    res.status(403).send("ERROR: Platform disabled");
    return;
  }

  const q = req.query as Record<string, string>;

  // --- Resolve param values using custom names first, then built-in aliases ---
  // user_id
  const userId =
    (platform.paramUserId ? q[platform.paramUserId] : undefined) ??
    q.user_id ?? q.uid ?? q.user ?? "";

  // amount — also handles CPX Research (amount_usd, amount_local) and other platforms
  const rawAmt =
    (platform.paramAmount ? q[platform.paramAmount] : undefined) ??
    q.amount ?? q.reward ?? q.payout ?? q.coins ?? q.amount_usd ?? q.amount_local ?? "";

  // txid — also handles CPX Research (trans_id) and other platforms
  const txid =
    (platform.paramTxid ? q[platform.paramTxid] : undefined) ??
    q.txid ?? q.trans_id ?? q.transaction_id ?? q.offer_id ?? q.tid ?? q.oid ?? "";

  // secret (no custom name needed — platforms use different fields but we keep aliases)
  const secret = q.secret ?? q.hash ?? q.key ?? q.sig ?? "";

  if (!userId || !rawAmt || !txid) {
    logger.warn({ q, platformId }, "Postback: missing required params");
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
      logger.warn({ platformId, secret: "***" }, "Postback: invalid secret");
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
        eq(transactionsTable.description, description)
      )
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
});

export default router;
