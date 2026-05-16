const ingredients = [
  '1 ball (250 g) pizza dough',
  '⅓ cup (80 ml) crushed San Marzano tomatoes',
  '125 g fresh mozzarella, torn into pieces',
  'Handful of fresh basil leaves',
  '2 tbsp extra-virgin olive oil',
  '¼ tsp fine sea salt',
]

const steps = [
  'Place a pizza stone or heavy baking sheet on the top rack and preheat your oven to 500 °F (260 °C) for at least 45 minutes.',
  'On a lightly floured surface, stretch the dough by hand into a 10–12 inch round, leaving a slightly thicker rim for the crust.',
  'Transfer the shaped dough to a lightly floured pizza peel or parchment-lined baking sheet.',
  'Spoon the crushed San Marzano tomatoes over the base, spreading to within ½ inch of the edge. Season with salt and drizzle with 1 tbsp of the olive oil.',
  'Scatter the torn mozzarella evenly over the sauce.',
  'Slide the pizza onto the hot stone (or place the baking sheet on the rack) and bake for 8–10 minutes, until the crust is golden and the cheese is bubbling with light brown spots.',
  'Remove from the oven and immediately top with fresh basil leaves. Finish with the remaining 1 tbsp olive oil and serve at once.',
]

function MargheritaRecipe() {
  return (
    <article style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Margherita Pizza</h2>
      <p style={{ color: '#555', marginTop: 0 }}>
        The classic Neapolitan pizza — bright tomato, creamy mozzarella, fresh basil.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          margin: '1.5rem 0',
        }}
      >
        {[
          { label: 'Prep time', value: '20 min' },
          { label: 'Bake time', value: '8–10 min' },
          { label: 'Total time', value: '~30 min' },
          { label: 'Serves', value: '1–2' },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: '0.75rem 1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontWeight: 600 }}>{value}</div>
          </div>
        ))}
      </div>

      <h3>Ingredients</h3>
      <ul style={{ lineHeight: 1.8 }}>
        {ingredients.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3>Steps</h3>
      <ol style={{ lineHeight: 1.8 }}>
        {steps.map((step) => (
          <li key={step} style={{ marginBottom: '0.75rem' }}>
            {step}
          </li>
        ))}
      </ol>

      <p style={{ marginTop: '2rem', padding: '1rem', background: '#fffbea', borderRadius: 8, borderLeft: '4px solid #f0c040' }}>
        <strong>Tip:</strong> San Marzano tomatoes are sweeter and less acidic than standard plum tomatoes — don't substitute if you can help it. Look for the DOP seal.
      </p>
    </article>
  )
}

export default MargheritaRecipe
