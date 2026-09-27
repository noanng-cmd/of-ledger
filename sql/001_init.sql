CREATE TABLE IF NOT EXISTS raw_market_events (
  id BIGSERIAL PRIMARY KEY,
  discord_message_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'updated', 'deleted')),
  payload JSONB NOT NULL,
  parser_version TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_raw_market_events_message
  ON raw_market_events (discord_message_id, received_at DESC);

CREATE TABLE IF NOT EXISTS market_listings (
  id BIGSERIAL PRIMARY KEY,
  discord_message_id TEXT NOT NULL UNIQUE,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  item_raw TEXT NOT NULL,
  display_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  enchant INTEGER,
  item_level INTEGER,
  sealed BOOLEAN NOT NULL DEFAULT FALSE,
  price_zcoin NUMERIC(20,4) NOT NULL CHECK (price_zcoin >= 0),
  listed_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'observed'
    CHECK (status IN ('observed', 'inactive', 'expired', 'removed', 'sold_confirmed')),
  image_url TEXT,
  inactive_at TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB NOT NULL,
  parser_version TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_market_listings_item_time
  ON market_listings (item_name, listed_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_listings_time
  ON market_listings (listed_at DESC);

CREATE INDEX IF NOT EXISTS idx_market_listings_price
  ON market_listings (item_name, price_zcoin);

DROP VIEW IF EXISTS market_item_7d;

CREATE VIEW market_item_7d AS
SELECT
  item_name,
  COUNT(*) AS listing_count,
  MIN(price_zcoin) AS min_price,
  MAX(price_zcoin) AS max_price,
  AVG(price_zcoin) AS average_price,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price_zcoin) AS p25_price,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price_zcoin) AS p75_price,
  MAX(listed_at) AS last_seen_at
FROM market_listings
WHERE listed_at >= NOW() - INTERVAL '7 days'
GROUP BY item_name;
