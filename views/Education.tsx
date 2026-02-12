import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, Circle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { UPCOMING_CLASSES, ASSIGNMENTS } from '../constants';

export const EducationView: React.FC = () => {
  const [tab, setTab] = useState<'schedule' | 'assignments'>('schedule');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stripStartDate, setStripStartDate] = useState<Date>(new Date());
  
  // Normalize date to midnight for consistent comparison
  const normalizeDate = (d: Date) => {
    const newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Generate the Monday-Friday of the week containing stripStartDate
  const calendarDays = useMemo(() => {
    const days = [];
    const current = normalizeDate(stripStartDate);
    
    // Find Monday relative to the stripStartDate
    const day = current.getDay();
    // Monday is 1. If day is 0 (Sunday), we go back 6 days. Else go back day - 1.
    const diff = day === 0 ? 6 : day - 1;
    
    const monday = new Date(current);
    monday.setDate(current.getDate() - diff);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  }, [stripStartDate]);

  // Filter classes based on selected date
  const filteredClasses = useMemo(() => {
    const selectedDayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
    return UPCOMING_CLASSES.filter(cls => cls.dayOfWeek === selectedDayOfWeek);
  }, [selectedDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
     return date.getDate() === selectedDate.getDate() && 
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
  };

  const handleDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      const newDate = new Date(y, m - 1, d); // Month is 0-indexed in JS Date
      setSelectedDate(newDate);
      setStripStartDate(newDate); // Move the strip to the selected date
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Education</h1>
        <label className="p-2 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors relative overflow-hidden">
          <CalendarIcon size={20} />
          <input 
            type="date" 
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={handleDatePick}
          />
        </label>
      </div>

      {/* Tab Switcher */}
      <div className="bg-gray-200 p-1 rounded-xl flex font-medium text-sm">
        <button 
          onClick={() => setTab('schedule')}
          className={`flex-1 py-2 rounded-lg transition-all ${tab === 'schedule' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Schedule
        </button>
        <button 
          onClick={() => setTab('assignments')}
          className={`flex-1 py-2 rounded-lg transition-all ${tab === 'assignments' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Assignments
        </button>
      </div>

      {tab === 'schedule' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Calendar Strip (5 Days Mon-Fri) */}
          <div className="grid grid-cols-5 gap-2 pb-2">
             {calendarDays.map((date, idx) => {
               const active = isSelected(date);
               return (
                 <button 
                   key={idx} 
                   onClick={() => setSelectedDate(date)}
                   className={`flex flex-col items-center justify-center h-20 rounded-2xl border transition-all duration-200 ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'}`}
                 >
                    <span className={`text-[10px] sm:text-xs font-medium mb-1 ${active ? 'text-blue-100' : 'text-gray-400'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-lg sm:text-xl font-bold ${active ? 'text-white' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </span>
                 </button>
               );
             })}
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-gray-900">
               {isToday(selectedDate) ? "Today's Classes" : `Classes for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`}
             </h3>
             
             {filteredClasses.length > 0 ? (
               filteredClasses.map(cls => (
                 <Card key={cls.id} className="relative overflow-visible">
                    <div className={`absolute top-4 bottom-4 left-0 w-1.5 rounded-r-md ${cls.color}`}></div>
                    <div className="pl-4">
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-lg text-gray-900">{cls.title}</h4>
                         <Badge variant="gray">CLASS</Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                         <div className="flex items-center gap-1">
                            <Clock size={14} /> {cls.startTime} - {cls.endTime}
                         </div>
                         <div className="flex items-center gap-1">
                            <MapPin size={14} /> {cls.location}
                         </div>
                      </div>
                    </div>
                 </Card>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                   <CalendarIcon size={24} className="text-gray-300" />
                 </div>
                 <p className="font-medium">No classes scheduled</p>
                 <p className="text-sm">Enjoy your free time!</p>
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-900">Upcoming</h3>
             <button className="text-blue-600 text-sm font-medium">Filter</button>
          </div>
          
          {ASSIGNMENTS.map(assignment => (
            <Card key={assignment.id} className="flex flex-col gap-3">
               <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <BookOpenIcon />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                     </div>
                  </div>
                  <button className="text-gray-300">
                    {assignment.completed ? <CheckCircle className="text-green-500" /> : <Circle />}
                  </button>
               </div>
               
               <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-xs font-medium text-red-500">Due: {assignment.dueDate}</span>
                  <Badge variant={assignment.daysLeft <= 2 ? 'red' : 'blue'}>
                    {assignment.daysLeft === 0 ? 'Today' : `${assignment.daysLeft} days left`}
                  </Badge>
               </div>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
};

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);