"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MarketItemVisual from "./MarketItemVisual";

type Listing = {
  discord_message_id: string;
  display_name: string;
  item_name: string;
  enchant: number | null;
  item_level: number | null;
  sealed: boolean;
  price_zcoin: number;
  listed_at: string;
  status: string;
  image_url?: string | null;
};

type Payload = {
  source: "demo" | "database";
  listings: Listing[];
};

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function itemLink(listing: Listing) {
  const params = new URLSearchParams({
    name: listing.display_name,
    price: String(listing.price_zcoin),
    seen: listing.listed_at
  });
  if (listing.image_url) params.set("image", listing.image_url);
  return `/item?${params.toString()}`;
}

export default function MarketLiveBoard() {
  const [data, setData] = useState<Payload>({ source: "demo", listings: [] });
  const [query, setQuery] = useState("");
  const [onlySealed, setOnlySealed] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await fetch("/api/market/live?limit=50", { cache: "no-store" });
      if (!response.ok) return;
      setData(await response.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const listings = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.listings.filter((listing) => {
      const matchesQuery =
        !q ||
        listing.display_name.toLowerCase().includes(q) ||
        listing.item_name.toLowerCase().includes(q);
      return matchesQuery && (!onlySealed || listing.sealed);
    });
  }, [data.listings, query, onlySealed]);

  return (
    <section className="marketWorkspace">
      <div className="marketToolbar">
        <div>
          <span className="kicker">MARKET LIVE</span>
          <h1>zMarket em uma visão que dá para usar.</h1>
          <p>
            Item, imagem, preço e momento da entrada. Quando o Discord for autorizado,
            essa mesma tela passa a receber as publicações reais automaticamente.
          </p>
        </div>

        <div className="sourceBadge">
          <i className={data.source === "database" ? "sourceOnline" : ""} />
          {data.source === "database" ? "DADOS REAIS" : "MODO DEMONSTRAÇÃO"}
        </div>
      </div>

      <div className="marketFilters">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar Venir, Cloak, Dye, Agathion..."
          aria-label="Buscar item"
        />
        <label>
          <input
            type="checkbox"
            checked={onlySealed}
            onChange={(event) => setOnlySealed(event.target.checked)}
          />
          somente Sealed
        </label>
        <span>{listings.length} entradas visíveis</span>
      </div>

      <div className="marketTable">
        <div className="marketTableHead">
          <span>ITEM</span>
          <span>PREÇO</span>
          <span>ENTROU NO MARKET</span>
          <span>STATUS</span>
        </div>

        {loading && data.listings.length === 0 ? (
          <div className="marketEmpty">Carregando Market...</div>
        ) : null}

        {listings.map((listing) => (
          <Link className="marketListingRow" href={itemLink(listing)} key={listing.discord_message_id}>
            <span className="marketItemCell">
              <MarketItemVisual
                name={listing.display_name}
                imageUrl={listing.image_url}
              />
              <span>
                <strong>{listing.display_name}</strong>
                <small>
                  {listing.enchant !== null ? `+${listing.enchant} · ` : ""}
                  {listing.item_level !== null ? `Lv. ${listing.item_level} · ` : ""}
                  {listing.sealed ? "Sealed" : "item observado"}
                </small>
              </span>
            </span>

            <span className="marketPrice">
              <strong>{Number(listing.price_zcoin).toLocaleString("pt-BR")}</strong>
              <small>zCoin</small>
            </span>

            <span className="marketTime">{formatTime(listing.listed_at)}</span>
            <span className="listingStatus">{listing.status === "observed" ? "Observado" : listing.status}</span>
          </Link>
        ))}

        {!loading && listings.length === 0 ? (
          <div className="marketEmpty">Nenhum item encontrado com esses filtros.</div>
        ) : null}
      </div>

      <div className="marketNote">
        <strong>Imagem real do item:</strong> o coletor já está preparado para guardar a
        thumbnail/imagem enviada no embed do Discord. Enquanto não temos a liberação do servidor,
        o OF Ledger usa um placeholder visual e não inventa uma imagem do jogo.
      </div>
    </section>
  );
}
