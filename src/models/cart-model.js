import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 

import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema; 

const cartSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    sessionId: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, required: false },
    couponId: { type: Schema.Types.ObjectId, required: false },
    orderId: { type: Schema.Types.ObjectId, required: false },
    shippingAddressId: { type: Schema.Types.ObjectId, required: false },
    subTotal: { type: Number, required: false },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryInstruction: { type: String, required: false },
    paymentMethod: { type: String, enum: ['Stripe', 'Paypal', 'Razorpay', 'COD'], default: 'COD' },
    status: { type: String, enum: ['In Progress', 'Ordered', 'Canceled', 'Delivered'], default: 'In Progress' },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
}, { collection: 'carts' });

cartSchema.plugin(uniqueValidator); 

export default mongoose.model('Cart', cartSchema); // (<CollectionName>, <CollectionSchema>)
