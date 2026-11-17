import { StudentProfile, Question, MarketplaceItem, StudyGroup, Conversation } from '../types';

export const UNIVERSITIES = [
  'All Campuses',
  'Stanford University',
  'UC Berkeley',
  'MIT',
  'NYU',
  'UT Austin',
  'Univ. of Michigan',
  'Oxford University',
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Ahmadu Bello University (ABU)',
  'University of Nigeria Nsukka (UNN)',
  'Obafemi Awolowo University (OAU)',
  'Covenant University',
  'University of Toronto',
  'University of Cambridge',
  'Imperial College London'
];

export const CATEGORIES = [
  'All Subjects',
  'Computer Science',
  'Mathematics',
  'Pre-Med & Biology',
  'Engineering',
  'Business & Econ',
  'Physics & Chem',
  'Humanities & Law',
  'Campus Life'
];

export const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: 'Grid' },
  { id: 'textbooks', label: 'Textbooks', icon: 'BookOpen' },
  { id: 'electronics', label: 'Calculators & Tech', icon: 'Laptop' },
  { id: 'lab_supplies', label: 'Lab Kits & Gear', icon: 'FlaskConical' },
  { id: 'notes_guides', label: 'Past Exams & Notes', icon: 'FileText' },
  { id: 'dorm_living', label: 'Dorm & Living', icon: 'Home' },
  { id: 'other', label: 'Other Materials', icon: 'Package' },
];

// All hardcoded demo accounts have been removed.
// Accounts in AskCampus are strictly created by authentic registered users.
export const INITIAL_QUESTIONS: Question[] = [];

export const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [];

export const INITIAL_MARKETPLACE_ORDERS: any[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [];
