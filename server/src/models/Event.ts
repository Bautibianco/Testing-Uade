import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'EXAM' | 'DELIVERY' | 'CLASS';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: EventType;
  organization?: string; // Organización asociada al evento
  remindDays?: number; // Para V3
  deletedAt?: Date; // Para soft delete
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  time: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  type: {
    type: String,
    required: true,
    enum: ['EXAM', 'DELIVERY', 'CLASS']
  },
  organization: {
    type: String,
    trim: true,
    maxlength: 100
  },
  remindDays: {
    type: Number,
    min: 0,
    max: 30
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices compuestos
EventSchema.index({ userId: 1, date: 1 });
EventSchema.index({ userId: 1, updatedAt: -1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
