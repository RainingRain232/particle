import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const html = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

// All theme names (lowercase key used in CSS classes and JS variables)
const THEMES = [
  'pyramid', 'matrix', 'synth', 'frost', 'void', 'inferno', 'abyss',
  'glitch', 'storm', 'sakura', 'neon', 'aurora', 'jungle', 'pixel',
  'cosmic', 'steam', 'toxic', 'coral', 'haboob', 'eclipse', 'circuit',
  'glacier', 'holo', 'wildfire', 'moonlit', 'quantum', 'monsoon',
  'ember', 'prism', 'midnight', 'plasma', 'zen', 'nebula', 'copper',
  'biolum', 'dust', 'pulse', 'vapor',
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Extract CSS and JS content from raw HTML (no script execution needed)
const styleContent = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
const scriptContent = (html.match(/<script>([\s\S]*?)<\/script>/) || [])[1] || '';

// Parse DOM without executing scripts (avoids canvas getContext crash)
let doc;
beforeAll(() => {
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  doc = dom.window.document;
});

// ─── HTML STRUCTURE ───

describe('Page structure', () => {
  it('has correct title', () => {
    expect(doc.title).toContain('Portfolio');
  });

  it('has all required sections', () => {
    for (const id of ['hero', 'about', 'skills', 'experience', 'projects', 'contact']) {
      expect(doc.getElementById(id), `Missing section #${id}`).not.toBeNull();
    }
  });

  it('has navigation links', () => {
    const navLinks = doc.querySelectorAll('.nav-links a[href]');
    expect(navLinks.length).toBeGreaterThanOrEqual(4);
  });

  it('has scroll progress bar', () => {
    expect(doc.getElementById('scrollProgress')).not.toBeNull();
  });

  it('has cursor elements', () => {
    expect(doc.querySelector('.cursor-dot')).not.toBeNull();
    expect(doc.querySelector('.cursor-ring')).not.toBeNull();
  });

  it('has glow orbs 1-4', () => {
    for (let i = 1; i <= 4; i++) {
      expect(doc.querySelector(`.glow-orb-${i}`), `Missing .glow-orb-${i}`).not.toBeNull();
    }
  });
});

// ─── THEME DROPDOWN ───

describe('Theme dropdown', () => {
  it('has dropdown toggle and menu', () => {
    expect(doc.getElementById('themeDropdownToggle')).not.toBeNull();
    expect(doc.getElementById('themeDropdownMenu')).not.toBeNull();
  });

  it('has a toggle button for every theme', () => {
    for (const theme of THEMES) {
      const btn = doc.getElementById(`${theme}Toggle`);
      expect(btn, `Missing #${theme}Toggle`).not.toBeNull();
      expect(btn.tagName).toBe('BUTTON');
    }
  });

  it('each toggle button onclick calls the correct function', () => {
    for (const theme of THEMES) {
      const btn = doc.getElementById(`${theme}Toggle`);
      const onclick = btn.getAttribute('onclick');
      expect(onclick, `#${theme}Toggle wrong onclick`).toBe(`toggle${capitalize(theme)}Theme()`);
    }
  });

  it('each toggle button has a label span and SVG icon', () => {
    for (const theme of THEMES) {
      const btn = doc.getElementById(`${theme}Toggle`);
      expect(btn.querySelector('span'), `#${theme}Toggle missing label`).not.toBeNull();
      expect(btn.querySelector('span').textContent.trim().length).toBeGreaterThan(0);
      expect(btn.querySelector('svg'), `#${theme}Toggle missing SVG`).not.toBeNull();
    }
  });
});

// ─── CSS THEME DEFINITIONS ───

describe('CSS theme definitions', () => {
  it('has CSS class for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent).toContain(`body.${theme}-theme`);
    }
  });

  it('defines --accent-1 for every theme', () => {
    for (const theme of THEMES) {
      const regex = new RegExp(`body\\.${theme}-theme\\s*\\{[^}]*--accent-1:`);
      expect(styleContent, `Missing --accent-1 for ${theme}`).toMatch(regex);
    }
  });

  it('has cursor-dot styling for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent, `Missing cursor-dot for ${theme}`).toContain(`body.${theme}-theme .cursor-dot`);
    }
  });

  it('has scroll-progress styling for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent, `Missing scroll-progress for ${theme}`).toContain(`body.${theme}-theme .scroll-progress`);
    }
  });

  it('has hero h1 gradient for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent, `Missing hero h1 for ${theme}`).toContain(`body.${theme}-theme .hero-content h1`);
    }
  });

  it('has nav-logo styling for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent, `Missing nav-logo for ${theme}`).toContain(`body.${theme}-theme .nav-logo`);
    }
  });

  it('has glow-orb overrides for every theme', () => {
    for (const theme of THEMES) {
      expect(styleContent, `Missing glow-orb for ${theme}`).toContain(`body.${theme}-theme .glow-orb-1`);
    }
  });
});

// ─── CANVAS ELEMENTS ───

describe('Canvas elements', () => {
  const canvasThemes = [
    'sakura', 'neon', 'aurora', 'jungle', 'pixel', 'cosmic', 'steam',
    'toxic', 'coral', 'haboob', 'eclipse', 'circuit', 'glacier', 'holo',
    'wildfire', 'moonlit', 'quantum', 'monsoon', 'ember', 'prism',
    'midnight', 'plasma', 'zen', 'nebula', 'copper', 'biolum', 'dust',
    'pulse', 'vapor',
  ];

  it('has background and object canvases for standard themes', () => {
    for (const theme of canvasThemes) {
      expect(doc.getElementById(`${theme}Canvas`), `Missing #${theme}Canvas`).not.toBeNull();
      expect(doc.getElementById(`${theme}ObjCanvas`), `Missing #${theme}ObjCanvas`).not.toBeNull();
    }
  });

  it('has canvases for early themes', () => {
    const earlyCanvases = [
      'pyramidCanvas', 'sandCanvas',
      'matrixRainCanvas', 'neoFaceCanvas',
      'synthGridCanvas', 'synthSunCanvas', 'synthBikeCanvas',
      'snowCanvas', 'frostCrystalCanvas',
      'voidCanvas', 'voidObjCanvas',
      'infernoCanvas', 'infernoObjCanvas',
      'abyssCanvas', 'abyssObjCanvas',
      'glitchCanvas', 'glitchObjCanvas',
      'stormCanvas', 'stormObjCanvas',
    ];
    for (const id of earlyCanvases) {
      expect(doc.getElementById(id), `Missing #${id}`).not.toBeNull();
    }
  });
});

// ─── CANVAS CSS RULES ───

describe('Canvas CSS rules', () => {
  const batchThemes = ['nebula', 'copper', 'biolum', 'dust', 'pulse', 'vapor'];

  it('has positioning and visibility rules for batch canvases', () => {
    for (const theme of batchThemes) {
      expect(styleContent, `Missing #${theme}Canvas.visible`).toContain(`#${theme}Canvas.visible`);
      expect(styleContent, `Missing #${theme}ObjCanvas.visible`).toContain(`#${theme}ObjCanvas.visible`);
    }
  });
});

// ─── ROOT CSS VARIABLES ───

describe('Root CSS variables', () => {
  it('defines all required custom properties in :root', () => {
    for (const v of ['--bg-primary', '--accent-1', '--accent-2', '--accent-3', '--accent-4',
      '--text-primary', '--text-secondary', '--glass-bg', '--glass-border']) {
      expect(styleContent).toContain(`${v}:`);
    }
  });
});

// ─── JAVASCRIPT THEME LOGIC (parsed from raw source) ───

describe('JavaScript toggle functions', () => {
  it('defines a toggle function for every theme', () => {
    for (const theme of THEMES) {
      const fnName = `toggle${capitalize(theme)}Theme`;
      const regex = new RegExp(`function\\s+${fnName}\\s*\\(`);
      expect(scriptContent, `Missing function ${fnName}`).toMatch(regex);
    }
  });

  it('declares active state variable for every theme', () => {
    for (const theme of THEMES) {
      expect(scriptContent, `Missing ${theme}Active declaration`).toContain(`${theme}Active`);
    }
  });

  it('defines deactivateAllThemesExcept function', () => {
    expect(scriptContent).toContain('function deactivateAllThemesExcept');
  });

  it('deactivateAllThemesExcept handles every theme', () => {
    const fnStart = scriptContent.indexOf('function deactivateAllThemesExcept');
    let depth = 0, fnEnd = fnStart;
    for (let i = fnStart; i < scriptContent.length; i++) {
      if (scriptContent[i] === '{') depth++;
      if (scriptContent[i] === '}') { depth--; if (depth === 0) { fnEnd = i; break; } }
    }
    const fnBody = scriptContent.slice(fnStart, fnEnd + 1);
    for (const theme of THEMES) {
      expect(fnBody, `deactivateAllThemesExcept missing '${theme}'`).toContain(`'${theme}'`);
    }
  });

  it('each toggle integrates mutual exclusivity', () => {
    for (const theme of THEMES) {
      // Two patterns exist: external wrapper (_orig{Theme}Toggle2) or inline call
      const hasWrapper = scriptContent.includes(`_orig${capitalize(theme)}Toggle2`);
      const hasInlineCall = scriptContent.includes(
        `deactivateAllThemesExcept('${theme}')`
      );
      expect(
        hasWrapper || hasInlineCall,
        `${theme} toggle missing mutual exclusivity (no wrapper or inline deactivateAllThemesExcept)`
      ).toBe(true);
    }
  });
});

// ─── THEME ANIMATION FUNCTIONS ───

describe('Theme animation functions', () => {
  it('has at least one start function for every theme', () => {
    for (const theme of THEMES) {
      const cap = capitalize(theme);
      // Different naming conventions: start{Theme}(), start{Theme}Bg(), start{Theme}Sand(), etc.
      const regex = new RegExp(`function\\s+start${cap}[A-Za-z]*\\s*\\(`);
      expect(scriptContent, `Missing animation start function for ${theme}`).toMatch(regex);
    }
  });
});

// ─── THEME COUNT ───

describe('Theme inventory', () => {
  it(`has exactly ${THEMES.length} theme toggle buttons`, () => {
    const menu = doc.getElementById('themeDropdownMenu');
    const buttons = menu.querySelectorAll('button.nav-logo-item');
    expect(buttons.length).toBe(THEMES.length);
  });

  it('THEMES list matches actual buttons in DOM', () => {
    const menu = doc.getElementById('themeDropdownMenu');
    const buttons = menu.querySelectorAll('button.nav-logo-item');
    const domThemeIds = Array.from(buttons).map((b) => b.id.replace('Toggle', ''));
    expect(domThemeIds.sort()).toEqual([...THEMES].sort());
  });
});
