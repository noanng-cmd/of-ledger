"use client";

import { useEffect, useState } from "react";

type Listing = {
  discord_message_id: string;
  display_name: string;
  price_zcoin: number;
};

export default function MarketTicker() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/market/live?limit=12", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (mounted) setListings(payload.listings ?? []);
      } catch {
        // ticker stays silent if the API is temporarily unavailable
      }
    }

    load();
    const timer = window.setInterval(load, 5000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const items = listings.length
    ? listings.map((listing) => `${listing.display_name} • ${Number(listing.price_zcoin).toLocaleString("pt-BR")} zCoin`)
    : ["Aguardando novas entradas do zMarket..."];

  return (
    <div className="marketTicker" aria-label="Últimas entradas no Market">
      <span className="tickerLabel"><i /> MARKET LIVE</span>
      <div className="tickerViewport">
        <div className="tickerTrack">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
