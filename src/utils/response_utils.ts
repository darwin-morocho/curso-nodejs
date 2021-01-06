import { Response } from 'express';
import { Types, mongo } from 'mongoose';

const { ObjectId } = Types;
const { MongoError } = mongo;

export const validateObjectId = (id: string): void => {
  if (!ObjectId.isValid(id)) {
    throw { code: 400, message: `Invalid ObjectId ${id}` };
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const sendError = (res: Response, e: any): void => {
  console.log(e);
  if (e instanceof MongoError) {
    res.status(400).send({
      code: e.code,
      message: e.code === 11000 ? 'Duplicated value' : 'Error',
    });
    return;
  }
  const statusCode: number = e.code || 500;
  res.status(statusCode).send(e.message);
};
