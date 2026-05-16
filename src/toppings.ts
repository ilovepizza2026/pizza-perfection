export type Topping = {
  id: string
  name: string
  category: string
  priceUsd: number
  calories: number
}

export const TOPPINGS: Topping[] = [
  { id: 'extra-cheese', name: 'Extra Cheese', category: 'Dairy', priceUsd: 1.5, calories: 85 },
  { id: 'pepperoni', name: 'Pepperoni', category: 'Meat', priceUsd: 2, calories: 130 },
  { id: 'sausage', name: 'Italian Sausage', category: 'Meat', priceUsd: 2, calories: 150 },
  { id: 'mushrooms', name: 'Mushrooms', category: 'Vegetable', priceUsd: 1.5, calories: 15 },
  { id: 'bell-peppers', name: 'Bell Peppers', category: 'Vegetable', priceUsd: 1, calories: 20 },
  { id: 'red-onion', name: 'Red Onion', category: 'Vegetable', priceUsd: 1, calories: 15 },
  { id: 'black-olives', name: 'Black Olives', category: 'Vegetable', priceUsd: 1, calories: 25 },
  { id: 'jalapenos', name: 'Jalapeños', category: 'Vegetable', priceUsd: 1, calories: 10 },
  { id: 'anchovies', name: 'Anchovies', category: 'Seafood', priceUsd: 2.5, calories: 40 },
  { id: 'prosciutto', name: 'Prosciutto', category: 'Meat', priceUsd: 3, calories: 60 },
  { id: 'arugula', name: 'Arugula', category: 'Vegetable', priceUsd: 1.5, calories: 5 },
  { id: 'truffle-oil', name: 'Truffle Oil', category: 'Specialty', priceUsd: 4, calories: 120 },
]
