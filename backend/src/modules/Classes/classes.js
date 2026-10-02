export class Product {
    constructor({ id, name, price, stock }) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.stock = stock;
    }
  }

  export class User {
    constructor({ id, name, email }) {
      this.id = id;
      this.name = name;
      this.email = email;
    }
  }

  export class Order {
    constructor({ id, userId, items, status }) {
      this.id = id;
      this.userId = userId;
      this.items = items;
      this.status = status;
      this.createdAt = new Date();
    }
  }