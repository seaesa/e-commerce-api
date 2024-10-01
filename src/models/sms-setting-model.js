import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const smsSettingSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: false },
    smsSid: { type: String, required: true },
    smsAuthToken: { type: String, required: true },
    smsFromNumber: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: 'smsSettings' });

smsSettingSchema.plugin(uniqueValidator); 

export default mongoose.model('SMSSetting', smsSettingSchema); // (<CollectionName>, <CollectionSchema>)
