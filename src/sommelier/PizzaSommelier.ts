/**
 * PizzaSommelier — an AI-powered pizza and beverage pairing engine
 * with mood-based recommendations, occasion matching, and a pretentiousness meter.
 */

export type Mood = 'happy' | 'sad' | 'stressed' | 'adventurous' | 'lazy' | 'hangover' | 'celebrating' | 'comfort_seeking' | 'impressing_someone' | 'broke'
export type Occasion = 'date_night' | 'game_day' | 'kids_party' | 'work_lunch' | 'breakup' | 'promotion' | 'tuesday' | 'existential_crisis' | 'netflix_binge' | 'meeting_the_parents'
export type BeverageType = 'wine' | 'beer' | 'cocktail' | 'soda' | 'water' | 'juice' | 'coffee' | 'milkshake' | 'nothing_im_fine'

export interface PizzaPairing {
  pizza: PizzaRecommendation
  beverage: BeverageRecommendation
  pairingScore: number
  sommelierNote: string
  pretentiousnessLevel: number // 0-100
  actuallyGood: boolean
  wineSnobberyTranslation: string
}

export interface PizzaRecommendation {
  name: string
  crust: string
  sauce: string
  toppings: string[]
  whyThisOne: string
  moodAlignment: number
  comfortScore: number
}

export interface BeverageRecommendation {
  name: string
  type: BeverageType
  description: string
  whyItWorks: string
  alternativeIfBroke: string
  temperature: string
}

export interface MoodAnalysis {
  detectedMood: Mood
  confidence: number
  subMoods: string[]
  pizzaUrgency: number // 1-10
  recommendation: string
  doNotOrder: string
  supportiveMessage: string
}

export interface OccasionGuide {
  occasion: Occasion
  recommendedPizzas: PizzaRecommendation[]
  recommendedBeverages: BeverageRecommendation[]
  etiquetteTips: string[]
  mistakesToAvoid: string[]
  conversationStarters: string[]
  exitStrategy: string
}

const MOOD_PIZZA_MAP: Record<Mood, { pizzas: PizzaRecommendation[]; beverages: BeverageRecommendation[]; note: string }> = {
  happy: {
    pizzas: [
      { name: 'The Celebration Supreme', crust: 'regular', sauce: 'marinara', toppings: ['pepperoni', 'sausage', 'mushroom', 'green pepper', 'onion'], whyThisOne: 'You\'re happy — go all out. Get the supreme. You deserve every topping.', moodAlignment: 95, comfortScore: 85 },
      { name: 'Truffle Mushroom Bliss', crust: 'neapolitan', sauce: 'white', toppings: ['truffle oil', 'mushroom', 'arugula'], whyThisOne: 'Happy people can afford to be fancy. Treat yourself.', moodAlignment: 80, comfortScore: 70 },
    ],
    beverages: [
      { name: 'Prosecco', type: 'wine', description: 'Bubbly for bubbly moods', whyItWorks: 'Bubbles match your energy. Science.', alternativeIfBroke: 'Sparkling water with a lemon. Pretend.', temperature: 'Chilled' },
    ],
    note: 'Your serotonin levels suggest you can handle adventurous toppings. Go wild.',
  },
  sad: {
    pizzas: [
      { name: 'The Comfort Blanket', crust: 'thick', sauce: 'marinara', toppings: ['mozzarella', 'mozzarella', 'more mozzarella'], whyThisOne: 'Extra cheese is a hug in food form. You need this.', moodAlignment: 98, comfortScore: 100 },
      { name: 'Classic Pepperoni', crust: 'regular', sauce: 'marinara', toppings: ['pepperoni'], whyThisOne: 'Nothing fancy. Nothing risky. Just reliable, familiar, always-there pepperoni.', moodAlignment: 90, comfortScore: 95 },
    ],
    beverages: [
      { name: 'Hot chocolate', type: 'coffee', description: 'Warm, sweet, judgment-free', whyItWorks: 'It\'s basically a liquid hug.', alternativeIfBroke: 'Warm milk with a spoon of Nutella stirred in.', temperature: 'Hot' },
    ],
    note: 'The sommelier prescribes carbs. This is a medical pizza emergency.',
  },
  stressed: {
    pizzas: [
      { name: 'The Deadline Special', crust: 'thin', sauce: 'garlic butter', toppings: ['bacon', 'jalapeno', 'pepperoni'], whyThisOne: 'Spicy + salty = stress eating perfected. No judgment here.', moodAlignment: 88, comfortScore: 80 },
    ],
    beverages: [
      { name: 'IPA', type: 'beer', description: 'Bitter, like your feelings about that spreadsheet', whyItWorks: 'Hops have calming properties. That\'s our story and we\'re sticking to it.', alternativeIfBroke: 'Chamomile tea. Yes, with pizza. Don\'t @ me.', temperature: 'Cold' },
    ],
    note: 'Step away from the laptop. Eat the pizza. The deadline will still be there but so will your sanity.',
  },
  adventurous: {
    pizzas: [
      { name: 'The Wildcard', crust: 'detroit', sauce: 'pesto', toppings: ['pineapple', 'jalapeno', 'bacon', 'arugula'], whyThisOne: 'Sweet, spicy, smoky, peppery. It shouldn\'t work. It absolutely does.', moodAlignment: 95, comfortScore: 60 },
      { name: 'The Fusion Experiment', crust: 'cauliflower', sauce: 'bbq', toppings: ['bbq_chicken', 'red onion', 'cilantro', 'pineapple'], whyThisOne: 'You\'re in the mood to discover. This pizza is a journey.', moodAlignment: 90, comfortScore: 55 },
    ],
    beverages: [
      { name: 'Natural wine (orange)', type: 'wine', description: 'Funky, unpredictable, and slightly weird — like you right now', whyItWorks: 'Adventurous pizza deserves an adventurous drink.', alternativeIfBroke: 'Kombucha. It\'s also weird and fermented.', temperature: 'Slightly chilled' },
    ],
    note: 'The sommelier salutes your bravery. Not all heroes wear capes. Some order pineapple-jalapeño.',
  },
  lazy: {
    pizzas: [
      { name: 'Literally Just Cheese', crust: 'regular', sauce: 'marinara', toppings: [], whyThisOne: 'Zero topping decisions required. Maximum laziness achieved.', moodAlignment: 100, comfortScore: 90 },
    ],
    beverages: [
      { name: 'Whatever\'s in the fridge', type: 'nothing_im_fine', description: 'You\'re not getting up for a drink', whyItWorks: 'Pairs with couch. Complements sweatpants.', alternativeIfBroke: 'Tap water. From the bathroom if the kitchen is too far.', temperature: 'Room temp (you\'re not walking to the fridge)' },
    ],
    note: 'The sommelier respects the horizontal lifestyle. Order delivery. Do not move.',
  },
  hangover: {
    pizzas: [
      { name: 'The Morning After', crust: 'stuffed', sauce: 'marinara', toppings: ['sausage', 'bacon', 'pepperoni', 'ham'], whyThisOne: 'Grease absorbs regret. That\'s just chemistry.', moodAlignment: 95, comfortScore: 92 },
    ],
    beverages: [
      { name: 'Ginger ale', type: 'soda', description: 'The unofficial hangover sponsor', whyItWorks: 'Settles the stomach while pizza settles the soul.', alternativeIfBroke: 'Water. Lots of water. Why didn\'t you drink water last night.', temperature: 'Cold with ice' },
    ],
    note: 'The sommelier does not judge. The sommelier has been there. Eat slowly.',
  },
  celebrating: {
    pizzas: [
      { name: 'The Victory Lap', crust: 'stuffed', sauce: 'white', toppings: ['truffle oil', 'prosciutto', 'arugula', 'parmesan'], whyThisOne: 'You won at life today. This pizza is your trophy.', moodAlignment: 92, comfortScore: 75 },
    ],
    beverages: [
      { name: 'Champagne', type: 'wine', description: 'Real champagne. From Champagne. You earned it.', whyItWorks: 'Bubbles + victory + pizza = peak human experience.', alternativeIfBroke: 'Martinelli\'s sparkling cider. No one will know. (They will know.)', temperature: 'Ice cold' },
    ],
    note: 'The sommelier raises a glass. You did the thing. Now eat the pizza.',
  },
  comfort_seeking: {
    pizzas: [
      { name: 'Grandma\'s Recipe', crust: 'thick', sauce: 'marinara', toppings: ['sausage', 'mushroom', 'onion'], whyThisOne: 'This is the pizza equivalent of a warm blanket and a movie you\'ve seen 17 times.', moodAlignment: 97, comfortScore: 99 },
    ],
    beverages: [
      { name: 'Root beer', type: 'soda', description: 'Nostalgic. Comforting. Zero pretension.', whyItWorks: 'Root beer and pizza is the childhood you deserve.', alternativeIfBroke: 'Any soda, honestly. This isn\'t the time for water.', temperature: 'Cold' },
    ],
    note: 'The sommelier understands. Sometimes you just need pizza and feelings.',
  },
  impressing_someone: {
    pizzas: [
      { name: 'The "I Have Good Taste"', crust: 'neapolitan', sauce: 'olive_oil', toppings: ['burrata', 'prosciutto', 'arugula', 'truffle oil'], whyThisOne: 'This pizza says "I know what I\'m doing" even if you don\'t.', moodAlignment: 85, comfortScore: 60 },
    ],
    beverages: [
      { name: 'Barolo', type: 'wine', description: 'Italian wine with Italian pizza. You planned this.', whyItWorks: 'Makes you look cultured. Even if you googled "good wine for pizza" 5 minutes ago.', alternativeIfBroke: 'Chianti in a nice glass. The glass does 80% of the work.', temperature: 'Room temperature (say "cellar temperature" to sound fancy)' },
    ],
    note: 'The sommelier has prepared talking points: mention "San Marzano tomatoes" and "wood-fired" at least once.',
  },
  broke: {
    pizzas: [
      { name: 'The Budget King', crust: 'thin', sauce: 'marinara', toppings: ['pepperoni'], whyThisOne: 'One topping. Maximum satisfaction per dollar. This is peak financial planning.', moodAlignment: 85, comfortScore: 88 },
    ],
    beverages: [
      { name: 'Tap water', type: 'water', description: 'Free. Like your budget demands.', whyItWorks: 'It hydrates and costs $0.00. The ROI is infinite.', alternativeIfBroke: 'You\'re already at the broke option. There is no alternative. Drink water.', temperature: 'Whatever comes out of the tap' },
    ],
    note: 'The sommelier has waived their fee. We\'ve all been here. One pepperoni pizza can change your week.',
  },
}

const OCCASION_GUIDES: Record<Occasion, Omit<OccasionGuide, 'occasion' | 'recommendedPizzas' | 'recommendedBeverages'>> = {
  date_night: {
    etiquetteTips: ['Order something shareable — it\'s romantic', 'Don\'t order garlic knots unless they do first', 'Fold your pizza. It shows confidence.', 'If they put ketchup on pizza, you can legally leave.'],
    mistakesToAvoid: ['Ordering anchovies on a first date', 'Getting sauce on your shirt', 'Arguing about pineapple before the appetizer arrives', 'Eating more than 60% of the shared pizza'],
    conversationStarters: ['What\'s your most controversial pizza opinion?', 'If you could only eat one pizza for the rest of your life...', 'Do you fold or go flat?'],
    exitStrategy: 'Pretend you got a text about a pizza emergency at home. No one questions pizza emergencies.',
  },
  game_day: {
    etiquetteTips: ['Order multiple pizzas — this is not the time for restraint', 'Variety is key: at least one meat, one veggie, one wild card', 'Napkins. So many napkins.'],
    mistakesToAvoid: ['Only ordering one pizza for 8 people', 'Getting a salad', 'Arguing about toppings during the 4th quarter'],
    conversationStarters: ['This play is almost as good as this pizza', 'Who ordered the anchovy pizza? Show yourself.'],
    exitStrategy: 'The game ended. Everyone leaves. You keep the leftover pizza. This was always the plan.',
  },
  kids_party: {
    etiquetteTips: ['Cheese pizza is the universal kids\' currency', 'Cut into small squares, not triangles — less mess', 'Order 50% more than you think you need'],
    mistakesToAvoid: ['Ordering anything with visible vegetables', 'Truffle oil at a 7-year-old\'s party', 'Underestimating how much pizza children can consume'],
    conversationStarters: ['Who wants more pizza?? (this is the only conversation starter you need)'],
    exitStrategy: 'Sugar crash in 45 minutes. The party will end itself.',
  },
  work_lunch: {
    etiquetteTips: ['Order a variety to avoid the "who picked this" debate', 'Always get one plain cheese — someone will need it', 'Eat with a fork if the CEO is watching. Sacrifice your dignity.'],
    mistakesToAvoid: ['Ordering the most expensive pizza on the company card (actually, do this)', 'Getting garlic breath before a 2pm meeting', 'Being the person who takes 4 slices before everyone\'s had one'],
    conversationStarters: ['So, about that Q3 roadmap... just kidding, let\'s talk about pizza'],
    exitStrategy: '"I have a hard stop at 1." Everyone respects a hard stop.',
  },
  breakup: {
    etiquetteTips: ['Order whatever you want. There are no rules anymore.', 'Eat the entire pizza. It\'s medicinal.', 'Pair with ice cream. The sommelier approves.'],
    mistakesToAvoid: ['Ordering their favorite pizza (too painful)', 'Sharing (you are done sharing)', 'Moderation (absolutely not)'],
    conversationStarters: ['N/A — you\'re eating alone and that\'s okay'],
    exitStrategy: 'There is no exit. There is only pizza. And eventually, sleep.',
  },
  promotion: {
    etiquetteTips: ['You\'re buying. For everyone. That\'s the rule.', 'Get the fancy pizza. You can afford it now (barely).', 'Make a toast with pizza slices.'],
    mistakesToAvoid: ['Being humble about it (you worked hard, celebrate)', 'Ordering from the cheap place (not tonight)'],
    conversationStarters: ['So, now that I\'m [new title], I\'d like to propose a pizza-based policy...'],
    exitStrategy: 'You don\'t exit. You\'re the guest of honor. Stay until the pizza is gone.',
  },
  tuesday: {
    etiquetteTips: ['It\'s Tuesday. There are no rules.', 'Order pizza because you want to. No occasion needed.', 'This is the purest form of pizza ordering.'],
    mistakesToAvoid: ['Feeling guilty about pizza on a Tuesday (never feel guilty about pizza)'],
    conversationStarters: ['It\'s Tuesday and I ordered pizza. I\'m winning at life.'],
    exitStrategy: 'Go to bed. Wake up. Eat cold leftover pizza. Peak Tuesday.',
  },
  existential_crisis: {
    etiquetteTips: ['Pizza exists. Therefore something is good.', 'The universe may be indifferent but pizza is not.', 'Eat slowly. Be present. The cheese is real even if nothing else is.'],
    mistakesToAvoid: ['Philosophizing about whether pizza has inherent meaning (it does)', 'Ordering nothing because "what\'s the point" (the point is pizza)'],
    conversationStarters: ['Does pizza have consciousness? Discuss.'],
    exitStrategy: 'The crisis passes. The pizza remains. This is the way.',
  },
  netflix_binge: {
    etiquetteTips: ['Order enough for the entire series', 'Get a pizza that\'s good cold — you will forget about it during a cliffhanger', 'No toppings that require attention (looking at you, hot peppers)'],
    mistakesToAvoid: ['Getting crumbs on the remote', 'Running out of pizza before the season finale'],
    conversationStarters: ['Shh. We\'re watching.'],
    exitStrategy: 'The show ends. The pizza is gone. You stare at the ceiling. Start a new show.',
  },
  meeting_the_parents: {
    etiquetteTips: ['Do NOT order pineapple unless you\'ve confirmed their stance', 'Compliment whatever they order, even if it\'s wrong', 'Offer to pay. Insist. Win their respect through pizza generosity.'],
    mistakesToAvoid: ['Eating with your hands if they\'re using forks', 'Ordering more than 3 slices on the first meeting', 'Mentioning that you follow a pizza stock market'],
    conversationStarters: ['What\'s your go-to pizza order? (This reveals everything about a person)'],
    exitStrategy: '"I should get going — early morning tomorrow." Classic, timeless, unremarkable.',
  },
}

export class PizzaSommelier {
  analyzeMood(mood: Mood): MoodAnalysis {
    const moodData = MOOD_PIZZA_MAP[mood]
    const urgencyMap: Record<Mood, number> = {
      hangover: 10, sad: 9, stressed: 8, comfort_seeking: 8, broke: 7,
      lazy: 6, celebrating: 6, happy: 5, adventurous: 5, impressing_someone: 4,
    }

    const subMoods: Record<Mood, string[]> = {
      happy: ['grateful', 'energetic', 'generous'], sad: ['melancholic', 'nostalgic', 'in need of cheese'],
      stressed: ['overwhelmed', 'caffeinated', 'running on fumes'], adventurous: ['curious', 'fearless', 'possibly reckless'],
      lazy: ['horizontal', 'unmotivated', 'one with the couch'], hangover: ['regretful', 'dehydrated', 'light-sensitive'],
      celebrating: ['proud', 'generous', 'slightly smug'], comfort_seeking: ['vulnerable', 'soft', 'in need of carbs'],
      impressing_someone: ['nervous', 'overthinking', 'googling wine'], broke: ['resourceful', 'creative', 'checking the couch for coins'],
    }

    const doNotOrders: Record<Mood, string> = {
      happy: 'Don\'t order plain cheese — you can do better today.', sad: 'Don\'t order a salad. This is not the time for health.',
      stressed: 'Don\'t order anything spicy — you have enough going on.', adventurous: 'Don\'t order pepperoni — that\'s a Tuesday move.',
      lazy: 'Don\'t order anything that requires assembly or dipping.', hangover: 'Don\'t order anchovies. Trust us.',
      celebrating: 'Don\'t order from the cheap place. Not tonight.', comfort_seeking: 'Don\'t order anything new or experimental.',
      impressing_someone: 'Don\'t order with your mouth full from the bread basket.', broke: 'Don\'t look at the truffle section of the menu.',
    }

    const supportiveMessages: Record<Mood, string> = {
      happy: 'The world is good and pizza makes it better. Enjoy!', sad: 'Pizza won\'t fix everything, but it won\'t make anything worse. You\'re going to be okay.',
      stressed: 'Take a breath. Take a bite. One thing at a time.', adventurous: 'Fortune favors the bold. And the bold order pineapple-jalapeño.',
      lazy: 'Rest is productive. Pizza is fuel. You\'re doing great.', hangover: 'This too shall pass. The pizza will help it pass faster.',
      celebrating: 'You earned this. Every bite. Celebrate loudly.', comfort_seeking: 'It\'s okay to need comfort. Pizza is here for you. Always.',
      impressing_someone: 'Be yourself. But the version of yourself that knows about wine pairings.', broke: 'Being broke is temporary. Pizza loyalty is forever. One slice at a time.',
    }

    return {
      detectedMood: mood,
      confidence: 85 + Math.floor(Math.random() * 15),
      subMoods: subMoods[mood],
      pizzaUrgency: urgencyMap[mood],
      recommendation: moodData.note,
      doNotOrder: doNotOrders[mood],
      supportiveMessage: supportiveMessages[mood],
    }
  }

  getPairing(mood: Mood): PizzaPairing {
    const moodData = MOOD_PIZZA_MAP[mood]
    const pizza = moodData.pizzas[0]
    const beverage = moodData.beverages[0]

    const pretentiousness = beverage.type === 'wine' ? 70 + Math.floor(Math.random() * 30) :
      beverage.type === 'beer' ? 20 + Math.floor(Math.random() * 30) :
      beverage.type === 'water' ? 0 : 30 + Math.floor(Math.random() * 20)

    const wineTranslations: Record<Mood, string> = {
      happy: 'Notes of joy, with a finish of "I made good life choices."',
      sad: 'Full-bodied comfort with a nose of melted mozzarella and a finish of hope.',
      stressed: 'Aggressive tannins match the aggression of your inbox.',
      adventurous: 'Untamed, unfiltered, and slightly unpredictable — like your pizza order.',
      lazy: 'Pairs with couch. Decant directly into mouth.',
      hangover: 'The bouquet is... please stop talking about bouquets.',
      celebrating: 'Effervescent joy with a palate of "I did it" and a finish of pepperoni.',
      comfort_seeking: 'Soft, gentle, and warm — like the pizza it accompanies.',
      impressing_someone: 'Say "terroir" once and they\'ll think you know things.',
      broke: 'Water. The sommelier note is: hydrate.',
    }

    return {
      pizza,
      beverage,
      pairingScore: Math.round(pizza.moodAlignment * 0.6 + pizza.comfortScore * 0.4),
      sommelierNote: moodData.note,
      pretentiousnessLevel: pretentiousness,
      actuallyGood: true,
      wineSnobberyTranslation: wineTranslations[mood],
    }
  }

  getOccasionGuide(occasion: Occasion): OccasionGuide {
    const guideData = OCCASION_GUIDES[occasion]
    const moods: Mood[] = {
      date_night: 'impressing_someone', game_day: 'happy', kids_party: 'stressed',
      work_lunch: 'impressing_someone', breakup: 'sad', promotion: 'celebrating',
      tuesday: 'lazy', existential_crisis: 'comfort_seeking', netflix_binge: 'lazy',
      meeting_the_parents: 'impressing_someone',
    }[occasion] as Mood ?? 'happy'

    const moodData = MOOD_PIZZA_MAP[moods]

    return {
      occasion,
      recommendedPizzas: moodData.pizzas,
      recommendedBeverages: moodData.beverages,
      ...guideData,
    }
  }

  getPretentiousnessScore(order: { pizza: string; beverage: string; description: string }): {
    score: number
    level: string
    feedback: string
    suggestions: string[]
  } {
    let score = 0
    const lower = (order.pizza + ' ' + order.beverage + ' ' + order.description).toLowerCase()

    if (lower.includes('truffle')) score += 25
    if (lower.includes('artisan')) score += 20
    if (lower.includes('neapolitan')) score += 15
    if (lower.includes('wood-fired') || lower.includes('wood fired')) score += 15
    if (lower.includes('san marzano')) score += 20
    if (lower.includes('burrata')) score += 18
    if (lower.includes('prosciutto')) score += 12
    if (lower.includes('natural wine')) score += 25
    if (lower.includes('orange wine')) score += 30
    if (lower.includes('barolo') || lower.includes('brunello')) score += 20
    if (lower.includes('terroir')) score += 35
    if (lower.includes('mouthfeel')) score += 40
    if (lower.includes('notes of')) score += 30
    if (lower.includes('finish')) score += 15
    if (lower.includes('pepperoni')) score -= 10
    if (lower.includes('domino')) score -= 30
    if (lower.includes('ranch')) score -= 20
    if (lower.includes('ketchup')) score -= 50

    score = Math.min(100, Math.max(0, score))

    let level: string
    if (score >= 80) level = 'Insufferable Foodie'
    else if (score >= 60) level = 'Aspiring Food Critic'
    else if (score >= 40) level = 'Casually Cultured'
    else if (score >= 20) level = 'Refreshingly Normal'
    else level = 'Gloriously Unpretentious'

    const feedback = score >= 70
      ? 'You used words like "terroir" and "mouthfeel." We respect your commitment to being That Person at dinner parties.'
      : score >= 40
      ? 'A healthy balance of sophistication and approachability. You can dine at fancy places AND enjoy Costco pizza.'
      : 'You order what you like and don\'t need a sommelier to validate your choices. Honestly? That\'s the most powerful move.'

    const suggestions = score >= 70
      ? ['Consider occasionally ordering from a chain restaurant to stay grounded', 'Not every pizza needs to be a "journey"']
      : score <= 30
      ? ['Try saying "this has nice acidity" next time. People will be impressed.', 'Mozzarella di bufala is regular mozzarella\'s cooler cousin. Worth trying.']
      : ['You\'re perfectly calibrated. Don\'t change.']

    return { score, level, feedback, suggestions }
  }
}
