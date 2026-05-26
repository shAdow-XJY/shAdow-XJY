import { type ReactNode } from 'react';
import { XJYAppProvider } from '@shadow-xjy-website/web-common';
import type { SupportedLocale, LocaleSupport, LocaleLoader } from '@shadow-xjy-website/web-common';

const rootLocaleLoaders = {
  'en-US':   () => import('../../app/i18n/locales/en-US.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'zh-Hans': () => import('../../app/i18n/locales/zh-Hans.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'zh-Hant': () => import('../../app/i18n/locales/zh-Hant.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'ar-SA':   () => import('../../app/i18n/locales/ar-SA.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'nl-NL':   () => import('../../app/i18n/locales/nl-NL.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'ru-RU':   () => import('../../app/i18n/locales/ru-RU.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'bg-BG':   () => import('../../app/i18n/locales/bg-BG.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'de-DE':   () => import('../../app/i18n/locales/de-DE.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'fr-FR':   () => import('../../app/i18n/locales/fr-FR.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'id-ID':   () => import('../../app/i18n/locales/id-ID.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'pt-BR':   () => import('../../app/i18n/locales/pt-BR.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'fi-FI':   () => import('../../app/i18n/locales/fi-FI.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'sv-SE':   () => import('../../app/i18n/locales/sv-SE.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'ja-JP':   () => import('../../app/i18n/locales/ja-JP.json').then((m) => m.default) as ReturnType<LocaleLoader>,
  'ko-KR':   () => import('../../app/i18n/locales/ko-KR.json').then((m) => m.default) as ReturnType<LocaleLoader>,
} satisfies Partial<Record<SupportedLocale, LocaleLoader>>;

const LOCALE_MAP: Record<string, SupportedLocale> = {
  'en': 'en-US',
  'zh': 'zh-Hans',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'zh-hant': 'zh-Hant',
  'ar': 'ar-SA',
  'nl': 'nl-NL',
  'ru': 'ru-RU',
  'bg': 'bg-BG',
  'de': 'de-DE',
  'fr': 'fr-FR',
  'id': 'id-ID',
  'pt-br': 'pt-BR',
  'fi': 'fi-FI',
  'sv': 'sv-SE',
};

const ROOT_LOCALE_SUPPORT: LocaleSupport = {
  isSupportEN:     true,
  isSupportZHHans: true,
  isSupportZHHant: true,
  isSupportJA:     true,
  isSupportAR:     true,
  isSupportNL:     true,
  isSupportRU:     true,
  isSupportBG:     true,
  isSupportDE:     true,
  isSupportFR:     true,
  isSupportID:     true,
  isSupportPTBR:   true,
  isSupportFI:     true,
  isSupportSV:     true,
  isSupportKO:     true,
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
