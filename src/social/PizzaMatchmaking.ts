/**
 * PizzaMatchmaking — a dating-app-style matcher that pairs people
 * based on pizza preferences. Because if you can't share a pizza,
 * you can't share a life.
 */

export type DealBreaker = 'pineapple_lover' | 'pineapple_hater' | 'anchovy_enjoyer' | 'no_cheese' | 'ketchup_on_pizza' | 'eats_with_fork' | 'doesnt_eat_crust' | 'reheats_in_microwave' | 'cold_pizza_only' | 'dips_in_ranch'

export interface PizzaProfile {
  id: string
  name: string
  age: number
  location: string
  photo: string
  crustPreference: string
  saucePreference: string
  topThreeToppings: string[]
  dealBreakers: DealBreaker[]
  pizzaFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'special_occasions'
  foldOrFlat: 'fold' | 'flat' | 'depends_on_mood'
  slicesPerSitting: number
  controversialOpinion: string
  pizzaLoveLanguage: string
  idealFirstDate: string
  redFlags: string[]
  greenFlags: string[]
}

export interface Match {
  id: string
  profile1: PizzaProfile
  profile2: PizzaProfile
  compatibilityScore: number
  toppingOverlap: number
  dealBreakerConflicts: string[]
  sharedValues: string[]
  firstDateSuggestion: string
  pizzaToShareOnFirstDate: string
  relationshipForecast: string
  iceBreaker: string
  warningLabel: string | null
}

export interface SwipeResult {
  action: 'like' | 'pass' | 'super_like' | 'pizza_emergency'
  profileId: string
  reason: string
  timestamp: string
}

const DEAL_BREAKER_LABELS: Record<DealBreaker, { label: string; severity: number; emoji: string }> = {
  pineapple_lover: { label: 'Puts pineapple on pizza', severity: 50, emoji: '🍍' },
  pineapple_hater: { label: 'Refuses pineapple on pizza', severity: 30, emoji: '🚫' },
  anchovy_enjoyer: { label: 'Orders anchovies willingly', severity: 60, emoji: '🐟' },
  no_cheese: { label: 'Orders pizza without cheese', severity: 80, emoji: '😱' },
  ketchup_on_pizza: { label: 'Puts ketchup on pizza', severity: 95, emoji: '🍅' },
  eats_with_fork: { label: 'Eats pizza with a fork and knife', severity: 70, emoji: '🍴' },
  doesnt_eat_crust: { label: 'Leaves the crust', severity: 40, emoji: '🦴' },
  reheats_in_microwave: { label: 'Reheats pizza in the microwave', severity: 55, emoji: '📡' },
  cold_pizza_only: { label: 'Only eats cold leftover pizza', severity: 35, emoji: '🧊' },
  dips_in_ranch: { label: 'Dips pizza in ranch', severity: 45, emoji: '🥛' },
}

const RELATIONSHIP_FORECASTS = [
  { minScore: 90, forecast: 'Soulmates. You will open a pizzeria together and grow old arguing about nothing because you agree on everything.', emoji: '💍' },
  { minScore: 75, forecast: 'Strong match. You\'ll have a beautiful pizza life with only minor crust disagreements.', emoji: '❤️' },
  { minScore: 60, forecast: 'Promising. You can share a pizza most nights. Some nights you\'ll need your own.', emoji: '💛' },
  { minScore: 45, forecast: 'It could work if you both compromise. Half-and-half is your love language.', emoji: '🤝' },
  { minScore: 30, forecast: 'Challenging. You will argue about toppings at least twice a week. Possibly worth it.', emoji: '⚡' },
  { minScore: 15, forecast: 'Risky. Your pizza preferences are fundamentally incompatible. Separate orders only.', emoji: '⚠️' },
  { minScore: 0, forecast: 'Do not. Under any circumstances. Share a pizza. Or a table. Or a zip code.', emoji: '🚨' },
]

const ICE_BREAKERS = [
  'If you could only eat one pizza for the rest of your life, what would it be?',
  'Controversial question: do you eat the crust first or last?',
  'What\'s the worst pizza you\'ve ever had and why was it from an airport?',
  'If your personality were a pizza topping, what would you be and why?',
  'Hot take: what\'s the most overrated pizza place in your city?',
  'Would you rather have unlimited free pizza but it\'s always lukewarm, or pay full price but it\'s always perfect?',
  'What\'s on your dream pizza that doesn\'t exist yet?',
  'Be honest: have you ever judged someone based on their pizza order?',
  'Pineapple on pizza — dealbreaker or deal-maker?',
  'If you opened a pizzeria, what would you name it?',
]

const FIRST_DATE_PIZZAS = [
  { pizza: 'Classic Margherita', vibe: 'Safe, elegant, shows you appreciate simplicity' },
  { pizza: 'Pepperoni', vibe: 'Reliable. You\'re saying "I\'m not here to play games"' },
  { pizza: 'White truffle mushroom', vibe: 'Fancy. You\'re trying to impress. It might work.' },
  { pizza: 'Half pepperoni, half veggie', vibe: 'The diplomatic choice. You\'re a people pleaser.' },
  { pizza: 'BBQ chicken', vibe: 'Bold but accessible. You have range.' },
  { pizza: 'Hawaiian', vibe: 'You\'re testing them. This is a loyalty assessment.' },
]

export class PizzaMatchmaking {
  private profiles: Map<string, PizzaProfile> = new Map()
  private matches: Match[] = []
  private swipeHistory: SwipeResult[] = []

  createProfile(params: Omit<PizzaProfile, 'id' | 'redFlags' | 'greenFlags'>): PizzaProfile {
    const redFlags = this.detectRedFlags(params)
    const greenFlags = this.detectGreenFlags(params)

    const profile: PizzaProfile = {
      ...params,
      id: `pp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      redFlags,
      greenFlags,
    }

    this.profiles.set(profile.id, profile)
    return profile
  }

  findMatches(profileId: string, limit: number = 10): Match[] {
    const profile = this.profiles.get(profileId)
    if (!profile) throw new Error('Profile not found. Maybe create one first?')

    const candidates = Array.from(this.profiles.values()).filter((p) => p.id !== profileId)

    const matches = candidates.map((candidate) => this.calculateMatch(profile, candidate))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, limit)

    this.matches.push(...matches)
    return matches
  }

  swipe(fromId: string, toId: string, action: SwipeResult['action']): SwipeResult {
    const from = this.profiles.get(fromId)
    const to = this.profiles.get(toId)
    if (!from || !to) throw new Error('Profile not found.')

    let reason: string
    switch (action) {
      case 'like':
        reason = `Liked ${to.name}'s taste. ${to.topThreeToppings[0]} fans unite.`
        break
      case 'pass':
        reason = this.generatePassReason(from, to)
        break
      case 'super_like':
        reason = `Super liked! ${to.name}'s pizza profile is chef's kiss.`
        break
      case 'pizza_emergency':
        reason = `PIZZA EMERGENCY: ${from.name} needs pizza RIGHT NOW and ${to.name} is nearby.`
        break
    }

    const result: SwipeResult = {
      action,
      profileId: toId,
      reason,
      timestamp: new Date().toISOString(),
    }
    this.swipeHistory.push(result)
    return result
  }

  getMatchStats(): {
    totalProfiles: number
    totalMatches: number
    avgCompatibility: number
    mostCommonDealBreaker: string
    mostPopularTopping: string
    foldVsFlat: { fold: number; flat: number; depends: number }
    avgSlicesPerSitting: number
    topIceBreaker: string
  } {
    const profiles = Array.from(this.profiles.values())

    const dealBreakerCounts = new Map<string, number>()
    profiles.forEach((p) => p.dealBreakers.forEach((db) => {
      dealBreakerCounts.set(db, (dealBreakerCounts.get(db) ?? 0) + 1)
    }))

    const toppingCounts = new Map<string, number>()
    profiles.forEach((p) => p.topThreeToppings.forEach((t) => {
      toppingCounts.set(t, (toppingCounts.get(t) ?? 0) + 1)
    }))

    const foldVsFlat = { fold: 0, flat: 0, depends: 0 }
    profiles.forEach((p) => {
      if (p.foldOrFlat === 'fold') foldVsFlat.fold++
      else if (p.foldOrFlat === 'flat') foldVsFlat.flat++
      else foldVsFlat.depends++
    })

    return {
      totalProfiles: profiles.length,
      totalMatches: this.matches.length,
      avgCompatibility: this.matches.length > 0 ? Math.round(this.matches.reduce((s, m) => s + m.compatibilityScore, 0) / this.matches.length) : 0,
      mostCommonDealBreaker: Array.from(dealBreakerCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none',
      mostPopularTopping: Array.from(toppingCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pepperoni',
      foldVsFlat,
      avgSlicesPerSitting: profiles.length > 0 ? Math.round(profiles.reduce((s, p) => s + p.slicesPerSitting, 0) / profiles.length * 10) / 10 : 0,
      topIceBreaker: ICE_BREAKERS[0],
    }
  }

  // ---- Private helpers ----

  private calculateMatch(p1: PizzaProfile, p2: PizzaProfile): Match {
    let score = 50

    // Topping overlap
    const overlap = p1.topThreeToppings.filter((t) => p2.topThreeToppings.includes(t))
    score += overlap.length * 10

    // Crust compatibility
    if (p1.crustPreference === p2.crustPreference) score += 8

    // Sauce compatibility
    if (p1.saucePreference === p2.saucePreference) score += 5

    // Fold compatibility
    if (p1.foldOrFlat === p2.foldOrFlat) score += 7

    // Pizza frequency compatibility
    if (p1.pizzaFrequency === p2.pizzaFrequency) score += 10
    if ((p1.pizzaFrequency === 'daily' && p2.pizzaFrequency === 'monthly') ||
        (p2.pizzaFrequency === 'daily' && p1.pizzaFrequency === 'monthly')) score -= 15

    // Slice count — similar appetites
    const sliceDiff = Math.abs(p1.slicesPerSitting - p2.slicesPerSitting)
    if (sliceDiff <= 1) score += 5
    if (sliceDiff >= 4) score -= 10

    // Deal breaker conflicts
    const conflicts: string[] = []
    p1.dealBreakers.forEach((db) => {
      const info = DEAL_BREAKER_LABELS[db]
      // Check if p2 exhibits the deal breaker behavior
      if (db === 'pineapple_lover' && p2.topThreeToppings.includes('pineapple')) {
        conflicts.push(`${p1.name} can't handle that ${p2.name} loves pineapple`)
        score -= info.severity / 5
      }
      if (db === 'doesnt_eat_crust' && p2.redFlags.includes('Leaves the crust')) {
        conflicts.push(`${p1.name} is horrified that ${p2.name} abandons their crusts`)
        score -= info.severity / 5
      }
    })

    score = Math.min(100, Math.max(0, Math.round(score)))

    // Shared values
    const sharedValues: string[] = []
    if (overlap.length > 0) sharedValues.push(`Both love ${overlap.join(' and ')}`)
    if (p1.foldOrFlat === p2.foldOrFlat) sharedValues.push(`Both ${p1.foldOrFlat === 'fold' ? 'folders' : 'flat-eaters'}`)
    if (p1.pizzaFrequency === p2.pizzaFrequency) sharedValues.push(`Both eat pizza ${p1.pizzaFrequency}`)

    const forecast = RELATIONSHIP_FORECASTS.find((f) => score >= f.minScore) ?? RELATIONSHIP_FORECASTS[RELATIONSHIP_FORECASTS.length - 1]
    const firstDatePizza = FIRST_DATE_PIZZAS[Math.floor(Math.random() * FIRST_DATE_PIZZAS.length)]

    let warningLabel: string | null = null
    if (conflicts.length >= 3) warningLabel = 'HIGH CONFLICT ZONE: Multiple pizza incompatibilities detected'
    else if (p1.slicesPerSitting + p2.slicesPerSitting > 12) warningLabel = 'BUDGET WARNING: You will spend a lot on pizza together'

    return {
      id: `match-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      profile1: p1,
      profile2: p2,
      compatibilityScore: score,
      toppingOverlap: overlap.length,
      dealBreakerConflicts: conflicts,
      sharedValues,
      firstDateSuggestion: `Go to a local pizza spot and order ${firstDatePizza.pizza}. ${firstDatePizza.vibe}`,
      pizzaToShareOnFirstDate: firstDatePizza.pizza,
      relationshipForecast: `${forecast.emoji} ${forecast.forecast}`,
      iceBreaker: ICE_BREAKERS[Math.floor(Math.random() * ICE_BREAKERS.length)],
      warningLabel,
    }
  }

  private detectRedFlags(params: Omit<PizzaProfile, 'id' | 'redFlags' | 'greenFlags'>): string[] {
    const flags: string[] = []
    if (params.dealBreakers.includes('ketchup_on_pizza')) flags.push('Puts ketchup on pizza (seek help)')
    if (params.dealBreakers.includes('no_cheese')) flags.push('Orders cheeseless pizza (why)')
    if (params.slicesPerSitting > 8) flags.push('Eats 8+ slices in one sitting (impressive but concerning)')
    if (params.slicesPerSitting < 1) flags.push('Eats less than 1 slice (are you okay?)')
    if (params.pizzaFrequency === 'special_occasions') flags.push('Only eats pizza on special occasions (what is wrong)')
    if (params.controversialOpinion.toLowerCase().includes('ketchup')) flags.push('Has ketchup-related pizza opinions')
    if (params.dealBreakers.includes('eats_with_fork')) flags.push('Uses utensils on pizza')
    return flags
  }

  private detectGreenFlags(params: Omit<PizzaProfile, 'id' | 'redFlags' | 'greenFlags'>): string[] {
    const flags: string[] = []
    if (params.pizzaFrequency === 'weekly' || params.pizzaFrequency === 'daily') flags.push('Committed pizza enthusiast')
    if (params.foldOrFlat === 'fold') flags.push('Knows how to fold (culture)')
    if (params.slicesPerSitting >= 3 && params.slicesPerSitting <= 5) flags.push('Healthy pizza appetite')
    if (params.topThreeToppings.includes('pepperoni')) flags.push('Respects the classics')
    if (params.idealFirstDate.toLowerCase().includes('pizza')) flags.push('Pizza-centric dating priorities')
    return flags
  }

  private generatePassReason(from: PizzaProfile, to: PizzaProfile): string {
    const reasons = [
      `${to.name} eats ${to.slicesPerSitting} slices and ${from.name} can't relate.`,
      `Pizza frequency mismatch: ${from.pizzaFrequency} vs ${to.pizzaFrequency}.`,
      `Incompatible topping energy.`,
      `${from.name} sensed a disturbance in the crust preferences.`,
      `Not enough topping overlap. Moving on.`,
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }
}
