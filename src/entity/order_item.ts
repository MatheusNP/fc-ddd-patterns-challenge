export default class OrderItem {
  _id: string;
  _name: string;
  _quantity: number;
  _price: number;

  constructor(id: string, name: string, quantity: number, price: number) {
    this._id = id;
    this._name = name;
    this._quantity = quantity;
    this._price = price;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}