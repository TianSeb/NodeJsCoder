import z from "zod"
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import aggregatePaginate from "mongoose-aggregate-paginate-v2"
import { Product } from "../../../entities/IProduct"
import { UserRoles } from "../../../entities/IUser"


export interface PaginatedProductModel extends PaginateModel<Product & Document> {}

export const ProductSchema: Schema = new Schema<Product>({
  title: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique:true, minlength: 6, maxlength: 6 },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  owner: { type: String, default: UserRoles.ADMIN},
  thumbnails: { type: [String], required: false },
}, {
  versionKey: false
})

ProductSchema.plugin(aggregatePaginate)

export const ProductModel = model<Product, any>('Product', ProductSchema)

export const ProductSchemaValidator = z.object({
  body: z.object({
    title: z.string().nonempty(),
    description: z.string(),
    code: z.string().nonempty(),
    price: z.number().nonnegative(),
    status: z.boolean(),
    stock: z.number().nonnegative(),
    category: z.string(),
    thumbnails: z.array(z.string()).optional()
  })
})
