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

// ─── FACE SVG STRUCTURE ───

describe('Face SVG elements', () => {
  it('has the face container', () => {
    expect(doc.querySelector('.face-container')).not.toBeNull();
  });

  it('has face SVG with viewBox', () => {
    const svg = doc.querySelector('.face-svg');
    expect(svg, 'Missing .face-svg').not.toBeNull();
  });

  it('has left and right eye irises and pupils', () => {
    expect(doc.getElementById('leftIris'), 'Missing #leftIris').not.toBeNull();
    expect(doc.getElementById('leftPupil'), 'Missing #leftPupil').not.toBeNull();
    expect(doc.getElementById('rightIris'), 'Missing #rightIris').not.toBeNull();
    expect(doc.getElementById('rightPupil'), 'Missing #rightPupil').not.toBeNull();
  });

  it('has eye beam lines', () => {
    expect(doc.getElementById('leftBeam'), 'Missing #leftBeam').not.toBeNull();
    expect(doc.getElementById('rightBeam'), 'Missing #rightBeam').not.toBeNull();
  });

  it('has mouth elements for animation', () => {
    expect(doc.getElementById('faceMouth'), 'Missing #faceMouth').not.toBeNull();
    expect(doc.getElementById('faceMouthLower'), 'Missing #faceMouthLower').not.toBeNull();
    expect(doc.getElementById('mouthInterior'), 'Missing #mouthInterior').not.toBeNull();
  });

  it('has enhanced mouth elements (teeth, tongue, glow)', () => {
    expect(doc.getElementById('mouthGlow'), 'Missing #mouthGlow').not.toBeNull();
    expect(doc.getElementById('mouthTeethUpper'), 'Missing #mouthTeethUpper').not.toBeNull();
    expect(doc.getElementById('mouthTongue'), 'Missing #mouthTongue').not.toBeNull();
    expect(doc.getElementById('lowerLipCurve'), 'Missing #lowerLipCurve').not.toBeNull();
  });

  it('has mouth glow gradient defined in SVG defs', () => {
    expect(doc.getElementById('mouthGlowGrad'), 'Missing #mouthGlowGrad gradient').not.toBeNull();
  });
});

// ─── SPEECH BUBBLE ───

describe('Speech bubble', () => {
  it('has the speech bubble element', () => {
    expect(doc.getElementById('faceSpeech')).not.toBeNull();
  });

  it('has text and author spans', () => {
    expect(doc.getElementById('faceSpeechText')).not.toBeNull();
    expect(doc.getElementById('faceSpeechAuthor')).not.toBeNull();
  });

  it('has CSS for speech bubble visibility toggle', () => {
    expect(styleContent).toContain('.face-speech');
    expect(styleContent).toContain('.face-speech.visible');
  });

  it('has CSS for the speech bubble tail (::after)', () => {
    expect(styleContent).toContain('.face-speech::after');
  });
});

// ─── TIMED MESSAGES ───

describe('Timed welcome messages', () => {
  it('has the 5-second CV message', () => {
    expect(scriptContent).toContain("showCustomSpeech('Scroll naar onderen voor mijn CV'");
  });

  it('has the 25-second theme hint message', () => {
    expect(scriptContent).toContain("showCustomSpeech('Klik linksbovenin voor een theme'");
  });

  it('has the 70-second canvas surprise message', () => {
    expect(scriptContent).toContain("showCustomSpeech('Scroll naar het canvas bovenin en klik daar een paar keer voor een verrassing'");
  });

  it('messages are scheduled at correct intervals', () => {
    expect(scriptContent).toMatch(/setTimeout\(\(\)\s*=>\s*\{\s*showCustomSpeech\('Scroll naar onderen[^}]+\},\s*5000\)/);
    expect(scriptContent).toMatch(/setTimeout\(\(\)\s*=>\s*\{\s*showCustomSpeech\('Klik linksbovenin[^}]+\},\s*25000\)/);
    expect(scriptContent).toMatch(/setTimeout\(\(\)\s*=>\s*\{\s*showCustomSpeech\('Scroll naar het canvas[^}]+\},\s*70000\)/);
  });
});

// ─── SPEECH SYSTEM FUNCTIONS ───

describe('Speech system functions', () => {
  it('defines triggerTalk function', () => {
    expect(scriptContent).toMatch(/function\s+triggerTalk\s*\(/);
  });

  it('defines showCustomSpeech function', () => {
    expect(scriptContent).toMatch(/function\s+showCustomSpeech\s*\(/);
  });

  it('has cyber security quotes array', () => {
    expect(scriptContent).toContain('cyberQuotes');
    // Verify at least 10 quotes exist
    const quoteMatches = scriptContent.match(/\{\s*text:\s*"/g);
    expect(quoteMatches.length).toBeGreaterThanOrEqual(10);
  });
});

// ─── NAVIGATION ───

describe('Navigation', () => {
  it('has main nav element', () => {
    expect(doc.getElementById('mainNav')).not.toBeNull();
  });

  it('has mobile hamburger menu', () => {
    expect(doc.getElementById('navHamburger')).not.toBeNull();
    expect(doc.getElementById('navMobile')).not.toBeNull();
  });

  it('hamburger has onclick for toggleMobileNav', () => {
    const hamburger = doc.getElementById('navHamburger');
    expect(hamburger.getAttribute('onclick')).toBe('toggleMobileNav()');
  });

  it('defines toggleMobileNav and closeMobileNav in JS', () => {
    expect(scriptContent).toMatch(/function\s+toggleMobileNav\s*\(/);
    expect(scriptContent).toMatch(/function\s+closeMobileNav\s*\(/);
  });
});

// ─── CONTENT SECTIONS ───

describe('About section', () => {
  it('has stat cards with numeric targets', () => {
    const statCards = doc.querySelectorAll('.stat-card');
    expect(statCards.length).toBeGreaterThanOrEqual(3);
  });

  it('each stat card has a data-target number', () => {
    const statNums = doc.querySelectorAll('.stat-number[data-target]');
    expect(statNums.length).toBeGreaterThanOrEqual(3);
    statNums.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'));
      expect(target).toBeGreaterThan(0);
    });
  });
});

describe('Skills section', () => {
  it('has skill cards', () => {
    const cards = doc.querySelectorAll('.skill-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('skill bars have data-width percentages', () => {
    const bars = doc.querySelectorAll('.skill-bar-fill[data-width]');
    expect(bars.length).toBeGreaterThanOrEqual(5);
    bars.forEach((bar) => {
      const width = parseInt(bar.getAttribute('data-width'));
      expect(width).toBeGreaterThanOrEqual(0);
      expect(width).toBeLessThanOrEqual(100);
    });
  });
});

describe('Experience section', () => {
  it('has timeline items', () => {
    const items = doc.querySelectorAll('.timeline-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it('each timeline item has a date', () => {
    const dates = doc.querySelectorAll('.timeline-date');
    expect(dates.length).toBeGreaterThanOrEqual(2);
    dates.forEach((d) => {
      expect(d.textContent.trim().length).toBeGreaterThan(0);
    });
  });
});

describe('Projects section', () => {
  it('has project cards', () => {
    const cards = doc.querySelectorAll('.project-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  it('each project card has a data-project attribute', () => {
    const cards = doc.querySelectorAll('.project-card[data-project]');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Contact section', () => {
  it('has contact links', () => {
    const links = doc.querySelectorAll('.contact-link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('has at least one mailto link', () => {
    const mailLinks = doc.querySelectorAll('.contact-link[href^="mailto:"]');
    expect(mailLinks.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── META & HEAD ───

describe('HTML head', () => {
  it('has charset meta tag', () => {
    const meta = doc.querySelector('meta[charset]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('charset').toLowerCase()).toBe('utf-8');
  });

  it('has viewport meta tag', () => {
    const meta = doc.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toContain('width=device-width');
  });

  it('has lang attribute on html element', () => {
    expect(doc.documentElement.getAttribute('lang')).toBeTruthy();
  });
});

// ─── RESPONSIVE CSS ───

describe('Responsive design', () => {
  it('has mobile breakpoint at 768px', () => {
    expect(styleContent).toContain('@media (max-width: 768px)');
  });

  it('has small phone breakpoint at 420px', () => {
    expect(styleContent).toContain('@media (max-width: 420px)');
  });

  it('has responsive canvas sizing for object canvases', () => {
    // Object canvases should get resized on mobile
    expect(styleContent).toMatch(/@media\s*\(max-width:\s*768px\)\s*\{[^}]*ObjCanvas/);
  });
});

// ─── CSS FUNDAMENTALS ───

describe('CSS fundamentals', () => {
  it('resets box-sizing to border-box', () => {
    expect(styleContent).toContain('box-sizing: border-box');
  });

  it('uses smooth scroll behavior', () => {
    expect(styleContent).toContain('scroll-behavior: smooth');
  });

  it('hides overflow-x on body', () => {
    expect(styleContent).toContain('overflow-x: hidden');
  });

  it('imports Inter and Space Grotesk fonts', () => {
    expect(styleContent).toContain('Inter');
    expect(styleContent).toContain('Space Grotesk');
  });
});

// ─── LASER SYSTEM ───

describe('Laser system', () => {
  it('defines LaserBeam class', () => {
    expect(scriptContent).toMatch(/class\s+LaserBeam/);
  });

  it('defines Spark class', () => {
    expect(scriptContent).toMatch(/class\s+Spark/);
  });

  it('defines fireLaser function', () => {
    expect(scriptContent).toMatch(/function\s+fireLaser\s*\(/);
  });

  it('defines animateLasers function', () => {
    expect(scriptContent).toMatch(/function\s+animateLasers\s*\(/);
  });

  it('has a laser overlay canvas', () => {
    expect(scriptContent).toContain('laserCanvas');
  });
});

// ─── EYE TRACKING ───

describe('Eye tracking', () => {
  it('defines updateEyes function', () => {
    expect(scriptContent).toMatch(/function\s+updateEyes\s*\(/);
  });

  it('references all eye SVG elements in JS', () => {
    expect(scriptContent).toContain("getElementById('leftIris')");
    expect(scriptContent).toContain("getElementById('rightIris')");
    expect(scriptContent).toContain("getElementById('leftPupil')");
    expect(scriptContent).toContain("getElementById('rightPupil')");
  });
});
