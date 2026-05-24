import { Router } from "express";
import { db } from "@workspace/db";
import {
  platformsTable,
  usersTable,
  balancesTable,
  transactionsTable,
} from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

/**
 * Generic offerwall postback endpoint.
 * Supports MyChips, Torox, OfferToro, CPX Research, Lootably, Adgate, BitLabs, and most others.
 *
 * Postback URL to enter in offerwall dashboard:
 *   https://YOUR_DOMAIN/api/postback/{platformId}?user_id={USER_ID}&amount={AMOUNT}&txid={TID}&secret=YOUR_SECRET_KEY
 *
 * Parameter aliases accepted:
 *   user_id  | uid | user
 *   amount   | reward | payout | coins
 *   txid     | transaction_id | offer_id | tid | oid
 *   secret   | hash | key | sig
 */
router.get("/postback/:platformId", async (req, res) => {
  const platformId = parseInt(req.params.platformId as string);

  if (isNaN(platformId)) {
    logger.warn("Postback: invalid platformId");
    res.status(400).send("ERROR: Invalid platform");
    return;
  }

  const q = req.query as Record<string, string>;

  const userId   = q.user_id   ?? q.uid      ?? q.user   ?? "";
  const rawAmt   = q.amount    ?? q.reward   ?? q.payout ?? q.coins ?? "";
  const txid     = q.txid      ?? q.transaction_id ?? q.offer_id ?? q.tid ?? q.oid ?? "";
  const secret   = q.secret    ?? q.hash     ?? q.key    ?? q.sig  ?? "";

  if (!userId || !rawAmt || !txid) {
    logger.warn({ q }, "Postback: missing required params");
    res.status(400).send("ERROR: Missing required params");
    return;
  }

  const amount = parseFloat(rawAmt);
  if (isNaN(amount) || amount <= 0) {
    logger.warn({ rawAmt }, "Postback: invalid amount");
    res.status(400).send("ERROR: Invalid amount");
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
