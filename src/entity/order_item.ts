export default class OrderItem {
  private _id: string;
  private _productId: string;
  private _name: string;
  private _quantity: number;
  private _price: number;

  constructor(id: string, name: string, quantity: number, price: number, productId: string) {
    this._id = id;
    this._productId = productId;
    this._name = name;
    this._quantity = quantity;
    this._price = price;
  }

  get quantity(): number {
    return this._quantity;
  }

  orderItemTotal(): number {
    return this._price * this._quantity;
  }
}