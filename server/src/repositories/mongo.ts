import mongoose from 'mongoose';
import { Event, IEvent } from '../models/Event';
import { IUser, User } from '../models/User';

export class MongoUserRepository {
  async create(userData: { email: string; passwordHash: string; firstName?: string; lastName?: string; organizations?: string[] }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async exists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  async updateById(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }
}

export class MongoEventRepository {
  async create(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = new Event(eventData);
    return await event.save();
  }

  async findByUserAndDateRange(
    userId: string, 
    from: string, 
    to: string
  ): Promise<IEvent[]> {
    return await Event.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: from, $lte: to },
      deletedAt: { $exists: false }
    }).sort({ date: 1, time: 1 });
  }

  async findByIdAndUser(eventId: string, userId: string): Promise<IEvent | null> {
    return await Event.findOne({
      _id: eventId,
      userId: new mongoose.Types.ObjectId(userId),
      deletedAt: { $exists: false }
    });
  }

  async deleteByIdAndUser(eventId: string, userId: string): Promise<boolean> {
    const result = await Event.updateOne(
      {
        _id: eventId,
        userId: new mongoose.Types.ObjectId(userId),
        deletedAt: { $exists: false }
      },
      { deletedAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async updateByIdAndUser(
    eventId: string, 
    userId: string, 
    updateData: Partial<IEvent>
  ): Promise<IEvent | null> {
    return await Event.findOneAndUpdate(
      {
        _id: eventId,
        userId: new mongoose.Types.ObjectId(userId),
        deletedAt: { $exists: false }
      },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }
}

export const connectMongoDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};
