import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required : true
    },
    quantity:{
        type : Number,
        required : true,
        min : 1
    },
    price:{
        type:Number,
        required:true,
        min : 0 
    },
});

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    items : {
        type : [orderItemSchema],
        validate : [arr => arr.length > 0 , "Order must have at least one item"]
    },
    totalPrice : {
        type : Number,
        required : true, 
    },
    status:{
        type: String,
        enum : ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    shippingAddress : {
        type : String,
        required : true,
        trim : true
    },
},{timestamps : true});

const Order = mongoose.model("Order", orderSchema);
export default Order;
