import Link from "next/link";
import IntegrationStatus from "../../components/IntegrationStatus";
import MarketTicker from "../../components/MarketTicker";

export const metadata = {
  title: "Admin Status | OF Ledger"
};

export default function AdminPage() {
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
          <Link href="/">Dashboard</Link>
        </nav>

        <span className="adminPill">ADMIN PREVIEW</span>
      </header>

      <section className="adminWorkspace">
        <span className="kicker">OF LEDGER CONTROL ROOM</span>
        <h1>Integrações e saúde do projeto</h1>
        <p>
          Aqui você acompanha o que já está pronto e o que ainda depende da autorização
          do zGaming.
        </p>

        <IntegrationStatus />

        <article className="panel adminRoadmap">
          <span className="kicker">PRÓXIMOS PASSOS</span>
          <h2>Pipeline preparado</h2>
          <ol>
            <li><b>1</b><span>Admin zGaming libera o bot read-only no #zmarket.</span></li>
            <li><b>2</b><span>Ligamos o collector e validamos 10–20 mensagens reais.</span></li>
            <li><b>3</b><span>Conectamos PostgreSQL e iniciamos backfill do histórico.</span></li>
            <li><b>4</b><span>Market Live, médias, tendências e alertas passam para dados reais.</span></li>
          </ol>
        </article>
      </section>

      <MarketTicker />
    </main>
  );
}
