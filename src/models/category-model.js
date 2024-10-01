import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
 
const categorySchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: false },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    imageName: { type: String },
    imagePath: { type: String },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
});

categorySchema.plugin(uniqueValidator); 

export default mongoose.model('Category', categorySchema); // (<CollectionName>, <CollectionSchema>)
