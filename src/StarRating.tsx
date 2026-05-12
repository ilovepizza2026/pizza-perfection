import { useState } from 'react'

type Props = {
  initial?: number
  max?: number
  onChange?: (value: number) => void
}

function StarRating({ initial = 0, max = 5, onChange }: Props) {
  const [value, setValue] = useState(initial)
  const [hover, setHover] = useState(0)

  const handleSelect = (next: number) => {
    setValue(next)
    onChange?.(next)
  }

  const display = hover || value

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      style={{ display: 'inline-flex', gap: 2 }}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= display
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star === 1 ? '' : 's'}`}
            onMouseEnter={() => setHover(star)}
            onClick={() => handleSelect(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.25rem',
              color: filled ? '#f5a623' : '#ccc',
              padding: 0,
              lineHeight: 1,
            }}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
