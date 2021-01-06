import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Products from '../../db/schemas/product';
import { sendError, validateObjectId } from '../../utils/response_utils';

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const itemsPerPage: number = 20;
  const page: number = parseInt(req.query.page as string);
  const start = (page - 1) * itemsPerPage;
  const total: number = await Products.count();
  // const end: number = page * itemsPerPage;

  const products = await Products.find().skip(start).limit(itemsPerPage);

  res.send({
    page: page,
    per_page: itemsPerPage,
    total: total,
    total_pages: Math.ceil(total / itemsPerPage),
    data: products,
  });
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    validateObjectId(productId);

    const product = await Products.findById(productId).populate({
      path: 'user',
      select: {
        password: 0,
        __v: 0,
      },
    });

    if (product) {
      res.send({ data: product });
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, year, description, price, user } = req.body;
    validateObjectId(user);
    const product = await Products.create({
      name,
      year,
      description,
      price,
      user,
    });
    res.send(product);
  } catch (e) {
    sendError(res, e);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string = req.params.productId;
    validateObjectId(id);
    const { name, year, description, price, user } = req.body;
    if (user) {
      validateObjectId(user);
    }
    const updatedProduct = await Products.findByIdAndUpdate(id, {
      name,
      year,
      description,
      price,
      user,
    });

    if (updatedProduct) {
      res.send({ data: 'OK' });
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

export const partialUpdateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    validateObjectId(productId);
    const { name, year, description, price, user } = req.body;
    if (user) {
      validateObjectId(user);
    }
    const product = await Products.findById(productId);

    if (product) {
      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;
      product.user = user || product.user;
      await product.save();
      res.send({ data: product });
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

export const updateProductAndNotify = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId: string = req.params.productId;
    validateObjectId(productId);
    const { client, data } = req.body;
    const { name, year, description, price, user } = data;

    if (user) {
      validateObjectId(user);
    }

    const product = await Products.findById(productId);

    if (product) {
      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;
      product.user = user || product.user;
      await product.save();

      res.send({ data: product, message: `Email sent to ${client}` });
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

export const deleteProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId: string = req.params.productId;

    validateObjectId(productId);

    const deleted = await Products.deleteOne({
      _id: Types.ObjectId(productId),
    });

    if (deleted.deletedCount > 0) {
      res.send({});
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};
