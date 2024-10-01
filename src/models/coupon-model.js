import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    code: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discount: { type: Number, required: true },
    fromDate: { type: Date, required: false },
    toDate: { type: Date, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
});

couponSchema.plugin(uniqueValidator); 

export default mongoose.model('Coupon', couponSchema); // (<CollectionName>, <CollectionSchema>)
