export type Topping = {
  id: string
  name: string
  category: string
  priceUsd: number
}

export const TOPPINGS: Topping[] = [
  { id: 'extra-cheese', name: 'Extra Cheese', category: 'Dairy', priceUsd: 1.5 },
  { id: 'pepperoni', name: 'Pepperoni', category: 'Meat', priceUsd: 2 },
  { id: 'sausage', name: 'Italian Sausage', category: 'Meat', priceUsd: 2 },
  { id: 'mushrooms', name: 'Mushrooms', category: 'Vegetable', priceUsd: 1.5 },
  { id: 'bell-peppers', name: 'Bell Peppers', category: 'Vegetable', priceUsd: 1 },
  { id: 'red-onion', name: 'Red Onion', category: 'Vegetable', priceUsd: 1 },
  { id: 'black-olives', name: 'Black Olives', category: 'Vegetable', priceUsd: 1 },
  { id: 'jalapenos', name: 'Jalapeños', category: 'Vegetable', priceUsd: 1 },
  { id: 'anchovies', name: 'Anchovies', category: 'Seafood', priceUsd: 2.5 },
  { id: 'prosciutto', name: 'Prosciutto', category: 'Meat', priceUsd: 3 },
  { id: 'arugula', name: 'Arugula', category: 'Vegetable', priceUsd: 1.5 },
  { id: 'truffle-oil', name: 'Truffle Oil', category: 'Specialty', priceUsd: 4 },
]
