import React, { useState, useEffect } from 'react';
import { useProfileI18n } from '../../app/i18n/useProfileI18n';
import { githubData, dockSets } from '../../data/githubData';
import { AppProviders } from './AppProviders';
import { Moon, Sun, Globe, Check } from 'lucide-react';
import type { SupportedLocale } from '@shadow-xjy-website/web-common';

// Theme color definitions (matching Figma implementation)
type ThemeColors = {
  bodyBg: string;
  cardBg0: string;
  cardBg1: string;
  cardBorder: string;
  divider: string;
  textPrimary: string;
  textMuted: string;
  gridLine: string;
};

const DARK_THEME: ThemeColors = {
  bodyBg: '#0d1117',
  cardBg0: '#1c2128',
  cardBg1: '#161b22',
  cardBorder: '#30363d',
  divider: '#21262d',
  textPrimary: '#e6edf3',
  textMuted: '#8b949e',
  gridLine: 'rgba(48,54,61,0.25)',
};

const LIGHT_THEME: ThemeColors = {
  bodyBg: '#ffffff',
  cardBg0: '#f6f8fa',
  cardBg1: '#ffffff',
  cardBorder: '#d0d7de',
  divider: '#eaeef2',
  textPrimary: '#24292f',
  textMuted: '#57606a',
  gridLine: 'rgba(208,215,222,0.3)',
};

function FloatingButtons({ isDark, onThemeToggle }: { isDark: boolean; onThemeToggle: () => void }) {
  const { t, locale, setLocale } = useProfileI18n();
  const [langOpen, setLangOpen] = React.useState(false);

  // i18n ALL Root languages
  const LANGS: { code: SupportedLocale; label: string }[] = [
    { code: 'en-US', label: 'English' },
    { code: 'zh-Hans', label: '简体中文' },
    { code: 'zh-Hant', label: '繁體中文' },
    { code: 'ja-JP', label: '日本語' },
    { code: 'ko-KR', label: '한국어' },
    { code: 'ar-SA', label: 'العربية' },
    { code: 'nl-NL', label: 'Nederlands' },
    { code: 'ru-RU', label: 'Русский' },
    { code: 'bg-BG', label: 'Български' },
    { code: 'de-DE', label: 'Deutsch' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'id-ID', label: 'Bahasa Indonesia' },
    { code: 'pt-BR', label: 'Português' },
    { code: 'fi-FI', label: 'Suomi' },
    { code: 'sv-SE', label: 'Svenska' },
  ];
  const activeLangLabel = LANGS.find(l => l.code === locale)?.label || 'English';

  return (
    <div className="floating-controls">
      {/* Theme Toggle */}
      <button 
        onClick={onThemeToggle}
        aria-label="Toggle theme" 
        className="floating-control"
        style={{ borderRadius: '1rem', background: isDark ? 'rgba(22,27,34,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`, backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)', cursor: 'pointer' }}
      >
        <span style={{ color: isDark ? '#f0883e' : '#57606a', display: 'flex' }}>
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
        </span>
        <span className="floating-control-label" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: isDark ? '#e6edf3' : '#24292f', letterSpacing: '0.04em', fontWeight: 500 }}>
          {isDark ? t('theme.dark') : t('theme.light')}
        </span>
      </button>

      {/* Language Switcher */}
      <div style={{ position: 'relative', userSelect: 'none' }}>
        <button 
          onClick={() => setLangOpen(!langOpen)}
          aria-label="Switch language" 
          className="floating-control"
          style={{ borderRadius: '1rem', background: isDark ? 'rgba(22,27,34,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`, backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)' : '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)', cursor: 'pointer' }}
        >
          <span style={{ color: '#58a6ff', display: 'flex' }}><Globe size={15} /></span>
          <span className="floating-control-label" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: isDark ? '#e6edf3' : '#24292f', letterSpacing: '0.04em', fontWeight: 500 }}>
            {activeLangLabel}
          </span>
          <span className="floating-control-caret" style={{ color: '#8b949e', display: 'flex', marginLeft: '0.25rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
          </span>
        </button>
        {langOpen && (
          <div style={{ position: 'absolute', top: '100%', marginTop: '0.5rem', right: 0, borderRadius: '0.75rem', overflow: 'hidden', background: isDark ? 'rgba(22,27,34,0.92)' : 'rgba(255,255,255,0.92)', border: `1px solid ${isDark ? '#30363d' : '#d0d7de'}`, backdropFilter: 'blur(16px)', minWidth: '130px', zIndex: 60, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)', maxHeight: '300px', overflowY: 'auto' }}>
            <div style={{ padding: '0.375rem', display: 'flex', flexDirection: 'column' }}>
              {LANGS.map((l, i) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLocale(l.code);
                    setLangOpen(false);
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', cursor: 'pointer', background: l.code === locale ? (isDark ? 'rgba(88,166,255,0.15)' : 'rgba(9,105,218,0.1)') : 'transparent', border: 'none', borderRadius: '0.375rem', transition: 'background 0.2s' }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: l.code === locale ? '#58a6ff' : (isDark ? '#e6edf3' : '#24292f'), fontWeight: l.code === locale ? 600 : 500 }}>{l.label}</span>
                  {l.code === locale && <Check size={12} color="#58a6ff" style={{ marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MainContent({ baseUrl, isDark, onThemeToggle }: { baseUrl: string; isDark: boolean; onThemeToggle: () => void }) {
  const { t, locale, setLocale } = useProfileI18n();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeAcc = githubData[activeIndex];
  const { accent, accentB } = activeAcc;
  
  // Theme colors
  const c = isDark ? DARK_THEME : LIGHT_THEME;

  const dSets = dockSets.map(links => links.map(link => ({
    ...link,
    label: link.icon === 'blog' ? t('profile.blog') : link.icon === 'website' ? t('profile.website') : t('profile.github')
  })));
  
  const activeLinks = dSets[activeIndex];

  return (
    <>
      <FloatingButtons isDark={isDark} onThemeToggle={onThemeToggle} />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: c.bodyBg, transition: 'background 0.3s ease' }}></div>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${c.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${c.gridLine} 1px, transparent 1px)`, backgroundSize: '48px 48px', transition: 'background-image 0.3s ease' }}></div>
      <div id="glow-bg" aria-hidden="true" style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', width: '640px', height: '320px', background: `radial-gradient(ellipse at center, ${accent}0f 0%, transparent 70%)`, transition: 'background 0.4s ease' }}></div>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: '42rem', margin: '0 auto', padding: '5rem 1rem 12rem' }}>
        <header className="text-center mb-12">
          <div className="relative mb-6 flex justify-center">
            <div id="avatar-glow" aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', width: '96px', height: '96px', borderRadius: '50%', background: `radial-gradient(circle, ${accentB}40 0%, ${accent}20 50%, transparent 70%)`, transform: 'translate(-50%, -50%) scale(1.5)', filter: 'blur(14px)', transition: 'background 0.4s ease' }}></div>
            <div id="avatar-ring" style={{ position: 'relative', borderRadius: '50%', padding: '3px', background: `linear-gradient(135deg, ${accent} 0%, ${accentB} 50%, ${accent} 100%)`, display: 'inline-block', transition: 'background 0.4s ease' }}>
              <img src="https://github.com/shAdow-XJY.png?size=200" alt="shAdow-XJY avatar" width="96" height="96" loading="eager" style={{ display: 'block', width: '96px', height: '96px', borderRadius: '50%', background: c.cardBg1, objectFit: 'cover', position: 'relative', zIndex: 2, transition: 'background 0.3s' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: c.textPrimary, fontFamily: "'Outfit', sans-serif", margin: '0 0 0.5rem', transition: 'color 0.3s' }}>shAdow-XJY</h1>
          <p id="handle-text" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: accent, letterSpacing: '0.05em', margin: '0 0 1rem', transition: 'color 0.3s' }}>@shAdow-XJY</p>
          <p style={{ fontSize: '1rem', maxWidth: '20rem', lineHeight: 1.625, color: c.textMuted, margin: '0 auto', transition: 'color 0.3s' }}>
            {t('profile.developer')} <span id="brand-text" style={{ color: accentB, fontWeight: 600, transition: 'color 0.3s' }}>ShadowPlusing</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: c.textMuted, transition: 'color 0.3s' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" id="pin-icon" fill={accent} style={{ transition: 'fill 0.3s' }}/></svg>{t('profile.earth')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: c.textMuted, transition: 'color 0.3s' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" id="link-icon" stroke={accentB} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.3s' }}/></svg>shadowplusing.dev
            </span>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '100%', minWidth: 0, marginBottom: '2rem', padding: '0.25rem', borderRadius: '0.75rem', background: c.cardBg1, border: `1px solid ${c.cardBorder}`, overflowX: 'auto', transition: 'background 0.3s, border-color 0.3s' }}>
          {githubData.map((acc, index) => (
            <button 
              key={acc.handle}
              onClick={() => setActiveIndex(index)}
              style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.5rem', padding: '0.5rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.2s', border: 'none', cursor: 'pointer', background: index === activeIndex ? c.divider : 'transparent', color: index === activeIndex ? acc.accent : c.textMuted }}
            >
              {acc.type === 'personal' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
              )}
              {acc.handle}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: `0 0 0 1px ${c.cardBorder}, 0 8px 32px ${isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)'}`, transition: 'box-shadow 0.3s' }}>
            <img src={`${baseUrl.replace(/\/$/, '')}/images/${activeAcc.handle}-stats-streak-${isDark ? 'dark' : 'light'}.svg`} alt={`${activeAcc.handle} stats`} width="100%" style={{ display: 'block' }} />
          </div>
          <div style={{ borderRadius: '0.75rem', overflow: 'hidden', boxShadow: `0 0 0 1px ${c.cardBorder}, 0 8px 32px ${isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)'}`, transition: 'box-shadow 0.3s' }}>
            <img src={`${baseUrl.replace(/\/$/, '')}/images/${activeAcc.handle}-langs-${isDark ? 'dark' : 'light'}.svg`} alt={`${activeAcc.handle} stats`} width="100%" style={{ display: 'block' }} />
          </div>
        </div>

        {/* Floating Dock */}
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: isDark ? 'rgba(22,27,34,0.65)' : 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', border: `1px solid ${c.cardBorder}`, borderRadius: '1.25rem', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.24)' : '0 8px 32px rgba(0,0,0,0.12)', transition: 'all 0.3s' }}>
            {activeLinks.map(link => (
              <a 
                key={link.href}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="dock-item"
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: '50%', color: c.textMuted, transition: 'all 0.2s', outline: 'none' }}
              >
                {link.icon === 'website' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>}
                {link.icon === 'github' && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>}
                {link.icon === 'blog' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>}
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export function ProfileApp({ locale, baseUrl }: { locale: string; baseUrl: string }) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  React.useEffect(() => {
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <AppProviders locale={locale}>
      <MainContent baseUrl={baseUrl} isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
    </AppProviders>
  );
}
