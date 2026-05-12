export type Pizza = {
  id: string
  name: string
  description: string
  priceUsd: number
}

export const PIZZAS: Pizza[] = [
  {
    id: 'margherita',
    name: 'Margherita',
    description: 'San Marzano tomato, fresh mozzarella, basil, olive oil.',
    priceUsd: 14,
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    description: 'Tomato, mozzarella, cup-and-char pepperoni.',
    priceUsd: 16,
  },
  {
    id: 'funghi',
    name: 'Funghi',
    description: 'Cremini, shiitake, fontina, thyme, garlic oil.',
    priceUsd: 17,
  },
  {
    id: 'diavola',
    name: 'Diavola',
    description: 'Tomato, mozzarella, spicy soppressata, chili honey.',
    priceUsd: 18,
  },
]
