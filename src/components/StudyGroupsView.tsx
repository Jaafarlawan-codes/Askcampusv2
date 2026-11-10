import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Calendar, 
  Check, 
  BookOpen, 
  Tag, 
  X,
  Clock,
  Sparkles 
} from 'lucide-react';
import { StudyGroup, StudentProfile } from '../types';
import { triggerConfetti } from '../utils/helpers';

interface StudyGroupsViewProps {
  groups: StudyGroup[];
  currentUser: StudentProfile;
  selectedCampus: string;
  onToggleJoin: (groupId: string) => void;
  onCreateGroup: (newGroup: StudyGroup) => void;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  groups,
  currentUser,
  selectedCampus,
  onToggleJoin,
  onCreateGroup,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingType, setMeetingType] = useState<'In-Person' | 'Online Zoom' | 'Library Room'>('Library Room');
  const [location, setLocation] = useState('Campus Library Study Room');
  const [schedule, setSchedule] = useState('Tuesdays & Thursdays, 7:00 PM');
  const [maxMembers, setMaxMembers] = useState(6);
  const [filterMySchool, setFilterMySchool] = useState(true);

  const filteredGroups = groups.filter((g) => {
    if (filterMySchool && currentUser.school) {
      return (
        g.campus.toLowerCase() === currentUser.school.toLowerCase() ||
        (g.host.school && g.host.school.toLowerCase() === currentUser.school.toLowerCase()) ||
        (g.host.college && g.host.college.toLowerCase() === currentUser.school.toLowerCase())
      );
    }
    if (selectedCampus === 'All Campuses') return true;
    return g.campus === selectedCampus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !title.trim()) return;

    const newGroup: StudyGroup = {
      id: `sg_${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim() || `Study group for ${courseCode} homework review and midterm prep.`,
      campus: currentUser.school || currentUser.college || (selectedCampus === 'All Campuses' ? 'Campus' : selectedCampus),
      meetingType,
      location: location.trim(),
      schedule: schedule.trim(),
      membersCount: 1,
      maxMembers: Number(maxMembers),
      joined: true,
      tags: [courseCode.trim().toUpperCase(), 'Midterm Prep'],
      host: currentUser,
    };

    onCreateGroup(newGroup);
    triggerConfetti();
    setShowCreateModal(false);
    setCourseCode('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Study Groups & Cram Sessions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Collaborate on problem sets, review lecture slides, and prep for midterms with peers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Form a Study Group</span>
        </button>
      </div>

      {/* School Colleague vs All Campuses Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilterMySchool(true)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMySchool
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🎓 Colleagues at {currentUser.school || 'My School'}</span>
        </button>

        <button
          onClick={() => setFilterMySchool(false)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            !filterMySchool
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🌐 All Campuses</span>
        </button>
      </div>

      {/* Grid of study groups */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No study groups found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first student to form a study group for your course or midterm exam prep!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Host a Study Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-900 text-white uppercase tracking-wider">
                  {group.courseCode}
                </span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {group.meetingType}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {group.title}
              </h3>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                {group.description}
              </p>

              <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{group.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{group.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>{group.campus}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={group.host.avatar}
                  alt={group.host.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="text-xs text-slate-500">
                  Host: <strong className="text-slate-700">{group.host.name}</strong>
                </span>
              </div>

              <button
                onClick={() => {
                  onToggleJoin(group.id);
                  if (!group.joined) triggerConfetti();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  group.joined
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {group.joined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined ({group.membersCount}/{group.maxMembers})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Join ({group.membersCount}/{group.maxMembers})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Modal: Create Study Group */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Host a Campus Study Group</h3>
                  <p className="text-xs text-indigo-200">Study together for exams and quizzes</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS 161 or MATH 51"
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Group Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm 1 Problem Set Practice Group"
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Meeting Location / Zoom Link *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Library Room 204 or Zoom link"
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Schedule / Meeting Days *
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. Wednesdays 6:00 PM - 8:00 PM"
                  required
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What topics will you be covering together?"
                  rows={3}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20"
                >
                  Create Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
