# kalshi-orderbook-viewer
Terminal orderbook visualization for Kalshi and Polymarket. Beautiful depth charts in your terminal.

[![npm](https://img.shields.io/npm/v/kalshi-orderbook-viewer)](https://www.npmjs.com/package/kalshi-orderbook-viewer)

```bash
npx kalshi-orderbook KXFEDDECISION
npx kalshi-orderbook KXFEDDECISION --watch    # refresh every 30s
npx kalshi-orderbook KXFEDDECISION KXINX      # multiple markets
```

## Programmatic
```ts
import { fetchOrderbook, renderOrderbook } from 'kalshi-orderbook-viewer'
const ob = await fetchOrderbook('KXFEDDECISION')
console.log(renderOrderbook(ob))
```

## License
MIT — [SimpleFunctions](https://simplefunctions.dev)
