import { Schema, Document, model, Types } from 'mongoose';
import { User } from './user';

interface Product extends Document {
  name: string;
  year: number;
  price?: number;
  description?: string;
  user: Types.ObjectId | User;
}

const schema = new Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, default: 0 },
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
});

const Products = model<Product>('product', schema);

export default Products;
