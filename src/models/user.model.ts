import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from '../types/IUser';

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


UserSchema.index({ role: 1 });

export default mongoose.model<IUserDocument>('User', UserSchema);