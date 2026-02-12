import React, { useState, useRef } from 'react';
import { Search, Filter, MapPin, Bookmark, ArrowLeft, Upload, CheckCircle, Briefcase, FileText, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { JOBS } from '../constants';
import { Job } from '../types';

export const JobsView: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsSuccess(false);
    setResumeFile(null);
    setFormData({ fullName: '', email: '', phone: '', coverLetter: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // If a job is selected, show the Application Page
  if (selectedJob) {
    return (
      <div className="pb-24 pt-4 px-4 space-y-6 h-screen flex flex-col bg-gray-50 fixed inset-0 z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedJob(null)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Apply for Job</h1>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in px-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h2>
            <p className="text-gray-500 mb-8">
              Your application for <span className="font-semibold text-gray-900">{selectedJob.title}</span> at {selectedJob.company} has been submitted successfully.
            </p>
            <Button onClick={() => setSelectedJob(null)} fullWidth>
              Back to Jobs
            </Button>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Job Summary */}
            <Card className="bg-white border-blue-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${selectedJob.color || 'bg-blue-600'}`}>
                   <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">{selectedJob.title}</h2>
                  <p className="text-gray-500 text-sm">{selectedJob.company}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="blue">{selectedJob.type}</Badge>
                    <span className="text-sm font-semibold text-green-600 mt-0.5">{selectedJob.rate}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@uni.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+1 234..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume / CV</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {!resumeFile ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-blue-400 transition-colors cursor-pointer group"
                  >
                    <Upload size={24} className="mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">Tap to upload PDF</span>
                    <span className="text-xs text-gray-400 mt-1">Max file size: 5MB</span>
                  </div>
                ) : (
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                         <p className="text-sm font-bold text-gray-900 truncate">{resumeFile.name}</p>
                         <p className="text-xs text-blue-600">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter (Optional)</label>
                <textarea 
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Tell us why you're a good fit..."
                />
              </div>

              <div className="pt-4 pb-8">
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  disabled={isSubmitting}
                  className="bg-gray-900 hover:bg-black text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Default Job List View
  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>
        <button className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for jobs, gigs..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Micro-Tasks', 'Part-Time', 'Internship', 'Full-Time'].map((filter, i) => (
          <button 
            key={filter}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border ${i === 1 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Featured Opportunity */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Featured Opportunities</h3>
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 border-none text-white p-5 shadow-lg shadow-blue-200">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h2 className="text-xl font-bold leading-tight mb-1">Campus Brand<br/>Ambassador</h2>
               <p className="text-blue-100">Red Bull</p>
             </div>
             <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
               <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Featured
             </div>
           </div>
           
           <div className="mb-5">
             <span className="text-2xl font-bold">$20/hr + Perks</span>
           </div>

           <Button 
             onClick={() => handleApply(JOBS[0])}
             className="bg-white text-blue-600 hover:bg-blue-50 w-32 py-2 text-sm font-bold rounded-lg border-none"
           >
             Apply Now
           </Button>
        </Card>
      </div>

      {/* Recent Jobs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Jobs</h3>
            <span className="text-sm text-gray-500">{JOBS.length - 1} results</span>
        </div>

        {JOBS.slice(1).map(job => (
          <Card key={job.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
               <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                 <BriefcaseIcon />
               </div>
               <button className="text-gray-400 hover:text-gray-600">
                 <Bookmark size={20} />
               </button>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
            <p className="text-gray-500 text-sm mb-3">{job.company}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="gray">{job.type}</Badge>
              <Badge variant="gray">{job.location}</Badge>
              <Badge variant="gray">Flexible</Badge>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-50">
               <span className="font-bold text-gray-900">{job.rate}</span>
               <Button 
                 size="sm" 
                 className="bg-gray-900 text-white px-6 rounded-lg"
                 onClick={() => handleApply(job)}
               >
                 Apply
               </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);