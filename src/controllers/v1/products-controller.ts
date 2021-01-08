import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Products from '../../db/schemas/product';
import { sendError, validateObjectId } from '../../utils/response_utils';
import { validateNewProductBody } from '../../validators/v1/products-validator';

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const itemsPerPage: number = 20;
  const page: number = parseInt(req.query.page as string);
  const start = (page - 1) * itemsPerPage;
  const total: number = await Products.count({ user: req.session.userId });
  // const end: number = page * itemsPerPage;

  const products = await Products.find({
    user: req.session.userId,
  })
    .skip(start)
    .limit(itemsPerPage);

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

    const product = await Products.findOne({
      _id: productId,
      user: req.session.userId,
    }).populate({
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
    const { userId } = req.session;
    console.log(req.body);
    const { name, year, description, price } = req.body;
    validateObjectId(userId);
    const product = await Products.create({
      name,
      year,
      description,
      price,
      user: userId,
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
    const { name, year, description, price } = req.body;

    const updatedProduct = await Products.findOneAndUpdate(
      {
        _id: id,
        user: req.session.userId,
      },
      {
        name,
        year,
        description,
        price,
        user: req.session.userId,
      }
    );

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
    const { name, year, description, price } = req.body;
    const product = await Products.findOne({
      _id: productId,
      user: req.session.userId,
    });

    if (product) {
      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;
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
    const { name, year, description, price } = data;

    const product = await Products.findOne({
      _id: productId,
      user: req.session.userId,
    });

    if (product) {
      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;
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

    // validateObjectId(productId);

    const deleted = await Products.deleteOne({
      _id: productId,
      user: req.session.userId,
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
