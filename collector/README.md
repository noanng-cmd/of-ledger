# OF Ledger zMarket Collector

Serviço read-only que observa o canal oficial `#zmarket` e envia eventos para a API do OF Ledger.

## Permissões mínimas do bot

- View Channel
- Read Message History
- acesso ao conteúdo necessário para ler os embeds do zGaming Market Bot

No Discord Developer Portal, habilite o Message Content Intent caso seja necessário para o payload do canal.

## Variáveis

- `DISCORD_BOT_TOKEN`
- `DISCORD_GUILD_ID=1117270667520393216`
- `DISCORD_MARKET_CHANNEL_ID=1375274626472738898`
- `OF_LEDGER_INGEST_URL=https://<dominio-do-site>`
- `OF_LEDGER_INGEST_SECRET=<segredo-forte>`

Nunca coloque o token do bot no GitHub.
