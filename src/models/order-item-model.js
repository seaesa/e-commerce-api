import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const orderItemSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    orderId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
}, { collection: 'orderItems' });

orderItemSchema.plugin(uniqueValidator); 
export default mongoose.model('OrderItem', orderItemSchema); // (<CollectionName>, <CollectionSchema>)
