"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MarketTicker from "../components/MarketTicker";

type Deal = {
  item: string;
  price: number;
  reference: number;
  listings: number;
  score: number;
};

const deals: Deal[] = [
  { item: "Vesper Breastplate +8", price: 980, reference: 1240, listings: 19, score: 92 },
  { item: "Baium Doll Lv.2", price: 410, reference: 492, listings: 31, score: 89 },
  { item: "Ice Gaiters +8", price: 760, reference: 845, listings: 16, score: 82 },
  { item: "Dragon Belt", price: 1190, reference: 1295, listings: 44, score: 79 }
];

const movements = [
  { item: "Dragon Belt", change: 26.4 },
  { item: "Baium Doll Lv.2", change: 18.8 },
  { item: "Vesper Helmet +8", change: 14.2 },
  { item: "Queen Ant Ring", change: -10.9 },
  { item: "Ice Gaiters +8", change: -8.4 }
];

const characters = [
  { name: "Titan competitivo", gs: "2.421", spirits: "6★", patterns: "Upadas", price: "4.800 zCoin" },
  { name: "Dreadnought competitivo", gs: "2.188", spirits: "5★", patterns: "Upadas", price: "3.950 zCoin" }
];

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return deals;
    return deals.filter((deal) => deal.item.toLowerCase().includes(query));
  }, [search]);

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="OF Ledger">
          <span className="brandOf">OF</span>
          <span className="brandZ">Z</span>
          <span className="brandText">LEDGER</span>
        </Link>

        <nav>
          <Link href="/market">Market</Link>
          <a href="#barganhas">Barganhas</a>
          <a href="#tendencias">Tendências</a>
          <a href="#alertas">Alertas</a>
          <a href="#personagens">Personagens</a>
          <a href="#servicos">Serviços</a>
        </nav>

        <Link className="discordButtonLink" href="/admin">Status do projeto</Link>
      </header>

      <section className="hero" id="inicio">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="eyebrow"><span className="liveDot" /> EMERALD MARKET INTELLIGENCE</div>
        <h1>OF <span>LEDGER</span></h1>
        <p className="mission">
          Dar transparência ao mercado do zGaming Emerald para que os jogadores saibam quanto os itens realmente valem.
        </p>
        <div className="heroActions">
          <Link className="primaryButton" href="/market">Abrir Market Live</Link>
          <a className="secondaryButton" href="#alertas">Criar alerta</a>
        </div>
      </section>

      <section className="stats" aria-label="Indicadores">
        <article>
          <span>OFERTAS MONITORADAS</span>
          <strong>14.832</strong>
          <small>dados simulados no protótipo</small>
        </article>
        <article>
          <span>BARGANHAS AGORA</span>
          <strong>27</strong>
          <small>Deal Score ≥ 75</small>
        </article>
        <article>
          <span>ITENS EM ALTA</span>
          <strong>14</strong>
          <small>janela de 7 dias</small>
        </article>
        <article>
          <span>VOLUME 24H</span>
          <strong>18.420</strong>
          <small>zCoin anunciado</small>
        </article>
      </section>

      <section className="dashboardGrid" id="market">
        <article className="panel panelWide">
          <div className="panelHeader">
            <div>
              <span className="kicker">MARKET LIVE</span>
              <h2>Melhores oportunidades</h2>
            </div>
            <input
              aria-label="Buscar item"
              placeholder="Buscar item..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="dealTable" id="barganhas">
            <div className="dealRow dealHead">
              <span>ITEM</span>
              <span>PREÇO</span>
              <span>REF. 7D</span>
              <span>DESCONTO</span>
              <span>DEAL SCORE</span>
            </div>
            {filteredDeals.map((deal) => {
              const discount = ((deal.price - deal.reference) / deal.reference) * 100;
              return (
                <div className="dealRow" key={deal.item}>
                  <strong>{deal.item}</strong>
                  <span>{deal.price.toLocaleString("pt-BR")} zCoin</span>
                  <span>{deal.reference.toLocaleString("pt-BR")}</span>
                  <span className="positive">{discount.toFixed(1)}%</span>
                  <span><b className="score">{deal.score}</b></span>
                </div>
              );
            })}
          </div>

          <Link className="panelCta" href="/market">
            Ver o Market Live completo com item, imagem, preço e horário →
          </Link>
        </article>

        <article className="panel" id="tendencias">
          <span className="kicker">TENDÊNCIAS</span>
          <h2>Mercado em movimento</h2>
          <div className="movementList">
            {movements.map((movement) => (
              <div key={movement.item}>
                <span>{movement.item}</span>
                <b className={movement.change >= 0 ? "up" : "down"}>
                  {movement.change >= 0 ? "+" : ""}{movement.change.toFixed(1)}%
                </b>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="splitSection" id="alertas">
        <article className="featureCard alertCard">
          <span className="kicker">ALERTAS EM TEMPO REAL</span>
          <h2>Você define o preço. O OF Ledger fica de olho.</h2>
          <p>
            Receba avisos quando um item entrar no Market dentro do valor desejado ou abaixo da referência de mercado.
          </p>
          <div className="alertExample">
            <span>Vesper Breastplate +8</span>
            <strong>≤ 950 zCoin</strong>
            <button>Criar alerta</button>
          </div>
        </article>

        <article className="featureCard integrityCard">
          <span className="kicker">PREÇO JUSTO</span>
          <h2>Menos ruído. Mais contexto.</h2>
          <p>
            Medianas, liquidez, histórico e confiança para reduzir distorções causadas por anúncios fora da curva.
          </p>
          <div className="fairPrice">
            <small>PREÇO DE REFERÊNCIA OBSERVADO</small>
            <strong>820 zCoin</strong>
            <span>Confiança demonstrativa • 127 anúncios</span>
          </div>
        </article>
      </section>

      <section className="charactersSection" id="personagens">
        <div className="sectionTitle">
          <span className="kicker">PERSONAGENS COMPETITIVOS</span>
          <h2>Somente personagens preparados para o competitivo.</h2>
          <p>Critérios mínimos: GS acima de 2.000, Spirits 5★+ e Patterns evoluídas.</p>
        </div>
        <div className="characterGrid">
          {characters.map((character) => (
            <article className="characterCard" key={character.name}>
              <div className="verified">COMPETITIVE VERIFIED</div>
              <h3>{character.name}</h3>
              <div className="characterStats">
                <span><small>GS</small><b>{character.gs}</b></span>
                <span><small>SPIRITS</small><b>{character.spirits}</b></span>
                <span><small>PATTERNS</small><b>{character.patterns}</b></span>
              </div>
              <strong className="characterPrice">{character.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="servicesSection" id="servicos">
        <div>
          <span className="kicker">EMERALD SERVICES</span>
          <h2>Serviços da comunidade com identidade e reputação.</h2>
          <p>
            Espaço planejado para drivers, progressão e serviços permitidos pelas regras do servidor, com avaliações e histórico.
          </p>
        </div>
        <div className="servicePills">
          <span>Driver / Progressão</span>
          <span>Mentoria</span>
          <span>Boss / Conteúdo</span>
          <span>Reputação</span>
        </div>
      </section>

      <footer>
        <div>
          <strong>OF LEDGER</strong>
          <span>Projeto comunitário • zGaming Emerald</span>
        </div>
        <Link href="/admin">Status da integração</Link>
      </footer>

      <MarketTicker />
    </main>
  );
}
