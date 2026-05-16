import { TOPPINGS } from './toppings'
import './ToppingsList.css'

function ToppingsList() {
  return (
    <section>
      <h2>Toppings</h2>
      <ul className="toppings-list">
        {TOPPINGS.map((topping) => (
          <li key={topping.id} className="topping-item">
            {topping.name}
            <span className="topping-tooltip">{topping.calories} cal</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ToppingsList
