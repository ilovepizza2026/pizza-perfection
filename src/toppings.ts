export type Topping = {
  id: string
  name: string
  calories: number
}

export const TOPPINGS: Topping[] = [
  { id: 'mozzarella', name: 'Mozzarella', calories: 85 },
  { id: 'pepperoni', name: 'Pepperoni', calories: 130 },
  { id: 'mushrooms', name: 'Mushrooms', calories: 15 },
  { id: 'basil', name: 'Fresh Basil', calories: 5 },
  { id: 'olives', name: 'Black Olives', calories: 25 },
  { id: 'sausage', name: 'Italian Sausage', calories: 150 },
  { id: 'bell-peppers', name: 'Bell Peppers', calories: 20 },
  { id: 'onions', name: 'Red Onions', calories: 15 },
  { id: 'anchovies', name: 'Anchovies', calories: 40 },
  { id: 'jalapenos', name: 'Jalapeños', calories: 10 },
]
