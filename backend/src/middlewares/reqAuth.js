export const auth = (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Нет заголовка Authorization' })
    }
    next()
  }