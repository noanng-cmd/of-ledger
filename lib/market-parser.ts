export const PARSER_VERSION = "1.0.0";

export type DiscordEmbedPayload = {
  title?: string | null;
  description?: string | null;
  fields?: Array<{ name?: string | null; value?: string | null }>;
  footer?: { text?: string | null } | null;
};

export type DiscordMessagePayload = {
  id: string;
  createdAt: string;
  content?: string | null;
  embeds?: DiscordEmbedPayload[];
};

export type ParsedMarketListing = {
  discordMessageId: string;
  itemRaw: string;
  displayName: string;
  itemName: string;
  enchant: number | null;
  level: number | null;
  sealed: boolean;
  priceZcoin: number;
  listedAt: string;
};

function flattenMessage(message: DiscordMessagePayload) {
  const parts: string[] = [];
  if (message.content) parts.push(message.content);

  for (const embed of message.embeds ?? []) {
    if (embed.title) parts.push(embed.title);
    if (embed.description) parts.push(embed.description);
    for (const field of embed.fields ?? []) {
      if (field.name) parts.push(field.name);
      if (field.value) parts.push(field.value);
    }
    if (embed.footer?.text) parts.push(embed.footer.text);
  }

  return parts.join("\n");
}

function parsePrice(raw: string) {
  const value = raw.trim();
  if (!value) return Number.NaN;

  const hasComma = value.includes(",");
  const hasDot = value.includes(".");

  if (hasComma && hasDot) {
    const lastComma = value.lastIndexOf(",");
    const lastDot = value.lastIndexOf(".");
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    return Number(value.split(thousandsSeparator).join("").replace(decimalSeparator, "."));
  }

  if (hasComma) {
    const parts = value.split(",");
    if (parts.length === 2 && parts[1].length <= 4) {
      return Number(parts[0].replace(/\./g, "") + "." + parts[1]);
    }
    return Number(value.replace(/,/g, ""));
  }

  return Number(value.replace(/,/g, ""));
}

function normalizeItem(itemRaw: string) {
  const displayName = itemRaw
    .replace(/\(null\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const sealed = /\(sealed\)/i.test(displayName);
  let working = displayName.replace(/\(sealed\)/gi, "").trim();

  const enchantMatch = working.match(/^\+(\d+)\s+/i);
  const enchant = enchantMatch ? Number(enchantMatch[1]) : null;
  if (enchantMatch) working = working.slice(enchantMatch[0].length).trim();

  const levelMatch = working.match(/\bLv\.?\s*(\d+)\b/i);
  const level = levelMatch ? Number(levelMatch[1]) : null;
  if (levelMatch) working = working.replace(levelMatch[0], "").replace(/\s+/g, " ").trim();

  working = working
    .replace(/\(\s*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    displayName,
    itemName: working || displayName,
    enchant,
    level,
    sealed
  };
}

export function parseZMarketMessage(message: DiscordMessagePayload): ParsedMarketListing | null {
  const text = flattenMessage(message);

  const itemMatch = text.match(/(.+?)\s+was added on the market\b/i);
  const priceMatch = text.match(/Price:\s*[^\d]*([\d.,]+)\s*zCoin\b/i);

  if (!itemMatch || !priceMatch) return null;

  const itemRaw = itemMatch[1].trim();
  const priceZcoin = parsePrice(priceMatch[1]);
  if (!Number.isFinite(priceZcoin)) return null;

  const normalized = normalizeItem(itemRaw);

  return {
    discordMessageId: message.id,
    itemRaw,
    ...normalized,
    priceZcoin,
    listedAt: new Date(message.createdAt).toISOString()
  };
}
