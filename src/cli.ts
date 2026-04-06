#!/usr/bin/env node
import { fetchOrderbook, renderOrderbook } from './index.js'

async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--'))
  if (args.length === 0) { console.log('Usage: kalshi-orderbook <TICKER> [TICKER2...]'); process.exit(0) }
  const isJson = process.argv.includes('--json')
  const watch = process.argv.includes('--watch')

  const show = async () => {
    for (const ticker of args) {
      try {
        const ob = await fetchOrderbook(ticker)
        if (isJson) console.log(JSON.stringify(ob, null, 2))
        else console.log(renderOrderbook(ob) + '\n')
      } catch (e: any) { console.error(`Error (${ticker}): ${e.message}`) }
    }
  }

  await show()
  if (watch) {
    setInterval(async () => { console.clear(); await show() }, 30000)
  }
}
main()
