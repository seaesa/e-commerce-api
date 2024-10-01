import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.set('strictQuery', false);
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' }
});

subscriptionSchema.plugin(uniqueValidator);

export default mongoose.model('Subscription', subscriptionSchema); // (<CollectionName>, <CollectionSchema>)
