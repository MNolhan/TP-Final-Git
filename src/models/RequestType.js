import mongoose from 'mongoose';

const PRIORITIES = ['low', 'medium', 'high', 'critical'];

const RequestTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'medium',
    },
    category: {
      type: String,
      required: [true, 'category is required'],
      trim: true,
    },
    estimatedResponseTime: {
      type: Number,
      min: [0, 'estimatedResponseTime must be positive'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('RequestType', RequestTypeSchema);
export { PRIORITIES };
