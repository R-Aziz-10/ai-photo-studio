import { ALLOW_CUSTOM_PROMPTS } from './constants';
import { CUSTOM_THEME_ID } from './themes';
import type { Theme } from './themes';
import type { Accessory } from './accessories';
import { MAX_ACCESSORY_LEN, MAX_THEME_LEN, cleanText, isBlocked } from './safety';

const SAFE_SUFFIX =
  'Keep it creative, tasteful and family-friendly, suitable for all ages, with the person fully and modestly dressed.';

/** Kembalikan pesan error jika input kustom tidak valid, atau null jika aman. */
export function validateCustomInputs(themeId: string, customTheme: string, extraAccessory: string): string | null {
  if (!ALLOW_CUSTOM_PROMPTS) return null;

  const theme = cleanText(customTheme, MAX_THEME_LEN);
  const extra = cleanText(extraAccessory, MAX_ACCESSORY_LEN);

  if (themeId === CUSTOM_THEME_ID && !theme) return 'Tulis dulu ide tema kustom Anda, atau pilih salah satu tema yang tersedia.';
  if (isBlocked(theme) || isBlocked(extra)) {
    return 'Teks Anda memuat kata yang tidak diperbolehkan. Silakan ganti dengan ide lain yang ramah untuk semua usia.';
  }
  return null;
}

type Args = {
  theme: Theme | null; // null jika memakai tema kustom
  themeId: string;
  accessory: Accessory;
  customTheme: string;
  extraAccessory: string;
  facePrompt: string;
};

/** Susun prompt akhir yang dikirim ke AI. */
export function composePrompt({ theme, themeId, accessory, customTheme, extraAccessory, facePrompt }: Args): string {
  const parts: string[] = [];

  if (themeId === CUSTOM_THEME_ID && ALLOW_CUSTOM_PROMPTS) {
    const text = cleanText(customTheme, MAX_THEME_LEN);
    parts.push(`Transform the photo into this scene and style requested by the visitor: '${text}'. ${SAFE_SUFFIX}`);
  } else if (theme) {
    parts.push(theme.prompt);
  }

  if (accessory.promptHint) parts.push(accessory.promptHint);

  const extra = ALLOW_CUSTOM_PROMPTS ? cleanText(extraAccessory, MAX_ACCESSORY_LEN) : '';
  if (extra) {
    parts.push(`Also add this to the person, clearly visible and naturally integrated: '${extra}'. Keep it family-friendly.`);
  }

  parts.push(facePrompt, 'High quality, detailed studio result.');
  return parts.join(' ');
}
