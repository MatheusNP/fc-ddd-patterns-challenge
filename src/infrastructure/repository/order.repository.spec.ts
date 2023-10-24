import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderModel from "../db/sequelize/model/order.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);

    await sequelize.sync();
  });

  afterEach(async() => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(new Address(
      "A st.",
      1,
      "60000-000",
      "Fortaleza",
    ));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("i1", product.name, 1, product.price, product.id);
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "o1",
      customer_id: "c1",
      total: order.total(),
      items: [
        {
          id: "i1",
          name: "Product 1",
          product_id: "p1",
          price: 100,
          quantity: 1,
          order_id: "o1",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer 1");
    customer.changeAddress(new Address(
      "A st.",
      1,
      "60000-000",
      "Fortaleza",
    ));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("i1", product.name, 1, product.price, product.id);
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: {id: order.id },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find("o1");

    expect(foundOrder.items).toHaveLength(1);
    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerID,
      total: foundOrder.total(),
      items: [
        {
          id: foundOrder.items[0].id,
          name: "Product 1",
          product_id: foundOrder.items[0].productID,
          price: foundOrder.items[0].price,
          quantity: foundOrder.items[0].quantity,
          order_id: foundOrder.id,
        },
      ],
    });
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("o1");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("c1", "Customer 1");
    customer1.changeAddress(new Address(
      "A st.",
      1,
      "60000-000",
      "Fortaleza",
    ));
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 100);
    await productRepository.create(product1);

    const orderRepository = new OrderRepository();
    const orderItem1 = new OrderItem("i1", product1.name, 1, product1.price, product1.id);
    const order1 = new Order("o1", customer1.id, [orderItem1]);
    await orderRepository.create(order1);

    const customer2 = new Customer("c2", "Customer 2");
    customer2.changeAddress(new Address(
      "B st.",
      2,
      "60000-999",
      "São Paulo",
    ));
    await customerRepository.create(customer2);

    const product2 = new Product("p2", "Product 2", 200);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem("i2", product2.name, 2, product2.price, product2.id);
    const order2 = new Order("o2", customer2.id, [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });

});