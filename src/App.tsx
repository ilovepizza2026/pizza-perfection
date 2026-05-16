import PizzaMenu from './PizzaMenu'
import ToppingsList from './ToppingsList'

function App() {
  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>Pizza Perfection</h1>
      <p>The ultimate pizza platform.</p>
      <PizzaMenu />
      <ToppingsList />
    </div>
  )
}

export default App
