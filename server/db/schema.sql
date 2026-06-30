-- Run once in the Supabase SQL editor.
-- user_id columns reference auth.users(id) — Supabase's built-in auth table.
-- Supabase user IDs are UUIDs.

-- Short Q&A collected in Step 4 (Preferences)
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  categories      TEXT[]       DEFAULT '{}',
  listing_style   VARCHAR(100),
  monthly_goal    INTEGER,
  experience_level VARCHAR(50),
  primary_goal    VARCHAR(100),
  completed_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- eBay OAuth tokens per user
CREATE TABLE IF NOT EXISTS ebay_connections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token     TEXT        NOT NULL,
  refresh_token    TEXT        NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  ebay_user_id     VARCHAR(255),
  store_name       VARCHAR(255),
  last_synced_at   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- eBay listings synced via Sell Inventory API
CREATE TABLE IF NOT EXISTS ebay_listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebay_item_id  VARCHAR(255) NOT NULL,
  title         TEXT,
  price         NUMERIC(10,2),
  quantity      INTEGER,
  quantity_sold INTEGER      DEFAULT 0,
  status        VARCHAR(50),
  category      VARCHAR(255),
  image_url     TEXT,
  listing_url   TEXT,
  listed_at     TIMESTAMPTZ,
  synced_at     TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(user_id, ebay_item_id)
);

-- eBay orders synced via Sell Fulfillment API
CREATE TABLE IF NOT EXISTS ebay_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ebay_order_id   VARCHAR(255) NOT NULL,
  total_amount    NUMERIC(10,2),
  currency        VARCHAR(10)  DEFAULT 'USD',
  status          VARCHAR(50),
  buyer_username  VARCHAR(255),
  item_count      INTEGER,
  shipping_cost   NUMERIC(10,2),
  ebay_fees       NUMERIC(10,2),
  ordered_at      TIMESTAMPTZ,
  synced_at       TIMESTAMPTZ  DEFAULT NOW(),
  UNIQUE(user_id, ebay_order_id)
);
