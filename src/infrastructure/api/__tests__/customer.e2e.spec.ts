import { app, sequelize } from '../express';
import request from 'supertest';

describe('E2E test for customer', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'Street',
          number: 123,
          zip: '12345',
          city: 'City',
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John');
    expect(response.body.address.street).toBe('Street');
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe('12345');
    expect(response.body.address.city).toBe('City');
  });

  it('should not create a customer', async () => {
    const response = await request(app).post('/customer').send({
      name: 'John',
    });

    expect(response.status).toBe(500);
  });

  it('should list all customers', async () => {
    const res1 = await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'Street A',
          number: 123,
          zip: '12345',
          city: 'City 1',
        },
      });

    expect(res1.status).toBe(201);

    const res2 = await request(app)
      .post('/customer')
      .send({
        name: 'Jane',
        address: {
          street: 'Street B',
          number: 456,
          zip: '67890',
          city: 'City 2',
        },
      });

    expect(res2.status).toBe(201);

    const response = await request(app).get('/customer').send();

    expect(response.status).toBe(200);
    expect(response.body.customers.length).toBe(2);
    const customer1 = response.body.customers[0];
    expect(customer1.name).toBe('John');
    const customer2 = response.body.customers[1];
    expect(customer2.name).toBe('Jane');

    const responseXML = await request(app).get('/customer').set('Accept', 'application/xml').send();

    expect(responseXML.status).toBe(200);
    expect(responseXML.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  });
});
