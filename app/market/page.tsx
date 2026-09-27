import Link from "next/link";
import MarketLiveBoard from "../../components/MarketLiveBoard";
import MarketTicker from "../../components/MarketTicker";

export const metadata = {
  title: "Market Live | OF Ledger"
};

export default function MarketPage() {
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
          <Link href="/#barganhas">Barganhas</Link>
          <Link href="/#tendencias">Tendências</Link>
          <Link href="/#alertas">Alertas</Link>
          <Link href="/#personagens">Personagens</Link>
          <Link href="/#servicos">Serviços</Link>
        </nav>

        <Link className="discordButtonLink" href="/admin">Status</Link>
      </header>

      <MarketLiveBoard />
      <MarketTicker />
    </main>
  );
}
