import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../../lib/db";
import { getLatestMarketListings } from "../../../../lib/market-repository";

const demo = [
  { discord_message_id: "demo-1", display_name: "Venir's Talisman Lv. 27 (Sealed)", item_name: "Venir's Talisman", enchant: null, item_level: 27, sealed: true, price_zcoin: 87, listed_at: "2026-09-27T13:44:41.000Z", status: "observed" },
  { discord_message_id: "demo-2", display_name: "+8 Agathion Dragon Egg (Sealed)", item_name: "Agathion Dragon Egg", enchant: 8, item_level: null, sealed: true, price_zcoin: 64, listed_at: "2026-09-27T13:44:21.000Z", status: "observed" },
  { discord_message_id: "demo-3", display_name: "CON Dye (Lv. 16)", item_name: "CON Dye", enchant: null, item_level: 16, sealed: false, price_zcoin: 19, listed_at: "2026-09-27T13:43:27.000Z", status: "observed" },
  { discord_message_id: "demo-4", display_name: "+8 Cloak of Protection (Sealed)", item_name: "Cloak of Protection", enchant: 8, item_level: null, sealed: true, price_zcoin: 59, listed_at: "2026-09-27T13:40:34.000Z", status: "observed" },
  { discord_message_id: "demo-5", display_name: "Einhasad's Pendant Lv. 4 (Sealed)", item_name: "Einhasad's Pendant", enchant: null, item_level: 4, sealed: true, price_zcoin: 65, listed_at: "2026-09-27T15:11:52.000Z", status: "observed" }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "30");

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ source: "demo", listings: demo.slice(0, limit) });
  }

  const listings = await getLatestMarketListings(limit);
  return NextResponse.json({ source: "database", listings });
}
