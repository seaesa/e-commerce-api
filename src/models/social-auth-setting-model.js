import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const socialAuthSettingSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    facebookStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    facebookClientId: { type: String, required: false },
    facebookClientSecret: { type: String, required: false },
    googleClientId: { type: String, required: false },
    googleClientSecret: { type: String, required: false },
    googleStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    twitterClientId: { type: String, required: false },
    twitterSecretId: { type: String, required: false },
    twitterStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: 'socialAuthSettings' });

socialAuthSettingSchema.plugin(uniqueValidator); 

export default mongoose.model('SocialAuthSettings', socialAuthSettingSchema); // (<CollectionName>, <CollectionSchema>)
