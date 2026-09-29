const BASE = 'http://localhost:3000'

export const getProducts = () =>
  fetch(`${BASE}/products`).then(r => r.json())

export const createProduct = (data) =>
  fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const updateProduct = (id, data) =>
  fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json())

export const deleteProduct = (id) =>
  fetch(`${BASE}/products/${id}`, { method: 'DELETE' }).then(r => r.json())