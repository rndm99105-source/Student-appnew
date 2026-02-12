
import { Assignment, ClassSession, Event, Job, Post } from './types';

export const CURRENT_USER = {
  name: "Guest",
  role: "Student",
};

export const UPCOMING_CLASSES: ClassSession[] = [
  {
    id: '1',
    title: 'Advanced Calculus',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    location: 'Room 301',
    color: 'bg-indigo-600',
    dayOfWeek: 'Mon'
  },
  {
    id: '2',
    title: 'Economics',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    location: 'Room 405',
    color: 'bg-green-600',
    dayOfWeek: 'Mon'
  },
  {
    id: '3',
    title: 'Literature',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    location: 'Library',
    color: 'bg-purple-500',
    dayOfWeek: 'Tue'
  },
  {
    id: '4',
    title: 'Physics Lab',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    location: 'Lab B',
    color: 'bg-cyan-500',
    dayOfWeek: 'Tue'
  },
  {
    id: '5',
    title: 'Chemistry',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Lab 1',
    color: 'bg-teal-500',
    dayOfWeek: 'Wed'
  },
  {
    id: '6',
    title: 'Intro to Psychology',
    startTime: '01:00 PM',
    endTime: '02:30 PM',
    location: 'Auditorium',
    color: 'bg-amber-500',
    dayOfWeek: 'Wed'
  },
  {
    id: '7',
    title: 'Art History',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Studio B',
    color: 'bg-pink-500',
    dayOfWeek: 'Thu'
  },
  {
    id: '8',
    title: 'Modern History',
    startTime: '01:00 PM',
    endTime: '02:30 PM',
    location: 'Hall A',
    color: 'bg-red-500',
    dayOfWeek: 'Thu'
  },
  {
    id: '9',
    title: 'Physical Education',
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    location: 'Gym',
    color: 'bg-orange-500',
    dayOfWeek: 'Fri'
  },
  {
    id: '10',
    title: 'Computer Science 101',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Lab 2',
    color: 'bg-blue-600',
    dayOfWeek: 'Fri'
  },
  {
    id: '11',
    title: 'Web Development Workshop',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    location: 'Innovation Hub',
    color: 'bg-slate-700',
    dayOfWeek: 'Fri'
  },
  {
    id: '12',
    title: 'Data Science Seminar',
    startTime: '04:30 PM',
    endTime: '06:00 PM',
    location: 'Main Auditorium',
    color: 'bg-emerald-600',
    dayOfWeek: 'Fri'
  }
];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'History Essay: World War II',
    course: 'Modern History',
    dueDate: 'Oct 15, 11:59 PM',
    daysLeft: 2,
    completed: false
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    course: 'Physics 101',
    dueDate: 'Oct 16, 5:00 PM',
    daysLeft: 3,
    completed: false
  },
  {
    id: '3',
    title: 'Calculus Problem Set 4',
    course: 'Adv. Calculus',
    dueDate: 'Oct 12, 11:59 PM',
    daysLeft: 0,
    completed: true
  }
];

export const JOBS: Job[] = [
  {
    id: '1',
    title: 'Campus Brand Ambassador',
    company: 'Red Bull',
    type: 'Part-Time',
    location: 'On Campus',
    rate: '$20/hr + Perks',
    featured: true,
    color: 'bg-indigo-600'
  },
  {
    id: '2',
    title: 'Library Assistant',
    company: 'University Library',
    type: 'Part-Time',
    location: 'On Campus',
    rate: '$15/hr'
  },
  {
    id: '3',
    title: 'Data Entry Project',
    company: 'Tech Corp',
    type: 'Micro-Task',
    location: 'Remote',
    rate: '$50 Fixed'
  }
];

export const FEED_POSTS: Post[] = [
  {
    id: '1',
    author: 'Career Center',
    timeAgo: '2 days ago',
    content: 'Don\'t miss the upcoming career fair! Over 50 companies attending.',
    tags: ['Career', 'Event'],
    likes: 45,
    comments: 12,
    isEvent: true,
    eventTitle: 'Campus Career Fair 2024'
  },
  {
    id: '2',
    author: 'Sarah Jenkins',
    timeAgo: '2h ago',
    content: 'Has anyone taken Prof. Smith\'s Advanced Econ class? Any tips for the midterm?',
    tags: ['Academics', 'Help'],
    likes: 12,
    comments: 5
  },
  {
    id: '3',
    author: 'Mike Chen',
    timeAgo: '4h ago',
    content: 'Selling my old calculus textbook. 50% off original price. DM if interested!',
    tags: ['ForSale', 'Books'],
    likes: 8,
    comments: 2
  }
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Freshers Welcome Party',
    date: 'Oct 20',
    time: '7:00 PM',
    location: 'Student Union Hall',
    organizer: 'Student Council',
    attendees: 124
  },
  {
    id: '2',
    title: 'Hackathon 2024: Build the Future',
    date: 'Nov 05',
    time: '9:00 AM',
    location: 'Innovation Hub',
    organizer: 'Tech Club',
    attendees: 85
  },
  {
    id: '3',
    title: 'Study Abroad Seminar',
    date: 'Oct 25',
    time: '2:00 PM',
    location: 'Room 101',
    organizer: 'International Office',
    attendees: 45
  }
];
