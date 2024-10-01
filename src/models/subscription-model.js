import mongoose from 'mongoose'; 
mongoose.set('strictQuery', false); 
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema; 
const subscribeSchema = new Schema({
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' }
});

subscribeSchema.plugin(uniqueValidator); 

export default mongoose.model('Subscription', subscriptionSchema); // (<CollectionName>, <CollectionSchema>)
