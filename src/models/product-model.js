import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false);
 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const productSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    subCategoryId: { type: Schema.Types.ObjectId, required: true },
    brandId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    featureImage: [{ type: String, required: false }],
    images: [{ type: String, required: false }],
    price: { type: Number, required: true },
    discount: { type: Number, required: false },
    discountType: { type: String, enum: [null, 'percentage', 'fixed'], default: null },
    totalQuantity: { type: Number, required: false },
    quantityInStock: { type: Number, required: false },
    displayOrder: { type: Number, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    sku: { type: String, required: true },
    tags: [{ type: String, required: false }],
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
});

productSchema.plugin(uniqueValidator); 
export default mongoose.model('Product', productSchema); // (<CollectionName>, <CollectionSchema>)
