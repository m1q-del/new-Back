import { useCallback, useEffect, useState } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../Api/api'
import { Link } from 'react-router-dom'

const makeKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random())

const emptyRow = () => ({ key: makeKey(), name: '', price: '' })

export const OrderPage = () => {
  const [products, setProducts] = useState([])
  const [rows, setRows] = useState([emptyRow()])
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

  const addRow = () => setRows((prev) => [...prev, emptyRow()])

  const removeRow = (key) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.key !== key)
      return next.length ? next : [emptyRow()]
    })
  }

  const updateRow = (key, field, value) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)))
  }

  const validateRow = (row) => {
    const name = String(row.name ?? '').trim()
    if (!name) return { error: 'Введите название во всех строках' }
    if (/\d/.test(name)) return { error: 'Название не должно содержать цифры' }
    if (row.price === '' || Number.isNaN(Number(row.price)))
      return { error: 'Введите цену во всех строках' }
    if (Number(row.price) < 0) return { error: 'Цена не может быть отрицательной' }
    return { value: { name, price: Number(row.price) } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const prepared = []
    for (const row of rows) {
      const res = validateRow(row)
      if (res.error) { setError(res.error); return }
      prepared.push(res.value)
    }

    try {
      if (editingId) await updateProduct(editingId, prepared[0])
      else for (const item of prepared) await createProduct(item)
      resetForm()
      await load()
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка сервера')
    }
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setRows([{ key: makeKey(), name: p.name, price: String(p.price) }])
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
    setEditingId(null)
    setRows([emptyRow()])
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Заказ</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}
      >
        {rows.map((row, i) => (
          <div key={row.key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ width: 20, color: '#888' }}>{i + 1}.</span>

            <input
              style={{ ...inputStyle, flex: 2 }}
              placeholder="Название"
              value={row.name}
              onChange={(e) => updateRow(row.key, 'name', e.target.value)}
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              placeholder="Цена"
              type="number"
              min="0"
              value={row.price}
              onChange={(e) => updateRow(row.key, 'price', e.target.value)}
            />

            <button
              type="button"
              style={buttonStyle}
              onClick={() => removeRow(row.key)}
              disabled={rows.length === 1 && !row.name && !row.price}
              title="Удалить строку"
            >
              ✕
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button type="button" style={buttonStyle} onClick={addRow}>
            + Добавить строку для заказа
          </button>
          <button type="submit" style={buttonStyle}>
            {editingId ? 'Сохранить' : 'Оформить заказ'}
          </button>
          {editingId && (
            <button type="button" style={buttonStyle} onClick={resetForm}>Отмена</button>
          )}
        </div>
      </form>

      <Link style={linkStyle} to="/">На главную</Link>

      <h2 style={{ fontSize: 18 }}>Каталог</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((p) => (
          <li
            key={p.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              border: '1px solid #ddd',
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            <span>
              <b>{p.name}</b> — {p.price} ₽
              {p.stock != null && (
                <span style={{ color: '#888' }}> (остаток: {p.stock})</span>
              )}
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