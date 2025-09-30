import mongoose from 'mongoose';
import { EventType, IEvent } from '../models/Event';
import { IUser } from '../models/User';

// Interfaces para el repositorio en memoria
interface MemoryUser {
  _id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  organizations: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MemoryEvent {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: EventType;
  organization?: string;
  remindDays?: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Almacenamiento en memoria
const users: MemoryUser[] = [];
const events: MemoryEvent[] = [];

export class MemoryUserRepository {
  async create(userData: { email: string; passwordHash: string; firstName?: string; lastName?: string; organizations?: string[] }): Promise<IUser> {
    const id = new mongoose.Types.ObjectId().toString();
    const now = new Date();
    
    const user: MemoryUser = {
      _id: id,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      organizations: userData.organizations || [],
      createdAt: now,
      updatedAt: now
    };
    
    users.push(user);
    
    return {
      _id: new mongoose.Types.ObjectId(id),
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      organizations: user.organizations,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return null;
    
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = users.find(u => u._id === id);
    if (!user) return null;
    
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IUser;
  }

  async exists(email: string): Promise<boolean> {
    return users.some(u => u.email === email.toLowerCase());
  }

  async updateById(id: string, updateData: Partial<MemoryUser>): Promise<IUser | null> {
    const userIndex = users.findIndex(u => u._id === id);
    if (userIndex === -1) return null;
    
    const user = users[userIndex];
    Object.assign(user, updateData, { updatedAt: new Date() });
    
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      organizations: user.organizations,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IUser;
  }
}

export class MemoryEventRepository {
  async create(eventData: Partial<IEvent>): Promise<IEvent> {
    const id = new mongoose.Types.ObjectId().toString();
    const now = new Date();
    
    const event: MemoryEvent = {
      _id: id,
      userId: eventData.userId!.toString(),
      title: eventData.title!,
      description: eventData.description,
      date: eventData.date!,
      time: eventData.time,
      type: eventData.type!,
      remindDays: eventData.remindDays,
      deletedAt: eventData.deletedAt,
      createdAt: now,
      updatedAt: now
    };
    
    events.push(event);
    
    return {
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(event.userId),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      remindDays: event.remindDays,
      deletedAt: event.deletedAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    } as IEvent;
  }

  async findByUserAndDateRange(
    userId: string, 
    from: string, 
    to: string
  ): Promise<IEvent[]> {
    const userEvents = events
      .filter(e => e.userId === userId && !e.deletedAt)
      .filter(e => e.date >= from && e.date <= to)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.time || '00:00').localeCompare(b.time || '00:00');
      });
    
    return userEvents.map(event => ({
      _id: new mongoose.Types.ObjectId(event._id),
      userId: new mongoose.Types.ObjectId(event.userId),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      remindDays: event.remindDays,
      deletedAt: event.deletedAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    })) as IEvent[];
  }

  async findByIdAndUser(eventId: string, userId: string): Promise<IEvent | null> {
    const event = events.find(e => e._id === eventId && e.userId === userId && !e.deletedAt);
    if (!event) return null;
    
    return {
      _id: new mongoose.Types.ObjectId(event._id),
      userId: new mongoose.Types.ObjectId(event.userId),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      remindDays: event.remindDays,
      deletedAt: event.deletedAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    } as IEvent;
  }

  async deleteByIdAndUser(eventId: string, userId: string): Promise<boolean> {
    const eventIndex = events.findIndex(e => e._id === eventId && e.userId === userId && !e.deletedAt);
    if (eventIndex === -1) return false;
    
    events[eventIndex].deletedAt = new Date();
    events[eventIndex].updatedAt = new Date();
    return true;
  }

  async updateByIdAndUser(
    eventId: string, 
    userId: string, 
    updateData: Partial<IEvent>
  ): Promise<IEvent | null> {
    const eventIndex = events.findIndex(e => e._id === eventId && e.userId === userId && !e.deletedAt);
    if (eventIndex === -1) return null;
    
    const event = events[eventIndex];
    Object.assign(event, updateData, { updatedAt: new Date() });
    
    return {
      _id: new mongoose.Types.ObjectId(event._id),
      userId: new mongoose.Types.ObjectId(event.userId),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      type: event.type,
      remindDays: event.remindDays,
      deletedAt: event.deletedAt,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    } as IEvent;
  }
}
