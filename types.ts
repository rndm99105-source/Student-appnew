
export type ViewState = 'HOME' | 'EDUCATION' | 'JOBS' | 'COMMUNITY' | 'PROFILE' | 'AUTH' | 'MESSAGES' | 'EARNINGS';

export interface User {
  name: string;
  role: 'Student' | 'Pupil' | 'University' | 'Company';
  avatar?: string;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type?: 'alert' | 'info' | 'success';
}

export interface ClassSession {
  id: string;
  title: string;
  code?: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string; // Hex or tailwind class reference
  dayOfWeek: string; // 'Mon', 'Tue', 'Wed', etc.
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  daysLeft: number;
  completed: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'Part-Time' | 'Micro-Task' | 'Internship' | 'Full-Time';
  location: string;
  rate: string;
  featured?: boolean;
  color?: string;
}

export interface Post {
  id: string;
  author: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  isEvent?: boolean;
  eventDate?: string;
  eventTitle?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online?: boolean;
  messages: Message[];
}