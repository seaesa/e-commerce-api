import mongoose from 'mongoose'; 

mongoose.set('strictQuery', false); 
const Schema = mongoose.Schema; 

const companySchema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    address: { type: String, required: false },
    dateFormat: { type: String, required: false },
    timeFormat: { type: String, required: false },
    timeZone: { type: String, required: false },
    language: { type: String, required: false },
    appName: { type: String, required: false },
    logoName: { type: String, required: false },
    logoPath: { type: String, required: false },
    favicon: { type: String, required: false },
    miniDrawer: { type: String, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false },
    deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
    deletedAt: { type: Date, required: false }

}); 
export default mongoose.model('Company', companySchema); // (<CollectionName>, <CollectionSchema>)
