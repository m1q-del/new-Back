import { useCallback, useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from './Api/api'
import { Link } from 'react-router-dom'

export default function App() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    padding: '6px 12px',
    borderRadius: 6,
    background: '#f2f2f2',
    display: 'inline-block',
  }

  const inputStyle = {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: 14,
    background: '#fff',
  }

  const buttonStyle = {
    padding: '6px 12px',
    borderRadius: 6,
    border: '1px solid #ccc',
    background: '#f2f2f2',
    color: '#333',
    cursor: 'pointer',
    fontSize: 14,
  }

  const load = useCallback(async () => {
    try {
      setProducts(await getProducts())
      setError('')
    } catch {
      setError('Не удалось загрузить товары')
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmedName = String(name ?? '').trim()
    if (!trimmedName) { setError('Введите название'); return }
    if (/\d/.test(trimmedName)) { setError('Товар не должен содержать цифры'); return }
    if (price === '') { setError('Введите цену'); return }

    const payload = {
      name: trimmedName,
      price: Number(price),
      stock: stock === '' ? 0 : Number(stock),
    }

    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      setName(''); setPrice(''); setStock(''); setEditingId(null)
      await load()
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка сервера')
    }
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setName(p.name)
    setPrice(String(p.price))
    setStock(p.stock == null ? '' : String(p.stock))
  }

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.error || 'Не удалось удалить товар')
    }
  }

  const resetForm = () => {
    setEditingId(null); setName(''); setPrice(''); setStock('')
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Товары</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input style={inputStyle} placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={inputStyle} placeholder="Цена" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input style={inputStyle} placeholder="Остаток" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />

        <button type="submit" style={buttonStyle}>{editingId ? 'Сохранить' : 'Добавить'}</button>
        {editingId && (
          <button type="button" style={buttonStyle} onClick={resetForm}>Отмена</button>
        )}
      </form>

      <Link style={linkStyle} to="/order">Перейти к заказу</Link>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map(p => (
          <li key={p.id} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: 10,
            border: '1px solid #ddd', borderRadius: 6, marginBottom: 8
          }}>
            <span>
              <b>{p.name}</b> — {p.price} ₽
              {p.stock != null && <span style={{ color: '#888' }}> (остаток: {p.stock})</span>}
            </span>
            <span style={{ display: 'flex', gap: 6 }}>
              <button style={buttonStyle} onClick={() => startEdit(p)}>Редактировать</button>
              <button style={buttonStyle} onClick={() => handleDelete(p.id)}>Удалить</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}