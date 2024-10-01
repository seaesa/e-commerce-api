import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
const taxSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  rate: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  createdBy: { type: Schema.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, required: false },
  updatedAt: { type: Date, required: false },
  deletedBy: { type: Schema.Types.ObjectId, required: false },
  deletedAt: { type: Date, default: null }
});

taxSchema.plugin(uniqueValidator);

export default mongoose.model('Tax', taxSchema); // (<CollectionName>, <CollectionSchema>)
