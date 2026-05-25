/**
 * scripts/generate-svgs.ts
 *
 * 预生成 GitHub 统计 SVG 图片并同步到 index.astro。
 * 移除多余主题，只保留与 Web 页面一致的三张卡片 (stats, streak, langs)。
 */

import { writeFileSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');
const INDEX_ASTRO_PATH = join(__dirname, '..', 'src', 'pages', 'index.astro');

const LANG_COLORS: Record<string, string> = {
  Dart:       '#00B4AB',
  'C++':      '#f34b7d',
  TypeScript: '#3178c6',
  CSS:        '#563d7c',
  Java:       '#b07219',
  C:          '#555555',
  Vue:        '#41b883',
  JavaScript: '#f7df1e',
  Python:     '#3572A5',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  Rust:       '#dea584',
  Go:         '#00ADD8',
  Ruby:       '#701516',
  PHP:        '#4F5D95',
  HTML:       '#e34c26',
  Shell:      '#89e051',
  Svelte:     '#ff3e00',
  Lua:        '#000080',
};

// ─── GitHub API 请求 ─────────────────────────────────────
async function fetchGitHub(path: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'shAdow-XJY-profile-svg',
      ...(process.env.GH_TOKEN ? { 'Authorization': `Bearer ${process.env.GH_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} → ${res.status}`);
  return res.json();
}

// ─── SVG 生成器（复刻 Astro 组件的高保真版本） ───────────────

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateStatsSvg({ repos, followers, following, stars, commits }: any) {
  const W = 500;
  const H = 195;
  const colW = W / 3;
  
  const cols = [
    { label: 'REPOS', value: repos },
    { label: 'FOLLOWERS', value: followers },
    { label: 'FOLLOWING', value: following },
  ].map((o, i) => {
    const cx = colW * i + colW / 2;
    return `
      <g>
        <text x="${cx}" y="104" font-family="'JetBrains Mono', monospace" font-size="36" fill="#e6edf3" font-weight="700" text-anchor="middle">${o.value}</text>
        <text x="${cx}" y="124" font-family="'JetBrains Mono', monospace" font-size="9.5" fill="#8b949e" text-anchor="middle" letter-spacing="1.8">${o.label}</text>
      </g>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <linearGradient id="sg-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c2128" />
      <stop offset="100%" stop-color="#161b22" />
    </linearGradient>
    <linearGradient id="sg-accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#58a6ff" />
      <stop offset="55%" stop-color="#3fb950" />
      <stop offset="100%" stop-color="#3fb950" stop-opacity="0" />
    </linearGradient>
    <filter id="sg-glow">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="url(#sg-bg)" stroke="#30363d" stroke-width="1" />
  <rect width="${W * 0.72}" height="2" rx="1" fill="url(#sg-accent)" filter="url(#sg-glow)" />
  <text x="20" y="36" font-family="'JetBrains Mono', monospace" font-size="13" fill="#58a6ff" font-weight="600">@shAdow-XJY</text>
  <text x="${W - 18}" y="36" font-family="'JetBrains Mono', monospace" font-size="11" fill="#3fb950" text-anchor="end" font-weight="500" letter-spacing="0.5">github stats</text>
  <line x1="16" y1="48" x2="${W - 16}" y2="48" stroke="#21262d" stroke-width="1" />
  ${cols}
  <line x1="${colW}" y1="58" x2="${colW}" y2="138" stroke="#21262d" stroke-width="1" />
  <line x1="${colW * 2}" y1="58" x2="${colW * 2}" y2="138" stroke="#21262d" stroke-width="1" />
  <line x1="16" y1="142" x2="${W - 16}" y2="142" stroke="#21262d" stroke-width="1" />
  <text x="${W / 4}" y="166" font-family="'JetBrains Mono', monospace" font-size="11" fill="#3fb950" text-anchor="middle" font-weight="500">&#9733; ${stars} stars earned</text>
  <line x1="${W / 2}" y1="150" x2="${W / 2}" y2="176" stroke="#21262d" stroke-width="1" />
  <text x="${W * 3 / 4}" y="166" font-family="'JetBrains Mono', monospace" font-size="11" fill="#8b949e" text-anchor="middle">${commits} commits (2024)</text>
</svg>`;
}

function generateStreakSvg({ commits }: any) {
  const W = 500;
  const H = 130;
  const cols = [
    { label: 'TOTAL CONTRIBUTIONS', value: commits.toString(), x: 90 },
    { label: 'CURRENT STREAK', value: `12d`, x: 270 },
    { label: 'LONGEST STREAK', value: `21d`, x: 430 },
  ].map(({ label, value, x }) => `
    <g>
      <text x="${x}" y="86" font-family="'JetBrains Mono', monospace" font-size="26" fill="#e6edf3" font-weight="700" text-anchor="middle">${value}</text>
      <text x="${x}" y="106" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#8b949e" text-anchor="middle" letter-spacing="1.2">${label}</text>
    </g>`).join('');

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <linearGradient id="str-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c2128" />
      <stop offset="100%" stop-color="#161b22" />
    </linearGradient>
    <linearGradient id="str-accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f0883e" />
      <stop offset="70%" stop-color="#f85149" />
      <stop offset="100%" stop-color="#f85149" stop-opacity="0" />
    </linearGradient>
    <filter id="str-glow">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="url(#str-bg)" stroke="#30363d" stroke-width="1" />
  <rect width="${W * 0.55}" height="2" rx="1" fill="url(#str-accent)" filter="url(#str-glow)" />
  <text x="20" y="34" font-family="'JetBrains Mono', monospace" font-size="13" fill="#f0883e" font-weight="600">Contribution Streak</text>
  <line x1="16" y1="46" x2="${W - 16}" y2="46" stroke="#21262d" stroke-width="1" />
  ${cols}
  <line x1="${W / 3}" y1="56" x2="${W / 3}" y2="115" stroke="#21262d" stroke-width="1" />
  <line x1="${W * 2 / 3}" y1="56" x2="${W * 2 / 3}" y2="115" stroke="#21262d" stroke-width="1" />
</svg>`;
}

function generateLangsSvg({ languages }: any) {
  const W = 500;
  const BAR_Y = 62;
  const BAR_H = 10;
  const INNER_W = W - 40;
  const LIST_START = 100;
  const ROW_H = 28;
  const LANG_BAR_X = 170;
  const LANG_BAR_W = INNER_W - 150;
  const H = LIST_START + languages.length * ROW_H + 20;

  let curX = 20;
  const segments = languages.map(({ name, pct }: any) => {
    const segW = (pct / 100) * INNER_W;
    const color = LANG_COLORS[name] ?? '#8b949e';
    const seg = `<rect x="${curX}" y="${BAR_Y}" width="${segW}" height="${BAR_H}" fill="${color}" clip-path="url(#stacked-bar-clip)" />`;
    curX += segW;
    return seg;
  }).join('');

  const rows = languages.map(({ name, pct }: any, i: number) => {
    const y = LIST_START + i * ROW_H;
    const barW = (pct / 100) * LANG_BAR_W;
    const color = LANG_COLORS[name] ?? '#8b949e';
    const isLast = i === languages.length - 1;
    const lineHtml = !isLast ? `<line x1="16" y1="${y + ROW_H - 2}" x2="${W - 16}" y2="${y + ROW_H - 2}" stroke="#21262d" stroke-width="1" />` : '';

    return `
      <g>
        <circle cx="28" cy="${y + 5}" r="4" fill="${color}" />
        <text x="42" y="${y + 10}" font-family="'JetBrains Mono', monospace" font-size="12" fill="#e6edf3">${escapeXml(name)}</text>
        <rect x="${LANG_BAR_X}" y="${y + 1}" width="${LANG_BAR_W}" height="8" rx="4" fill="#21262d" />
        <rect x="${LANG_BAR_X}" y="${y + 1}" width="${barW}" height="8" rx="4" fill="${color}" opacity="0.9" />
        <text x="${W - 18}" y="${y + 10}" font-family="'JetBrains Mono', monospace" font-size="11" fill="#8b949e" text-anchor="end">${pct.toFixed(1)}%</text>
        ${lineHtml}
      </g>`;
  }).join('');

  return `<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;">
  <defs>
    <linearGradient id="lg-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c2128" />
      <stop offset="100%" stop-color="#161b22" />
    </linearGradient>
    <linearGradient id="lg-accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3fb950" />
      <stop offset="60%" stop-color="#58a6ff" />
      <stop offset="100%" stop-color="#58a6ff" stop-opacity="0" />
    </linearGradient>
    <clipPath id="stacked-bar-clip">
      <rect x="20" y="${BAR_Y}" width="${INNER_W}" height="${BAR_H}" rx="5" />
    </clipPath>
    <filter id="lg-glow">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="url(#lg-bg)" stroke="#30363d" stroke-width="1" />
  <rect width="${W * 0.58}" height="2" rx="1" fill="url(#lg-accent)" filter="url(#lg-glow)" />
  <text x="20" y="34" font-family="'JetBrains Mono', monospace" font-size="13" fill="#3fb950" font-weight="600">Top Languages</text>
  <text x="${W - 18}" y="34" font-family="'JetBrains Mono', monospace" font-size="11" fill="#8b949e" text-anchor="end">by repo</text>
  <line x1="16" y1="46" x2="${W - 16}" y2="46" stroke="#21262d" stroke-width="1" />
  <rect x="20" y="${BAR_Y}" width="${INNER_W}" height="${BAR_H}" rx="5" fill="#21262d" />
  ${segments}
  <line x1="16" y1="86" x2="${W - 16}" y2="86" stroke="#21262d" stroke-width="1" />
  ${rows}
</svg>`;
}

// ─── 主流程 ─────────────────────────────────────────────
async function main() {
  console.log('📡 Fetching GitHub data...');
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const [user, repos] = await Promise.all([
    fetchGitHub('/users/shAdow-XJY'),
    fetchGitHub('/users/shAdow-XJY/repos?per_page=100&sort=updated'),
  ]);

  let stars = 0;
  const langTotals: Record<string, number> = {};
  for (const repo of repos) {
    stars += repo.stargazers_count || 0;
    if (repo.language) langTotals[repo.language] = (langTotals[repo.language] || 0) + 1;
  }

  const entries = Object.entries(langTotals).sort(([, a], [, b]) => b - a).slice(0, 7);
  const totalLang = entries.reduce((s, [, v]) => s + v, 0);
  const languages = entries.map(([name, count]) => ({
    name,
    pct: totalLang > 0 ? Number(((count / totalLang) * 100).toFixed(1)) : 0
  }));

  const githubData = {
    repos: user.public_repos ?? 0,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    stars,
    commits: 387, // TODO: Replace with GraphQL fetch if reliable commits are needed
    languages,
  };

  // 生成三张精确对齐 Astro 效果的 SVG
  writeFileSync(join(OUT_DIR, 'stats.svg'), generateStatsSvg(githubData), 'utf-8');
  writeFileSync(join(OUT_DIR, 'streak.svg'), generateStreakSvg(githubData), 'utf-8');
  writeFileSync(join(OUT_DIR, 'langs.svg'), generateLangsSvg(githubData), 'utf-8');

  // 更新 index.astro 里的 githubData，以供 Web 端同步渲染
  let indexAstro = readFileSync(INDEX_ASTRO_PATH, 'utf8');
  const dataString = JSON.stringify(githubData, null, 2).replace(/"([^"]+)":/g, '$1:');
  indexAstro = indexAstro.replace(/const githubData = [\s\S]*?};\n/, `const githubData = ${dataString};\n`);
  writeFileSync(INDEX_ASTRO_PATH, indexAstro, 'utf8');

  console.log(`✅ Generated identical SVGs: stats.svg, streak.svg, langs.svg`);
  console.log(`✅ Updated githubData in index.astro`);
}

main().catch(e => {
  console.error('❌ SVG generation failed:', e.message);
  process.exit(1);
});
