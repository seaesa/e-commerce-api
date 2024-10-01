import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const subCategorySchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    imageName: { type: String, required: false },
    imagePath: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
}, { collection: 'subCategories' });

subCategorySchema.plugin(uniqueValidator); 

export default mongoose.model('SubCategory', subCategorySchema); // (<CollectionName>, <CollectionSchema>)
