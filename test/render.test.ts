import { describe, it, expect } from 'vitest'
import { renderOrderbook } from '../src/index.js'
describe('renderOrderbook', () => {
  it('renders orderbook', () => {
    const output = renderOrderbook({
      ticker: 'TEST', title: 'Test Market', venue: 'kalshi', status: 'open',
      price: 50, bestBid: 49, bestAsk: 51, spread: 2, volume: 1000, volume24h: 500,
      liquidityScore: 'high',
      bidLevels: [{price: 49, size: 100}, {price: 48, size: 80}],
      askLevels: [{price: 51, size: 90}, {price: 52, size: 60}],
    }, { color: false })
    expect(output).toContain('Test Market')
    expect(output).toContain('49c')
  })
})
