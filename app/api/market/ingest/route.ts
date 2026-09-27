import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/db";
import { parseZMarketMessage, type DiscordMessagePayload } from "../../../../lib/market-parser";
import {
  markMarketListingInactive,
  saveMarketListing,
  type MarketEventInput
} from "../../../../lib/market-repository";

const DEFAULT_GUILD_ID = "1117270667520393216";
const DEFAULT_CHANNEL_ID = "1375274626472738898";

type IngestBody = {
  guildId: string;
  channelId: string;
  eventType?: "created" | "updated" | "deleted";
  message: DiscordMessagePayload;
};

function authorized(request: Request) {
  const expected = process.env.OF_LEDGER_INGEST_SECRET;
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as IngestBody;
  const guildId = process.env.DISCORD_GUILD_ID ?? DEFAULT_GUILD_ID;
  const channelId = process.env.DISCORD_MARKET_CHANNEL_ID ?? DEFAULT_CHANNEL_ID;

  if (body.guildId !== guildId || body.channelId !== channelId) {
    return NextResponse.json({ ignored: true, reason: "outside_zmarket_scope" }, { status: 202 });
  }

  if (!body.message?.id) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "database_not_configured", parserReady: true },
      { status: 503 }
    );
  }

  const event: MarketEventInput = {
    guildId: body.guildId,
    channelId: body.channelId,
    eventType: body.eventType ?? "created",
    messageId: body.message.id,
    payload: body
  };

  if (event.eventType === "deleted") {
    await markMarketListingInactive(event);
    return NextResponse.json({ ok: true, status: "inactive" });
  }

  const listing = parseZMarketMessage(body.message);
  if (!listing) {
    return NextResponse.json(
      { error: "message_not_recognized", messageId: body.message.id },
      { status: 422 }
    );
  }

  await saveMarketListing(event, listing);

  return NextResponse.json({
    ok: true,
    listing: {
      id: listing.discordMessageId,
      item: listing.displayName,
      canonicalItem: listing.itemName,
      enchant: listing.enchant,
      level: listing.level,
      sealed: listing.sealed,
      priceZcoin: listing.priceZcoin,
      listedAt: listing.listedAt
    }
  });
}
