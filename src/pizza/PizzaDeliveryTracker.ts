/**
 * PizzaDeliveryTracker — real-time pizza delivery simulation
 * with driver personalities, obstacle events, and ETA drama.
 */

export type DeliveryStatus =
  | 'order_placed'
  | 'preparing'
  | 'in_oven'
  | 'quality_check'
  | 'boxing'
  | 'waiting_for_driver'
  | 'picked_up'
  | 'en_route'
  | 'nearby'
  | 'at_door'
  | 'delivered'
  | 'lost_forever'

export interface DeliveryDriver {
  id: string
  name: string
  personality: DriverPersonality
  rating: number
  totalDeliveries: number
  vehicle: string
  quirk: string
  catchphrase: string
  speedMultiplier: number
  lostProbability: number
}

export type DriverPersonality =
  | 'speed_demon'
  | 'scenic_route'
  | 'chatty'
  | 'perfectionist'
  | 'chaotic_good'
  | 'zen_master'

export interface DeliveryEvent {
  timestamp: string
  status: DeliveryStatus
  message: string
  emoji: string
  driverComment: string | null
  etaChange: number // minutes added/removed
}

export interface DeliveryOrder {
  id: string
  pizzaName: string
  driver: DeliveryDriver
  status: DeliveryStatus
  events: DeliveryEvent[]
  estimatedMinutes: number
  actualMinutes: number
  distanceMiles: number
  tipAmount: number
  pizzaTemperature: number // degrees F, starts at 350, drops over time
  boxIntegrity: number // 0-100, can degrade from bumps
  createdAt: string
  deliveredAt: string | null
}

const DRIVERS: DeliveryDriver[] = [
  { id: 'dr-1', name: 'Lightning Lou', personality: 'speed_demon', rating: 4.2, totalDeliveries: 1847, vehicle: '2019 Honda Civic (modified exhaust)', quirk: 'Takes corners like a Formula 1 driver', catchphrase: 'Speed is temporary. Pizza is forever.', speedMultiplier: 1.4, lostProbability: 0.05 },
  { id: 'dr-2', name: 'Scenic Steve', personality: 'scenic_route', rating: 3.8, totalDeliveries: 623, vehicle: 'VW Bus (vintage)', quirk: 'Takes the long way because "the journey matters"', catchphrase: 'It\'s not late, it\'s fashionably timed.', speedMultiplier: 0.6, lostProbability: 0.15 },
  { id: 'dr-3', name: 'Chatty Chloe', personality: 'chatty', rating: 4.7, totalDeliveries: 2341, vehicle: 'Toyota Prius', quirk: 'Will tell you her life story at the door', catchphrase: 'Your pizza is here! Also, did I mention I\'m writing a novel?', speedMultiplier: 1.0, lostProbability: 0.02 },
  { id: 'dr-4', name: 'Perfect Pat', personality: 'perfectionist', rating: 4.9, totalDeliveries: 892, vehicle: 'Temperature-controlled sedan', quirk: 'Checks pizza alignment before handing it over', catchphrase: 'I repositioned the pepperoni. You\'re welcome.', speedMultiplier: 0.85, lostProbability: 0.01 },
  { id: 'dr-5', name: 'Chaos Carl', personality: 'chaotic_good', rating: 3.5, totalDeliveries: 4102, vehicle: 'Unknown (changes daily)', quirk: 'Arrives from unexpected directions. Once delivered from a kayak.', catchphrase: 'I took a shortcut through the park. Don\'t ask.', speedMultiplier: 1.1, lostProbability: 0.2 },
  { id: 'dr-6', name: 'Zen Zara', personality: 'zen_master', rating: 4.6, totalDeliveries: 1200, vehicle: 'Electric scooter', quirk: 'Meditates at red lights', catchphrase: 'The pizza arrives when it is meant to arrive.', speedMultiplier: 0.9, lostProbability: 0.03 },
]

const OBSTACLE_EVENTS: { message: string; emoji: string; etaChange: number; temperatureDrop: number; boxDamage: number }[] = [
  { message: 'Traffic jam on Main Street. Driver is questioning life choices.', emoji: '🚗', etaChange: 5, temperatureDrop: 8, boxDamage: 0 },
  { message: 'Driver stopped to pet a dog. Priorities.', emoji: '🐕', etaChange: 2, temperatureDrop: 3, boxDamage: 0 },
  { message: 'GPS rerouted through a construction zone. Classic.', emoji: '🚧', etaChange: 7, temperatureDrop: 12, boxDamage: 0 },
  { message: 'Speed bump taken at full speed. Pizza achieved brief weightlessness.', emoji: '🛫', etaChange: 0, temperatureDrop: 0, boxDamage: 15 },
  { message: 'Driver made a wrong turn. "Recalculating..."', emoji: '🔄', etaChange: 4, temperatureDrop: 6, boxDamage: 0 },
  { message: 'Sudden rain. Driver shields pizza with own body. True hero.', emoji: '🌧️', etaChange: 3, temperatureDrop: 5, boxDamage: 5 },
  { message: 'Train crossing. 47 cars. This is fine.', emoji: '🚂', etaChange: 8, temperatureDrop: 15, boxDamage: 0 },
  { message: 'Driver found a shortcut! ETA decreased. Don\'t ask how.', emoji: '⚡', etaChange: -5, temperatureDrop: 0, boxDamage: 5 },
  { message: 'Red light. Driver is composing haiku about pizza.', emoji: '🚦', etaChange: 1, temperatureDrop: 2, boxDamage: 0 },
  { message: 'Someone tried to steal the pizza. Driver defended it with honor.', emoji: '⚔️', etaChange: 3, temperatureDrop: 5, boxDamage: 10 },
  { message: 'Pothole! Box jumped but driver caught it mid-air. Impressive.', emoji: '🕳️', etaChange: 0, temperatureDrop: 0, boxDamage: 20 },
  { message: 'Driver is arguing with GPS. GPS is losing.', emoji: '📱', etaChange: 3, temperatureDrop: 4, boxDamage: 0 },
]

const STATUS_MESSAGES: Record<DeliveryStatus, { message: string; emoji: string }> = {
  order_placed: { message: 'Your pizza dreams have been received by the kitchen.', emoji: '📋' },
  preparing: { message: 'A pizza artist is crafting your masterpiece.', emoji: '👨‍🍳' },
  in_oven: { message: 'Your pizza is getting its tan. 450°F of pure transformation.', emoji: '🔥' },
  quality_check: { message: 'Quality inspector is verifying topping distribution equity.', emoji: '🔍' },
  boxing: { message: 'Pizza is being placed in its cardboard chariot.', emoji: '📦' },
  waiting_for_driver: { message: 'Your pizza is ready and emotionally prepared for the journey.', emoji: '⏳' },
  picked_up: { message: 'Driver has the pizza. The adventure begins.', emoji: '🏎️' },
  en_route: { message: 'Pizza is traveling at the speed of hunger.', emoji: '🚗' },
  nearby: { message: 'Driver is in your neighborhood. Start salivating.', emoji: '📍' },
  at_door: { message: 'PIZZA IS AT YOUR DOOR. This is not a drill.', emoji: '🚪' },
  delivered: { message: 'Pizza has been delivered. World peace achieved (temporarily).', emoji: '🎉' },
  lost_forever: { message: 'Your pizza has entered another dimension. We are sorry.', emoji: '🌀' },
}

export class PizzaDeliveryTracker {
  private orders: Map<string, DeliveryOrder> = new Map()

  startDelivery(pizzaName: string, distanceMiles: number): DeliveryOrder {
    const driver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)]
    const baseMinutes = distanceMiles * 4 // ~15mph average
    const estimatedMinutes = Math.round(baseMinutes / driver.speedMultiplier)

    const order: DeliveryOrder = {
      id: `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pizzaName,
      driver,
      status: 'order_placed',
      events: [{
        timestamp: new Date().toISOString(),
        status: 'order_placed',
        message: STATUS_MESSAGES.order_placed.message,
        emoji: STATUS_MESSAGES.order_placed.emoji,
        driverComment: null,
        etaChange: 0,
      }],
      estimatedMinutes,
      actualMinutes: 0,
      distanceMiles,
      tipAmount: 0,
      pizzaTemperature: 350,
      boxIntegrity: 100,
      createdAt: new Date().toISOString(),
      deliveredAt: null,
    }

    this.orders.set(order.id, order)
    return order
  }

  advanceStatus(orderId: string): DeliveryEvent {
    const order = this.orders.get(orderId)
    if (!order) throw new Error('Order not found. Like your pizza.')

    const statusFlow: DeliveryStatus[] = [
      'order_placed', 'preparing', 'in_oven', 'quality_check', 'boxing',
      'waiting_for_driver', 'picked_up', 'en_route', 'nearby', 'at_door', 'delivered',
    ]

    const currentIdx = statusFlow.indexOf(order.status)
    if (currentIdx === -1 || currentIdx >= statusFlow.length - 1) {
      throw new Error('Delivery is already complete. Stop refreshing.')
    }

    // Check if pizza gets lost (only during en_route)
    if (order.status === 'en_route' && Math.random() < order.driver.lostProbability) {
      order.status = 'lost_forever'
      const event: DeliveryEvent = {
        timestamp: new Date().toISOString(),
        status: 'lost_forever',
        message: STATUS_MESSAGES.lost_forever.message,
        emoji: STATUS_MESSAGES.lost_forever.emoji,
        driverComment: this.getLostComment(order.driver),
        etaChange: 999,
      }
      order.events.push(event)
      return event
    }

    // Maybe trigger an obstacle event during transit
    const isTransit = ['picked_up', 'en_route', 'nearby'].includes(order.status)
    if (isTransit && Math.random() < 0.4) {
      const obstacle = OBSTACLE_EVENTS[Math.floor(Math.random() * OBSTACLE_EVENTS.length)]
      order.pizzaTemperature = Math.max(70, order.pizzaTemperature - obstacle.temperatureDrop)
      order.boxIntegrity = Math.max(0, order.boxIntegrity - obstacle.boxDamage)
      order.estimatedMinutes += obstacle.etaChange

      const obstacleEvent: DeliveryEvent = {
        timestamp: new Date().toISOString(),
        status: order.status,
        message: obstacle.message,
        emoji: obstacle.emoji,
        driverComment: this.getDriverReaction(order.driver, obstacle.etaChange),
        etaChange: obstacle.etaChange,
      }
      order.events.push(obstacleEvent)
    }

    // Advance to next status
    const nextStatus = statusFlow[currentIdx + 1]
    order.status = nextStatus

    if (nextStatus === 'delivered') {
      order.deliveredAt = new Date().toISOString()
      order.actualMinutes = order.estimatedMinutes + Math.round((Math.random() - 0.3) * 10)
    }

    // Temperature drops during transit
    if (isTransit) {
      order.pizzaTemperature = Math.max(70, order.pizzaTemperature - (5 + Math.random() * 10))
    }

    const statusInfo = STATUS_MESSAGES[nextStatus]
    const event: DeliveryEvent = {
      timestamp: new Date().toISOString(),
      status: nextStatus,
      message: statusInfo.message,
      emoji: statusInfo.emoji,
      driverComment: nextStatus === 'delivered' ? this.getDeliveryComment(order) : null,
      etaChange: 0,
    }
    order.events.push(event)

    return event
  }

  getDeliveryReport(orderId: string): {
    summary: string
    driverPerformance: string
    pizzaCondition: string
    temperatureVerdict: string
    boxVerdict: string
    suggestedTip: number
    funStats: string[]
  } {
    const order = this.orders.get(orderId)
    if (!order) throw new Error('Order not found.')

    let temperatureVerdict: string
    if (order.pizzaTemperature >= 200) temperatureVerdict = 'Piping hot! Perfect delivery temperature.'
    else if (order.pizzaTemperature >= 150) temperatureVerdict = 'Warm enough. No complaints.'
    else if (order.pizzaTemperature >= 100) temperatureVerdict = 'Lukewarm. It\'s been through some things.'
    else temperatureVerdict = 'Cold. This pizza has seen better days. Consider a microwave.'

    let boxVerdict: string
    if (order.boxIntegrity >= 90) boxVerdict = 'Box is pristine. Could display it in a museum.'
    else if (order.boxIntegrity >= 70) boxVerdict = 'Minor wear. Character building.'
    else if (order.boxIntegrity >= 40) boxVerdict = 'Box has been through a war. Pizza is probably fine. Probably.'
    else boxVerdict = 'The box is held together by hope and grease. Structural integrity: vibes only.'

    const onTime = order.actualMinutes <= order.estimatedMinutes + 5
    const driverPerformance = onTime
      ? `${order.driver.name} delivered on time! "${order.driver.catchphrase}"`
      : `${order.driver.name} was ${order.actualMinutes - order.estimatedMinutes} minutes late. Blame their ${order.driver.quirk.toLowerCase()}.`

    const suggestedTip = onTime && order.pizzaTemperature >= 150 ? Math.round(order.distanceMiles * 2) : Math.round(order.distanceMiles)

    const obstacles = order.events.filter((e) => e.etaChange !== 0)
    const pizzaCondition = order.boxIntegrity >= 70 && order.pizzaTemperature >= 150 ? 'Excellent' : order.boxIntegrity >= 40 ? 'Acceptable' : 'Questionable'

    return {
      summary: `${order.pizzaName} delivered by ${order.driver.name} in ${order.actualMinutes} minutes (estimated: ${order.estimatedMinutes}). ${obstacles.length} incidents en route.`,
      driverPerformance,
      pizzaCondition,
      temperatureVerdict,
      boxVerdict,
      suggestedTip,
      funStats: [
        `Pizza lost ${350 - order.pizzaTemperature}°F during transit`,
        `Box survived ${100 - order.boxIntegrity}% damage`,
        `Driver personality: ${order.driver.personality.replace('_', ' ')}`,
        `${order.events.length} total status updates`,
        obstacles.length > 0 ? `Obstacles encountered: ${obstacles.length}` : 'Smooth sailing — no obstacles!',
      ],
    }
  }

  private getDriverReaction(driver: DeliveryDriver, etaChange: number): string {
    const reactions: Record<DriverPersonality, string[]> = {
      speed_demon: ['I can make up the time. Watch me.', 'This is merely a speed bump in my legend.', 'Engaging turbo mode.'],
      scenic_route: ['Ah, a detour! Even better.', 'More time to enjoy the journey.', 'The pizza appreciates the extra scenery.'],
      chatty: ['Let me tell you about the time this SAME thing happened...', 'Oh this reminds me of a story!', 'You won\'t BELIEVE what just happened.'],
      perfectionist: ['This delay is unacceptable. Recalculating optimal route.', 'I refuse to let this affect pizza quality.', 'Adjusting thermal retention protocol.'],
      chaotic_good: ['This is fine. Everything is fine.', 'I know another way. Trust the process.', 'Hold my energy drink.'],
      zen_master: ['All things happen in their own time.', 'The pizza is exactly where it needs to be.', 'Breathe. The cheese is still melted.'],
    }
    const options = reactions[driver.personality]
    return options[Math.floor(Math.random() * options.length)]
  }

  private getLostComment(driver: DeliveryDriver): string {
    const comments: Record<DriverPersonality, string> = {
      speed_demon: 'I was going too fast and ended up in another zip code.',
      scenic_route: 'I found a really beautiful lake and kind of... forgot.',
      chatty: 'I started talking to someone and ended up at their house instead.',
      perfectionist: 'The pizza wasn\'t aligned correctly so I went back to fix it. Then I got lost.',
      chaotic_good: 'I took a shortcut through a portal. Currently in Narnia. Send help.',
      zen_master: 'The pizza chose a different path. I must respect its journey.',
    }
    return comments[driver.personality]
  }

  private getDeliveryComment(order: DeliveryOrder): string {
    if (order.pizzaTemperature >= 200 && order.boxIntegrity >= 90) {
      return `${order.driver.name}: "Delivered with pride. ${order.driver.catchphrase}"`
    }
    if (order.boxIntegrity < 50) {
      return `${order.driver.name}: "The box has been through some things. The pizza is fine. Probably. Don't open it aggressively."`
    }
    return `${order.driver.name}: "Here's your pizza! ${order.driver.catchphrase}"`
  }
}
