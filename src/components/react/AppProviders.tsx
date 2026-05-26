import { type ReactNode } from 'react';
import { XJYAppProvider } from '@shadow-xjy-website/web-common';
import type { SupportedLocale, LocaleSupport, LocaleLoader } from '@shadow-xjy-website/web-common';

const rootLocaleLoaders = {
  'en-US':   () => import('../../app/i18n/locales/en-US.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'zh-Hans': () => import('../../app/i18n/locales/zh-Hans.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'ja-JP':   () => import('../../app/i18n/locales/ja-JP.json').then((m) => m.default) as ReturnType<LocaleLoader>,
} satisfies Partial<Record<SupportedLocale, LocaleLoader>>;

const LOCALE_MAP: Record<string, SupportedLocale> = {
  'en': 'en-US',
  'zh': 'zh-Hans',
  'ja': 'ja-JP',
};

const ROOT_LOCALE_SUPPORT: LocaleSupport = {
  isSupportEN:     true,
  isSupportZHHans: true,
  isSupportJA:     true,
  // others disabled
  isSupportZHHant: false,
  isSupportAR:     false,
  isSupportNL:     false,
  isSupportRU:     false,
  isSupportBG:     false,
  isSupportDE:     false,
  isSupportFR:     false,
  isSupportID:     false,
  isSupportPTBR:   false,
  isSupportFI:     false,
  isSupportSV:     false,
  isSupportKO:     false,
};

export function AppProviders({ locale, children }: { locale: string; children: ReactNode }) {
  const commonLocale = LOCALE_MAP[locale] ?? 'en-US';
  return (
    <XJYAppProvider
      initialLocale={commonLocale}
      localeSupport={ROOT_LOCALE_SUPPORT}
      localeLoaders={rootLocaleLoaders}
    >
      {children}
    </XJYAppProvider>
  );
}
