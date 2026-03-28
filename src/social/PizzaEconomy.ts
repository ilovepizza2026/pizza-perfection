/**
 * PizzaEconomy — a virtual pizza currency and marketplace where users
 * trade toppings, bet on debates, and manage pizza portfolios.
 */

export type PizzaCurrency = 'slicecoin' | 'crustbuck' | 'doughtoken'

export interface PizzaWallet {
  id: string
  userId: string
  balances: Record<PizzaCurrency, number>
  transactions: WalletTransaction[]
  portfolio: ToppingInvestment[]
  totalPortfolioValue: number
  riskProfile: 'conservative_cheese' | 'moderate_margherita' | 'aggressive_anchovy' | 'yolo_pineapple'
  creditRating: string
}

export interface WalletTransaction {
  id: string
  type: 'earn' | 'spend' | 'trade' | 'bet_win' | 'bet_loss' | 'dividend' | 'tip'
  currency: PizzaCurrency
  amount: number
  description: string
  balanceAfter: number
  timestamp: string
}

export interface ToppingInvestment {
  toppingId: string
  toppingName: string
  shares: number
  purchasePrice: number
  currentPrice: number
  gain: number
  gainPercent: number
}

export interface ToppingStock {
  id: string
  name: string
  ticker: string
  currentPrice: number
  previousClose: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high52Week: number
  low52Week: number
  trend: 'rising' | 'falling' | 'stable' | 'volatile'
  analystRating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'run'
  newsHeadline: string
}

export interface DebateBet {
  id: string
  debateId: string
  userId: string
  side: 1 | 2
  amount: number
  currency: PizzaCurrency
  odds: number
  status: 'active' | 'won' | 'lost' | 'refunded'
  potentialPayout: number
  placedAt: string
  resolvedAt: string | null
}

export interface PizzaNFT {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'one_of_a_kind'
  image: string
  ownerId: string
  mintedAt: string
  lastSalePrice: number
  currentBid: number
  traits: { trait: string; value: string; rarity: number }[]
}

const TOPPING_STOCKS: ToppingStock[] = [
  { id: 'PEP', name: 'Pepperoni', ticker: '$PEP', currentPrice: 42.50, previousClose: 41.80, change: 0.70, changePercent: 1.67, volume: 1200000, marketCap: 85000000, high52Week: 48.20, low52Week: 35.10, trend: 'rising', analystRating: 'strong_buy', newsHeadline: 'Pepperoni demand hits all-time high as remote workers order more pizza' },
  { id: 'PIN', name: 'Pineapple', ticker: '$PIN', currentPrice: 18.75, previousClose: 22.30, change: -3.55, changePercent: -15.92, volume: 890000, marketCap: 12000000, high52Week: 35.00, low52Week: 8.50, trend: 'volatile', analystRating: 'hold', newsHeadline: 'Pineapple stock crashes after celebrity chef publicly denounces Hawaiian pizza' },
  { id: 'MUSH', name: 'Mushroom', ticker: '$MUSH', currentPrice: 28.90, previousClose: 28.45, change: 0.45, changePercent: 1.58, volume: 650000, marketCap: 42000000, high52Week: 32.10, low52Week: 24.30, trend: 'stable', analystRating: 'buy', newsHeadline: 'Mushroom futures rise on truffle pizza trend driving demand' },
  { id: 'ANCH', name: 'Anchovy', ticker: '$ANCH', currentPrice: 5.20, previousClose: 5.15, change: 0.05, changePercent: 0.97, volume: 45000, marketCap: 800000, high52Week: 7.80, low52Week: 3.10, trend: 'stable', analystRating: 'hold', newsHeadline: 'Anchovy remains a niche play. Analysts say "if you know, you know."' },
  { id: 'SAU', name: 'Italian Sausage', ticker: '$SAU', currentPrice: 36.10, previousClose: 35.50, change: 0.60, changePercent: 1.69, volume: 780000, marketCap: 58000000, high52Week: 40.20, low52Week: 30.50, trend: 'rising', analystRating: 'buy', newsHeadline: 'Sausage rally continues as Chicago deep dish season begins' },
  { id: 'TRUF', name: 'Truffle Oil', ticker: '$TRUF', currentPrice: 89.50, previousClose: 85.20, change: 4.30, changePercent: 5.05, volume: 120000, marketCap: 15000000, high52Week: 95.00, low52Week: 45.00, trend: 'rising', analystRating: 'strong_buy', newsHeadline: 'Truffle oil gentrification index at all-time high. Millennial spending up 40%.' },
  { id: 'JALP', name: 'Jalapeño', ticker: '$JALP', currentPrice: 15.30, previousClose: 14.80, change: 0.50, changePercent: 3.38, volume: 340000, marketCap: 9500000, high52Week: 18.90, low52Week: 11.20, trend: 'rising', analystRating: 'buy', newsHeadline: 'Spicy pizza trend drives jalapeño futures. Nashville hot chicken pizza to blame.' },
  { id: 'OLV', name: 'Black Olives', ticker: '$OLV', currentPrice: 11.40, previousClose: 12.10, change: -0.70, changePercent: -5.79, volume: 210000, marketCap: 5200000, high52Week: 16.50, low52Week: 9.80, trend: 'falling', analystRating: 'sell', newsHeadline: 'Olives lose ground as Gen Z declares them "weird little fruits."' },
  { id: 'BACON', name: 'Bacon', ticker: '$BACON', currentPrice: 55.80, previousClose: 54.90, change: 0.90, changePercent: 1.64, volume: 920000, marketCap: 72000000, high52Week: 62.30, low52Week: 48.50, trend: 'stable', analystRating: 'strong_buy', newsHeadline: 'Bacon remains recession-proof. Portfolio managers recommend as hedge against sadness.' },
  { id: 'KETCH', name: 'Ketchup', ticker: '$KETCH', currentPrice: 0.03, previousClose: 0.04, change: -0.01, changePercent: -25.00, volume: 12, marketCap: 150, high52Week: 0.10, low52Week: 0.01, trend: 'falling', analystRating: 'run', newsHeadline: 'Ketchup-on-pizza stock delisted from most exchanges. Shareholders in therapy.' },
]

const PIZZA_NFTS: Omit<PizzaNFT, 'ownerId' | 'currentBid'>[] = [
  { id: 'nft-1', name: 'The Original Margherita #001', description: 'The first pizza ever rated on Pizza Perfection. A piece of history.', rarity: 'legendary', image: '🍕', mintedAt: '2026-01-01T00:00:00Z', lastSalePrice: 42000, traits: [{ trait: 'Crust', value: 'Neapolitan', rarity: 15 }, { trait: 'Sauce', value: 'San Marzano', rarity: 8 }, { trait: 'Vibe', value: 'Immaculate', rarity: 2 }] },
  { id: 'nft-2', name: 'Pineapple Controversy Slice', description: 'A digital pineapple pizza slice that changes color based on public sentiment.', rarity: 'epic', image: '🍍', mintedAt: '2026-02-14T00:00:00Z', lastSalePrice: 8800, traits: [{ trait: 'Controversy', value: 'Maximum', rarity: 1 }, { trait: 'Flavor', value: 'Debatable', rarity: 50 }] },
  { id: 'nft-3', name: 'Golden Anchovy', description: 'For the 0.1% who unironically love anchovies. A badge of honor.', rarity: 'one_of_a_kind', image: '🐟', mintedAt: '2026-03-01T00:00:00Z', lastSalePrice: 150000, traits: [{ trait: 'Saltiness', value: 'Transcendent', rarity: 0.1 }, { trait: 'Social Acceptance', value: 'None', rarity: 0.5 }] },
  { id: 'nft-4', name: 'The Folded Slice', description: 'A perfectly folded New York slice, frozen in time. The ideal form.', rarity: 'rare', image: '🌮', mintedAt: '2026-01-15T00:00:00Z', lastSalePrice: 3200, traits: [{ trait: 'Fold Angle', value: '47°', rarity: 12 }, { trait: 'Grease Drip', value: 'Artful', rarity: 8 }] },
  { id: 'nft-5', name: 'Ketchup Crime Scene', description: 'Someone put ketchup on pizza and this NFT commemorates the horror.', rarity: 'common', image: '🍅', mintedAt: '2026-03-15T00:00:00Z', lastSalePrice: 0.03, traits: [{ trait: 'Taste', value: 'Criminal', rarity: 99 }, { trait: 'Value', value: 'Negative', rarity: 100 }] },
]

export class PizzaEconomy {
  private wallets: Map<string, PizzaWallet> = new Map()
  private stocks: Map<string, ToppingStock> = new Map()
  private bets: DebateBet[] = []
  private nfts: Map<string, PizzaNFT> = new Map()

  constructor() {
    TOPPING_STOCKS.forEach((s) => this.stocks.set(s.id, s))
    PIZZA_NFTS.forEach((n) => this.nfts.set(n.id, { ...n, ownerId: '', currentBid: 0 }))
  }

  createWallet(userId: string): PizzaWallet {
    const wallet: PizzaWallet = {
      id: `wallet-${Date.now()}`,
      userId,
      balances: { slicecoin: 1000, crustbuck: 500, doughtoken: 100 },
      transactions: [{
        id: `tx-${Date.now()}`,
        type: 'earn',
        currency: 'slicecoin',
        amount: 1000,
        description: 'Welcome bonus! Here\'s 1000 SliceCoin to start your pizza investing journey.',
        balanceAfter: 1000,
        timestamp: new Date().toISOString(),
      }],
      portfolio: [],
      totalPortfolioValue: 0,
      riskProfile: 'moderate_margherita',
      creditRating: 'BBB (Barely Buying Bacon)',
    }
    this.wallets.set(wallet.id, wallet)
    return wallet
  }

  buyStock(walletId: string, stockId: string, shares: number): ToppingInvestment {
    const wallet = this.wallets.get(walletId)
    if (!wallet) throw new Error('Wallet not found. Maybe check under the couch cushions.')

    const stock = this.stocks.get(stockId)
    if (!stock) throw new Error('Stock not found. This topping doesn\'t exist on the market.')

    const cost = stock.currentPrice * shares
    if (wallet.balances.slicecoin < cost) {
      throw new Error(`Insufficient SliceCoin. You need ${cost} but have ${wallet.balances.slicecoin}. Maybe sell some $KETCH.`)
    }

    wallet.balances.slicecoin -= cost

    const existing = wallet.portfolio.find((p) => p.toppingId === stockId)
    if (existing) {
      const totalShares = existing.shares + shares
      existing.purchasePrice = ((existing.purchasePrice * existing.shares) + cost) / totalShares
      existing.shares = totalShares
      existing.currentPrice = stock.currentPrice
      existing.gain = (stock.currentPrice - existing.purchasePrice) * existing.shares
      existing.gainPercent = ((stock.currentPrice - existing.purchasePrice) / existing.purchasePrice) * 100
    } else {
      wallet.portfolio.push({
        toppingId: stockId,
        toppingName: stock.name,
        shares,
        purchasePrice: stock.currentPrice,
        currentPrice: stock.currentPrice,
        gain: 0,
        gainPercent: 0,
      })
    }

    wallet.transactions.push({
      id: `tx-${Date.now()}`,
      type: 'spend',
      currency: 'slicecoin',
      amount: cost,
      description: `Bought ${shares} shares of ${stock.ticker} at ${stock.currentPrice}/share`,
      balanceAfter: wallet.balances.slicecoin,
      timestamp: new Date().toISOString(),
    })

    wallet.totalPortfolioValue = wallet.portfolio.reduce((s, p) => s + p.currentPrice * p.shares, 0)
    this.updateRiskProfile(wallet)

    return wallet.portfolio.find((p) => p.toppingId === stockId)!
  }

  sellStock(walletId: string, stockId: string, shares: number): number {
    const wallet = this.wallets.get(walletId)
    if (!wallet) throw new Error('Wallet not found.')

    const stock = this.stocks.get(stockId)
    if (!stock) throw new Error('Stock not found.')

    const holding = wallet.portfolio.find((p) => p.toppingId === stockId)
    if (!holding || holding.shares < shares) throw new Error('Insufficient shares. You can\'t sell what you don\'t have.')

    const proceeds = stock.currentPrice * shares
    wallet.balances.slicecoin += proceeds
    holding.shares -= shares

    if (holding.shares === 0) {
      wallet.portfolio = wallet.portfolio.filter((p) => p.toppingId !== stockId)
    } else {
      holding.currentPrice = stock.currentPrice
      holding.gain = (stock.currentPrice - holding.purchasePrice) * holding.shares
      holding.gainPercent = ((stock.currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100
    }

    wallet.transactions.push({
      id: `tx-${Date.now()}`,
      type: 'trade',
      currency: 'slicecoin',
      amount: proceeds,
      description: `Sold ${shares} shares of ${stock.ticker} at ${stock.currentPrice}/share`,
      balanceAfter: wallet.balances.slicecoin,
      timestamp: new Date().toISOString(),
    })

    wallet.totalPortfolioValue = wallet.portfolio.reduce((s, p) => s + p.currentPrice * p.shares, 0)
    return proceeds
  }

  placeBet(walletId: string, debateId: string, side: 1 | 2, amount: number): DebateBet {
    const wallet = this.wallets.get(walletId)
    if (!wallet) throw new Error('Wallet not found.')

    if (wallet.balances.doughtoken < amount) {
      throw new Error(`Not enough DoughToken. You have ${wallet.balances.doughtoken}, need ${amount}. Earn more by rating pizzas.`)
    }

    wallet.balances.doughtoken -= amount
    const odds = 1.5 + Math.random() * 2

    const bet: DebateBet = {
      id: `bet-${Date.now()}`,
      debateId,
      userId: wallet.userId,
      side,
      amount,
      currency: 'doughtoken',
      odds: Math.round(odds * 100) / 100,
      status: 'active',
      potentialPayout: Math.round(amount * odds),
      placedAt: new Date().toISOString(),
      resolvedAt: null,
    }

    this.bets.push(bet)
    return bet
  }

  getMarketOverview(): {
    stocks: ToppingStock[]
    marketSentiment: string
    topGainer: ToppingStock
    topLoser: ToppingStock
    totalVolume: number
    marketCap: number
    memeStockOfTheDay: ToppingStock
    analystQuote: string
  } {
    const stocks = Array.from(this.stocks.values())
    const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent)
    const topGainer = sorted[0]
    const topLoser = sorted[sorted.length - 1]
    const totalVolume = stocks.reduce((s, st) => s + st.volume, 0)
    const marketCap = stocks.reduce((s, st) => s + st.marketCap, 0)

    const avgChange = stocks.reduce((s, st) => s + st.changePercent, 0) / stocks.length
    let marketSentiment: string
    if (avgChange > 2) marketSentiment = 'Extremely Bullish — everyone wants pizza'
    else if (avgChange > 0) marketSentiment = 'Mildly Bullish — pizza confidence is up'
    else if (avgChange > -2) marketSentiment = 'Bearish — some toppings are underperforming'
    else marketSentiment = 'Panic — the pizza market is in freefall'

    const memeStock = stocks.find((s) => s.id === 'KETCH') ?? stocks.find((s) => s.trend === 'volatile') ?? stocks[0]

    const quotes = [
      `"${topGainer.ticker} is the topping of the future." — Pizza Street Journal`,
      `"Sell your ${topLoser.ticker} before it's too late." — The Crust Report`,
      `"In this market, the only safe investment is pepperoni." — Warren Buffet (probably)`,
      `"We rate $BACON as a strong buy. Bacon is recession-proof." — Goldman Slices`,
      `"$KETCH at $0.03 is still overvalued." — Every analyst, unanimously`,
    ]

    return {
      stocks,
      marketSentiment,
      topGainer,
      topLoser,
      totalVolume,
      marketCap,
      memeStockOfTheDay: memeStock,
      analystQuote: quotes[Math.floor(Math.random() * quotes.length)],
    }
  }

  getNFTMarketplace(): PizzaNFT[] {
    return Array.from(this.nfts.values())
  }

  private updateRiskProfile(wallet: PizzaWallet): void {
    const hasAnchovy = wallet.portfolio.some((p) => p.toppingId === 'ANCH')
    const hasPineapple = wallet.portfolio.some((p) => p.toppingId === 'PIN')
    const hasKetchup = wallet.portfolio.some((p) => p.toppingId === 'KETCH')
    const hasTruffle = wallet.portfolio.some((p) => p.toppingId === 'TRUF')

    if (hasKetchup) wallet.riskProfile = 'yolo_pineapple'
    else if (hasAnchovy && hasPineapple) wallet.riskProfile = 'aggressive_anchovy'
    else if (hasTruffle) wallet.riskProfile = 'moderate_margherita'
    else wallet.riskProfile = 'conservative_cheese'

    // Update credit rating
    const totalValue = wallet.balances.slicecoin + wallet.totalPortfolioValue
    if (totalValue > 50000) wallet.creditRating = 'AAA (Absolutely Amazing Appetite)'
    else if (totalValue > 10000) wallet.creditRating = 'AA (Admirably Appetizing)'
    else if (totalValue > 5000) wallet.creditRating = 'A (Adequate)'
    else if (totalValue > 1000) wallet.creditRating = 'BBB (Barely Buying Bacon)'
    else wallet.creditRating = 'D (Desperately Needs Pizza)'
  }
}
