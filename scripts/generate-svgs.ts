/**
 * scripts/generate-svgs.ts
 *
 * 预生成 GitHub 统计 SVG 图片并同步到 index.astro。
 */

import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');
const INDEX_ASTRO_PATH = join(__dirname, '..', 'src', 'pages', 'index.astro');

const LANG_COLORS: Record<string, string> = {
  Dart: "#00B4AB", "C++": "#f34b7d", TypeScript: "#3178c6", CSS: "#563d7c", Java: "#b07219", C: "#555555",
  Vue: "#41b883", JavaScript: "#f1e05a", Shell: "#89e051", HTML: "#e34c26", Python: "#3572A5"
};

const ACCOUNTS_CONFIG: any[] = [
  { handle: 'shAdow-XJY', type: 'personal', accent: '#58a6ff', accentB: '#3fb950', mockAge: '5.8y' },
  { handle: 'shAdow-XJY-Manager', type: 'org', accent: '#f0883e', accentB: '#ffa657', mockAge: '2.1y' },
  { handle: 'shAdow-XJY-Website', type: 'org', accent: '#bc8cff', accentB: '#79c0ff', mockAge: '1.5y' },
  { handle: 'shAdow-XJY-Games', type: 'org', accent: '#478cbf', accentB: '#a5efac', mockAge: '0.0y' },
];

const FALLBACK_DATA: Record<string, any> = {
  'shAdow-XJY': {
    stats: { publicRepos: 13, publicCommits: 427, privateRepos: 5, privateCommits: 9 },
    languages: [
      { name: "Dart", pct: 36.4 },
      { name: "C++", pct: 18.2 },
      { name: "C", pct: 9.1 },
      { name: "Java", pct: 9.1 },
      { name: "Vue", pct: 9.1 },
      { name: "Astro", pct: 9.1 },
      { name: "Batchfile", pct: 9.1 }
    ]
  },
  'shAdow-XJY-Manager': {
    stats: { publicRepos: 45, publicCommits: 538, privateRepos: 4, privateCommits: 59 },
    languages: [
      { name: "C++", pct: 38.1 },
      { name: "Dart", pct: 23.8 },
      { name: "Java", pct: 11.9 },
      { name: "JavaScript", pct: 9.5 },
      { name: "Vue", pct: 7.1 },
      { name: "Python", pct: 4.8 },
      { name: "HTML", pct: 4.8 }
    ]
  },
  'shAdow-XJY-Website': {
    stats: { publicRepos: 4, publicCommits: 3, privateRepos: 9, privateCommits: 342 },
    languages: [
      { name: "JavaScript", pct: 44.4 },
      { name: "TypeScript", pct: 44.4 },
      { name: "Dart", pct: 11.1 }
    ]
  },
  'shAdow-XJY-Games': {
    stats: { publicRepos: 0, publicCommits: 0, privateRepos: 0, privateCommits: 0 },
    languages: []
  }
};

type Theme = 'dark' | 'light';

const THEME_COLORS = {
  dark: {
    bg0: '#1c2128',
    bg1: '#161b22',
    border: '#30363d',
    divider: '#21262d',
    textPrimary: '#e6edf3',
    textMuted: '#8b949e'
  },
  light: {
    bg0: '#f6f8fa',
    bg1: '#ffffff',
    border: '#d0d7de',
    divider: '#eaeef2',
    textPrimary: '#24292f',
    textMuted: '#57606a'
  }
};

function escapeXml(str: string) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function generateUpdatedSvg(theme: Theme) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  const color = THEME_COLORS[theme].textMuted;
  return `<svg viewBox="0 0 170 24" width="170" height="24" xmlns="http://www.w3.org/2000/svg">
  <text x="85" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="${color}" text-anchor="middle">Updated <tspan font-weight="700">${date}</tspan></text>
</svg>`;
}

function generateStatsOverviewSvg({ handle, accent, accentB, stats, type }: any, uid: string, theme: Theme = 'dark') {
  const c = THEME_COLORS[theme];
  const W = 500, H = 170, colW = W / 4;
  
  // Custom rendering logic for each column to match requested color format
  const columns = [
    { label: "PUBLIC REPO", tag: `<text x="${colW * 0 + colW / 2}" y="108" font-family="'JetBrains Mono', monospace" font-size="32" fill="${accent}" font-weight="700" text-anchor="middle">${stats.publicRepos || 0}</text>`, labelCx: colW * 0 + colW / 2 },
    { label: "PRIVATE REPO", tag: `<text x="${colW * 1 + colW / 2}" y="108" font-family="'JetBrains Mono', monospace" font-size="32" fill="${accentB}" font-weight="700" text-anchor="middle">${stats.privateRepos || 0}</text>`, labelCx: colW * 1 + colW / 2 },
    { label: "COMMITS", tag: `<text font-family="'JetBrains Mono', monospace" font-weight="700" text-anchor="middle"><tspan x="${colW * 2 + colW / 2}" y="68" font-size="20" fill="${accent}">${stats.publicCommits || 0}</tspan><tspan x="${colW * 2 + colW / 2}" y="88" font-size="14" fill="${c.textMuted}">+</tspan><tspan x="${colW * 2 + colW / 2}" y="108" font-size="20" fill="${accentB}">${stats.privateCommits || 0}</tspan></text>`, labelCx: colW * 2 + colW / 2 },
    { label: "ACCOUNT AGE", tag: `<text x="${colW * 3 + colW / 2}" y="108" font-family="'JetBrains Mono', monospace" font-size="32" fill="${accentB}" font-weight="700" text-anchor="middle">${stats.accountAge || '0y'}</text>`, labelCx: colW * 3 + colW / 2 },
  ].map((col) => {
    return `
      <g>
        ${col.tag}
        <text x="${col.labelCx}" y="128" font-family="'JetBrains Mono', monospace" font-size="9" fill="${c.textMuted}" text-anchor="middle" letter-spacing="1.1">${escapeXml(col.label)}</text>
      </g>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <linearGradient id="ss-bg-${uid}-${theme}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.bg0}" />
      <stop offset="100%" stop-color="${c.bg1}" />
    </linearGradient>
    <linearGradient id="ss-acc-${uid}-${theme}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="55%" stop-color="${accentB}" />
      <stop offset="100%" stop-color="${accentB}" stop-opacity="0" />
    </linearGradient>
    <filter id="ss-glow-${uid}-${theme}">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <clipPath id="clip-corners-${uid}-${theme}">
      <rect width="${W}" height="${H}" rx="12" />
    </clipPath>
  </defs>
  <g clip-path="url(#clip-corners-${uid}-${theme})">
    <rect width="${W}" height="${H}" rx="12" fill="url(#ss-bg-${uid}-${theme})" stroke="${c.border}" stroke-width="1" />
    <rect width="${W * 0.68}" height="2" fill="url(#ss-acc-${uid}-${theme})" filter="url(#ss-glow-${uid}-${theme})" />
  </g>
  <rect width="${W}" height="${H}" rx="12" fill="none" stroke="${c.border}" stroke-width="1" />
  <text x="20" y="34" font-family="'JetBrains Mono', monospace" font-size="12.5" fill="${accent}" font-weight="600">@${escapeXml(handle)}</text>
  <text x="${W - 18}" y="34" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="${accentB}" text-anchor="end" font-weight="500">stats &amp; overview</text>
  <line x1="16" y1="46" x2="${W - 16}" y2="46" stroke="${c.divider}" stroke-width="1" />
  ${columns}
  ${[1, 2, 3].map(i => `<line x1="${colW * i}" y1="56" x2="${colW * i}" y2="140" stroke="${c.divider}" stroke-width="1" />`).join('')}
  <line x1="16" y1="143" x2="${W - 16}" y2="143" stroke="${c.divider}" stroke-width="1" />
  <text x="${W / 2}" y="160" font-family="'JetBrains Mono', monospace" font-size="10" fill="${c.textMuted}" text-anchor="middle">activity (${new Date().getFullYear()})</text>
</svg>`;
}

function generateLangsSvg({ languages, accent, accentB }: any, uid: string, theme: Theme = 'dark') {
  const tc = THEME_COLORS[theme];
  const W = 500, BAR_Y = 62, BAR_H = 10, INNER_W = W - 40, LIST_START = 100, ROW_H = 28;
  const H = LIST_START + languages.length * ROW_H + 20;

  let segs = '', rows = '', currX = 20;
  languages.forEach(({ name, pct }: any, i: number) => {
    const c = LANG_COLORS[name] || tc.textMuted;
    const w = (pct / 100) * INNER_W;
    const isFirst = i === 0, isLast = i === languages.length - 1;
    segs += `
      ${isFirst ? `<rect x="${currX}" y="${BAR_Y}" width="${w}" height="${BAR_H}" fill="${c}" rx="5"/>
                   <rect x="${currX + w - 5}" y="${BAR_Y}" width="5" height="${BAR_H}" fill="${c}"/>` :
        isLast ? `<rect x="${currX}" y="${BAR_Y}" width="${w}" height="${BAR_H}" fill="${c}" rx="5"/>
                  <rect x="${currX}" y="${BAR_Y}" width="5" height="${BAR_H}" fill="${c}"/>` :
          `<rect x="${currX}" y="${BAR_Y}" width="${w}" height="${BAR_H}" fill="${c}"/>`}
    `;
    rows += `
      <circle cx="30" cy="${LIST_START + i * ROW_H + 5}" r="4" fill="${c}" />
      <text x="44" y="${LIST_START + i * ROW_H + 9}" font-family="'JetBrains Mono', monospace" font-size="12" fill="${tc.textPrimary}" font-weight="600">${escapeXml(name)}</text>
      <text x="${W - 20}" y="${LIST_START + i * ROW_H + 9}" font-family="'JetBrains Mono', monospace" font-size="12" fill="${tc.textMuted}" text-anchor="end">${pct}%</text>
    `;
    currX += w;
  });

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <linearGradient id="l-bg-${uid}-${theme}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${tc.bg0}" />
      <stop offset="100%" stop-color="${tc.bg1}" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="url(#l-bg-${uid}-${theme})" stroke="${tc.border}" stroke-width="1" />
  <text x="20" y="34" font-family="'JetBrains Mono', monospace" font-size="12.5" fill="${accent}" font-weight="600">@${escapeXml(uid.replace(/[^A-Za-z\-]/g, ''))}</text>
  <text x="${W - 18}" y="34" font-family="'JetBrains Mono', monospace" font-size="10.5" fill="${tc.textMuted}" text-anchor="end" font-weight="500">top languages</text>
  <line x1="16" y1="46" x2="${W - 16}" y2="46" stroke="${tc.divider}" stroke-width="1" />
  <rect x="20" y="${BAR_Y}" width="${INNER_W}" height="${BAR_H}" rx="5" fill="${tc.divider}" />
  ${segs}
  <line x1="16" y1="86" x2="${W - 16}" y2="86" stroke="${tc.divider}" stroke-width="1" />
  ${rows}
</svg>`;
}

async function getAccountData(conf: typeof ACCOUNTS_CONFIG[0]) {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error('GH_TOKEN is missing. Cannot fetch GraphQL API.');
  }

  const isOrg = conf.type === 'org';
  const query = `
    query getStats($login: String!) {
      user(login: $login) @skip(if: ${isOrg}) {
        createdAt
        ...RepoStats
      }
      organization(login: $login) @include(if: ${isOrg}) {
        createdAt
        ...RepoStats
      }
    }
    fragment RepoStats on RepositoryOwner {
      repositories(first: 100, ownerAffiliations: [OWNER], isFork: false) {
        nodes {
          isPrivate
          primaryLanguage {
            name
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'shAdow-XJY-profile-svg'
    },
    body: JSON.stringify({
      query,
      variables: { login: conf.handle }
    })
  });

  if (!res.ok) {
    throw new Error(`GraphQL API error: ${res.status} ${await res.text()}`);
  }

  const body = await res.json() as any;
  if (body.errors) {
    throw new Error(`GraphQL Errors: ${JSON.stringify(body.errors)}`);
  }

  const owner = isOrg ? body.data.organization : body.data.user;
  if (!owner) {
    throw new Error(`GitHub identity ${conf.handle} not found or inaccessible.`);
  }

  let publicRepos = 0, privateRepos = 0;
  let publicCommits = 0, privateCommits = 0;
  const langTotals: Record<string, number> = {};

  for (const repo of owner.repositories.nodes) {
    const isPrivate = repo.isPrivate;
    const commits = repo.defaultBranchRef?.target?.history?.totalCount || 0;
    
    if (isPrivate) {
      privateRepos++;
      privateCommits += commits;
    } else {
      publicRepos++;
      publicCommits += commits;
    }
    
    if (repo.primaryLanguage?.name) {
      const lang = repo.primaryLanguage.name;
      langTotals[lang] = (langTotals[lang] || 0) + 1;
    }
  }

  let accountAge = conf.mockAge;
  if (owner.createdAt) {
    const ageInMs = Date.now() - new Date(owner.createdAt).getTime();
    const ageInYears = (ageInMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
    accountAge = `${ageInYears}y`;
  }

  const entries = Object.entries(langTotals).sort(([, a], [, b]) => b - a).slice(0, 7);
  const totalLang = entries.reduce((s, [, v]) => s + v, 0);
  const languages = entries.map(([name, count]) => ({
    name,
    pct: totalLang > 0 ? Number(((count / totalLang) * 100).toFixed(1)) : 0
  }));

  return {
    handle: conf.handle,
    type: conf.type,
    accent: conf.accent,
    accentB: conf.accentB,
    stats: {
      publicRepos,
      publicCommits,
      privateRepos,
      privateCommits,
      accountAge
    },
    languages
  };
}

async function main() {
  console.log('📡 Fetching GitHub data...');
  if (!process.env.GH_TOKEN) {
    console.warn(`
      ⚠️ WARNING: process.env.GH_TOKEN is not set!
      Generating fallback mock SVG components.
    `);
  }

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, 'updated-dark.svg'), generateUpdatedSvg('dark'), 'utf-8');
  writeFileSync(join(OUT_DIR, 'updated-light.svg'), generateUpdatedSvg('light'), 'utf-8');

  const githubData = [];
  for (const acc of ACCOUNTS_CONFIG) {
    console.log(`fetching ${acc.handle}...`);
    let data;
    try {
      data = await getAccountData(acc);
    } catch (e: any) {
       console.log(`Fallback mock data for ${acc.handle} due to: ${e.message}`);
       const fallback = FALLBACK_DATA[acc.handle] || FALLBACK_DATA['shAdow-XJY'];
       data = { 
         ...acc, 
         stats: { ...fallback.stats, accountAge: acc.mockAge }, 
         languages: fallback.languages
       };
    }
    githubData.push(data);
    
    // Create SVGs for both themes
    const uid = data.handle.replace(/[^a-zA-Z0-9]/g, '');
    
    // Dark theme SVGs
    writeFileSync(join(OUT_DIR, `${data.handle}-stats-streak-dark.svg`), generateStatsOverviewSvg(data, uid, 'dark'), 'utf-8');
    writeFileSync(join(OUT_DIR, `${data.handle}-langs-dark.svg`), generateLangsSvg(data, data.handle, 'dark'), 'utf-8');
    
    // Light theme SVGs
    writeFileSync(join(OUT_DIR, `${data.handle}-stats-streak-light.svg`), generateStatsOverviewSvg(data, uid, 'light'), 'utf-8');
    writeFileSync(join(OUT_DIR, `${data.handle}-langs-light.svg`), generateLangsSvg(data, data.handle, 'light'), 'utf-8');
    
    // Also keep the old files for backward compatibility (default to dark)
    writeFileSync(join(OUT_DIR, `${data.handle}-stats-streak.svg`), generateStatsOverviewSvg(data, uid, 'dark'), 'utf-8');
    writeFileSync(join(OUT_DIR, `${data.handle}-langs.svg`), generateLangsSvg(data, data.handle, 'dark'), 'utf-8');
  }

  // Update index.astro
  let indexAstro = readFileSync(INDEX_ASTRO_PATH, 'utf8');
  const dataString = JSON.stringify(githubData, null, 2).replace(/"([^"]+)":/g, '$1:');
  indexAstro = indexAstro.replace(/const githubData = [\s\S]*?;\n/, `const githubData = ${dataString};\n`);
  writeFileSync(INDEX_ASTRO_PATH, indexAstro, 'utf8');

  console.log(`✅ Generated SVG resources`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
