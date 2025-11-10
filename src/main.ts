import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/* --- restore theme (palette + typography) from localStorage before app bootstrap --- */
(function restoreSavedTheme() {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const rootStyle = document.documentElement && document.documentElement.style;
    if (!rootStyle) return;

    const palRaw = localStorage.getItem('active_palette');
    if (palRaw) {
      try {
        const pal = JSON.parse(palRaw);
        if (pal.primary) rootStyle.setProperty('--color-primary', pal.primary);
        if (pal.secondary) rootStyle.setProperty('--color-secondary', pal.secondary);
        if (pal.text1) rootStyle.setProperty('--color-text-1', pal.text1);
        if (pal.text2) rootStyle.setProperty('--color-text-2', pal.text2);
        if (pal.bg) rootStyle.setProperty('--color-bg', pal.bg);
      } catch (e) {
        /* invalid palette JSON - ignore */
      }
    }

    const typoRaw = localStorage.getItem('active_typography');
    if (typoRaw) {
      try {
        const ty = JSON.parse(typoRaw);
        if (ty.titleFont) rootStyle.setProperty('--title-font', ty.titleFont);
        if (ty.textFont) rootStyle.setProperty('--text-font', ty.textFont);
        if (ty.titleSize !== undefined && ty.titleSize !== null) {
          const v = String(ty.titleSize);
          rootStyle.setProperty('--title-size', /^\d+$/.test(v) ? `${v}px` : v);
        }
        if (ty.subtitleSize !== undefined && ty.subtitleSize !== null) {
          const v = String(ty.subtitleSize);
          rootStyle.setProperty('--subtitle-size', /^\d+$/.test(v) ? `${v}px` : v);
        }
        if (ty.textSize !== undefined && ty.textSize !== null) {
          const v = String(ty.textSize);
          rootStyle.setProperty('--text-size', /^\d+$/.test(v) ? `${v}px` : v);
        }
      } catch (e) {
        /* invalid typography JSON - ignore */
      }
    }
  } catch (e) {
    /* non-browser environment - ignore */
  }
})();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
