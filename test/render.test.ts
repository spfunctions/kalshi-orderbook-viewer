import { describe, it, expect, afterEach, vi } from 'vitest'
import { fetchOrderbook, renderOrderbook, type OrderbookData } from '../src/index.js'

const SAMPLE_OB: OrderbookData = {
  ticker: 'TEST',
  title: 'Test Market',
  venue: 'kalshi',
  status: 'open',
  price: 50,
  bestBid: 49,
  bestAsk: 51,
  spread: 2,
  volume: 1000,
  volume24h: 500,
  liquidityScore: 'high',
  bidLevels: [
    { price: 49, size: 100 },
    { price: 48, size: 80 },
  ],
  askLevels: [
    { price: 51, size: 90 },
    { price: 52, size: 60 },
  ],
}

function mockJsonOnce(body: unknown, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  )
}

afterEach(() => vi.restoreAllMocks())

// ── renderOrderbook (pure) ────────────────────────────────

describe('renderOrderbook', () => {
  it('renders title, prices, and bids/asks (no color)', () => {
    const out = renderOrderbook(SAMPLE_OB, { color: false })
    expect(out).toContain('Test Market')
    expect(out).toContain('kalshi')
    expect(out).toContain('49c')
    expect(out).toContain('51c')
    expect(out).toContain('Spread: 2c')
    expect(out).toContain('high liq')
  })

  it('handles empty orderbook gracefully', () => {
    const out = renderOrderbook(
      { ...SAMPLE_OB, bidLevels: [], askLevels: [] },
      { color: false },
    )
    expect(out).toContain('Test Market')
  })

  it('shows volume', () => {
    const out = renderOrderbook(SAMPLE_OB, { color: false })
    expect(out).toMatch(/Vol:.*1,000/)
  })
})

// ── fetchOrderbook (mocked) ───────────────────────────────

describe('fetchOrderbook', () => {
  it('routes through /api/public/markets?tickers=', async () => {
    const spy = mockJsonOnce({ markets: [SAMPLE_OB] })
    await fetchOrderbook('KXFEDDECISION-25DEC')
    const url = String(spy.mock.calls[0][0])
    expect(url).toContain('/api/public/markets')
    expect(url).toContain('tickers=KXFEDDECISION-25DEC')
    expect(url).toContain('depth=true')
  })

  it('returns the first market and normalizes fields', async () => {
    mockJsonOnce({ markets: [SAMPLE_OB] })
    const ob = await fetchOrderbook('TEST')
    expect(ob.ticker).toBe('TEST')
    expect(ob.bidLevels).toHaveLength(2)
    expect(ob.askLevels).toHaveLength(2)
  })

  it('throws when no market is returned', async () => {
    mockJsonOnce({ markets: [] })
    await expect(fetchOrderbook('NOPE')).rejects.toThrow(/not found/)
  })

  it('throws on non-2xx with status code', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('boom', { status: 500, headers: { 'content-type': 'text/plain' } }),
    )
    await expect(fetchOrderbook('KX')).rejects.toThrow(/500/)
  })

  it('coerces missing optional fields to defaults without crashing', async () => {
    mockJsonOnce({
      markets: [{ ticker: 'KX', title: 'minimal', venue: 'kalshi', status: 'open', price: 50 }],
    })
    const ob = await fetchOrderbook('KX')
    expect(ob.bidLevels).toEqual([])
    expect(ob.askLevels).toEqual([])
    expect(ob.volume).toBe(0)
  })
})
