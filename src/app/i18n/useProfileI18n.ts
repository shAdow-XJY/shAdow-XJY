import { useI18n } from '@shadow-xjy-website/web-common';
import type { ProfileTranslationKey } from './keys.generated';

export function useProfileI18n() {
  const i18n = useI18n();
  return {
    ...i18n,
    t: (key: ProfileTranslationKey | (string & {})) => i18n.t(key),
  };
}
