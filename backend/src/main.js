import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { sequelize } from './db/sequelize.js'
import { User } from './models/User.js'
import { Product } from './models/Product.js'

import { logger } from './middlewares/logger.js'
import { auth } from './middlewares/reqAuth.js'

const app = express()

// --- Глобальные middleware ---
app.use(cors())
app.use(logger)
app.use(express.json())

// --- GET all ---
app.get('/products', async (req, res, next) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (e) {
    next(e)
  }
})

// --- POST create ---
app.post('/products', async (req, res, next) => {
  try {
    const { name, price, stock } = req.body

    const product = await Product.create({ name, price, stock })
    res.status(201).json(product)
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      })
    }
    next(e)
  }
})

// --- PUT update ---
app.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' })
    }

    await product.update(req.body)
    res.json(product)
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      return res.status(400).json({
        errors: e.errors.map(err => err.message),
      })
    }
    next(e)
  }
})

// --- DELETE ---
app.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' })
    }

    await product.destroy()
    res.json({ message: 'Товар удалён' })
  } catch (e) {
    next(e)
  }
})

// --- Echo для теста ---
app.post('/echo', (req, res) => {
  res.json(req.body)
})

// --- Защищённый роут ---
app.get('/admin', auth, (req, res) => {
  res.json({ message: 'Добро пожаловать в админку' })
})

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: 'Роут не найден' })
})

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Ошибка сервера' })
})

// --- Запуск ---
const PORT = process.env.PORT || 3000

async function start() {
  try {
    await sequelize.authenticate()
    console.log('БД подключена')

    await sequelize.sync()
    console.log('Таблицы синхронизированы')

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (e) {
    console.error('Ошибка запуска:', e)
    process.exit(1)
  }
}

start()