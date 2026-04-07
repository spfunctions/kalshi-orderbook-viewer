# kalshi-orderbook-viewer

[![npm](https://img.shields.io/npm/v/kalshi-orderbook-viewer)](https://www.npmjs.com/package/kalshi-orderbook-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Terminal orderbook visualization for **Kalshi** and **Polymarket** prediction
markets. Beautiful depth charts in your shell. Zero dependencies.

```bash
npx kalshi-orderbook KXFEDDECISION-25DEC
```

```
Will the Fed cut rates in December?
kalshi | open | Last: 42c | Spread: 2c | high liq

  BIDS                         ASKS
  ████████████ 41c x 1200      43c x 1500 ████████████
  ████████ 40c x 800           44c x 900  ███████
  █████ 39c x 500              45c x 400  ███
  ███ 38c x 300                46c x 200  █

Vol: 542,330 | 24h: 18,200
```

---

## Install

```bash
npm install -g kalshi-orderbook-viewer
# or run ad-hoc
npx kalshi-orderbook <ticker>
```

Zero runtime dependencies. ESM and CJS, full TypeScript types.

## CLI

```bash
# Single market
kalshi-orderbook KXFEDDECISION-25DEC

# Multiple markets
kalshi-orderbook KXFEDDECISION-25DEC KXBTC-26DEC31

# Auto-refresh every 30s
kalshi-orderbook KXFEDDECISION-25DEC --watch

# Raw JSON for piping into jq / other tools
kalshi-orderbook KXFEDDECISION-25DEC --json
```

## Programmatic API

```ts
import { fetchOrderbook, renderOrderbook } from 'kalshi-orderbook-viewer'

const ob = await fetchOrderbook('KXFEDDECISION-25DEC')

console.log(renderOrderbook(ob))
console.log(renderOrderbook(ob, { color: false }))  // strip ANSI for logs
```

### `fetchOrderbook(ticker): Promise<OrderbookData>`

Fetch a single market's orderbook by ticker via the SimpleFunctions public API.
Routes through `/api/public/markets?tickers={ticker}&depth=true` and returns
the first match.

Throws `Error("Market not found: <ticker>")` if the ticker has no live market,
and `Error("SimpleFunctions API error <status> ...")` on non-2xx responses.

### `renderOrderbook(ob, opts?): string`

Pure: render an `OrderbookData` to ANSI-coloured terminal output. Pass
`{ color: false }` to strip colours (e.g. when piping to a file).

### Type

```ts
interface OrderbookData {
  ticker: string
  title: string
  venue: 'kalshi' | 'polymarket' | string
  status: string
  price: number          // last trade in cents
  bestBid?: number
  bestAsk?: number
  spread?: number
  volume: number         // cumulative
  volume24h?: number
  liquidityScore?: 'high' | 'medium' | 'low' | string
  bidLevels: { price: number; size: number }[]
  askLevels: { price: number; size: number }[]
}
```

## Bugfix vs older releases

Versions before `1.1.0` called `/api/public/market/{ticker}` (singular), which
**does not exist** on the live SimpleFunctions API and returned a 404 HTML
page. The current version uses `/api/public/markets?tickers={ticker}` (plural)
and pulls the first match — verified live.

## Sister packages

| Need | Package |
|------|---------|
| Just monitor prices, no orderbook viz | [`kalshi-price-monitor`](https://github.com/spfunctions/kalshi-price-monitor) |
| Get aggregated edges across markets | [`prediction-market-edge-detector`](https://github.com/spfunctions/prediction-market-edge-detector) |
| Resolve any Polymarket id format | [`polymarket-ticker-resolver`](https://github.com/spfunctions/polymarket-ticker-resolver) |
| MCP / Claude / Cursor | [`simplefunctions-cli`](https://github.com/spfunctions/simplefunctions-cli), [`prediction-market-mcp-example`](https://github.com/spfunctions/prediction-market-mcp-example) |

## Testing

```bash
npm test
```

8 tests, all `fetch`-mocked — no network required.

## License

MIT — built by [SimpleFunctions](https://simplefunctions.dev).
