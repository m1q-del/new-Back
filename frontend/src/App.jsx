import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from './Api/api'

export default function App() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  // Загрузка
  const load = async () => {
    try {
      setProducts(await getProducts())
    } catch (e) {
      setError('Не удалось загрузить товары')
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setProducts(await getProducts())
      } catch (e) {
        setError('Не удалось загрузить товары')
      }
    })()
  }, [])

  // Создание / обновление
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || price === '') {
      setError('Заполните название и цену')
      return
    }

    try {
      if (editingId) {
        await updateProduct(editingId, { name, price: Number(price) })
      } else {
        await createProduct({ name, price: Number(price) })
      }
      setName(''); setPrice(''); setEditingId(null)
      load()
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка сервера')
    }
  }

  // Редактирование
  const startEdit = (p) => {
    setEditingId(p.id)
    setName(p.name)
    setPrice(p.price)
  }

  // Удаление
  const handleDelete = async (id) => {
    await deleteProduct(id)
    load()
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Товары</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
        {editingId && (
          <button type="button" onClick={() => {
            setEditingId(null); setName(''); setPrice('')
          }}>
            Отмена
          </button>
        )}
      </form>

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
              <button onClick={() => startEdit(p)}>✏️</button>
              <button onClick={() => handleDelete(p.id)}>🗑️</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}