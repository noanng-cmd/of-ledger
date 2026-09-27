# OF Ledger

**Dar transparência ao mercado do zGaming Emerald para que os jogadores saibam quanto os itens realmente valem.**

Plataforma comunitária de inteligência de mercado para o zGaming Emerald.

## Estado atual

- Dashboard público
- Market Live visual em `/market`
- Página de item em `/item`
- ticker Market Live com polling
- página de status técnico em `/admin`
- parser zMarket
- captura de thumbnail/imagem do embed do Discord
- API protegida de ingestão
- schema PostgreSQL para histórico
- collector Discord pronto para ser ligado após autorização do servidor

Enquanto o Discord e o banco real não estão conectados, o Market usa dados demonstrativos claramente identificados como demo.

## Fonte de preço

O OF Ledger trata os valores como **preços observados/anunciados**. Um anúncio que desaparece não é automaticamente chamado de venda confirmada.

## Imagens dos itens

O collector lê `thumbnail.url`, `image.url` e anexos de imagem do embed/mensagem do zMarket. A URL é persistida junto do listing para que o site consiga mostrar o próprio item anunciado.

## Personagens competitivos

Critérios mínimos do projeto:

- GS acima de 2.000
- Spirits com no mínimo 5 estrelas
- Patterns evoluídas

## Segurança

Nunca salve token do Discord, credenciais do banco ou credenciais do LivePix no repositório.
Use somente variáveis de ambiente/segredos no servidor.
