import express from 'express'
import {bd} from './Classes/bd.js'


const app = express()
app.use(express.json())

app.get('/products', (req, res) => {
  res.json(bd.products)
})


app.post('/products', (req, res) => {

  if (!req.body.name || typeof req.body.price === 'undefined') return res.status(400).json({ error: 'Укажите name (строка) и price (число)' });



  const newProduct = {
    id: bd.nextProductId,
    name: req.body.name,
    price: req.body.price
  }

  bd.nextProductId++
  bd.products.push(newProduct)
  res.status(201).json(newProduct)
})


app.put('/products/:id',(req,res)=>{
  const updateProduct = bd.products.find(p => p.id === Number(req.params.id))

  if(!updateProduct) return res.status(404).json({error:'Ошибка: товар не найден'})

  if(req.body.name) updateProduct.name = req.body.name
  if(req.body.price) updateProduct.price = req.body.price

  res.json(updateProduct)

})

app.delete('/products/:id', (req, res)=>{
  const index = bd.products.findIndex(p => p.id === Number(req.params.id))

  if(index === -1) return res.status(404).json({error:'Ошибка: товар не найден'})

  bd.products.splice(index, 1)
  res.json({message:'Товар удален'})
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})