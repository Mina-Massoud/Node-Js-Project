import { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
},
    {
        timestamps: true,
        versionKey: false
    })


const Product = model('Product', productSchema)
export default Product