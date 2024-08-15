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
});
