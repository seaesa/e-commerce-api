import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const orderSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    userId: { type: Schema.Types.ObjectId, required: false },
    couponId: { type: Schema.Types.ObjectId, required: false },
    paymentId: { type: Schema.Types.ObjectId, required: false },
    shippingAddressId: { type: Schema.Types.ObjectId, required: false },
    orderNumber: { type: String, required: false },
    subTotal: { type: Number, required: false },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: false },
    deliveryInstruction: { type: String, required: false },
    status: { type: String, enum: ['Ordered', 'Canceled', 'Delivered'], default: 'Ordered' },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
});

orderSchema.plugin(uniqueValidator); 

export default mongoose.model('Order', orderSchema); // (<CollectionName>, <CollectionSchema>)
