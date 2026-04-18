import { useState } from 'react'

export default function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (trimmed) {
        onAdd(trimmed)
        setInputValue('')
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {tags.map((tag, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#7c3aed',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          minWidth: '150px',
          padding: '10px 14px',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
  )
}
