import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {
  QA_CATEGORY_ROUTES,
  MARKETPLACE_CATEGORY_ROUTES,
  SITE_ORIGIN,
} from './src/data/seoRoutes';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildStaticDirectoryHtml(heading: string, summary: string, activePath: string): string {
  const qaLinks = QA_CATEGORY_ROUTES.map(
    (c) => `<li><a href="${c.path}">${escapeHtml(c.label)} Q&amp;A</a> — ${escapeHtml(c.subtitle)}</li>`
  ).join('');
  const marketLinks = MARKETPLACE_CATEGORY_ROUTES.map(
    (c) => `<li><a href="${c.path}">${escapeHtml(c.label)}</a> — ${escapeHtml(c.subtitle)}</li>`
  ).join('');

  const sectionFocus = activePath.startsWith('/marketplace')
    ? `<h2>Verified Campus Marketplace &amp; Recommended Sellers</h2>
       <p>Students on AskCampus buy and sell textbooks, calculators, lab kits, and dorm supplies directly in their local currency with zero platform commission. Every seller earns a live Reputation Rate (0–100%) and star rating from classmate reviews so top-recommended peers appear first.</p>`
    : activePath.startsWith('/qa')
    ? `<h2>Course-Tagged Academic Q&amp;A</h2>
       <p>Post homework questions tagged with your university course code, receive step-by-step explanations from classmates and teaching assistants, mark accepted solutions, and use the AI Study Copilot for practice breakdowns.</p>`
    : activePath === '/study-groups'
    ? `<h2>Campus Study Groups &amp; Exam Prep</h2>
       <p>Coordinate library room sessions and online study teams by course code with classmates at your own university.</p>`
    : activePath === '/ai-copilot'
    ? `<h2>AI Study Copilot &amp; Textbook Price Advisor</h2>
       <p>Generate structured concept breakdowns, practice questions, and fair local-currency resale appraisals for used textbooks and electronics.</p>`
    : `<h2>The University Student App Built for Classmates</h2>
       <p>AskCampus is a student web app that connects verified classmates at the same university for course-tagged academic Q&amp;A, study groups, AI study assistance, and a reputation-ranked campus marketplace.</p>`;

  return `<main style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;max-width:960px;margin:0 auto;padding:48px 24px;color:#0f172a;line-height:1.6;">
  <header style="margin-bottom:32px;border-bottom:1px solid #e2e8f0;padding-bottom:16px;">
    <a href="/" style="font-weight:800;font-size:20px;color:#0f172a;text-decoration:none;">AskCampus</a>
    <nav aria-label="Primary Sections" style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap;font-size:14px;">
      <a href="/qa">Academic Q&amp;A</a>
      <a href="/marketplace">Campus Marketplace</a>
      <a href="/study-groups">Study Groups</a>
      <a href="/ai-copilot">AI Study Copilot</a>
    </nav>
  </header>
  <article>
    <h1>${escapeHtml(heading)}</h1>
    <p>${escapeHtml(summary)}</p>
    <p style="font-size:13px;color:#475569;">Section URL: ${escapeHtml(SITE_ORIGIN + activePath)}</p>
    <section style="margin-top:24px;">
      ${sectionFocus}
    </section>
  </article>
  <section style="margin-top:32px;">
    <h2>Academic Q&amp;A Subjects</h2>
    <ul>${qaLinks}</ul>
  </section>
  <section style="margin-top:24px;">
    <h2>Campus Marketplace Categories &amp; Trusted Student Sellers</h2>
    <ul>${marketLinks}</ul>
  </section>
  <section style="margin-top:24px;">
    <h2>Frequently Asked Questions</h2>
    <h3>How does AskCampus verify classmates?</h3>
    <p>Students sign in with Google and select their country, university campus, and local currency so Q&amp;A feeds and marketplace listings match peers at the same school.</p>
    <h3>How are Marketplace sellers ranked?</h3>
    <p>Buyers submit 1–5 star ratings and feedback tags after purchases. Sellers with high reputation rates and verified handoffs are highlighted under Most Recommended Sellers.</p>
  </section>
</main>`;
}

function seoStaticRoutesPlugin(): Plugin {
  return {
    name: 'askcampus-seo-static-routes',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const template = fs.readFileSync(indexPath, 'utf-8');

      const allRoutes = [
        {
          path: '/',
          title: 'AskCampus – University Q&A, Study Groups & Campus Marketplace',
          description:
            'The university student app connecting verified classmates at your school. Ask academic questions, organize study groups, and buy or sell textbooks in your local currency.',
          heading: 'AskCampus – University Q&A, Study Groups & Campus Marketplace',
        },
        {
          path: '/qa',
          title: 'Academic Q&A Forum – All Subjects | AskCampus',
          description:
            'Browse and ask university coursework questions across Computer Science, Mathematics, Engineering, Pre-Med, Business, and Campus Life.',
          heading: 'Academic Q&A Forum on AskCampus',
        },
        {
          path: '/marketplace',
          title: 'Campus Marketplace – Textbooks, Tech & Gear | AskCampus',
          description:
            'Buy and sell textbooks, calculators, lab kits, notes, and dorm essentials from top-rated verified student sellers on your campus.',
          heading: 'Campus Marketplace & Recommended Student Sellers',
        },
        {
          path: '/study-groups',
          title: 'University Study Groups & Exam Cram Sessions | AskCampus',
          description:
            'Join or host campus study groups, library cram sessions, and course prep teams with fellow students.',
          heading: 'University Study Groups on AskCampus',
        },
        {
          path: '/ai-copilot',
          title: 'AI Study Copilot & Textbook Price Advisor | AskCampus',
          description:
            'Get step-by-step academic concept breakdowns, practice quiz checks, and local-currency textbook price appraisals.',
          heading: 'AI Study Copilot & Price Advisor on AskCampus',
        },
        ...QA_CATEGORY_ROUTES.map((c) => ({
          path: c.path,
          title: c.title,
          description: c.description,
          heading: `${c.label} Q&A on AskCampus`,
        })),
        ...MARKETPLACE_CATEGORY_ROUTES.map((c) => ({
          path: c.path,
          title: c.title,
          description: c.description,
          heading: `${c.label} – Campus Marketplace | AskCampus`,
        })),
      ];

      for (const route of allRoutes) {
        const canonicalUrl = `${SITE_ORIGIN}${route.path}`;
        const safeTitle = escapeHtml(route.title);
        const safeDesc = escapeHtml(route.description);

        let html = template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
          .replace(
            /<meta name="description" content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${safeDesc}" />`
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/?>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/?>/,
            `<meta property="og:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/?>/,
            `<meta property="og:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta property="og:description" content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${safeDesc}" />`
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:description" content="${safeDesc}" />`
          )
          .replace(
            '<div id="root"></div>',
            `<div id="root">${buildStaticDirectoryHtml(route.heading, route.description, route.path)}</div>`
          );

        if (route.path === '/') {
          fs.writeFileSync(indexPath, html, 'utf-8');
        } else {
          const relFile = route.path.replace(/^\//, '') + '.html';
          const outFile = path.join(distDir, relFile);
          fs.mkdirSync(path.dirname(outFile), {recursive: true});
          fs.writeFileSync(outFile, html, 'utf-8');
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoStaticRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
