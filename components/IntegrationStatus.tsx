"use client";

import { useEffect, useState } from "react";

type Health = {
  status: string;
  parser: string;
  ingestEndpoint: string;
  databaseConfigured: boolean;
  databaseReachable: boolean;
  zmarket: { guildId: string; channelId: string };
};

export default function IntegrationStatus() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch("/api/market/health", { cache: "no-store" })
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const parserOk = health?.parser === "ready";
  const ingestOk = health?.ingestEndpoint === "ready";
  const dbOk = Boolean(health?.databaseConfigured && health?.databaseReachable);

  return (
    <section className="integrationGrid">
      <article>
        <span className={parserOk ? "statusLight statusReady" : "statusLight"} />
        <small>PARSER ZMARKET</small>
        <strong>{parserOk ? "PRONTO" : "AGUARDANDO"}</strong>
        <p>Normalização de nome, enchant, level, Sealed, preço e imagem.</p>
      </article>
      <article>
        <span className={ingestOk ? "statusLight statusReady" : "statusLight"} />
        <small>API DE INGESTÃO</small>
        <strong>{ingestOk ? "PRONTA" : "AGUARDANDO"}</strong>
        <p>Entrada protegida para receber os eventos do collector Discord.</p>
      </article>
      <article>
        <span className={dbOk ? "statusLight statusReady" : "statusLight"} />
        <small>POSTGRESQL</small>
        <strong>{dbOk ? "ONLINE" : "PENDENTE"}</strong>
        <p>Será responsável pelo histórico, médias, alertas e tendências.</p>
      </article>
      <article>
        <span className="statusLight" />
        <small>DISCORD COLLECTOR</small>
        <strong>AGUARDANDO ADM</strong>
        <p>Será ligado assim que o bot receber acesso read-only ao #zmarket.</p>
      </article>
      <article className="integrationWide">
        <small>ESCOPO DO COLLECTOR</small>
        <strong>#zmarket</strong>
        <p>
          Guild {health?.zmarket?.guildId ?? "1117270667520393216"} · Canal{" "}
          {health?.zmarket?.channelId ?? "1375274626472738898"}
        </p>
      </article>
    </section>
  );
}
