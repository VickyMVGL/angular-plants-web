import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/* --- restore theme (palette + typography) from localStorage before app bootstrap --- */
(function restoreSavedTheme() {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const rootStyle = document.documentElement && document.documentElement.style;
    if (!rootStyle) return;

    // restore palette into :root (existing)
    const palRaw = localStorage.getItem('active_palette');
    let pal: any = null;
    if (palRaw) {
      try {
        pal = JSON.parse(palRaw);
        if (pal.primary) rootStyle.setProperty('--color-primary', pal.primary);
        if (pal.secondary) rootStyle.setProperty('--color-secondary', pal.secondary);
        if (pal.text1) rootStyle.setProperty('--color-text-1', pal.text1);
        if (pal.text2) rootStyle.setProperty('--color-text-2', pal.text2);
        if (pal.bg) rootStyle.setProperty('--color-bg', pal.bg);
      } catch (e) {
        /* invalid palette JSON - ignore */
      }
    }

    // restore typography into :root (existing)
    const typoRaw = localStorage.getItem('active_typography');
    let ty: any = null;
    if (typoRaw) {
      try {
        ty = JSON.parse(typoRaw);
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

    // Inject a small early style that applies saved vars directly to .preview-root
    // This avoids the flash where the component's scoped defaults briefly take effect.
    try {
      let previewCss = '';
      if (pal) {
        previewCss += `.preview-root{`;
        if (pal.primary) previewCss += `--color-primary:${pal.primary};`;
        if (pal.secondary) previewCss += `--color-secondary:${pal.secondary};`;
        if (pal.text1) previewCss += `--color-text-1:${pal.text1};`;
        if (pal.text2) previewCss += `--color-text-2:${pal.text2};`;
        if (pal.bg) previewCss += `--color-bg:${pal.bg};`;
        previewCss += `}`;
      }
      if (ty) {
        previewCss += `.preview-root{`;
        if (ty.titleFont) previewCss += `--title-font:${ty.titleFont};`;
        if (ty.textFont) previewCss += `--text-font:${ty.textFont};`;
        if (ty.titleSize !== undefined && ty.titleSize !== null)
          previewCss += `--title-size:${
            typeof ty.titleSize === 'number' ? ty.titleSize + 'px' : ty.titleSize
          };`;
        if (ty.subtitleSize !== undefined && ty.subtitleSize !== null)
          previewCss += `--subtitle-size:${
            typeof ty.subtitleSize === 'number' ? ty.subtitleSize + 'px' : ty.subtitleSize
          };`;
        if (ty.textSize !== undefined && ty.textSize !== null)
          previewCss += `--text-size:${
            typeof ty.textSize === 'number' ? ty.textSize + 'px' : ty.textSize
          };`;
        previewCss += `}`;
      }
      if (previewCss) {
        const el = document.createElement('style');
        el.id = 'saved-preview-vars';
        el.appendChild(document.createTextNode(previewCss));
        document.head.appendChild(el);
      }
    } catch (e) {
      /* ignore */
    }

    // Restore uploaded fonts (if any) so @font-face exists before Angular mounts
    try {
      const uploadedRaw = localStorage.getItem('uploaded_fonts');
      if (uploadedRaw) {
        const uploaded = JSON.parse(uploadedRaw) as Array<any>;
        if (uploaded && uploaded.length) {
          const s = document.createElement('style');
          s.id = 'restored-uploaded-fonts';
          let css = '';
          uploaded.forEach((f) => {
            if (f && f.family && f.dataUrl) {
              const fmt = f.fmt || 'truetype';
              css += `
                @font-face {
                  font-family: "${f.family}";
                  src: url("${f.dataUrl}") format("${fmt}");
                  font-weight: normal;
                  font-style: normal;
                  font-display: swap;
                }
              `;
            }
          });
          if (css) {
            s.appendChild(document.createTextNode(css));
            document.head.appendChild(s);
          }
        }
      }
    } catch (e) {
      /* ignore */
    }
  } catch (e) {
    /* ignore */
  }
})();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
