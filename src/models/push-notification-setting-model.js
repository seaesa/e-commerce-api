import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const pushNotificationSettingSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    onesignalAppId: { type: String, required: true },
    onesignalApiKey: { type: String, required: true },
    notificationLogo: { type: String, required: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: 'pushNotificationSettings' });

pushNotificationSettingSchema.plugin(uniqueValidator); 

export default mongoose.model('PushNotificationSettings', pushNotificationSettingSchema); // (<CollectionName>, <CollectionSchema>)
