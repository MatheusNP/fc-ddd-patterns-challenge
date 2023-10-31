import Order from "../../domain/checkout/entity/order";
import OrderItem from "../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../domain/checkout/repository/order-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerID,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_id: item.productID,
        }))
      },
      {
        include: [{ model: OrderItemModel }],
      },
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerID,
      },
      {
        where: {
          id: entity.id,
        },
      },
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;

    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }],
      });
    } catch (error) {
      throw new Error("Order not found")
    }

    const orderItems = orderModel.items.map((orderItem) => new OrderItem(
      orderItem.id,
      orderItem.name,
      orderItem.quantity,
      orderItem.price,
      orderItem.product_id,
    ));

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      orderItems,
    );

    return order
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map(orderModel => {
      const orderItems = orderModel.items.map((orderItem) => new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.quantity,
        orderItem.price,
        orderItem.product_id,
      ));

      const order = new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItems,
      );

      return order
    });
  }
  
}