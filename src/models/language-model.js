import mongoose from 'mongoose';
mongoose.set('strictQuery', false);
import uniqueValidator from 'mongoose-unique-validator';
const Schema = mongoose.Schema;
const languageSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  createdBy: { type: Schema.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, required: false },
  updatedAt: { type: Date, required: false },
  deletedBy: { type: Schema.Types.ObjectId, required: false },
  deletedAt: { type: Date, default: null }
});

languageSchema.plugin(uniqueValidator);

export default mongoose.model('Language', languageSchema); // (<CollectionName>, <CollectionSchema>)
