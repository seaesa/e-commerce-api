import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const paymentSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    orderId: { type: Schema.Types.ObjectId, required: false },
    paymentMethod: { type: String, required: false }, // Payment method
    status: { type: String, enum: [null, 'incomplete', 'completed', 'processing', 'failed'], default: null },
    amount: { type: Number, default: 0 },
    paymentId: { type: Schema.Types.ObjectId, required: false },
    paymentGatewayResponse: { type: Number, default: null },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now }
});

paymentSchema.plugin(uniqueValidator); 

export default mongoose.model('Payment', paymentSchema); // (<CollectionName>, <CollectionSchema>)
