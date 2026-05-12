import { PIZZAS } from './pizzas'

const formatPrice = (usd: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd)

function PizzaMenu() {
  return (
    <section>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
        {PIZZAS.map((pizza) => (
          <li
            key={pizza.id}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 0.25rem' }}>{pizza.name}</h3>
              <p style={{ margin: 0, color: '#555' }}>{pizza.description}</p>
            </div>
            <div style={{ fontWeight: 600 }}>{formatPrice(pizza.priceUsd)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PizzaMenu
