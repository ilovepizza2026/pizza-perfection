/**
 * PizzaSocialNetwork — a social platform where people share pizza opinions,
 * debate toppings, form pizza alliances, and rate each other's taste.
 */

export type PizzaTribe = 'traditionalist' | 'innovator' | 'purist' | 'maximalist' | 'contrarian' | 'diplomat'

export interface PizzaUser {
  id: string
  username: string
  displayName: string
  tribe: PizzaTribe
  bio: string
  avatar: string
  joinedAt: string
  pizzaCredibility: number // 0-100
  followers: string[]
  following: string[]
  posts: PizzaPost[]
  favoriteTopping: string
  controversialOpinion: string
  pizzasRated: number
  avgRating: number
  badges: PizzaBadge[]
  blocked: string[] // userIds of people with unforgivable pizza opinions
}

export interface PizzaPost {
  id: string
  authorId: string
  type: 'review' | 'hot_take' | 'debate' | 'photo' | 'poll' | 'confession'
  content: string
  pizzaReference: string | null
  likes: number
  dislikes: number
  comments: PizzaComment[]
  shares: number
  controversyScore: number
  tags: string[]
  createdAt: string
  isHotTake: boolean
}

export interface PizzaComment {
  id: string
  authorId: string
  authorName: string
  content: string
  likes: number
  isAngry: boolean
  createdAt: string
}

export interface PizzaBadge {
  id: string
  name: string
  description: string
  emoji: string
  earnedAt: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythical'
}

export interface PizzaDebate {
  id: string
  topic: string
  description: string
  side1: { label: string; votes: number; arguments: string[] }
  side2: { label: string; votes: number; arguments: string[] }
  status: 'active' | 'closed' | 'heated' | 'too_heated'
  heatLevel: number // 0-100
  startedAt: string
  closedAt: string | null
  verdict: string | null
  participantCount: number
}

export interface PizzaPoll {
  id: string
  question: string
  options: { text: string; votes: number; emoji: string }[]
  totalVotes: number
  createdAt: string
  expiresAt: string
  isControversial: boolean
}

export interface TasteCompatibility {
  user1Id: string
  user2Id: string
  overallMatch: number
  toppingOverlap: string[]
  dealbreakers: string[]
  verdict: string
  couldSharePizza: boolean
  suggestedCompromise: string
}

export interface TrendingTopic {
  topic: string
  postCount: number
  heatLevel: number
  emoji: string
  summary: string
}

const TRIBE_PROFILES: Record<PizzaTribe, { description: string; emoji: string; motto: string; strengths: string[]; weaknesses: string[] }> = {
  traditionalist: { description: 'Believes pizza peaked with margherita and everything since is heresy', emoji: '🏛️', motto: 'If it ain\'t broke, don\'t add pineapple to it.', strengths: ['Deep knowledge of classics', 'Respects the craft', 'Never disappoints'], weaknesses: ['Judgmental of innovation', 'Will lecture you about Naples', 'Orders the same thing every time'] },
  innovator: { description: 'Puts things on pizza that have no business being on pizza', emoji: '🔬', motto: 'Every topping is valid until proven guilty.', strengths: ['Fearless experimentation', 'Discovers amazing combos', 'Never boring'], weaknesses: ['Sometimes goes too far', 'Has made people cry with their orders', '50% hit rate on "inventions"'] },
  purist: { description: 'Fewer toppings = more respect for the dough', emoji: '✨', motto: 'Simplicity is the ultimate sophistication.', strengths: ['Appreciates quality ingredients', 'Can taste the difference in flour', 'Instagram-worthy orders'], weaknesses: ['Will pay $28 for a plain margherita', 'Insufferable at Domino\'s', 'Uses the word "artisan" too much'] },
  maximalist: { description: 'Every pizza should have at least 6 toppings or why bother', emoji: '🌋', motto: 'More is more. Less is just less.', strengths: ['Gets their money\'s worth', 'Never hungry after eating', 'Life of the pizza party'], weaknesses: ['Structural integrity issues', 'Takes 20 minutes to order', 'Their pizza weighs 4 pounds'] },
  contrarian: { description: 'If you like it, they don\'t. If you hate it, they love it.', emoji: '😈', motto: 'Pineapple AND anchovies. Fight me.', strengths: ['Keeps things interesting', 'Genuinely unique taste', 'Great at debates'], weaknesses: ['Orders for shock value', 'Has been asked to leave pizza parties', 'Their Yelp reviews are essays'] },
  diplomat: { description: 'Can find a pizza everyone agrees on. A true hero.', emoji: '🕊️', motto: 'There\'s a topping for everyone at this table.', strengths: ['Group ordering expert', 'Prevents pizza wars', 'Everyone\'s friend'], weaknesses: ['Never gets exactly what they want', 'Conflict-avoidant about crust choices', 'Has eaten a lot of mediocre compromise pizza'] },
}

const LEGENDARY_DEBATES: Omit<PizzaDebate, 'id' | 'startedAt' | 'closedAt' | 'participantCount'>[] = [
  { topic: 'The Pineapple Question', description: 'Does pineapple belong on pizza?', side1: { label: 'Yes, it\'s delicious', votes: 48293, arguments: ['Sweet + savory is a proven combo', 'Hawaiian pizza outsells most specialty pies', 'Gordon Ramsay put it on pizza once'] }, side2: { label: 'Absolutely not', votes: 51207, arguments: ['Fruit on cheese is a crime', 'It makes the crust soggy', 'Italy would like a word'] }, status: 'too_heated', heatLevel: 99, verdict: null },
  { topic: 'Is Deep Dish Actually Pizza?', description: 'Chicago vs. the world.', side1: { label: 'Yes, it\'s pizza', votes: 31000, arguments: ['It has dough, sauce, and cheese', 'Chicago says so', 'It\'s delicious'] }, side2: { label: 'It\'s a casserole', votes: 42000, arguments: ['Jon Stewart made a compelling argument', 'You eat it with a fork', 'Pizza should be foldable'] }, status: 'heated', heatLevel: 85, verdict: null },
  { topic: 'Crust: Eat or Leave?', description: 'Do you eat the pizza bones?', side1: { label: 'Eat the crust', votes: 61000, arguments: ['It\'s part of the pizza', 'Wasting food is wrong', 'Dip it in sauce'] }, side2: { label: 'Leave the crust', votes: 39000, arguments: ['It\'s just bread', 'Save room for more pizza', 'The toppings are the point'] }, status: 'active', heatLevel: 55, verdict: null },
  { topic: 'Cold Pizza for Breakfast', description: 'Is leftover cold pizza an acceptable breakfast?', side1: { label: 'Absolutely yes', votes: 72000, arguments: ['It\'s the best breakfast food', 'No effort required', 'The flavors meld overnight'] }, side2: { label: 'Reheat it at least', votes: 28000, arguments: ['Cold cheese is sad cheese', 'Microwaves exist', 'Have some self-respect'] }, status: 'closed', heatLevel: 30, verdict: 'Cold pizza for breakfast won in a landslide. The people have spoken.' },
  { topic: 'How Many Slices Per Person?', description: 'What\'s the socially acceptable number?', side1: { label: '2-3 slices', votes: 45000, arguments: ['That\'s a normal serving', 'Leave some for others', 'Balance your diet'] }, side2: { label: '4+ slices', votes: 55000, arguments: ['Life is short', '2 slices is an appetizer', 'Don\'t police my pizza intake'] }, status: 'active', heatLevel: 40, verdict: null },
]

const BADGES: PizzaBadge[] = [
  { id: 'b-1', name: 'First Slice', description: 'Rated your first pizza', emoji: '🍕', earnedAt: '', rarity: 'common' },
  { id: 'b-2', name: 'Pizza Critic', description: 'Rated 50 pizzas', emoji: '📝', earnedAt: '', rarity: 'uncommon' },
  { id: 'b-3', name: 'Controversial Take', description: 'Posted a hot take that got 100+ reactions', emoji: '🔥', earnedAt: '', rarity: 'uncommon' },
  { id: 'b-4', name: 'Pineapple Defender', description: 'Publicly defended pineapple on pizza', emoji: '🍍', earnedAt: '', rarity: 'rare' },
  { id: 'b-5', name: 'Anchovy Advocate', description: 'Ordered anchovies and lived to tell the tale', emoji: '🐟', earnedAt: '', rarity: 'rare' },
  { id: 'b-6', name: 'Pizza Diplomat', description: 'Successfully ordered for a group of 10+ without anyone complaining', emoji: '🕊️', earnedAt: '', rarity: 'legendary' },
  { id: 'b-7', name: 'Crust Whisperer', description: 'Correctly identified 5 crust types blindfolded', emoji: '👁️', earnedAt: '', rarity: 'legendary' },
  { id: 'b-8', name: 'Pizza Sommelier', description: 'Paired wine with pizza and impressed a sommelier', emoji: '🍷', earnedAt: '', rarity: 'mythical' },
  { id: 'b-9', name: 'The Chosen One', description: 'Created a pizza so perfect that all tribes agreed it was good', emoji: '👑', earnedAt: '', rarity: 'mythical' },
]

export class PizzaSocialNetwork {
  private users: Map<string, PizzaUser> = new Map()
  private posts: Map<string, PizzaPost> = new Map()
  private debates: PizzaDebate[] = []
  private polls: PizzaPoll[] = []

  constructor() {
    this.debates = LEGENDARY_DEBATES.map((d, i) => ({
      ...d,
      id: `debate-${i}`,
      startedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: d.status === 'closed' ? new Date().toISOString() : null,
      participantCount: d.side1.votes + d.side2.votes,
    }))
  }

  createUser(params: { username: string; displayName: string; favoriteTopping: string; controversialOpinion: string }): PizzaUser {
    const tribe = this.assignTribe(params.favoriteTopping, params.controversialOpinion)
    const user: PizzaUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      username: params.username,
      displayName: params.displayName,
      tribe,
      bio: `${TRIBE_PROFILES[tribe].emoji} ${TRIBE_PROFILES[tribe].motto}`,
      avatar: TRIBE_PROFILES[tribe].emoji,
      joinedAt: new Date().toISOString(),
      pizzaCredibility: 50,
      followers: [],
      following: [],
      posts: [],
      favoriteTopping: params.favoriteTopping,
      controversialOpinion: params.controversialOpinion,
      pizzasRated: 0,
      avgRating: 0,
      badges: [{ ...BADGES[0], earnedAt: new Date().toISOString() }],
      blocked: [],
    }
    this.users.set(user.id, user)
    return user
  }

  createPost(userId: string, params: { type: PizzaPost['type']; content: string; pizzaReference?: string; tags?: string[] }): PizzaPost {
    const user = this.users.get(userId)
    if (!user) throw new Error('User not found. Are you even a pizza person?')

    const isHotTake = params.type === 'hot_take' || this.detectHotTake(params.content)
    const controversyScore = this.calculateControversy(params.content)

    const post: PizzaPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      authorId: userId,
      type: params.type,
      content: params.content,
      pizzaReference: params.pizzaReference ?? null,
      likes: 0,
      dislikes: 0,
      comments: [],
      shares: 0,
      controversyScore,
      tags: params.tags ?? [],
      createdAt: new Date().toISOString(),
      isHotTake,
    }

    this.posts.set(post.id, post)
    user.posts.push(post)

    // Auto-generate reactions for hot takes
    if (isHotTake) {
      post.likes = Math.floor(Math.random() * 200)
      post.dislikes = Math.floor(Math.random() * 150)
      post.comments = this.generateAutoComments(post, 3)
    }

    // Check for badge eligibility
    this.checkBadgeEligibility(user, post)

    return post
  }

  getTasteCompatibility(userId1: string, userId2: string): TasteCompatibility {
    const user1 = this.users.get(userId1)
    const user2 = this.users.get(userId2)
    if (!user1 || !user2) throw new Error('One or both users not found.')

    let matchScore = 50

    // Same tribe bonus
    if (user1.tribe === user2.tribe) matchScore += 20

    // Compatible tribes
    const compatible: Record<PizzaTribe, PizzaTribe[]> = {
      traditionalist: ['purist', 'diplomat'],
      innovator: ['maximalist', 'contrarian'],
      purist: ['traditionalist', 'diplomat'],
      maximalist: ['innovator', 'contrarian'],
      contrarian: ['innovator', 'maximalist'],
      diplomat: ['traditionalist', 'purist'],
    }
    if (compatible[user1.tribe]?.includes(user2.tribe)) matchScore += 15

    // Conflicting tribes
    const conflicts: Record<PizzaTribe, PizzaTribe[]> = {
      traditionalist: ['contrarian', 'innovator'],
      innovator: ['traditionalist', 'purist'],
      purist: ['maximalist', 'contrarian'],
      maximalist: ['purist'],
      contrarian: ['traditionalist', 'diplomat'],
      diplomat: ['contrarian'],
    }
    if (conflicts[user1.tribe]?.includes(user2.tribe)) matchScore -= 20

    // Same favorite topping
    if (user1.favoriteTopping === user2.favoriteTopping) matchScore += 10

    matchScore = Math.min(100, Math.max(0, matchScore))

    const dealbreakers: string[] = []
    if (user1.favoriteTopping === 'pineapple' && user2.blocked.length > 0) {
      dealbreakers.push('Pineapple preferences may cause friction')
    }

    let verdict: string
    if (matchScore >= 80) verdict = 'Pizza soulmates. Order a pie and split it.'
    else if (matchScore >= 60) verdict = 'Compatible enough. Just don\'t look at each other\'s orders.'
    else if (matchScore >= 40) verdict = 'You can coexist. Get separate pizzas.'
    else verdict = 'Pizza enemies. Do not share a table.'

    return {
      user1Id: userId1,
      user2Id: userId2,
      overallMatch: matchScore,
      toppingOverlap: user1.favoriteTopping === user2.favoriteTopping ? [user1.favoriteTopping] : [],
      dealbreakers,
      verdict,
      couldSharePizza: matchScore >= 50,
      suggestedCompromise: matchScore < 50 ? 'Half and half. It\'s the only way.' : 'You can probably agree on a whole pizza.',
    }
  }

  getActiveDebates(): PizzaDebate[] {
    return this.debates.filter((d) => d.status !== 'closed')
  }

  voteInDebate(debateId: string, side: 1 | 2): PizzaDebate {
    const debate = this.debates.find((d) => d.id === debateId)
    if (!debate) throw new Error('Debate not found.')
    if (debate.status === 'closed') throw new Error('This debate is closed. The pizza gods have spoken.')

    if (side === 1) debate.side1.votes += 1
    else debate.side2.votes += 1

    debate.participantCount += 1
    debate.heatLevel = Math.min(100, debate.heatLevel + 0.5)

    if (debate.heatLevel >= 95) debate.status = 'too_heated'
    else if (debate.heatLevel >= 70) debate.status = 'heated'

    return debate
  }

  createPoll(params: { question: string; options: { text: string; emoji: string }[]; durationHours: number }): PizzaPoll {
    const poll: PizzaPoll = {
      id: `poll-${Date.now()}`,
      question: params.question,
      options: params.options.map((o) => ({ ...o, votes: 0 })),
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + params.durationHours * 60 * 60 * 1000).toISOString(),
      isControversial: params.question.toLowerCase().includes('pineapple') || params.question.toLowerCase().includes('best'),
    }
    this.polls.push(poll)
    return poll
  }

  getTrending(): TrendingTopic[] {
    return [
      { topic: '#PineappleDebate', postCount: 14523, heatLevel: 99, emoji: '🍍', summary: 'The eternal question. It never ends.' },
      { topic: '#CrustOrNoCrust', postCount: 8901, heatLevel: 65, emoji: '🦴', summary: 'Are pizza crusts "pizza bones"? Discuss.' },
      { topic: '#FoldGang', postCount: 6234, heatLevel: 50, emoji: '🌮', summary: 'Real New Yorkers fold. Everyone else is wrong.' },
      { topic: '#DeepDishIsntPizza', postCount: 5102, heatLevel: 85, emoji: '🥧', summary: 'Chicago has entered the chat. Chicago has been removed from the chat.' },
      { topic: '#ColdPizzaBreakfast', postCount: 4800, heatLevel: 30, emoji: '🌅', summary: 'Morning pizza enthusiasts unite.' },
      { topic: '#AnchovyAppreciation', postCount: 890, heatLevel: 45, emoji: '🐟', summary: 'A small but passionate community.' },
      { topic: '#PizzaIsAVegetable', postCount: 3400, heatLevel: 70, emoji: '🥬', summary: 'Congress said so in 2011. We\'re still processing.' },
    ]
  }

  getTribeProfile(tribe: PizzaTribe) {
    return TRIBE_PROFILES[tribe]
  }

  getAvailableBadges(): PizzaBadge[] {
    return [...BADGES]
  }

  // ---- Private helpers ----

  private assignTribe(favoriteTopping: string, opinion: string): PizzaTribe {
    const lower = (favoriteTopping + ' ' + opinion).toLowerCase()
    if (lower.includes('pineapple') || lower.includes('anchov') || lower.includes('controversial')) return 'contrarian'
    if (lower.includes('margherita') || lower.includes('traditional') || lower.includes('classic')) return 'traditionalist'
    if (lower.includes('truffle') || lower.includes('simple') || lower.includes('quality')) return 'purist'
    if (lower.includes('everything') || lower.includes('more') || lower.includes('loaded')) return 'maximalist'
    if (lower.includes('creative') || lower.includes('new') || lower.includes('experiment')) return 'innovator'
    return 'diplomat'
  }

  private detectHotTake(content: string): boolean {
    const hotWords = ['wrong', 'overrated', 'underrated', 'best', 'worst', 'fight me', 'actually', 'unpopular opinion', 'hot take', 'controversial']
    return hotWords.some((w) => content.toLowerCase().includes(w))
  }

  private calculateControversy(content: string): number {
    let score = 0
    const lower = content.toLowerCase()
    if (lower.includes('pineapple')) score += 40
    if (lower.includes('anchov')) score += 35
    if (lower.includes('deep dish')) score += 25
    if (lower.includes('best pizza')) score += 20
    if (lower.includes('overrated') || lower.includes('underrated')) score += 15
    if (lower.includes('fight me') || lower.includes('wrong')) score += 20
    if (lower.includes('ketchup')) score += 50 // absolute chaos
    return Math.min(100, score)
  }

  private generateAutoComments(post: PizzaPost, count: number): PizzaComment[] {
    const templates = [
      { content: 'This is the most correct thing I\'ve read all day.', isAngry: false },
      { content: 'I respectfully disagree and also you\'re wrong.', isAngry: true },
      { content: 'My Italian grandmother just felt a disturbance in the force.', isAngry: false },
      { content: 'This take is so hot it could cook a pizza.', isAngry: false },
      { content: 'I need to sit down after reading this.', isAngry: false },
      { content: 'You have been blocked, reported, and unfriended.', isAngry: true },
      { content: 'Finally someone said it.', isAngry: false },
      { content: 'Delete this.', isAngry: true },
    ]

    return templates
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map((t, i) => ({
        id: `comment-${Date.now()}-${i}`,
        authorId: `auto-${i}`,
        authorName: ['PizzaPurist99', 'CrustLover420', 'ToppingTitan', 'SliceOfLife', 'DoughBoy', 'MargheritaMax', 'PepperoniPete', 'AnchovyAnnie'][i % 8],
        content: t.content,
        likes: Math.floor(Math.random() * 50),
        isAngry: t.isAngry,
        createdAt: new Date().toISOString(),
      }))
  }

  private checkBadgeEligibility(user: PizzaUser, post: PizzaPost): void {
    const earnBadge = (badgeId: string) => {
      if (!user.badges.find((b) => b.id === badgeId)) {
        const badge = BADGES.find((b) => b.id === badgeId)
        if (badge) user.badges.push({ ...badge, earnedAt: new Date().toISOString() })
      }
    }

    if (post.isHotTake && post.likes + post.dislikes >= 100) earnBadge('b-3')
    if (post.content.toLowerCase().includes('pineapple') && post.content.toLowerCase().includes('good')) earnBadge('b-4')
    if (post.content.toLowerCase().includes('anchov')) earnBadge('b-5')
    if (user.posts.length >= 50) earnBadge('b-2')
  }
}
