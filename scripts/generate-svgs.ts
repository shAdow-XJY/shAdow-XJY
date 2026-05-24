/**
 * scripts/generate-svgs.ts
 *
 * 预生成 GitHub 统计 SVG 图片。
 * 输出到 src/images/，通过 Vite ?url import 统一处理路径。
 * dev 和构建时 base 前缀自动正确。
 *
 * Usage: node scripts/generate-svgs.ts
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');

// ─── 颜色主题 ────────────────────────────────────────────
const THEMES = {
  algolia: { bg: '#003d2d', title: '#ffffff', text: '#ffffff', icon: '#00e676', border: '#00e676' },
  dark:    { bg: '#161b22', title: '#e6edf3', text: '#e6edf3', icon: '#58a6ff', border: '#30363d' },
  radical: { bg: '#141321', title: '#ff71ce', text: '#ff71ce', icon: '#ff71ce', border: '#ff71ce' },
  dracula: { bg: '#282a36', title: '#f8f8f2', text: '#f8f8f2', icon: '#bd93f9', border: '#6272a4' },
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572A5',
  Swift: '#F05138',      Kotlin: '#A97BFF',    Dart: '#00B4AB',
  Rust: '#dea584',       Go: '#00ADD8',        Java: '#b07219',
  C: '#555555',          'C++': '#f34b7d',     'C#': '#178600',
  Ruby: '#701516',       PHP: '#4F5D95',       HTML: '#e34c26',
  CSS: '#563d7c',        Shell: '#89e051',     Vue: '#41b883',
  Svelte: '#ff3e00',     Lua: '#000080',
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

// ─── SVG 生成器 ─────────────────────────────────────────
function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateStatsSvg(data: { repos: number; followers: number; following: number }, theme = THEMES.algolia) {
  const { bg, title, text, icon, border } = theme;
  const stats = [
    { icon: '◈', label: 'Repos',    value: data.repos },
    { icon: '◉', label: 'Followers', value: data.followers },
    { icon: '◎', label: 'Following', value: data.following },
  ];

  const lines = stats.map((s, i) => {
    const y = 55 + i * 25;
    return `<g transform="translate(0,${y})">
    <text x="30" y="12" font-size="13" fill="${icon}" font-family="monospace">${s.icon}</text>
    <text x="60" y="14" font-size="13" fill="${text}" font-family="monospace">${escapeXml(s.label)}</text>
    <text x="280" y="14" font-size="13" fill="${title}" font-family="monospace" text-anchor="end" font-weight="600">${s.value.toLocaleString()}</text>
  </g>`;
  }).join('\n');

  return `<svg width="370" height="150" viewBox="0 0 370 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="370" height="150" rx="10" fill="${bg}" stroke="${border}" stroke-width="1"/>
  <text x="20" y="28" font-size="15" fill="${title}" font-family="monospace" font-weight="bold">@shAdow-XJY</text>
  <line x1="20" y1="40" x2="350" y2="40" stroke="${border}" stroke-width="0.5" stroke-opacity="0.5"/>
  ${lines}
</svg>`;
}

function generateLangsSvg(langData: Record<string, number>, theme = THEMES.algolia) {
  const { bg, title, text, border } = theme;

  const entries = Object.entries(langData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);

  const total = entries.reduce((s, [, v]) => s + v, 0);

  const bars = entries.map(([name, count], i) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    const barW = Math.round(pct * 2.5);
    const y = 45 + i * 28;
    const color = LANG_COLORS[name] ?? '#8b949e';
    return `<g transform="translate(0,${y})">
    <text x="0" y="11" font-size="12" fill="${text}" font-family="monospace">${escapeXml(name)}</text>
    <rect x="0" y="15" width="250" height="6" rx="3" fill="${border}" fill-opacity="0.2"/>
    <rect x="0" y="15" width="${barW}" height="6" rx="3" fill="${color}"/>
    <text x="258" y="21" font-size="11" fill="${title}" font-family="monospace">${pct.toFixed(1)}%</text>
  </g>`;
  }).join('\n');

  const H = Math.max(entries.length * 28 + 50, 120);
  return `<svg width="370" height="${H}" viewBox="0 0 370 ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="370" height="${H}" rx="10" fill="${bg}" stroke="${border}" stroke-width="1"/>
  <text x="20" y="26" font-size="14" fill="${title}" font-family="monospace" font-weight="bold">Top Languages</text>
  <line x1="20" y1="35" x2="350" y2="35" stroke="${border}" stroke-width="0.5" stroke-opacity="0.5"/>
  ${bars}
</svg>`;
}

// ─── 主流程 ─────────────────────────────────────────────
async function main() {
  console.log('📡 Fetching GitHub data...');
  mkdirSync(OUT_DIR, { recursive: true });

  const [user, repos] = await Promise.all([
    fetchGitHub('/users/shAdow-XJY'),
    fetchGitHub('/users/shAdow-XJY/repos?per_page=100&sort=updated'),
  ]);

  const stats = {
    repos: user.public_repos ?? 0,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
  };

  const langTotals: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) langTotals[repo.language] = (langTotals[repo.language] || 0) + 1;
  }

  // 生成 algolia 主题（与 README 默认主题一致）
  const t = THEMES.algolia;

  // 多主题输出，方便 README 里切换
  for (const [themeName, theme] of Object.entries(THEMES)) {
    const statsSvg = generateStatsSvg(stats, theme);
    const langsSvg = generateLangsSvg(langTotals, theme);
    writeFileSync(join(OUT_DIR, `stats-${themeName}.svg`), statsSvg, 'utf-8');
    writeFileSync(join(OUT_DIR, `langs-${themeName}.svg`), langsSvg, 'utf-8');
  }

  // 默认主题（algolia）
  const defaultStats = generateStatsSvg(stats, t);
  const defaultLangs = generateLangsSvg(langTotals, t);
  writeFileSync(join(OUT_DIR, 'stats.svg'),   defaultStats, 'utf-8');
  writeFileSync(join(OUT_DIR, 'langs.svg'),   defaultLangs, 'utf-8');

  console.log(`✅ Generated SVGs in public/images/:`);
  console.log(`   stats.svg, stats-algolia.svg, stats-dark.svg, stats-radical.svg, stats-dracula.svg`);
  console.log(`   langs.svg,  langs-algolia.svg,  langs-dark.svg,  langs-radical.svg,  langs-dracula.svg`);
}

main().catch(e => {
  console.error('❌ SVG generation failed:', e.message);
  process.exit(1);
});
