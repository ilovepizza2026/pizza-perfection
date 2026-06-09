/**
 * PizzaEngine — a scientifically rigorous pizza ordering and rating system
 * with topping compatibility analysis, crust optimization, and slice economics.
 */

export type CrustType = 'thin' | 'regular' | 'thick' | 'stuffed' | 'deep_dish' | 'neapolitan' | 'detroit' | 'gluten_free' | 'cauliflower'
export type SauceType = 'marinara' | 'white' | 'pesto' | 'bbq' | 'buffalo' | 'garlic_butter' | 'olive_oil' | 'none'
export type CheeseType = 'mozzarella' | 'cheddar' | 'parmesan' | 'gouda' | 'provolone' | 'ricotta' | 'vegan' | 'none'
export type PizzaSize = 'personal' | 'small' | 'medium' | 'large' | 'party'
export type ToppingCategory = 'meat' | 'veggie' | 'cheese' | 'premium' | 'controversial'

export interface Topping {
  id: string
  name: string
  category: ToppingCategory
  price: number
  calories: number
  popularity: number // 0-100
  controversyScore: number // 0-100, how divisive this topping is
  pairsWellWith: string[]
  clashesWith: string[]
  description: string
  emoji: string
  funFact: string
}

export interface Pizza {
  id: string
  name: string
  size: PizzaSize
  crust: CrustType
  sauce: SauceType
  cheese: CheeseType
  toppings: Topping[]
  slices: number
  price: number
  calories: number
  harmonyScore: number
  controversyLevel: string
  description: string
  createdAt: string
}

export interface PizzaRating {
  pizzaId: string
  overall: number
  taste: number
  value: number
  creativity: number
  wouldOrderAgain: boolean
  review: string
  controversialOpinion: string
}

export interface OrderAnalytics {
  totalPizzas: number
  totalSpent: number
  totalSlices: number
  totalCalories: number
  avgHarmonyScore: number
  mostOrderedTopping: string
  leastOrderedTopping: string
  controversyIndex: number
  pizzaPersonality: string
  spiritPizza: string
}

const TOPPINGS: Topping[] = [
  { id: 'pepperoni', name: 'Pepperoni', category: 'meat', price: 1.50, calories: 130, popularity: 95, controversyScore: 5, pairsWellWith: ['mushroom', 'green_pepper', 'onion', 'sausage'], clashesWith: ['pineapple'], description: 'The classic. The legend. The GOAT.', emoji: '🍕', funFact: 'Americans eat 251.7 million pounds of pepperoni per year.' },
  { id: 'mushroom', name: 'Mushrooms', category: 'veggie', price: 1.00, calories: 15, popularity: 72, controversyScore: 20, pairsWellWith: ['pepperoni', 'onion', 'green_pepper', 'truffle_oil'], clashesWith: ['anchovies'], description: 'The umami bomb. Fungi fans unite.', emoji: '🍄', funFact: 'Mushrooms are more closely related to humans than to plants.' },
  { id: 'pineapple', name: 'Pineapple', category: 'controversial', price: 1.25, calories: 45, popularity: 55, controversyScore: 99, pairsWellWith: ['ham', 'jalapeno', 'bacon'], clashesWith: ['pepperoni', 'anchovies', 'sausage'], description: 'The most divisive food decision in human history.', emoji: '🍍', funFact: 'Hawaiian pizza was invented in Canada by a Greek immigrant. Hawaii wants nothing to do with this.' },
  { id: 'ham', name: 'Ham', category: 'meat', price: 1.50, calories: 120, popularity: 60, controversyScore: 15, pairsWellWith: ['pineapple', 'mushroom', 'onion'], clashesWith: ['anchovies'], description: 'Reliable. Trustworthy. The HR person of toppings.', emoji: '🍖', funFact: 'Ham and pineapple is the third most popular pizza combo worldwide.' },
  { id: 'sausage', name: 'Italian Sausage', category: 'meat', price: 1.75, calories: 160, popularity: 80, controversyScore: 8, pairsWellWith: ['pepperoni', 'green_pepper', 'onion', 'mushroom'], clashesWith: ['pineapple', 'bbq_chicken'], description: 'Fennel-scented perfection.', emoji: '🌭', funFact: 'Italian sausage pizza outsells pepperoni in Chicago.' },
  { id: 'green_pepper', name: 'Green Peppers', category: 'veggie', price: 0.75, calories: 10, popularity: 65, controversyScore: 12, pairsWellWith: ['pepperoni', 'sausage', 'onion', 'mushroom'], clashesWith: [], description: 'The crunch factor. Supreme pizza essential.', emoji: '🫑', funFact: 'Green peppers are just unripe red peppers. Mind blown.' },
  { id: 'onion', name: 'Onions', category: 'veggie', price: 0.75, calories: 15, popularity: 58, controversyScore: 25, pairsWellWith: ['pepperoni', 'sausage', 'green_pepper', 'mushroom'], clashesWith: [], description: 'Layers of flavor. Like an ogre. Or a parfait.', emoji: '🧅', funFact: 'Onions make you cry because they release a gas called syn-propanethial-S-oxide.' },
  { id: 'olives', name: 'Black Olives', category: 'veggie', price: 1.00, calories: 25, popularity: 45, controversyScore: 40, pairsWellWith: ['green_pepper', 'mushroom', 'feta'], clashesWith: ['bbq_chicken'], description: 'You either love them or pick them off. No in-between.', emoji: '🫒', funFact: 'The oldest olive tree is over 3,000 years old and still produces olives.' },
  { id: 'bacon', name: 'Bacon', category: 'premium', price: 2.00, calories: 180, popularity: 78, controversyScore: 10, pairsWellWith: ['pineapple', 'jalapeno', 'chicken', 'ranch'], clashesWith: [], description: 'Makes everything better. This is not debatable.', emoji: '🥓', funFact: 'There is a bacon-scented cologne. It sold out in hours.' },
  { id: 'jalapeno', name: 'Jalapeños', category: 'veggie', price: 1.00, calories: 10, popularity: 52, controversyScore: 30, pairsWellWith: ['pineapple', 'bacon', 'pepperoni', 'sausage'], clashesWith: [], description: 'For those who believe pizza should fight back.', emoji: '🌶️', funFact: 'Jalapeños are only 2,500–8,000 Scoville. Basically a warm hug.' },
  { id: 'anchovies', name: 'Anchovies', category: 'controversial', price: 2.00, calories: 60, popularity: 15, controversyScore: 92, pairsWellWith: ['olives', 'capers'], clashesWith: ['pineapple', 'mushroom', 'ham', 'bbq_chicken'], description: 'The most polarizing topping. A true personality test.', emoji: '🐟', funFact: 'In a 2023 survey, anchovies were voted "topping most likely to end a friendship."' },
  { id: 'bbq_chicken', name: 'BBQ Chicken', category: 'premium', price: 2.50, calories: 140, popularity: 68, controversyScore: 22, pairsWellWith: ['red_onion', 'cilantro', 'bacon'], clashesWith: ['anchovies', 'sausage', 'olives'], description: 'California Pizza Kitchen energy.', emoji: '🍗', funFact: 'BBQ chicken pizza was invented at Spago in Hollywood in 1985.' },
  { id: 'truffle_oil', name: 'Truffle Oil', category: 'premium', price: 3.00, calories: 40, popularity: 35, controversyScore: 45, pairsWellWith: ['mushroom', 'arugula', 'parmesan'], clashesWith: ['pepperoni', 'bbq_chicken', 'pineapple'], description: 'Instant gentrification of any pizza.', emoji: '✨', funFact: 'Most "truffle oil" contains zero actual truffles. It\'s synthetic flavor. You\'re welcome.' },
  { id: 'arugula', name: 'Arugula', category: 'premium', price: 1.50, calories: 5, popularity: 30, controversyScore: 35, pairsWellWith: ['truffle_oil', 'prosciutto', 'parmesan'], clashesWith: ['bbq_chicken', 'pepperoni'], description: 'For when you want your pizza to feel like a salad.', emoji: '🥬', funFact: 'Romans considered arugula an aphrodisiac. Your pizza is now romantic.' },
]

const SIZE_CONFIG: Record<PizzaSize, { slices: number; basePrice: number; calorieMultiplier: number; diameter: number }> = {
  personal: { slices: 4, basePrice: 7.99, calorieMultiplier: 0.5, diameter: 8 },
  small: { slices: 6, basePrice: 10.99, calorieMultiplier: 0.75, diameter: 10 },
  medium: { slices: 8, basePrice: 13.99, calorieMultiplier: 1.0, diameter: 12 },
  large: { slices: 10, basePrice: 16.99, calorieMultiplier: 1.3, diameter: 14 },
  party: { slices: 16, basePrice: 22.99, calorieMultiplier: 2.0, diameter: 18 },
}

const CRUST_MODIFIERS: Record<CrustType, { priceAdd: number; calorieAdd: number; description: string }> = {
  thin: { priceAdd: 0, calorieAdd: -50, description: 'Crispy and light' },
  regular: { priceAdd: 0, calorieAdd: 0, description: 'The classic hand-tossed' },
  thick: { priceAdd: 1.00, calorieAdd: 80, description: 'Pillowy and doughy' },
  stuffed: { priceAdd: 2.50, calorieAdd: 200, description: 'Cheese in the crust because why not' },
  deep_dish: { priceAdd: 3.00, calorieAdd: 250, description: 'Chicago-style casserole (fight me)' },
  neapolitan: { priceAdd: 1.50, calorieAdd: -30, description: 'Wood-fired authenticity' },
  detroit: { priceAdd: 2.00, calorieAdd: 150, description: 'Rectangular, crispy-edged, life-changing' },
  gluten_free: { priceAdd: 2.00, calorieAdd: -20, description: 'For the gluten-averse' },
  cauliflower: { priceAdd: 2.50, calorieAdd: -100, description: 'Pretending to be healthy while eating pizza' },
}

// Topping compatibility matrix: -1 = clash, 0 = neutral, 1 = good pair
const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {}
TOPPINGS.forEach((t) => {
  COMPATIBILITY_MATRIX[t.id] = {}
  TOPPINGS.forEach((other) => {
    if (t.id === other.id) { COMPATIBILITY_MATRIX[t.id][other.id] = 0; return }
    if (t.pairsWellWith.includes(other.id)) { COMPATIBILITY_MATRIX[t.id][other.id] = 1; return }
    if (t.clashesWith.includes(other.id)) { COMPATIBILITY_MATRIX[t.id][other.id] = -1; return }
    COMPATIBILITY_MATRIX[t.id][other.id] = 0
  })
})

export class PizzaEngine {
  private pizzas: Map<string, Pizza> = new Map()
  private ratings: Map<string, PizzaRating[]> = new Map()
  private orderHistory: Pizza[] = []

  getAllToppings(): Topping[] {
    return [...TOPPINGS]
  }

  getToppingsByCategory(category: ToppingCategory): Topping[] {
    return TOPPINGS.filter((t) => t.category === category)
  }

  getControversialToppings(): Topping[] {
    return TOPPINGS.filter((t) => t.controversyScore > 50).sort((a, b) => b.controversyScore - a.controversyScore)
  }

  checkCompatibility(toppingIds: string[]): {
    harmonyScore: number
    pairings: { topping1: string; topping2: string; verdict: 'great' | 'neutral' | 'clash' }[]
    warnings: string[]
    suggestions: string[]
    overallVerdict: string
  } {
    const pairings: { topping1: string; topping2: string; verdict: 'great' | 'neutral' | 'clash' }[] = []
    const warnings: string[] = []
    let totalScore = 0
    let comparisons = 0

    for (let i = 0; i < toppingIds.length; i++) {
      for (let j = i + 1; j < toppingIds.length; j++) {
        const score = COMPATIBILITY_MATRIX[toppingIds[i]]?.[toppingIds[j]] ?? 0
        const t1 = TOPPINGS.find((t) => t.id === toppingIds[i])
        const t2 = TOPPINGS.find((t) => t.id === toppingIds[j])
        if (!t1 || !t2) continue

        totalScore += score
        comparisons++

        const verdict = score > 0 ? 'great' : score < 0 ? 'clash' : 'neutral'
        pairings.push({ topping1: t1.name, topping2: t2.name, verdict })

        if (score < 0) {
          warnings.push(`${t1.emoji} ${t1.name} + ${t2.emoji} ${t2.name}: The toppings are fighting. This pizza needs therapy.`)
        }
      }
    }

    // Check for pineapple
    if (toppingIds.includes('pineapple')) {
      warnings.push('WARNING: Pineapple detected. This pizza will be judged. Proceed with confidence or shame.')
    }

    // Check for anchovy isolation
    if (toppingIds.includes('anchovies') && toppingIds.length > 1) {
      warnings.push('Anchovies prefer to be alone. Like that one friend who "doesn\'t do groups."')
    }

    // Check for pretentiousness
    const premiumCount = toppingIds.filter((id) => TOPPINGS.find((t) => t.id === id)?.category === 'premium').length
    if (premiumCount >= 3) {
      warnings.push('This pizza costs more than some people\'s rent. Are you sure?')
    }

    const harmonyScore = comparisons > 0 ? Math.round(((totalScore / comparisons + 1) / 2) * 100) : 50

    const suggestions: string[] = []
    if (harmonyScore < 40) suggestions.push('Consider removing conflicting toppings for a more harmonious pizza experience.')
    if (toppingIds.length === 1) suggestions.push('One topping? Bold minimalist move. Or just indecisive.')
    if (toppingIds.length > 6) suggestions.push('That\'s not a pizza, that\'s a topping support group. Less is more.')

    let overallVerdict: string
    if (harmonyScore >= 80) overallVerdict = 'Chef\'s kiss. This pizza is a masterpiece of topping diplomacy.'
    else if (harmonyScore >= 60) overallVerdict = 'Solid combo. The toppings are getting along at the party.'
    else if (harmonyScore >= 40) overallVerdict = 'It\'ll work, but some toppings are giving each other side-eye.'
    else if (harmonyScore >= 20) overallVerdict = 'Chaotic energy. This pizza is a group project where nobody agrees.'
    else overallVerdict = 'This pizza is a war crime. The Geneva Convention has opinions.'

    return { harmonyScore, pairings, warnings, suggestions, overallVerdict }
  }

  buildPizza(params: {
    name?: string
    size: PizzaSize
    crust: CrustType
    sauce: SauceType
    cheese: CheeseType
    toppingIds: string[]
  }): Pizza {
    const sizeConfig = SIZE_CONFIG[params.size]
    const crustMod = CRUST_MODIFIERS[params.crust]
    const toppings = params.toppingIds.map((id) => TOPPINGS.find((t) => t.id === id)).filter(Boolean) as Topping[]

    const toppingPrice = toppings.reduce((sum, t) => sum + t.price, 0)
    const toppingCalories = toppings.reduce((sum, t) => sum + t.calories, 0)
    const price = Math.round((sizeConfig.basePrice + crustMod.priceAdd + toppingPrice) * 100) / 100
    const calories = Math.round((200 + crustMod.calorieAdd + toppingCalories) * sizeConfig.calorieMultiplier)

    const compatibility = this.checkCompatibility(params.toppingIds)

    const avgControversy = toppings.length > 0
      ? Math.round(toppings.reduce((sum, t) => sum + t.controversyScore, 0) / toppings.length)
      : 0

    let controversyLevel: string
    if (avgControversy >= 70) controversyLevel = 'Will start arguments at parties'
    else if (avgControversy >= 40) controversyLevel = 'Mildly spicy opinions'
    else if (avgControversy >= 15) controversyLevel = 'Universally acceptable'
    else controversyLevel = 'So safe it\'s boring'

    const pizza: Pizza = {
      id: `pizza-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: params.name ?? this.generatePizzaName(toppings, params.crust),
      size: params.size,
      crust: params.crust,
      sauce: params.sauce,
      cheese: params.cheese,
      toppings,
      slices: sizeConfig.slices,
      price,
      calories,
      harmonyScore: compatibility.harmonyScore,
      controversyLevel,
      description: `A ${params.size} ${params.crust} crust pizza with ${params.sauce} sauce, ${params.cheese} cheese, and ${toppings.map((t) => t.name.toLowerCase()).join(', ') || 'no toppings (bold choice)'}. ${compatibility.overallVerdict}`,
      createdAt: new Date().toISOString(),
    }

    this.pizzas.set(pizza.id, pizza)
    this.orderHistory.push(pizza)

    return pizza
  }

  ratePizza(pizzaId: string, rating: Omit<PizzaRating, 'pizzaId'>): PizzaRating {
    const pizza = this.pizzas.get(pizzaId)
    if (!pizza) throw new Error('Pizza not found. It was probably eaten.')

    const fullRating: PizzaRating = { ...rating, pizzaId }
    const existing = this.ratings.get(pizzaId) ?? []
    existing.push(fullRating)
    this.ratings.set(pizzaId, existing)

    return fullRating
  }

  getSliceEconomics(pizzaId: string): {
    pricePerSlice: number
    caloriesPerSlice: number
    costPerCalorie: number
    shareability: string
    leftoverProbability: number
    regretIndex: number
  } {
    const pizza = this.pizzas.get(pizzaId)
    if (!pizza) throw new Error('Pizza not found.')

    const pricePerSlice = Math.round((pizza.price / pizza.slices) * 100) / 100
    const caloriesPerSlice = Math.round(pizza.calories / pizza.slices)
    const costPerCalorie = Math.round((pizza.price / pizza.calories) * 10000) / 10000

    let shareability: string
    if (pizza.size === 'party') shareability = 'Designed for sharing. You\'ll be the hero.'
    else if (pizza.size === 'large') shareability = 'Shareable if you\'re feeling generous.'
    else if (pizza.size === 'personal') shareability = 'This is YOUR pizza. Don\'t let anyone touch it.'
    else shareability = 'Can share. Shouldn\'t have to.'

    const leftoverProbability = pizza.size === 'party' ? 85 : pizza.size === 'large' ? 40 : pizza.size === 'medium' ? 15 : 0
    const regretIndex = Math.max(0, (pizza.calories / 500) * 20 + (pizza.price / 5) * 10 - pizza.harmonyScore / 5)

    return { pricePerSlice, caloriesPerSlice, costPerCalorie, shareability, leftoverProbability, regretIndex: Math.round(regretIndex) }
  }

  getAnalytics(): OrderAnalytics {
    if (this.orderHistory.length === 0) {
      return {
        totalPizzas: 0, totalSpent: 0, totalSlices: 0, totalCalories: 0,
        avgHarmonyScore: 0, mostOrderedTopping: 'N/A', leastOrderedTopping: 'N/A',
        controversyIndex: 0, pizzaPersonality: 'Pizza Virgin — you haven\'t ordered yet!',
        spiritPizza: 'Cheese pizza. Everyone starts here.',
      }
    }

    const totalPizzas = this.orderHistory.length
    const totalSpent = Math.round(this.orderHistory.reduce((s, p) => s + p.price, 0) * 100) / 100
    const totalSlices = this.orderHistory.reduce((s, p) => s + p.slices, 0)
    const totalCalories = this.orderHistory.reduce((s, p) => s + p.calories, 0)
    const avgHarmonyScore = Math.round(this.orderHistory.reduce((s, p) => s + p.harmonyScore, 0) / totalPizzas)

    const toppingCounts = new Map<string, number>()
    this.orderHistory.forEach((p) => p.toppings.forEach((t) => {
      toppingCounts.set(t.name, (toppingCounts.get(t.name) ?? 0) + 1)
    }))
    const sorted = Array.from(toppingCounts.entries()).sort((a, b) => b[1] - a[1])
    const mostOrderedTopping = sorted[0]?.[0] ?? 'N/A'
    const leastOrderedTopping = sorted[sorted.length - 1]?.[0] ?? 'N/A'

    const avgControversy = this.orderHistory.reduce((s, p) => {
      const avg = p.toppings.length > 0 ? p.toppings.reduce((ts, t) => ts + t.controversyScore, 0) / p.toppings.length : 0
      return s + avg
    }, 0) / totalPizzas

    let pizzaPersonality: string
    if (avgControversy > 60) pizzaPersonality = 'Chaos Agent — you love controversial toppings and heated debates'
    else if (avgControversy > 30) pizzaPersonality = 'Adventurous Eater — willing to try things, but not reckless'
    else if (avgHarmonyScore > 70) pizzaPersonality = 'The Diplomat — your pizzas are perfectly balanced, as all things should be'
    else pizzaPersonality = 'Classic Comfort — you know what you like and you stick with it'

    const spiritPizzas = [
      'Margherita — elegant simplicity',
      'Pepperoni — reliable and universally loved',
      'Hawaiian — misunderstood genius',
      'Meat Lovers — go big or go home',
      'Veggie Supreme — you contain multitudes',
      'White truffle — you have expensive taste',
    ]
    const spiritPizza = spiritPizzas[totalPizzas % spiritPizzas.length]

    return {
      totalPizzas, totalSpent, totalSlices, totalCalories, avgHarmonyScore,
      mostOrderedTopping, leastOrderedTopping,
      controversyIndex: Math.round(avgControversy),
      pizzaPersonality, spiritPizza,
    }
  }

  private generatePizzaName(toppings: Topping[], crust: CrustType): string {
    if (toppings.length === 0) return 'The Naked Pizza'
    if (toppings.some((t) => t.id === 'pineapple')) return 'The Debate Starter'
    if (toppings.some((t) => t.id === 'anchovies')) return 'The Acquired Taste'
    if (toppings.every((t) => t.category === 'meat')) return 'The Carnivore\'s Dream'
    if (toppings.every((t) => t.category === 'veggie')) return 'The Garden Party'
    if (toppings.length >= 5) return 'The Kitchen Sink'
    if (crust === 'deep_dish') return 'The Chicago Argument'
    if (toppings.some((t) => t.category === 'premium')) return 'The Fancy Pants'
    return 'The Custom Classic'
  }
}
