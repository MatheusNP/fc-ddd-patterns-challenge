import express, { Request, Response } from 'express';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import ListProductUseCase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateProductUseCase(new ProductRepository());

  try {
    const productDto = {
      name: req.body.name,
      price: req.body.price,
    };

    const product = await usecase.execute(productDto);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

productRoute.get('/', async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());

  try {
    const listProductDto = {};

    const products = await usecase.execute(listProductDto);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});
