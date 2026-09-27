"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MarketItemVisual from "../../components/MarketItemVisual";
import MarketTicker from "../../components/MarketTicker";

const history = [0.94, 0.98, 0.96, 1.02, 1, 0.97, 1.04, 1.08, 1.01, 0.99, 0.95, 1.03, 1];

function ItemContent() {
  const params = useSearchParams();
  const name = params.get("name") ?? "Item observado";
  const price = Number(params.get("price") ?? "0");
  const image = params.get("image");
  const seen = params.get("seen");

  const baseline = price > 0 ? Math.max(1, Math.round(price * 1.08)) : 60;
  const min = Math.max(1, Math.round(baseline * 0.86));
  const max = Math.round(baseline * 1.34);
  const points = history.map((factor) => Math.round(baseline * factor));

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="OF Ledger">
          <span className="brandOf">OF</span>
          <span className="brandZ">Z</span>
          <span className="brandText">LEDGER</span>
        </Link>
        <nav>
          <Link href="/market">← Voltar ao Market</Link>
        </nav>
        <Link className="discordButtonLink" href="/admin">Status</Link>
      </header>

      <section className="itemDetail">
        <div className="itemHeroCard">
          <MarketItemVisual name={name} imageUrl={image} />
          <div>
            <span className="kicker">ITEM OBSERVADO</span>
            <h1>{name}</h1>
            <p>
              Esta página usa preço anunciado no zMarket como referência. Venda confirmada
              só será exibida quando houver uma fonte que realmente confirme a transação.
            </p>
          </div>
          <div className="itemCurrentPrice">
            <small>ENTRADA ATUAL</small>
            <strong>{price ? price.toLocaleString("pt-BR") : "—"}</strong>
            <span>zCoin</span>
          </div>
        </div>

        <div className="itemMetrics">
          <article><small>REFERÊNCIA 7D</small><strong>{baseline}</strong><span>zCoin</span></article>
          <article><small>MÍNIMO OBSERVADO</small><strong>{min}</strong><span>zCoin</span></article>
          <article><small>MÁXIMO OBSERVADO</small><strong>{max}</strong><span>zCoin</span></article>
          <article><small>CONFIANÇA</small><strong>Demo</strong><span>aguardando base real</span></article>
        </div>

        <div className="itemDetailGrid">
          <article className="panel itemChartPanel">
            <span className="kicker">HISTÓRICO</span>
            <h2>Preço observado</h2>
            <div className="miniChart" aria-label="Gráfico demonstrativo">
              {points.map((point, index) => {
                const height = Math.max(12, Math.round((point / max) * 100));
                return (
                  <span key={index} style={{ height: `${height}%` }}>
                    <i>{point}</i>
                  </span>
                );
              })}
            </div>
            <small className="demoDisclaimer">
              Visual demonstrativo. Os pontos reais virão do PostgreSQL após a integração.
            </small>
          </article>

          <article className="panel">
            <span className="kicker">CONTEXTO</span>
            <h2>Leitura rápida</h2>
            <div className="itemFacts">
              <div><span>Última observação</span><strong>{seen ? new Date(seen).toLocaleString("pt-BR") : "—"}</strong></div>
              <div><span>Fonte</span><strong>zMarket / Discord</strong></div>
              <div><span>Imagem</span><strong>{image ? "capturada do embed" : "aguardando embed real"}</strong></div>
              <div><span>Status</span><strong>Preço anunciado</strong></div>
            </div>
          </article>
        </div>
      </section>

      <MarketTicker />
    </>
  );
}

export default function ItemPage() {
  return (
    <main>
      <Suspense fallback={<div className="pageLoading">Carregando item...</div>}>
        <ItemContent />
      </Suspense>
    </main>
  );
}
