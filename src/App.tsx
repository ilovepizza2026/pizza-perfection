import { useState, useEffect } from 'react'
import PizzaMenu from './PizzaMenu'
import MargheritaRecipe from './MargheritaRecipe'

type Page = 'menu' | 'recipe/margherita'

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Menu', page: 'menu' },
  { label: 'Margherita Recipe', page: 'recipe/margherita' },
]

function parsePage(): Page {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash === 'recipe/margherita') return 'recipe/margherita'
  return 'menu'
}

function App() {
  const [page, setPage] = useState<Page>(parsePage)

  useEffect(() => {
    const onHashChange = () => setPage(parsePage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Pizza Perfection</h1>
      <p style={{ margin: '0 0 1.5rem', color: '#555' }}>The ultimate pizza platform.</p>

      <nav style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1rem' }}>
        {NAV_LINKS.map(({ label, page: target }) => (
          <a
            key={target}
            href={`#${target}`}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 6,
              textDecoration: 'none',
              fontWeight: page === target ? 600 : 400,
              background: page === target ? '#f0f0f0' : 'transparent',
              color: page === target ? '#111' : '#555',
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {page === 'menu' && <PizzaMenu />}
      {page === 'recipe/margherita' && <MargheritaRecipe />}
    </div>
  )
}

export default App
