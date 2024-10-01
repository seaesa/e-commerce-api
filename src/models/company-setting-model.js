import mongoose from 'mongoose'; 
import uniqueValidator from 'mongoose-unique-validator';

mongoose.set('strictQuery', false); 
const Schema = mongoose.Schema; 

const companySettingSchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, required: true },
    paypalStatus: { type: Boolean, default: false },
    paypalEnvironment: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
    paypalSandboxClientId: { type: String, required: false },
    paypalSandboxClientSecret: { type: String, required: false },
    paypalLiveClientId: { type: String, required: false },
    paypalLiveClientSecret: { type: String, required: false },
    stripeStatus: { type: Boolean, default: false },
    stripeEnvironment: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
    stripeSandboxPublishableKey: { type: String, required: false },
    stripeSandboxSecretKey: { type: String, required: false },
    stripeLivePublishableKey: { type: String, required: false },
    stripeLiveSecretKey: { type: String, required: false },
    razorpayStatus: { type: Boolean, default: false },
    razorpayEnvironment: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
    razorpaySandboxKeyId: { type: String, required: false },
    razorpaySandboxKeySecret: { type: String, required: false },
    razorpayLiveKeyId: { type: String, required: false },
    razorpayLiveKeySecret: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, required: false },
    updatedAt: { type: Date, required: false }
}, { collection: 'companySettings' });

companySettingSchema.plugin(uniqueValidator); 
export default mongoose.model('CompanySetting', companySettingSchema); // (<CollectionName>, <CollectionSchema>)
