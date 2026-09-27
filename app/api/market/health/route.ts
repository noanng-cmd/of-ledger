import { NextResponse } from "next/server";
import { getPool, isDatabaseConfigured } from "../../../../lib/db";

export async function GET() {
  const databaseConfigured = isDatabaseConfigured();
  let databaseReachable = false;

  if (databaseConfigured) {
    try {
      await getPool().query("SELECT 1");
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  return NextResponse.json({
    service: "of-ledger",
    status: databaseConfigured && databaseReachable ? "ready" : "integration-pending",
    parser: "ready",
    ingestEndpoint: "ready",
    databaseConfigured,
    databaseReachable,
    zmarket: {
      guildId: process.env.DISCORD_GUILD_ID ?? "1117270667520393216",
      channelId: process.env.DISCORD_MARKET_CHANNEL_ID ?? "1375274626472738898"
    }
  });
}
