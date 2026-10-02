import { Product, User, Order } from './Classes/classes.js';

export const bd = {
  products: [
    new Product({ id: 1, name: 'Молоко', price: 80, stock: 50 }),
    new Product({ id: 2, name: 'Хлеб', price: 45, stock: 30 }),
  ],
  users: [
    new User({ id: 1, name: 'Иван', email: 'ivan@mail.ru' }),
  ],
  orders: [],

  nextProductId: 3,
  nextUserId: 2,
  nextOrderId: 1,
};
