import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;
 
const shippingAddressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    landmark: { type: String, required: true },
    houseNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    isDefaultAddress: { type: Boolean, default: false }, // Default address
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
}, { collection: 'shippingAddresses' });

shippingAddressSchema.plugin(uniqueValidator); 

export default mongoose.model('shippingAddresses', shippingAddressSchema); // (<CollectionName>, <CollectionSchema>)
