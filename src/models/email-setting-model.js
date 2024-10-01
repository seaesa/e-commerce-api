import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const emailSettingSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    mailFromName: { type: String, required: true },
    mailFromAddress: { type: String, required: true },
    driver: { type: String, required: true },
    host: { type: String, required: true },
    port: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    encryption: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: 'emailSettings' });

emailSettingSchema.plugin(uniqueValidator); 

export default mongoose.model('EmailSetting', emailSettingSchema); // (<CollectionName>, <CollectionSchema>)
