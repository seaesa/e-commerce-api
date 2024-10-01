import mongoose from 'mongoose'; 
import uniqueValidator from 'mongoose-unique-validator';

mongoose.set('strictQuery', false); 
const Schema = mongoose.Schema; 

const brandSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: false },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    imageName: { type: String, required: false },
    imagePath: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }
});

brandSchema.plugin(uniqueValidator); 

export default mongoose.model('Brand', brandSchema);  
