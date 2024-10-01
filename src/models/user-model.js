import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.set('strictQuery', false);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, required: false },
  employeeId: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  mobile: {
    type: String,
    unique: true,
    validate: {
      validator: function () {
        if (this.mobile === '') {
          return true;
        }
      }
    }
  },
  dob: { type: String, required: false },
  gender: { type: String, enum: ['male', 'female', 'other', null], default: null },
  imageName: { type: String, required: false },
  imagePath: { type: String, required: false },
  role: { type: String, required: true, enum: ['customer', 'admin', 'employee', 'superadmin'], default: 'customer' },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'inactive' },
  verifiedAt: { type: Date, required: false },
  createdBy: { type: Schema.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, required: false },
  updatedAt: { type: Date, required: false },
  deletedBy: { type: Schema.Types.ObjectId, required: false }, // Soft delete
  deletedAt: { type: Date, required: false },
  lastLogin: { type: Date, required: false }
});

userSchema.plugin(uniqueValidator);
export default mongoose.model('User', userSchema); // (<CollectionName>, <CollectionSchema>)
