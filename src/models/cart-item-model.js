import mongoose from 'mongoose';  
import uniqueValidator from 'mongoose-unique-validator';
mongoose.set('strictQuery', false);
const Schema = mongoose.Schema; 
const cartItemSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    cartId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
}, { collection: 'cartItems' });

cartItemSchema.plugin(uniqueValidator); 
export default mongoose.model('CartItem', cartItemSchema); // (<CollectionName>, <CollectionSchema>)
