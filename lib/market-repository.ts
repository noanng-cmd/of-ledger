import { getPool } from "./db";
import type { ParsedMarketListing } from "./market-parser";
import { PARSER_VERSION } from "./market-parser";

export type MarketEventInput = {
  guildId: string;
  channelId: string;
  eventType: "created" | "updated" | "deleted";
  messageId: string;
  payload: unknown;
};

export async function saveMarketListing(
  event: MarketEventInput,
  listing: ParsedMarketListing
) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO raw_market_events
        (discord_message_id, guild_id, channel_id, event_type, payload, parser_version)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [
        event.messageId,
        event.guildId,
        event.channelId,
        event.eventType,
        JSON.stringify(event.payload),
        PARSER_VERSION
      ]
    );

    await client.query(
      `INSERT INTO market_listings
        (discord_message_id, guild_id, channel_id, item_raw, display_name, item_name,
         enchant, item_level, sealed, price_zcoin, listed_at, status, raw_payload, parser_version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'observed',$12::jsonb,$13)
       ON CONFLICT (discord_message_id) DO UPDATE SET
         item_raw = EXCLUDED.item_raw,
         display_name = EXCLUDED.display_name,
         item_name = EXCLUDED.item_name,
         enchant = EXCLUDED.enchant,
         item_level = EXCLUDED.item_level,
         sealed = EXCLUDED.sealed,
         price_zcoin = EXCLUDED.price_zcoin,
         listed_at = EXCLUDED.listed_at,
         raw_payload = EXCLUDED.raw_payload,
         parser_version = EXCLUDED.parser_version,
         last_seen_at = NOW()`,
      [
        listing.discordMessageId,
        event.guildId,
        event.channelId,
        listing.itemRaw,
        listing.displayName,
        listing.itemName,
        listing.enchant,
        listing.level,
        listing.sealed,
        listing.priceZcoin,
        listing.listedAt,
        JSON.stringify(event.payload),
        PARSER_VERSION
      ]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function markMarketListingInactive(event: MarketEventInput) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO raw_market_events
        (discord_message_id, guild_id, channel_id, event_type, payload, parser_version)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [
        event.messageId,
        event.guildId,
        event.channelId,
        event.eventType,
        JSON.stringify(event.payload),
        PARSER_VERSION
      ]
    );

    await client.query(
      `UPDATE market_listings
       SET status = 'inactive', inactive_at = NOW(), last_seen_at = NOW()
       WHERE discord_message_id = $1`,
      [event.messageId]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getLatestMarketListings(limit = 30) {
  const pool = getPool();
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const result = await pool.query(
    `SELECT discord_message_id, display_name, item_name, enchant, item_level, sealed,
            price_zcoin::float8 AS price_zcoin, listed_at, status
     FROM market_listings
     ORDER BY listed_at DESC
     LIMIT $1`,
    [safeLimit]
  );

  return result.rows;
}
