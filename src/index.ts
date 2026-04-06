const BASE = 'https://simplefunctions.dev'

export interface OrderbookData {
  ticker: string; title: string; venue: string; status: string
  price: number; bestBid?: number; bestAsk?: number; spread?: number
  volume: number; volume24h?: number; liquidityScore?: string
  bidLevels: Array<{price: number; size: number}>
  askLevels: Array<{price: number; size: number}>
}

export async function fetchOrderbook(ticker: string): Promise<OrderbookData> {
  const res = await fetch(`${BASE}/api/public/market/${encodeURIComponent(ticker)}?depth=true`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const m = await res.json()
  return {
    ticker: m.ticker, title: m.title, venue: m.venue, status: m.status,
    price: m.price, bestBid: m.bestBid, bestAsk: m.bestAsk, spread: m.spread,
    volume: m.volume || 0, volume24h: m.volume24h || 0, liquidityScore: m.liquidityScore,
    bidLevels: m.bidLevels || [], askLevels: m.askLevels || [],
  }
}

const GRN = '\x1b[32m', RED = '\x1b[31m', CYN = '\x1b[36m', BLD = '\x1b[1m', DIM = '\x1b[2m', R = '\x1b[0m'

function bar(size: number, max: number, w: number = 15): string {
  const n = max > 0 ? Math.round((size / max) * w) : 0
  return '\u2588'.repeat(n) + ' '.repeat(w - n)
}

export function renderOrderbook(ob: OrderbookData, opts?: { width?: number; color?: boolean }): string {
  const c = opts?.color !== false
  const lines: string[] = []
  const b = c ? BLD : '', d = c ? DIM : '', g = c ? GRN : '', r = c ? RED : '', cn = c ? CYN : '', rs = c ? R : ''

  lines.push(`${b}${ob.title}${rs}`)
  lines.push(`${d}${ob.venue} | ${ob.status} | Last: ${b}${ob.price}c${rs}${d} | Spread: ${ob.spread ?? '?'}c | ${ob.liquidityScore || '?'} liq${rs}`)
  lines.push('')

  const allSizes = [...ob.bidLevels, ...ob.askLevels].map(l => l.size)
  const maxSize = Math.max(...allSizes, 1)

  lines.push(`${b}  BIDS                         ASKS${rs}`)
  const rows = Math.max(ob.bidLevels.length, ob.askLevels.length)
  for (let i = 0; i < rows; i++) {
    const bid = ob.bidLevels[i]
    const ask = ob.askLevels[i]
    const bidStr = bid ? `${g}${bar(bid.size, maxSize)}${rs} ${bid.price}c x ${bid.size}` : '                              '
    const askStr = ask ? `${ask.price}c x ${ask.size} ${r}${bar(ask.size, maxSize)}${rs}` : ''
    lines.push(`  ${bidStr}   ${askStr}`)
  }

  lines.push('')
  lines.push(`${d}Vol: ${ob.volume.toLocaleString()} | 24h: ${ob.volume24h?.toLocaleString() || '?'}${rs}`)
  return lines.join('\n')
}
