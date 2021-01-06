import { Application } from 'express';

import * as usersController from '../../controllers/v1/users-controller';
import * as productsController from '../../controllers/v1/products-controller';

const createRoutesV1 = (app: Application): void => {
  app.post('/api/v1/users/create', usersController.createUser);
  app.get('/api/v1/users', usersController.getUsers);
  app.get('/api/v1/users/:userId', usersController.getUserById);
  app.delete('/api/v1/users/:userId', usersController.deleteById);
  app.get('/api/v1/products', productsController.getProducts);
  app.get('/api/v1/products/:productId', productsController.getProductById);
  app.post('/api/v1/products/create', productsController.createProduct);
  app.put('/api/v1/products/:productId', productsController.updateProduct);
  app.patch(
    '/api/v1/products/:productId',
    productsController.partialUpdateProduct
  );
  app.delete(
    '/api/v1/products/:productId',
    productsController.deleteProductById
  );
  app.post(
    '/api/v1/products/:productId/notify-client',
    productsController.updateProductAndNotify
  );
};

export default createRoutesV1;
