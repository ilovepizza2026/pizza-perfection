import { useState } from 'react'
import { TOPPINGS } from './toppings'

const formatPrice = (usd: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd)

function ToppingsList() {
  const [query, setQuery] = useState('')

  const filtered = TOPPINGS.filter((t) =>
    `${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section>
      <h2>Toppings</h2>
      <input
        type="search"
        placeholder="Search toppings…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          fontSize: '1rem',
          border: '1px solid #e5e5e5',
          borderRadius: 8,
          marginBottom: '1rem',
          boxSizing: 'border-box',
        }}
      />
      {filtered.length === 0 ? (
        <p style={{ color: '#555' }}>No toppings match "{query}".</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
          {filtered.map((topping) => (
            <li
              key={topping.id}
              style={{
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{topping.name}</span>
                <span style={{ color: '#888', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  {topping.category}
                </span>
              </div>
              <div style={{ fontWeight: 600 }}>+{formatPrice(topping.priceUsd)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ToppingsList
