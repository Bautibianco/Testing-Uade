export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: EventType;
  organization?: string;
  remindDays?: number;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 'EXAM' | 'DELIVERY' | 'CLASS';

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: EventType;
  organization?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  type?: EventType;
  organization?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  organizations?: string[];
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
}

export interface ApiError {
  error: string;
  details?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface CalendarDay {
  date: Date;
  events: Event[];
  isCurrentMonth: boolean;
  isToday: boolean;
}
