export interface CategorySeoInfo {
  id: string;
  label: string;
  slug: string;
  path: string;
  title: string;
  description: string;
  subtitle: string;
}

export const SITE_ORIGIN = 'https://www.askcampus.online';

export const QA_CATEGORY_ROUTES: CategorySeoInfo[] = [
  {
    id: 'Computer Science',
    label: 'Computer Science',
    slug: 'computer-science',
    path: '/qa/computer-science',
    title: 'Computer Science Q&A & Algorithms Help | AskCampus',
    description: 'Ask and answer university Computer Science questions on algorithms, data structures, systems, and coding assignments with classmates.',
    subtitle: 'Algorithms, data structures, coding & systems',
  },
  {
    id: 'Mathematics',
    label: 'Mathematics',
    slug: 'mathematics',
    path: '/qa/mathematics',
    title: 'Mathematics Q&A & Calculus Help | AskCampus',
    description: 'Get verified peer explanations on calculus, linear algebra, probability, and discrete mathematics from students at your university.',
    subtitle: 'Calculus, linear algebra, statistics & proofs',
  },
  {
    id: 'Pre-Med & Biology',
    label: 'Pre-Med & Biology',
    slug: 'pre-med-biology',
    path: '/qa/pre-med-biology',
    title: 'Pre-Med & Biology Course Q&A | AskCampus',
    description: 'Collaborate on molecular biology, anatomy, biochemistry, and pre-med exam prep with fellow science students.',
    subtitle: 'Anatomy, biochemistry, genetics & lab prep',
  },
  {
    id: 'Engineering',
    label: 'Engineering',
    slug: 'engineering',
    path: '/qa/engineering',
    title: 'Engineering Homework & Course Q&A | AskCampus',
    description: 'Solve mechanical, electrical, civil, and software engineering coursework problems with verified campus peers.',
    subtitle: 'Circuits, mechanics, thermodynamics & CAD',
  },
  {
    id: 'Business & Econ',
    label: 'Business & Econ',
    slug: 'business-econ',
    path: '/qa/business-econ',
    title: 'Business, Finance & Economics Q&A | AskCampus',
    description: 'Discuss microeconomics, macroeconomics, accounting, and corporate finance case studies with students in your program.',
    subtitle: 'Finance, accounting, micro & macroeconomics',
  },
  {
    id: 'Physics & Chem',
    label: 'Physics & Chem',
    slug: 'physics-chem',
    path: '/qa/physics-chem',
    title: 'Physics & Chemistry Course Q&A | AskCampus',
    description: 'Get clear step-by-step answers on organic chemistry, electromagnetism, mechanics, and lab reports from classmates.',
    subtitle: 'Mechanics, organic chem & lab calculations',
  },
  {
    id: 'Humanities & Law',
    label: 'Humanities & Law',
    slug: 'humanities-law',
    path: '/qa/humanities-law',
    title: 'Humanities, Writing & Law Q&A | AskCampus',
    description: 'Exchange essay feedback, historical sources, and constitutional or legal coursework insights on AskCampus.',
    subtitle: 'Legal studies, literature, history & essays',
  },
  {
    id: 'Campus Life',
    label: 'Campus Life',
    slug: 'campus-life',
    path: '/qa/campus-life',
    title: 'Campus Life, Housing & Course Tips | AskCampus',
    description: 'Ask classmates about course registration, professors, dorm tips, campus libraries, and student life at your school.',
    subtitle: 'Registration, housing, professors & tips',
  },
];

export const MARKETPLACE_CATEGORY_ROUTES: CategorySeoInfo[] = [
  {
    id: 'textbooks',
    label: 'Textbooks',
    slug: 'textbooks',
    path: '/marketplace/textbooks',
    title: 'Used Textbooks – Campus Marketplace | AskCampus',
    description: 'Buy and sell affordable used university textbooks directly with classmates on your campus in your local currency.',
    subtitle: 'Course textbooks & semester editions',
  },
  {
    id: 'electronics',
    label: 'Calculators & Tech',
    slug: 'calculators-tech',
    path: '/marketplace/calculators-tech',
    title: 'Student Calculators & Tech – Campus Marketplace | AskCampus',
    description: 'Find scientific calculators, laptops, tablets, and study electronics sold by verified students at your school.',
    subtitle: 'Graphing calculators, laptops & accessories',
  },
  {
    id: 'lab_supplies',
    label: 'Lab Kits & Gear',
    slug: 'lab-kits-gear',
    path: '/marketplace/lab-kits-gear',
    title: 'Lab Kits, Coats & Gear – Campus Marketplace | AskCampus',
    description: 'Get lab coats, safety goggles, dissection kits, and engineering hardware locally on your campus.',
    subtitle: 'Lab coats, goggles, kits & hardware',
  },
  {
    id: 'notes_guides',
    label: 'Past Exams & Notes',
    slug: 'past-exams-notes',
    path: '/marketplace/past-exams-notes',
    title: 'Past Exams & Study Guides – Campus Marketplace | AskCampus',
    description: 'Browse printed study packets, course binders, and past exam prep materials from classmates.',
    subtitle: 'Course binders, packets & study guides',
  },
  {
    id: 'dorm_living',
    label: 'Dorm & Living',
    slug: 'dorm-living',
    path: '/marketplace/dorm-living',
    title: 'Dorm Gear & Student Essentials – Campus Marketplace | AskCampus',
    description: 'Buy and sell desk lamps, mini-fridges, bedding, and student apartment gear right on campus.',
    subtitle: 'Desk lamps, organizers & dorm gear',
  },
  {
    id: 'other',
    label: 'Other Materials',
    slug: 'other-materials',
    path: '/marketplace/other-materials',
    title: 'Other Campus Supplies – Campus Marketplace | AskCampus',
    description: 'Explore backpacks, art supplies, stationery, and miscellaneous university gear from verified students.',
    subtitle: 'Backpacks, art kits & campus supplies',
  },
];

export interface ParsedAppRoute {
  tab: 'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'saved' | 'profile';
  questionCategory?: string;
  marketCategory?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  activeLabel?: string;
}

export function resolveRouteFromPath(pathname: string): ParsedAppRoute {
  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';

  if (cleanPath === '/') {
    return {
      tab: 'questions',
      seoTitle: 'AskCampus – University Q&A, Study Groups & Campus Marketplace',
      seoDescription: 'The university student app connecting verified classmates at your school. Ask academic questions, organize study groups, and buy or sell textbooks in your local currency.',
      canonicalPath: '/',
    };
  }

  if (cleanPath === '/qa') {
    return {
      tab: 'questions',
      questionCategory: 'All Subjects',
      seoTitle: 'Academic Q&A Forum – All Subjects | AskCampus',
      seoDescription: 'Browse and ask university coursework questions across Computer Science, Mathematics, Engineering, Pre-Med, Business, and Campus Life.',
      canonicalPath: '/qa',
      activeLabel: 'All Q&A Subjects',
    };
  }

  if (cleanPath.startsWith('/qa/')) {
    const slug = cleanPath.replace('/qa/', '');
    const match = QA_CATEGORY_ROUTES.find((c) => c.slug === slug);
    if (match) {
      return {
        tab: 'questions',
        questionCategory: match.id,
        seoTitle: match.title,
        seoDescription: match.description,
        canonicalPath: match.path,
        activeLabel: match.label,
      };
    }
  }

  if (cleanPath === '/marketplace') {
    return {
      tab: 'marketplace',
      marketCategory: 'all',
      seoTitle: 'Campus Marketplace – Textbooks, Tech & Gear | AskCampus',
      seoDescription: 'Buy and sell textbooks, calculators, lab kits, notes, and dorm essentials with verified students on your campus.',
      canonicalPath: '/marketplace',
      activeLabel: 'All Marketplace Categories',
    };
  }

  if (cleanPath.startsWith('/marketplace/')) {
    const slug = cleanPath.replace('/marketplace/', '');
    const match = MARKETPLACE_CATEGORY_ROUTES.find((c) => c.slug === slug);
    if (match) {
      return {
        tab: 'marketplace',
        marketCategory: match.id,
        seoTitle: match.title,
        seoDescription: match.description,
        canonicalPath: match.path,
        activeLabel: match.label,
      };
    }
  }

  if (cleanPath === '/study-groups') {
    return {
      tab: 'studygroups',
      seoTitle: 'University Study Groups & Exam Cram Sessions | AskCampus',
      seoDescription: 'Join or host campus study groups, library cram sessions, and course prep teams with fellow students.',
      canonicalPath: '/study-groups',
      activeLabel: 'Study Groups',
    };
  }

  if (cleanPath === '/ai-copilot') {
    return {
      tab: 'copilot',
      seoTitle: 'AI Study Copilot & Textbook Price Advisor | AskCampus',
      seoDescription: 'Get step-by-step academic concept breakdowns, practice quiz checks, and local-currency textbook price appraisals.',
      canonicalPath: '/ai-copilot',
      activeLabel: 'AI Study Copilot',
    };
  }

  return {
    tab: 'questions',
    seoTitle: 'AskCampus – University Q&A, Study Groups & Campus Marketplace',
    seoDescription: 'Connect with verified classmates at your school. Ask course questions, organize study groups, and buy or sell textbooks in your local currency.',
    canonicalPath: '/',
  };
}

export function buildPathForState(
  tab: 'questions' | 'marketplace' | 'studygroups' | 'copilot' | 'saved' | 'profile',
  questionCategory: string,
  marketCategory: string
): ParsedAppRoute {
  if (tab === 'questions') {
    if (questionCategory && questionCategory !== 'All Subjects') {
      const match = QA_CATEGORY_ROUTES.find((c) => c.id === questionCategory);
      if (match) return resolveRouteFromPath(match.path);
    }
    return resolveRouteFromPath('/qa');
  }
  if (tab === 'marketplace') {
    if (marketCategory && marketCategory !== 'all') {
      const match = MARKETPLACE_CATEGORY_ROUTES.find((c) => c.id === marketCategory);
      if (match) return resolveRouteFromPath(match.path);
    }
    return resolveRouteFromPath('/marketplace');
  }
  if (tab === 'studygroups') return resolveRouteFromPath('/study-groups');
  if (tab === 'copilot') return resolveRouteFromPath('/ai-copilot');
  return resolveRouteFromPath('/');
}

export function applySeoMetadata(route: ParsedAppRoute) {
  if (typeof document === 'undefined') return;
  document.title = route.seoTitle;

  const setMeta = (selector: string, content: string) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', route.seoDescription);
  setMeta('meta[property="og:title"]', route.seoTitle);
  setMeta('meta[property="og:description"]', route.seoDescription);
  setMeta('meta[property="og:url"]', `${SITE_ORIGIN}${route.canonicalPath}`);
  setMeta('meta[name="twitter:title"]', route.seoTitle);
  setMeta('meta[name="twitter:description"]', route.seoDescription);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `${SITE_ORIGIN}${route.canonicalPath}`);
  }
}
