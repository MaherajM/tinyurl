import mongoose, { Document, Schema } from 'mongoose';

  export interface ILink extends Document {
    code: string;
    target: string;
    clicks: number;
    createdAt: Date;
    lastClickedAt: Date | null;
  }

  const linkSchema = new Schema<ILink>({
    code: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v: string) {
          return /^[A-Za-z0-9]{6,8}$/.test(v);
        },
        message: 'Code must be 6-8 alphanumeric characters'
      }
    },
    target: {
      type: String,
      required: true
    },
    clicks: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastClickedAt: {
      type: Date,
      default: null
    }
  });

  export const Link = mongoose.model<ILink>('Link', linkSchema);