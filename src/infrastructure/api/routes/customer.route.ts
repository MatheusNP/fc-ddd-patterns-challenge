import express, { Request, Response } from 'express';
import CreateCustomerUseCase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';

export const customerRoute = express.Router();

customerRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateCustomerUseCase(new CustomerRepository());

  try {
    const customerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        city: req.body.address.city,
        zip: req.body.address.zip,
      },
    };

    const customer = await usecase.execute(customerDto);
    res.status(201).send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});
