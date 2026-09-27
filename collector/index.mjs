import {
  Client,
  GatewayIntentBits,
  Partials
} from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID ?? "1117270667520393216";
const channelId = process.env.DISCORD_MARKET_CHANNEL_ID ?? "1375274626472738898";
const ingestUrl = process.env.OF_LEDGER_INGEST_URL;
const ingestSecret = process.env.OF_LEDGER_INGEST_SECRET;

if (!token || !ingestUrl || !ingestSecret) {
  console.error("Missing DISCORD_BOT_TOKEN, OF_LEDGER_INGEST_URL or OF_LEDGER_INGEST_SECRET");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message]
});

function serializeMessage(message) {
  return {
    id: message.id,
    createdAt: message.createdAt?.toISOString?.() ?? new Date().toISOString(),
    content: message.content ?? "",
    embeds: (message.embeds ?? []).map((embed) => ({
      title: embed.title,
      description: embed.description,
      fields: embed.fields?.map((field) => ({ name: field.name, value: field.value })) ?? [],
      footer: embed.footer ? { text: embed.footer.text } : null
    }))
  };
}

async function sendEvent(eventType, message) {
  if (message.guildId !== guildId || message.channelId !== channelId) return;

  const response = await fetch(`${ingestUrl.replace(/\/$/, "")}/api/market/ingest`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${ingestSecret}`
    },
    body: JSON.stringify({
      guildId,
      channelId,
      eventType,
      message: serializeMessage(message)
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Ingest failed", response.status, body.slice(0, 500));
  } else {
    const body = await response.json();
    console.log("zmarket event", eventType, body.listing?.item ?? message.id);
  }
}

client.on("messageCreate", (message) => {
  sendEvent("created", message).catch((error) => console.error("messageCreate", error));
});

client.on("messageUpdate", async (_oldMessage, newMessage) => {
  try {
    if (newMessage.partial) await newMessage.fetch();
    await sendEvent("updated", newMessage);
  } catch (error) {
    console.error("messageUpdate", error);
  }
});

client.on("messageDelete", async (message) => {
  try {
    if (message.guildId !== guildId || message.channelId !== channelId) return;

    const response = await fetch(`${ingestUrl.replace(/\/$/, "")}/api/market/ingest`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${ingestSecret}`
      },
      body: JSON.stringify({
        guildId,
        channelId,
        eventType: "deleted",
        message: {
          id: message.id,
          createdAt: message.createdAt?.toISOString?.() ?? new Date().toISOString(),
          content: "",
          embeds: []
        }
      })
    });

    if (!response.ok) {
      console.error("Delete ingest failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("messageDelete", error);
  }
});

client.once("ready", () => {
  console.log(`OF Ledger collector online as ${client.user?.tag}`);
  console.log(`Watching guild ${guildId}, channel ${channelId}`);
});

client.login(token);
