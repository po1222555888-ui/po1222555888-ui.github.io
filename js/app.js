/* =============================================
   Project Data  (detail-page content, no size)
   ============================================= */
const projects = [
  {
    id: 1,
    slug: 'gongdi',
    name: '工地計畫',
    subtitle: '勤美工家 2.0 · Kong Ke 2.0',
    category: 'Social Design',
    year: '2022.10',
    client: '勤美璞真文化藝術基金會',
    scope: 'Social Design, Infographic, Exhibition',
    bg: '#D4CDB5',
    meta: [
      { label: '主辦單位', value: '勤美璞真文化藝術基金會' },
      { label: '策劃設計', value: '水越設計' },
      { label: '專案管理', value: '張耀中' },
      { label: '日期',     value: '2022.10' },
      { label: '類別',     value: 'Social Design' },
    ],
    desc: '「工家2.0」以設計思維導入，邀請大家一起走入工地，探索工程基地裡的各種議題與可能性。期待透過不同面向和田調觀察，理解工地管理的現況，並深入進行空間的細節思考，激盪出其他觀點。透過實地田調，了解台灣工地現存的問題脈絡，以及因應工地文化，重新看待工地的現況印象，並未來發展公共議題為工家2.0計畫主軸。',
  },
  {
    id: 2,
    slug: 'taitung',
    name: '台東食育提案所',
    subtitle: 'Taitung Food Education',
    category: 'Exhibition',
    year: '2022.02',
    client: '台東縣政府 × 知本老爺酒店',
    scope: 'Exhibition Design, Publication, Workshop',
    bg: '#7A9070',
    meta: [
      { label: '客戶',   value: '台東縣政府' },
      { label: '合作',   value: '知本老爺酒店' },
      { label: '專案管理', value: '張耀中' },
      { label: '日期',   value: '2022.02' },
      { label: '類別',   value: 'Exhibition' },
    ],
    desc: '台東食育提案所結合展覽設計、出版品與社區工作坊，推廣台東在地飲食文化與農業教育。計畫以「美味食旅」為主軸，引導訪客深入認識台東的飲食生態，透過展覽、書籍與工作坊保存台東飲食的文化記憶。',
  },
  {
    id: 3,
    slug: 'dienmei',
    name: '電美',
    subtitle: '台灣設計展 · Taiwan Design Expo 2020',
    category: 'Exhibition',
    year: '2020',
    client: '台灣設計展',
    scope: 'Spatial Design, Exhibition Design',
    bg: '#5A6A58',
    meta: [
      { label: '客戶',     value: '台灣設計展' },
      { label: '策劃設計', value: '水越設計' },
      { label: '專案管理', value: '張耀中' },
      { label: '日期',     value: '2020' },
      { label: '類別',     value: 'Exhibition' },
    ],
    desc: '電美展館是 2020 台灣設計展的核心裝置，以半透明金屬結構探索工業美學與自然環境的對話。展館邀請訪客重新審視日常基礎建設中隱藏的美學秩序，在白天與夜晚呈現截然不同的空間感受。',
  },
  {
    id: 4,
    slug: 'our-land',
    name: '斯土斯民‧臺灣的故事',
    subtitle: 'Our Land, Our People — The Story of Taiwan',
    category: 'Publish',
    year: '2022.01',
    client: '國立臺灣博物館',
    scope: 'Publication Design, Editorial Design',
    bg: '#C8B888',
    meta: [
      { label: '客戶',   value: '國立臺灣博物館' },
      { label: '設計',   value: '水越設計' },
      { label: '專案',   value: '張耀中' },
      { label: '日期',   value: '2022.01' },
      { label: '語言',   value: '繁中 · 日文 · 英文' },
    ],
    desc: '《斯土斯民‧臺灣的故事》是國立臺灣博物館常設展覽的多語導覽手冊，以繁體中文、日文、英文三種語言同步出版。設計以台灣地形輪廓為核心圖像，在暖色系書衣上呈現金色燙印細節，三種版本各自針對閱讀習慣進行編排微調。',
  },
  {
    id: 5,
    slug: 'peca',
    name: 'Peca',
    subtitle: '多功能寵物購物推車 · Multifunctional Pet Cart',
    category: 'Product',
    year: '2021',
    client: 'Personal Project',
    scope: 'Product Design, Industrial Design',
    bg: '#C9AEB5',
    meta: [
      { label: '類別',   value: 'Product Design' },
      { label: '日期',   value: '2021' },
      { label: '得獎',   value: '金點新秀獎 入圍' },
      { label: '得獎',   value: '放視大賞 入圍' },
    ],
    desc: 'Peca 是一款專為都市寵物飼主設計的多功能購物推車，整合購物機能與寵物舒適乘坐體驗。從市場研究出發，歷經多次使用者測試與原型修訂，以簡潔的結構語言與溫暖色彩完成設計。2021 年入圍金點新秀獎年度最佳產品設計。',
  },
  {
    id: 6,
    slug: 'vivid',
    name: 'Vivid',
    subtitle: '便攜式靜脈注射儀 · Portable IV Device',
    category: 'Product',
    year: '2020',
    client: 'Personal Project',
    scope: 'Medical Device Design, Industrial Design',
    bg: '#4A6880',
    meta: [
      { label: '類別', value: 'Product Design' },
      { label: '日期', value: '2020' },
      { label: '得獎', value: '放視大賞 入圍' },
      { label: '得獎', value: '晨銘盃 入圍' },
    ],
    desc: 'Vivid 是一款為緊急與野外醫療情境設計的便攜式靜脈注射裝置，緊湊直觀的操作介面在高壓環境下仍能維持臨床精確度。深入訪談醫護人員，以人因工程為核心進行反覆迭代，2020 年入圍放視大賞及晨銘盃產品設計類別。',
  },
];

/* =============================================
   Blocks  (free-form canvas layout)
   Each block: { id, projectSlug, x, y, w, h }
   All coordinates are fractions of canvas width.
   editor.js overwrites this with saved data.
   ============================================= */
const blocks = [
  { id:1, projectSlug:'gongdi',   x:0,      y:0,      w:0.6667, h:0.375  },
  { id:2, projectSlug:'taitung',  x:0.6667, y:0,      w:0.3333, h:0.1875 },
  { id:3, projectSlug:'dienmei',  x:0.6667, y:0.1875, w:0.3333, h:0.1875 },
  { id:4, projectSlug:'our-land', x:0,      y:0.375,  w:0.6667, h:0.375  },
  { id:5, projectSlug:'peca',     x:0.6667, y:0.375,  w:0.3333, h:0.1875 },
  { id:6, projectSlug:'vivid',    x:0.6667, y:0.5625, w:0.3333, h:0.1875 },
];

/* Ordered list of project slugs for the home carousel.
   editor.js may override this from localStorage. */
let carouselSlugs = projects.slice(0, 6).map(p => p.slug);

/* Homepage variant: 'v1' = carousel, 'v2' = cloth text portrait */
let homeVariant = storedItem('airchang_home_variant') || 'v1';

/* Left/right inset (px) for the Previous/Next nav row on project detail
   pages. Adjustable via drag handles in edit mode (see injectDetailNavInsetHandles). */
let detailNavInsetL = 32.5;
let detailNavInsetR = 32.5;
function applyDetailInsets() {
  document.documentElement.style.setProperty('--detail-nav-inset-l', detailNavInsetL + 'px');
  document.documentElement.style.setProperty('--detail-nav-inset-r', detailNavInsetR + 'px');
}

/* Left-column width (%) plus left/right outer inset (px) for the
   fixed-left/scrolling-right split on project detail pages — site-wide,
   not per-project. Adjustable via drag handles in edit mode (see
   injectDetailSplitHandle). */
let detailSplitLeftPct = 38;
let detailSplitInsetL  = 40;
let detailSplitInsetR  = 40;
function applyDetailSplit() {
  document.documentElement.style.setProperty('--detail-split-left', detailSplitLeftPct + '%');
  document.documentElement.style.setProperty('--detail-split-inset-l', detailSplitInsetL + 'px');
  document.documentElement.style.setProperty('--detail-split-inset-r', detailSplitInsetR + 'px');
}

/* Aspect ratio (width/height) for the project cover image — site-wide,
   not per-project, so every project's cover crops to the same shape.
   Adjustable via a drag handle in edit mode (see
   injectDetailCoverRatioHandle). */
let detailCoverRatio = 1.9;
function applyDetailCoverRatio() {
  document.documentElement.style.setProperty('--detail-cover-ratio', detailCoverRatio);
}

/* Hide the top nav bar on scroll-down, reveal it on scroll-up (or near
   the top of the page) — the animated slide itself is a CSS transition
   on #nav (see #nav.nav-hidden), this just toggles the class. */
(function () {
  const SHOW_NEAR_TOP_PX = 60;
  let lastY = window.scrollY;
  let ticking = false;
  function update() {
    const nav = document.getElementById('nav');
    if (nav) {
      const y = window.scrollY;
      if (y <= SHOW_NEAR_TOP_PX) {
        nav.classList.remove('nav-hidden');
      } else if (y > lastY) {
        nav.classList.add('nav-hidden');
      } else if (y < lastY) {
        nav.classList.remove('nav-hidden');
      }
      lastY = y;
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* Live-adjustable cloth parameters */
const clothConfig = {
  curtainPct:    0.70,
  mouseRadius:   235,
  mouseStrength: 5.5,
  gravity:       0.12,
  damping:       0.99,
  text:          'AIR CHANG · INDUSTRIAL DESIGNER · TAIPEI · TAIWAN · 張耀中 · ',
  fontSize:      0,     // 0 = auto
  letterSpacing: 1.0,   // column-density multiplier
  lineSpacing:   1.0,   // row-density multiplier
  scrollTriggerPx: 1800, // wheel px needed (at top of page) to fully part the curtain
  _panelOpen:    false,
};

/* Intro scroll-lock (v2 hero only): 0 = curtain intact, 1 = fully parted.
   While at the very top of the page, wheel-down drives this up instead of
   scrolling the page; only once it reaches 1 does real scrolling resume.
   Wheel-up at the top reverses it, so the effect replays on the next
   scroll-down. See onIntroWheel() and the draw loop in startClothPortrait(). */
let curtainProgress = 0;

/* How much the v2 hero background photo scales up (Ken Burns style) as
   the curtain gesture completes — 0.15 = 15% zoom by curtainProgress=1,
   alongside the existing opacity fade. */
const HERO_BG_ZOOM = 0.15;

/* Info page — total-project counter animates 0 → count once it scrolls
   into view. totalCounterShown tracks this at the module level (not on
   the DOM element) so an edit-triggered renderInfo() re-render — which
   creates a fresh element every time — doesn't replay the animation
   mid-editing-session; only a genuine fresh page load does. */
let totalCounterShown = false;
function initTotalCounterObserver() {
  if (totalCounterShown) return;
  const el = document.querySelector('.info-total-count');
  if (!el) return;
  const target = portfolioItems.length;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      totalCounterShown = true;
      obs.disconnect();
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  obs.observe(el);
}

/* Project list starts collapsed to the first 5 rows, with a "+" to reveal
   the rest — resets to collapsed on a fresh page load (see renderHome).
   Always fully expanded while editing, so nothing is hidden from the
   person managing the list. */
const PROJ_LIST_COLLAPSE_COUNT = 5;
let projListExpanded = false;
// Set right before the one renderInfo() call that should animate the
// newly-revealed rows in — consumed (reset) by buildInfoSectionHTML the
// moment it's read, so ordinary re-renders while already expanded (e.g.
// any unrelated edit) never replay the reveal.
let projListJustExpanded = false;
function expandProjList() {
  projListExpanded = true;
  projListJustExpanded = true;
  renderInfo();
}
function collapseProjList() {
  const section = document.getElementById('info-section');
  const rows = section ? [...section.querySelectorAll('.info-proj-row')] : [];
  const toHide = rows.slice(PROJ_LIST_COLLAPSE_COUNT);
  if (!toHide.length) { projListExpanded = false; renderInfo(); return; }

  // Animate the rows beyond the 5th out (mirrors the expand reveal, same
  // stagger direction) before actually collapsing the list. Their actual
  // box height (not just opacity) shrinks to 0 too, so the divider line
  // and Experience/Awards below rise smoothly in sync with the fade
  // instead of staying put and jumping up once renderInfo() finally
  // drops the rows from the DOM.
  const COLLAPSE_MS = 300;
  // max-height can't transition from "auto", so lock in each row's
  // current rendered height as an explicit starting point first (a
  // visual no-op) before flipping the target to 0.
  toHide.forEach(el => {
    el.style.maxHeight = el.offsetHeight + 'px';
    el.style.minHeight = '0px'; // overrides the --row-h custom min-height, or nothing shrinks
  });
  void section.offsetHeight; // force a reflow so the browser commits that starting height

  requestAnimationFrame(() => {
    toHide.forEach((el, i) => {
      el.style.transitionDelay = `${i * 25}ms`;
      // Drop any leftover reveal classes first — .itr-row-reveal.itr-row-reveal-in
      // is more specific than .itr-row-collapsing alone and would otherwise
      // win the cascade and keep the row pinned at opacity:1.
      el.classList.remove('itr-row-reveal', 'itr-row-reveal-in');
      el.classList.add('itr-row-collapsing');
      el.style.maxHeight        = '0px';
      el.style.paddingTop       = '0px';
      el.style.paddingBottom    = '0px';
      el.style.borderBottomWidth = '0px';
      el.style.opacity          = '0';
      el.style.transform        = 'translateY(-10px)';
    });
  });

  setTimeout(() => {
    projListExpanded = false;
    renderInfo();
  }, COLLAPSE_MS + (toHide.length - 1) * 25 + 50);
}

/* Info page header — free-form canvas, same convention as every other
   free-form system in the app: each block is {id,x,y,w,h} as fractions
   of the canvas's own rendered width (see applyInfoHeaderPositions).
   editor.js owns the drag/resize/persist wiring. */
let infoHeaderBlocks = [
  { id: 'photo',     x: 0,    y: 0,    w: 0.09, h: 0.32 },
  { id: 'name',      x: 0.13, y: 0,    w: 0.45, h: 0.09 },
  { id: 'location',  x: 0.13, y: 0.1,  w: 0.45, h: 0.05 },
  { id: 'skills',    x: 0.13, y: 0.17, w: 0.6,  h: 0.08 },
  { id: 'email',     x: 0.75, y: 0,    w: 0.25, h: 0.05 },
  { id: 'phone',     x: 0.75, y: 0.06, w: 0.25, h: 0.05 },
];

/* Which of the fixed blocks above are hidden (removed but not deleted —
   restorable), and the user's own free-form text blocks added on top,
   {id, x, y, w, h, text, fontSize, color, weight}. Both editor.js-owned. */
let infoHeaderHidden = [];
let infoCustomBlocks = [];

/* Contact section — two free-form draggable text blocks (phone/email),
   same {id,x,y,w,h,text,fontSize,color,weight} convention as
   infoCustomBlocks, on their own canvas. null is the "not yet seeded"
   sentinel — the first time the section renders with nothing loaded from
   storage, it's filled from whatever the About section's own email/phone
   already contain (see defaultContactBlocks/buildContactSectionHTML). */
let contactBlocks = null;

const IHB_LABELS = {
  photo: '照片', name: '姓名', location: '地點', skills: '專長',
  email: 'Email', phone: '電話',
};

/* Below this canvas width, text blocks (fixed px font-size, independent
   of the block-position fractions below) stop fitting their shrinking
   box on one line and wrap — which, since blocks are free-form
   absolutely-positioned, means they grow taller than their allotted
   box and start overlapping whatever's below them. Empirically the
   point this starts (checked against this site's actual name/skills
   text and font sizes) is a bit under 600px. Below this width, the
   position/size math is frozen as if the canvas were still this wide
   (so photo and text keep exactly the same relative size and position
   they'd have at that width), and the whole canvas is scaled down as
   one visual unit instead — the photo and every text block shrink
   together, never past each other. Above it, nothing changes: block
   sizes still track the canvas's real width 1:1, same as before. */
const INFO_HEADER_MIN_W = 620;
function applyInfoHeaderPositions() {
  const wrap = document.getElementById('info-header-canvas-wrap');
  const canvas = document.getElementById('info-header-canvas');
  if (!canvas || !wrap) return;
  const availableW = wrap.offsetWidth;
  if (!availableW) return;
  const W = Math.max(availableW, INFO_HEADER_MIN_W);
  let maxBottom = 0;
  [...infoHeaderBlocks, ...infoCustomBlocks].forEach(b => {
    const el = canvas.querySelector(`[data-ihb-id="${b.id}"], [data-ihb-custom-id="${b.id}"]`);
    if (!el) return;
    el.style.left   = (b.x * W) + 'px';
    el.style.top    = (b.y * W) + 'px';
    el.style.width  = (b.w * W) + 'px';
    el.style.height = (b.h * W) + 'px';
    maxBottom = Math.max(maxBottom, (b.y + b.h) * W);
  });
  const naturalH = Math.max(80, maxBottom);
  const scale = Math.min(1, availableW / INFO_HEADER_MIN_W);
  canvas.style.width = W + 'px';
  canvas.style.height = naturalH + 'px';
  canvas.style.transform = scale < 1 ? `scale(${scale})` : '';
  wrap.style.height = (naturalH * scale) + 'px';
}

/* Same overflow/wrap problem and fix as INFO_HEADER_MIN_W above — phone/
   email/custom text have a fixed px font-size independent of these
   fraction-based block sizes, so on a narrow phone their box shrinks
   while the text inside doesn't, and it wraps and overflows into
   whatever's below. Empirically (this site's actual phone/email/banner
   text) that starts right around .contact-canvas's own 820px max-width,
   so freezing at 820 and scaling down as a whole below that keeps it
   from ever actually reaching that point. */
const CONTACT_MIN_W = 820;
function applyContactPositions() {
  const wrap = document.getElementById('contact-canvas-wrap');
  const canvas = document.getElementById('contact-canvas');
  if (!canvas || !wrap || !contactBlocks) return;
  const availableW = wrap.offsetWidth;
  if (!availableW) return;
  const W = Math.max(availableW, CONTACT_MIN_W);
  let maxBottom = 0;
  contactBlocks.forEach(b => {
    const el = canvas.querySelector(`[data-contact-id="${b.id}"]`);
    if (!el) return;
    el.style.left   = (b.x * W) + 'px';
    el.style.top    = (b.y * W) + 'px';
    el.style.width  = (b.w * W) + 'px';
    el.style.height = (b.h * W) + 'px';
    maxBottom = Math.max(maxBottom, (b.y + b.h) * W);
  });
  const naturalH = Math.max(60, maxBottom);
  const scale = Math.min(1, availableW / CONTACT_MIN_W);
  canvas.style.width = W + 'px';
  canvas.style.height = naturalH + 'px';
  canvas.style.transform = scale < 1 ? `scale(${scale})` : '';
  wrap.style.height = (naturalH * scale) + 'px';
}

/* =============================================
   Router
   ============================================= */
/* One-page site: '/', '/projects' and '/info' all render the same merged
   home page (hero → projects → info, continuous scroll). This flag tells
   renderHome() which section to land on right after the next render —
   set right before navigating away from the merged page, consumed once. */
let pendingScrollTarget = null;

function navHeightPx() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 52;
}

/* Custom eased scroll (ease-out — fast start, decelerating into the
   landing point) for every "jump to a section" action: nav links, the
   logo's back-to-top, and the post-navigation section landing in
   renderHome(). Used instead of native scroll-behavior:smooth so the
   easing/duration are consistent and controllable everywhere, rather
   than however each browser happens to implement native smooth scroll. */
function smoothScrollTo(targetY, duration = 700) {
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 1) return;
  const startTime = performance.now();
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + delta * easeOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const router = {
  routes: [],
  add(pattern, handler) { this.routes.push({ pattern, handler }); },
  resolve(pathname) {
    for (const r of this.routes) {
      const m = pathname.match(r.pattern);
      if (m) { r.handler(m); return; }
    }
  },
  navigate(path, push = true) {
    if (push) history.pushState({}, '', path);
    this.resolve(new URL(location.href).pathname);
    updateNav();
  },
  init() {
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-link]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || /^(https?|mailto|tel):/.test(href)) return;
      e.preventDefault();
      if (href !== location.pathname) {
        this.navigate(href);
      } else if (href === '/') {
        // The logo links to "/" — if we're already there, there's nothing
        // to navigate to, but clicking it should still act as a "back to
        // top" shortcut instead of doing nothing.
        if (homeVariant === 'v2' && curtainProgress !== 0) {
          // Reset the v2 curtain back to "intact" so the hero photo (whose
          // opacity/zoom only update where curtainProgress changes) is
          // visible again immediately, instead of staying invisible at
          // whatever progress it was left at until the next manual scroll.
          curtainProgress = 0;
          syncHeroV2Bg();
        }
        smoothScrollTo(0);
      }
    });
    // Info / Projects / Contact nav links: while already on the merged
    // home page, scroll straight there ourselves (rather than relying on
    // native #anchor + scroll-behavior:smooth, which we don't get to
    // control the easing/duration of). From any other page, route home
    // first and land on the target section once it exists.
    document.querySelectorAll('.nav-links a[data-scroll]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        if (location.pathname === '/') {
          const el = document.getElementById(a.dataset.scroll);
          if (el) {
            // Jumping straight to a section below the hero bypasses the v2
            // curtain wheel-gesture entirely, so mark it as already fully
            // parted — otherwise a manual scroll right after this lands
            // back in the hero's scroll-hijack zone (curtainProgress still
            // 0) and onIntroWheel snaps the page back toward the top.
            curtainProgress = 1;
            syncHeroV2Bg();
            smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - navHeightPx());
          }
          return;
        }
        pendingScrollTarget = a.dataset.scroll;
        this.navigate('/');
      });
    });
    window.addEventListener('popstate', () => {
      this.resolve(new URL(location.href).pathname);
      updateNav();
    });
    this.resolve(location.pathname);
    updateNav();
  },
};

function navigate(path) { router.navigate(path); }

function setPage(html, opts = {}) {
  const app = document.getElementById('app');
  app.innerHTML = html;
  // Callers with a pending scroll target (see renderHome) skip this reset —
  // resetting to top first, then smooth-scrolling to the target, meant the
  // animation always started from the top instead of wherever the page
  // actually was when navigation began.
  if (!opts.skipScrollReset) window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const p = app.querySelector('.page');
    if (p) p.classList.add('visible');
  }));
}

let sectionNavObserver = null;

/* Highlight the Info / Projects nav link that matches whichever section
   is currently in view, since both now live on the same scrollable page
   instead of being separate routes. */
function initSectionNavHighlight() {
  if (sectionNavObserver) { sectionNavObserver.disconnect(); sectionNavObserver = null; }
  const links = {};
  document.querySelectorAll('.nav-links a[data-scroll]').forEach(a => { links[a.dataset.scroll] = a; });
  const targets = Object.keys(links).map(id => document.getElementById(id)).filter(Boolean);
  if (!targets.length) return;
  sectionNavObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = links[entry.target.id];
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: `-${navHeightPx() + 10}px 0px -70% 0px`, threshold: 0 });
  targets.forEach(t => sectionNavObserver.observe(t));
}

function updateNav() {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  if (location.pathname === '/') initSectionNavHighlight();
}

/* =============================================
   Cloudinary URL helper
   Inserts transformation params so each context gets the right size.
   Falls back to the original URL for non-Cloudinary (legacy base64) covers.
   ============================================= */
function cloudinaryUrl(url, w) {
  if (!url || !url.startsWith('http') || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${w},f_auto/`);
}

/* Position + scale an <img> so the natural-image point (imgX%, imgY%) lands
   exactly at the container's center, magnified by zoom. This is what the crop
   modal's preview assumes ("window center = imgX/imgY"); object-position's
   edge-alignment semantics only coincide with the window's actual center when
   imgX=imgY=50, so any off-center crop needs this explicit math instead. */
function applyPreciseCrop(img, container, imgX, imgY, zoom) {
  function place() {
    const Cw = container.offsetWidth, Ch = container.offsetHeight;
    const NW = img.naturalWidth, NH = img.naturalHeight;
    if (!Cw || !Ch || !NW || !NH) return;
    const S  = Math.max(Cw / NW, Ch / NH) * zoom;
    const dW = NW * S, dH = NH * S;
    img.style.width  = dW + 'px';
    img.style.height = dH + 'px';
    img.style.left   = (Cw / 2 - (imgX / 100) * dW) + 'px';
    img.style.top    = (Ch / 2 - (imgY / 100) * dH) + 'px';
  }
  if (img.complete && img.naturalWidth) place();
  else img.addEventListener('load', place, { once: true });
}

/* Cover image crop — pan/zoom are per-project (p.coverImgX/Y/Zoom), but
   the frame's aspect ratio is the site-wide detailCoverRatio. */
function applyCoverCrop(p) {
  const frame = document.querySelector('.dc-frame');
  const img   = frame?.querySelector('.dc-img');
  if (!frame || !img || !p) return;
  applyPreciseCrop(img, frame, p.coverImgX ?? 50, p.coverImgY ?? 50, p.coverImgZoom ?? 1);
}

/* Gallery image crop — only items the user has actually cropped (g.ratio
   set) get a fixed frame + precise pan/zoom; everything else stays at
   its natural height:auto, uncropped. */
function applyGalleryCrops(p) {
  if (!p) return;
  (p.gallery || []).forEach(g => {
    if (!g.ratio) return;
    const item = document.querySelector(`.gallery-item[data-gallery-id="${g.id}"]`);
    const img  = item?.querySelector('.gi-crop-img');
    if (item && img) applyPreciseCrop(img, item, g.imgX ?? 50, g.imgY ?? 50, g.imgZoom ?? 1);
  });
}

/* =============================================
   Home — One-page site: Hero → Projects → Info, one
   continuous scroll. Hero is either the v1 carousel or the
   v2 cloth-text portrait; both build just their own section
   (id="hero-section") and leave Projects/Info untouched.
   ============================================= */
let carouselIdx   = 0;
let carouselTimer = null;

function buildHeroV1HTML() {
  const slides = carouselSlugs
    .map(slug => projects.find(p => p.slug === slug))
    .filter(Boolean);

  return `
  <div class="home-hero" id="hero-section">
    ${slides.map((p, i) => {
      const coverUrl = cloudinaryUrl(p.cover, 1400);
      const bg = coverUrl
        ? `background:${p.bg};background-image:url('${coverUrl}');background-size:cover;background-position:center`
        : `background:${p.bg}`;
      return `
    <a class="hero-slide" data-link href="/projects/${p.slug}"
       data-idx="${i}"
       style="position:absolute;inset:0;transition:opacity 600ms;opacity:${i === 0 ? 1 : 0};pointer-events:${i === 0 ? 'auto' : 'none'}">
      <div class="hero-placeholder" style="${bg}">
        ${!p.cover ? `<span class="hero-placeholder-label">${p.name}</span>` : ''}
      </div>
    </a>`;
    }).join('')}

    <button class="hero-arrow prev" onclick="carouselPrev()" aria-label="Previous">‹</button>
    <button class="hero-arrow next" onclick="carouselNext()" aria-label="Next">›</button>

    <div class="hero-dots">
      ${slides.map((_, i) => `<div class="hero-dot${i === 0 ? ' active' : ''}" onclick="carouselGoto(${i})"></div>`).join('')}
    </div>
  </div>`;
}

function initHeroV1() {
  carouselIdx = 0;
  clearInterval(carouselTimer);
  carouselTimer = setInterval(carouselNext, 4000);
}

/* Renders the full one-page site: Hero → Projects → Info, one continuous
   scroll. Used for the first load and for structural changes (switching
   hero variant, carousel slide list). In-place edits to just the projects
   grid or the info lists go through renderProjects()/renderInfo() instead,
   which patch their section without rebuilding the hero or losing scroll
   position — see those functions for why. */
function renderHome() {
  curtainProgress = 0; // fresh mount — replay the intro from scratch
  totalCounterShown = false; // fresh mount — replay the counter too
  projListExpanded = false; // fresh mount — collapse the project list again
  const heroHtml = homeVariant === 'v2' ? buildHeroV2HTML() : buildHeroV1HTML();
  // Only an explicit in-app navigation (pendingScrollTarget) should scroll
  // to a section — a plain page load/refresh always starts at the top,
  // even if the URL still has a #section-id left over from an earlier
  // in-page anchor scroll (clicking Info/Projects updates the URL hash
  // via native <a href="#..."> behavior, but that shouldn't "stick" and
  // hijack the next reload).
  const hasScrollTarget = !!pendingScrollTarget;

  setPage(`
<div class="page home-page">
  ${heroHtml}
  <section id="projects-section" class="projects-page">
    <div class="projects-canvas" id="projects-canvas">${buildProjectsSectionHTML()}</div>
  </section>
  <section id="info-section" class="info-page">${buildInfoSectionHTML()}</section>
  <section id="contact-section" class="contact-page">${buildContactSectionHTML()}</section>
</div>`, { skipScrollReset: hasScrollTarget });

  if (homeVariant === 'v2') initHeroV2(); else initHeroV1();
  initTotalCounterObserver();

  requestAnimationFrame(() => {
    applyBlockPositions();
    applyInfoHeaderPositions();
    applyContactPositions();
    applyProjRowLineOffset();
    applyTotalLineFit();
    applyInfoListsOverlapCheck();
    requestAnimationFrame(() => {
      const target = pendingScrollTarget;
      pendingScrollTarget = null;
      const el = target && document.getElementById(target);
      if (el) {
        // Same fix as the nav-link click handler — landing straight on a
        // below-hero section needs the v2 curtain treated as already
        // parted, or a manual scroll right after gets hijacked back
        // toward the top by onIntroWheel.
        curtainProgress = 1;
        syncHeroV2Bg();
        smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - navHeightPx());
      }
    });
  });
}

function carouselGoto(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  slides[carouselIdx].style.opacity      = '0';
  slides[carouselIdx].style.pointerEvents = 'none';
  dots[carouselIdx].classList.remove('active');
  carouselIdx = (idx + slides.length) % slides.length;
  slides[carouselIdx].style.opacity      = '1';
  slides[carouselIdx].style.pointerEvents = 'auto';
  dots[carouselIdx].classList.add('active');
  clearInterval(carouselTimer);
  carouselTimer = setInterval(carouselNext, 4000);
}

function carouselNext() { carouselGoto(carouselIdx + 1); }
function carouselPrev() { carouselGoto(carouselIdx - 1); }

/* =============================================
   Projects Section  (free-form canvas)
   ============================================= */
function buildProjectsSectionHTML() {
  return blocks.map(b => {
    const p    = projects.find(x => x.slug === b.projectSlug);
    const name = p ? p.name     : '';
    const cat  = p ? p.category : '';
    const coverUrl  = p ? cloudinaryUrl(p.cover, 1639) : null;
    const phBg      = p ? p.bg : 'var(--bg2)';
    const imgEl     = coverUrl
      ? `<img class="block-cover-img" src="${coverUrl}" draggable="false">`
      : '';

    const inner = `
      <div class="project-card-ph" style="background:${phBg}">${imgEl}</div>
      <div class="project-card-overlay">
        <div class="project-card-info">
          <span class="project-card-name">${name}</span>
          <span class="project-card-cat">${cat}</span>
        </div>
      </div>`;

    return p
      ? `<a href="/projects/${p.slug}" data-link class="project-block" data-block-id="${b.id}" aria-label="${name}">${inner}</a>`
      : `<div class="project-block" data-block-id="${b.id}" aria-label="empty">${inner}</div>`;
  }).join('');
}

/* Patches just the projects canvas in place — the merged home page (hero +
   projects + info) stays mounted, so this never resets scroll position or
   touches the hero's running carousel/cloth animation. Falls back to a full
   renderHome() if the canvas isn't mounted yet (e.g. first navigation). */
function renderProjects() {
  const canvas = document.getElementById('projects-canvas');
  if (!canvas) { renderHome(); return; }
  canvas.innerHTML = buildProjectsSectionHTML();
  requestAnimationFrame(applyBlockPositions);
}

/* Compute pixel positions from fractions and update DOM */
function applyBlockPositions() {
  const canvas = document.getElementById('projects-canvas');
  if (!canvas) return;
  const W = canvas.offsetWidth;
  if (!W) return;

  let maxBottom = 0;
  blocks.forEach(b => {
    const el = canvas.querySelector(`[data-block-id="${b.id}"]`);
    if (!el) return;
    el.style.left   = (b.x * W) + 'px';
    el.style.top    = (b.y * W) + 'px';
    el.style.width  = (b.w * W) + 'px';
    el.style.height = (b.h * W) + 'px';
    maxBottom = Math.max(maxBottom, (b.y + b.h) * W);

    const img = el.querySelector('.block-cover-img');
    const ph  = el.querySelector('.project-card-ph');
    if (img && ph) applyPreciseCrop(img, ph, b.imgX ?? 50, b.imgY ?? 50, b.imgZoom ?? 1);
  });
  canvas.style.height = Math.max(300, maxBottom + 100) + 'px';

  initProjectRevealObserver();
}

/* Scroll reveal for the Projects grid: each block starts hidden (see the
   .project-block CSS) and fades/rises into place whenever it scrolls into
   view, then fades back out if it scrolls out again — so the effect
   replays every time, not just the first time. Re-run (idempotent) any
   time positions are recomputed, since block add/remove/reorder can
   change which elements exist. */
let projectRevealObserver = null;
function initProjectRevealObserver() {
  if (projectRevealObserver) projectRevealObserver.disconnect();
  const canvas = document.getElementById('projects-canvas');
  if (!canvas) return;
  projectRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  canvas.querySelectorAll('.project-block').forEach(el => projectRevealObserver.observe(el));
}

/* Free-form Album + "Full Project" link canvas (mirrors the pattern used
   elsewhere for free-form blocks) */
function applyOutroPositions(p) {
  const canvas = document.getElementById('outro-canvas');
  if (!canvas || !p) return;
  const W = canvas.offsetWidth;
  if (!W) return;

  const al = p.albumPos || { x: 0,    y: 0,    w: 0.55, h: 0.42 };
  const li = p.linkPos  || { x: 0.62, y: 0.16, w: 0.3,  h: 0.1  };

  const alEl = canvas.querySelector('.project-album');
  const liEl = canvas.querySelector('.full-project-link');
  if (alEl) {
    alEl.style.left   = (al.x * W) + 'px';
    alEl.style.top    = (al.y * W) + 'px';
    alEl.style.width  = (al.w * W) + 'px';
    alEl.style.height = (al.h * W) + 'px';
  }
  if (liEl) {
    liEl.style.left   = (li.x * W) + 'px';
    liEl.style.top    = (li.y * W) + 'px';
    liEl.style.width  = (li.w * W) + 'px';
    liEl.style.height = (li.h * W) + 'px';
  }

  const maxBottom = Math.max((al.y + al.h) * W, (li.y + li.h) * W);
  canvas.style.height = Math.max(150, maxBottom + 20) + 'px';
}

/* Credit block — free-form draggable/resizable, same mechanics as the
   outro album/link, but a single block (no partner to align against). */
function applyCreditPosition(p) {
  const canvas = document.getElementById('credit-canvas');
  if (!canvas || !p) return;
  const W = canvas.offsetWidth;
  if (!W) return;

  const cr = p.crPos || { x: 0, y: 0, w: 1, h: 0.3 };
  const el = canvas.querySelector('.detail-credit');
  if (el) {
    el.style.left   = (cr.x * W) + 'px';
    el.style.top    = (cr.y * W) + 'px';
    el.style.width  = (cr.w * W) + 'px';
    el.style.height = (cr.h * W) + 'px';
  }
  canvas.style.height = Math.max(60, (cr.y + cr.h) * W + 20) + 'px';
}

/* Album carousel — auto-advance every 4s, plus manual prev/next arrows.
   Safe to call repeatedly on the same element (e.g. after a photo is added
   or removed without a full page re-render): it tears down any previous
   timer/listeners first via the cleanup stashed on the element. */
function startAlbumCarousel(albumEl) {
  if (albumEl._carouselCleanup) albumEl._carouselCleanup();

  const slides = albumEl.querySelectorAll('.album-slide');
  const dots   = albumEl.querySelectorAll('.album-dots .hero-dot');
  if (slides.length < 2) { albumEl._carouselCleanup = null; return; }

  let idx = 0;
  let timer = null;

  function goto(newIdx) {
    slides[idx].style.opacity = '0';
    dots[idx]?.classList.remove('active');
    idx = (newIdx + slides.length) % slides.length;
    slides[idx].style.opacity = '1';
    dots[idx]?.classList.add('active');
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goto(idx + 1), 4000);
  }
  function onPrev(e) { e.preventDefault(); e.stopPropagation(); goto(idx - 1); restart(); }
  function onNext(e) { e.preventDefault(); e.stopPropagation(); goto(idx + 1); restart(); }

  const prevBtn = albumEl.querySelector('.album-arrow.prev');
  const nextBtn = albumEl.querySelector('.album-arrow.next');
  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  restart();

  albumEl._carouselCleanup = () => {
    clearInterval(timer);
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
  };
}

/* Rebuild the arrow/dot nav to match the current photo count, then
   (re)start the carousel. Called after an in-place photo add/remove so
   we never need a full renderDetail() just to keep the album in sync. */
function rebuildAlbumNav(albumEl, p) {
  albumEl.querySelectorAll('.album-arrow, .album-dots').forEach(el => el.remove());
  const photos = p.albumPhotos || [];
  if (photos.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'hero-arrow prev album-arrow';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.textContent = '‹';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'hero-arrow next album-arrow';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.textContent = '›';
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'hero-dots album-dots';
    photos.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
    });
    albumEl.appendChild(prevBtn);
    albumEl.appendChild(nextBtn);
    albumEl.appendChild(dotsWrap);
  }
  startAlbumCarousel(albumEl);
}

/* Free-form OVERLAY spanning the right (image) column only, so text/line
   blocks can be dragged anywhere across the gallery images. The overlay
   itself sizes via CSS (inset:0 on a position:relative .detail-right); we
   only grow .detail-right's min-height if a block gets dragged below the
   natural content height, so nothing overlaps. */
function applyCustomPositions(p) {
  const canvas = document.getElementById('custom-canvas');
  const body   = document.querySelector('.detail-right');
  if (!canvas || !body || !p) return;
  const W = canvas.offsetWidth;
  if (!W) return;

  let maxBottom = 0;
  (p.customBlocks || []).forEach(b => {
    const el = canvas.querySelector(`[data-custom-id="${b.id}"]`);
    if (!el) return;
    el.style.left   = (b.x * W) + 'px';
    el.style.top    = (b.y * W) + 'px';
    el.style.width  = (b.w * W) + 'px';
    el.style.height = (b.h * W) + 'px';
    maxBottom = Math.max(maxBottom, (b.y + b.h) * W);
  });
  body.style.minHeight = maxBottom > 0 ? (maxBottom + 20) + 'px' : '';
}

/* True viewport width, excluding the vertical scrollbar — CSS's own
   100vw unit counts the scrollbar as part of the viewport, so a
   full-bleed trick built on it (see .info-proj-row::after) ends up a
   scrollbar's-width too wide and adds its own tiny horizontal
   scrollbar, on any OS/browser that reserves visible space for one
   (this doesn't show up testing in a scrollbar-less headless browser,
   which is how it slipped through). clientWidth has no such issue, so
   anything that needs a true full-bleed width should read --vw-safe
   instead of 100vw directly. */
function applyViewportSafeWidth() {
  document.documentElement.style.setProperty('--vw-safe', document.documentElement.clientWidth + 'px');
}
applyViewportSafeWidth();
window.addEventListener('resize', applyViewportSafeWidth);

/* Each project row's own distance from the viewport's left edge, fed to
   .info-proj-row::after (the full-bleed separator line) as
   --proj-row-x so it can position itself at the true viewport edge
   regardless of where the row itself sits. Measuring directly like this
   is more robust than a symmetric "left/right:50%" CSS trick, which
   just assumes the row's own center lines up with the viewport's and
   silently drifts off-edge whenever that assumption doesn't hold. */
function applyProjRowLineOffset() {
  document.querySelectorAll('.info-proj-row').forEach(row => {
    row.style.setProperty('--proj-row-x', row.getBoundingClientRect().left + 'px');
  });
  const table = document.querySelector('.info-proj-table');
  if (table) {
    table.style.setProperty('--proj-table-x', table.getBoundingClientRect().left + 'px');
  }
}
window.addEventListener('resize', applyProjRowLineOffset);

/* Sizes .info-total-line's font so the line's rendered width matches
   the available viewport width (minus its own left/right padding),
   scaling down as the window narrows and back up as it widens — the
   "always fills the line" effect. Measured (not a vw-based clamp())
   because the surrounding "Associated with"/"Projects" wording is
   editable text of unpredictable length, so a fixed vw coefficient
   tuned for one piece of copy would be wrong for another. Fits against
   the FINAL text (current project count), not whatever's live in the
   DOM mid count-up-animation, so the font-size doesn't jitter while
   that plays — see initTotalCounterObserver. */
function applyTotalLineFit() {
  const el = document.getElementById('info-total-line');
  if (!el) return;
  const prefix = infoTextData['total-prefix']?.text ?? 'Associated with____';
  const suffix = infoTextData['total-suffix']?.text ?? 'Projects';
  const text = `${prefix} ${portfolioItems.length} ${suffix}`;

  const REF = 100; // px — arbitrary reference size, cancels out in the ratio below
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;` +
    `font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-0.03em;font-size:${REF}px`;
  probe.textContent = text;
  document.body.appendChild(probe);
  const naturalWidth = probe.offsetWidth;
  probe.remove();

  const sidePad = parseFloat(getComputedStyle(el).paddingLeft) || 40;
  const targetWidth = document.documentElement.clientWidth - sidePad * 2;
  const fontSize = naturalWidth > 0 ? Math.max(14, (targetWidth / naturalWidth) * REF) : REF;
  el.style.fontSize = fontSize + 'px';
  // The prefix/suffix spans go through the generic [data-info-key] text
  // editor, which (see is() above) can stamp its own inline font-size
  // straight onto a span whenever its wording is saved — harmless for
  // every other use of that editor, but here it would freeze that one
  // span at a fixed size instead of scaling with the rest of the line.
  // Clearing it back to inherit keeps the whole line sized as one unit.
  el.querySelectorAll('[data-info-key]').forEach(span => { span.style.fontSize = ''; });
}
window.addEventListener('resize', applyTotalLineFit);

/* Experience/Awards normally sit side by side (see .info-lists-row),
   and the negative-gap drag control (infoListsGap) can pull Awards left
   via a fixed px margin-left to sit closer to — or deliberately overlap
   — Experience. That fixed offset doesn't shrink with the viewport, so
   at some narrower width the two sections start visually overlapping
   instead of just sitting close. Detected here by measurement (not a
   fixed breakpoint) so it stays correct regardless of how wide either
   section's own width-handle or the gap control are currently set to —
   a fixed breakpoint tuned for one configuration would be wrong for
   another. .info-lists-stacked (see CSS) switches the row to a stacked
   column and neutralizes the negative margin, which only makes sense
   as a side-by-side effect. Always re-measured with the class removed
   first so a since-widened window can un-stack again, not just stack
   once and stay stuck. */
function applyInfoListsOverlapCheck() {
  const row = document.querySelector('.info-lists-row');
  const exp = document.getElementById('info-exp-section');
  const award = document.getElementById('info-award-section');
  if (!row || !exp || !award) return;
  // The negative margin is also set as an inline style (see the render
  // template), which always wins over a stylesheet rule trying to zero
  // it back out — so neutralizing/restoring it has to happen here in JS
  // too, not just via the .info-lists-stacked CSS below.
  const inlineMargin = infoListsGap < 0 ? infoListsGap + 'px' : '';
  row.classList.remove('info-lists-stacked');
  award.style.marginLeft = inlineMargin;
  const expRect = exp.getBoundingClientRect();
  const awardRect = award.getBoundingClientRect();
  const overlapping = awardRect.left < expRect.right - 0.5;
  row.classList.toggle('info-lists-stacked', overlapping);
  if (overlapping) award.style.marginLeft = '';
}
window.addEventListener('resize', applyInfoListsOverlapCheck);

// Info project-list row → project page navigation. A delegated listener
// (rather than one bound per row) survives renderInfo()'s innerHTML
// rebuilds with no re-init step. Only rows with a configured linkSlug
// (set via the row's edit-mode .itr-link-btn, see injectInfoEditors)
// get a data-proj-link attribute and are clickable — not every listed
// project has a real page on the site. Disabled in edit mode, where a
// click there means drag-reorder / inline cell editing instead.
document.addEventListener('click', e => {
  if (document.body.classList.contains('editor-active')) return;
  const row = e.target.closest('.info-proj-row[data-proj-link]');
  if (!row) return;
  router.navigate(`/projects/${row.dataset.projLink}`);
});

/* Small cover-image preview that follows the cursor while hovering a
   linked project-list row — a lightweight visual hint of which project
   the row points to, without clicking through. One shared floating
   element (not one per row) repositioned on every mousemove, rather
   than something CSS-only, since it needs to track the cursor and swap
   its image per row. mousemove (not mouseenter/mouseleave, which don't
   bubble and would need per-row listeners re-wired after every
   renderInfo() rebuild) drives both showing/hiding and following —
   whichever row .closest() finds under the cursor on any given move
   decides the state, so it never needs its own enter/leave wiring at
   all. */
let projHoverPreviewEl = null;
let projHoverRow = null;
const PROJ_PREVIEW_BASE_W = 285, PROJ_PREVIEW_BASE_H = 195; // 1.5x the original 190x130
function ensureProjHoverPreviewEl() {
  if (!projHoverPreviewEl) {
    projHoverPreviewEl = document.createElement('div');
    projHoverPreviewEl.id = 'proj-hover-preview';
    document.body.appendChild(projHoverPreviewEl);
  }
  return projHoverPreviewEl;
}
document.addEventListener('mousemove', e => {
  if (document.body.classList.contains('editor-active')) return;
  const row = e.target.closest('.info-proj-row[data-proj-link]');
  if (row) {
    if (row !== projHoverRow) {
      projHoverRow = row;
      const proj = projects.find(p => p.slug === row.dataset.projLink);
      const el = ensureProjHoverPreviewEl();
      el.style.backgroundImage = proj?.cover ? `url(${cloudinaryUrl(proj.cover, 400)})` : 'none';
      // ±3% per appearance, same random factor on both dimensions so
      // the image doesn't stretch — a little size variation each time
      // so it doesn't feel mechanically identical row to row.
      const sizeFactor = 0.97 + Math.random() * 0.06;
      el.style.width  = Math.round(PROJ_PREVIEW_BASE_W * sizeFactor) + 'px';
      el.style.height = Math.round(PROJ_PREVIEW_BASE_H * sizeFactor) + 'px';
      // Restart the pop-in transition every time the row changes, not
      // just the first time the preview appears. Plain class toggling
      // (even deferred via rAF) isn't enough — the browser coalesces the
      // remove+add into a single style resolution and never actually
      // paints the "hidden" state in between, so it skips straight to
      // the end value. Explicitly killing the transition while setting
      // the hidden state, forcing a reflow to commit it, then restoring
      // the transition and waiting a full frame before setting the
      // visible state again is what actually forces a fresh transition.
      el.classList.remove('visible');
      el.style.transition = 'none';
      void el.offsetWidth;
      el.style.transition = '';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }
    const el = ensureProjHoverPreviewEl();
    el.style.left = (e.clientX + 18) + 'px';
    el.style.top  = (e.clientY - 18) + 'px';
  } else if (projHoverRow) {
    projHoverRow = null;
    projHoverPreviewEl?.classList.remove('visible');
  }
});
// Leaving the whole page (or switching mode) while hovering shouldn't
// leave the preview stuck on-screen.
document.addEventListener('mouseleave', () => {
  projHoverRow = null;
  projHoverPreviewEl?.classList.remove('visible');
});

window.addEventListener('resize', () => {
  // Gallery/statement/hero-title are normal document flow now (no more
  // free-form px positioning), so they no longer need JS repositioning
  // on resize — only outro, credit, and custom blocks are still free-form.
  const outroCanvas = document.getElementById('outro-canvas');
  if (outroCanvas) {
    const p = projects.find(x => x.slug === outroCanvas.dataset.projectSlug);
    if (p) applyOutroPositions(p);
  }
  const creditCanvas = document.getElementById('credit-canvas');
  if (creditCanvas) {
    const p = projects.find(x => x.slug === creditCanvas.dataset.projectSlug);
    if (p) applyCreditPosition(p);
  }
  const customCanvas = document.getElementById('custom-canvas');
  if (customCanvas) {
    const p = projects.find(x => x.slug === customCanvas.dataset.projectSlug);
    if (p) applyCustomPositions(p);
  }
  const galleryCanvas = document.getElementById('gallery-canvas');
  if (galleryCanvas) {
    const p = projects.find(x => x.slug === galleryCanvas.dataset.projectSlug);
    if (p) { applyCoverCrop(p); applyGalleryCrops(p); }
  }
});

/* =============================================
   Home V2 — Cloth Text Portrait
   ============================================= */
function buildHeroV2HTML() {
  const slideProjects = carouselSlugs
    .map(slug => projects.find(p => p.slug === slug))
    .filter(Boolean);

  const slidesHtml = slideProjects.map((p, i) => {
    const url = p.cover ? cloudinaryUrl(p.cover, 1920) : null;
    const bg  = url
      ? `background:${p.bg};background-image:url('${url}');background-size:cover;background-position:center`
      : `background:${p.bg}`;
    return `<div class="v2-slide" style="${bg};opacity:${i === 0 ? 1 : 0};transition:opacity 1200ms ease;"></div>`;
  }).join('');

  return `
  <div class="home-v2-page" id="hero-section">
    <div class="v2-bg">${slidesHtml}</div>
    <canvas id="cloth-canvas"></canvas>
  </div>`;
}

/* Wires up everything inside the just-(re)built #hero-section for the v2
   variant: background crossfade, the parameter control panel, and the
   cloth simulation itself. Safe to call after either a full renderHome()
   or a hero-only rebuildHeroV2(). */
function initHeroV2() {
  clearInterval(carouselTimer);
  let bgIdx = 0;
  carouselTimer = setInterval(() => {
    const slides = document.querySelectorAll('.v2-slide');
    if (!slides.length) { clearInterval(carouselTimer); return; }
    slides[bgIdx].style.opacity = '0';
    bgIdx = (bgIdx + 1) % slides.length;
    slides[bgIdx].style.opacity = '1';
  }, 4000);

  const heroEl = document.getElementById('hero-section');
  if (!heroEl) return;

  // Control panel
  const ctrlEl = document.createElement('div');
  ctrlEl.id = 'cloth-ctrl';
  const rnd = (v, d=2) => Math.round(v * 10**d) / 10**d;
  ctrlEl.innerHTML = `
    <button id="ctrl-toggle">⚙ 調整</button>
    <div id="ctrl-panel">
      <div class="ctrl-row ctrl-text-row">
        <span class="ctrl-label">文字</span>
        <input type="text" id="cr-text" class="ctrl-text-input"
          value="${(clothConfig.text||'').replace(/"/g,'&quot;')}"
          placeholder="輸入文字，自動重複…">
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">窗簾長度</span>
        <input type="range" id="cr-curtain" min="20" max="95" step="1" value="${Math.round(clothConfig.curtainPct*100)}">
        <span class="ctrl-val" id="cv-curtain">${Math.round(clothConfig.curtainPct*100)}%</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">字級</span>
        <input type="range" id="cr-fontsize" min="0" max="40" step="1" value="${clothConfig.fontSize}">
        <span class="ctrl-val" id="cv-fontsize">${clothConfig.fontSize > 0 ? clothConfig.fontSize + 'px' : '自動'}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">字距</span>
        <input type="range" id="cr-ls" min="0.3" max="4" step="0.1" value="${clothConfig.letterSpacing}">
        <span class="ctrl-val" id="cv-ls">${clothConfig.letterSpacing}×</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">行距</span>
        <input type="range" id="cr-lh" min="0.3" max="4" step="0.1" value="${clothConfig.lineSpacing}">
        <span class="ctrl-val" id="cv-lh">${clothConfig.lineSpacing}×</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">滑鼠半徑</span>
        <input type="range" id="cr-radius" min="50" max="600" step="10" value="${clothConfig.mouseRadius}">
        <span class="ctrl-val" id="cv-radius">${clothConfig.mouseRadius}px</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">撥動力道</span>
        <input type="range" id="cr-strength" min="0.5" max="25" step="0.5" value="${clothConfig.mouseStrength}">
        <span class="ctrl-val" id="cv-strength">${clothConfig.mouseStrength}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">重力</span>
        <input type="range" id="cr-gravity" min="0.01" max="0.8" step="0.01" value="${clothConfig.gravity}">
        <span class="ctrl-val" id="cv-gravity">${clothConfig.gravity}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">阻尼</span>
        <input type="range" id="cr-damping" min="0.90" max="0.999" step="0.001" value="${clothConfig.damping}">
        <span class="ctrl-val" id="cv-damping">${clothConfig.damping}</span>
      </div>
      <div class="ctrl-row">
        <span class="ctrl-label">捲動觸發距離</span>
        <input type="range" id="cr-scrolltrig" min="150" max="4000" step="50" value="${clothConfig.scrollTriggerPx}">
        <span class="ctrl-val" id="cv-scrolltrig">${clothConfig.scrollTriggerPx}px</span>
      </div>
    </div>`;
  heroEl.appendChild(ctrlEl);

  if (clothConfig._panelOpen) document.getElementById('ctrl-panel').classList.add('open');

  document.getElementById('ctrl-toggle').addEventListener('click', () => {
    clothConfig._panelOpen = !clothConfig._panelOpen;
    document.getElementById('ctrl-panel').classList.toggle('open', clothConfig._panelOpen);
  });

  // Text input — restart on blur or Enter
  const textInput = document.getElementById('cr-text');
  textInput.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Enter') textInput.blur();
  });
  textInput.addEventListener('blur', () => {
    const v = textInput.value.trim();
    clothConfig.text = v || 'AIR CHANG · INDUSTRIAL DESIGNER · TAIPEI · TAIWAN · 張耀中 · ';
    rebuildHeroV2();
  });

  // Sliders that need a grid restart
  [
    ['cr-curtain',  'cv-curtain',  v => Math.round(v) + '%',                   v => { clothConfig.curtainPct   = v / 100; }],
    ['cr-fontsize', 'cv-fontsize', v => v > 0 ? v + 'px' : '自動',             v => { clothConfig.fontSize      = v; }],
    ['cr-ls',       'cv-ls',       v => rnd(v,1) + '×',                        v => { clothConfig.letterSpacing = v; }],
    ['cr-lh',       'cv-lh',       v => rnd(v,1) + '×',                        v => { clothConfig.lineSpacing   = v; }],
  ].forEach(([sid, vid, display, setter]) => {
    document.getElementById(sid)?.addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      setter(v);
      document.getElementById(vid).textContent = display(v);
      rebuildHeroV2();
    });
  });

  // Live sliders (no restart needed)
  [
    ['cr-radius',     'cv-radius',     'mouseRadius',     v => Math.round(v) + 'px'],
    ['cr-strength',   'cv-strength',   'mouseStrength',   v => rnd(v)],
    ['cr-gravity',    'cv-gravity',    'gravity',         v => rnd(v)],
    ['cr-damping',    'cv-damping',    'damping',         v => rnd(v,3)],
    ['cr-scrolltrig', 'cv-scrolltrig', 'scrollTriggerPx', v => Math.round(v) + 'px'],
  ].forEach(([sid, vid, key, display]) => {
    document.getElementById(sid)?.addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      clothConfig[key] = v;
      document.getElementById(vid).textContent = display(v);
    });
  });

  requestAnimationFrame(() => {
    const c = document.getElementById('cloth-canvas');
    if (c) startClothPortrait(c);
  });

  // Keep the background fade/zoom in sync with the current intro progress
  // — matters when this runs via rebuildHeroV2() (e.g. a cloth-config
  // slider tweak mid-intro), since that replaces .v2-bg with a fresh
  // element that would otherwise reset to fully opaque/unscaled
  // regardless of curtainProgress.
  syncHeroV2Bg();
}

/* .v2-bg's opacity/zoom only update where curtainProgress changes (it's
   an imperative inline style, not recomputed every frame like the cloth
   text canvas), so every place that changes curtainProgress needs to
   call this afterward to keep the photo in sync. */
function syncHeroV2Bg() {
  const bg = document.querySelector('.v2-bg');
  if (bg) {
    bg.style.opacity   = String(1 - curtainEased());
    bg.style.transform = `scale(${1 + curtainEased() * HERO_BG_ZOOM})`;
  }
}

/* Rebuilds ONLY the hero section (used when a cloth parameter needs the
   text grid regenerated from scratch). Projects/Info sections, scroll
   position, and edit-mode state are all left completely untouched —
   unlike a full renderHome(), which would also be correct but would
   needlessly tear down and re-mount the rest of the page. */
function rebuildHeroV2() {
  const heroEl = document.getElementById('hero-section');
  if (!heroEl || homeVariant !== 'v2') { renderHome(); return; }
  // outerHTML swap also removes #cloth-ctrl since it was appended as a
  // child of heroEl — initHeroV2() below creates a fresh one.
  heroEl.outerHTML = buildHeroV2HTML();
  initHeroV2();
}

/* Intro scroll-lock — see the curtainProgress comment above clothConfig.
   The wheel listener below is registered once at load time and checks
   conditions internally rather than being attached/detached per hero
   mount, so it stays correct across variant switches, hero rebuilds, and
   route changes with no lifecycle management needed.

   A gentle quad ease-in for the first half, settling into a perfectly
   linear (1:1 with wheel input) rate for the second half, is applied to
   curtainProgress wherever it drives something visible — a full
   ease-IN-OUT was tried first, but its deceleration to near-zero speed
   right at t=1 caused a stall-then-snap the instant it handed off to
   native scrolling. Ending at slope 1 instead matches native scroll
   speed exactly, so the handoff is seamless. The raw progress itself
   stays linear with wheel input; only the OUTPUT is eased. */
function easeInThenLinear(t) {
  return t <= 0.5 ? 2 * t * t : t;
}
function curtainEased() { return easeInThenLinear(curtainProgress); }

/* How far the page scrolls over the full 0→1 curtain gesture — the
   distance from the top to where Projects naturally begins, so the
   hand-off to normal scrolling is seamless. */
function heroScrollHeight() {
  const sec = document.getElementById('projects-section');
  return sec ? sec.getBoundingClientRect().top + window.scrollY : window.innerHeight;
}

function onIntroWheel(e) {
  if (homeVariant !== 'v2' || location.pathname !== '/') return;
  if (e.target.closest('#cloth-ctrl')) return; // let the config panel scroll/scrub normally

  const heroH = heroScrollHeight();
  if (window.scrollY > heroH + 2) return; // well past the hero — normal scroll entirely

  const step = e.deltaY / clothConfig.scrollTriggerPx;

  if (e.deltaY > 0 && curtainProgress < 1) {
    e.preventDefault();
    curtainProgress = Math.min(1, curtainProgress + step);
  } else if (e.deltaY < 0 && curtainProgress > 0) {
    e.preventDefault();
    curtainProgress = Math.max(0, curtainProgress + step);
  } else {
    // Already at the matching extreme (0 or 1) — nothing to animate,
    // let the browser do its default thing (no-op at 0, real scroll
    // continuing past the hero at 1).
    return;
  }
  // Scroll the page itself in sync with the curtain — Projects rises
  // underneath as the curtain parts, rather than waiting for it to
  // finish. Some overlap between the two while mid-gesture is expected.
  window.scrollTo({ top: curtainEased() * heroH, behavior: 'instant' });
  syncHeroV2Bg();
}
window.addEventListener('wheel', onIntroWheel, { passive: false });

function startClothPortrait(canvas) {
  const NAV_H   = 52;
  const CW      = window.innerWidth;
  const CH      = window.innerHeight;
  const CLOTH_H = (CH - NAV_H) * clothConfig.curtainPct;

  const TEXT    = (clothConfig.text || '').trim() || 'AIR CHANG · INDUSTRIAL DESIGNER · TAIPEI · TAIWAN · 張耀中 · ';
  const lsMul   = Math.max(0.1, clothConfig.letterSpacing || 1);
  const lhMul   = Math.max(0.1, clothConfig.lineSpacing   || 1);
  const GRID_W  = Math.min(105, Math.max(10, Math.round(Math.floor(CW / 14)     / lsMul)));
  const GRID_H  = Math.min(65,  Math.max(5,  Math.round(Math.floor(CLOTH_H / 12) / lhMul)));
  const CELL_PX = CW / GRID_W;
  const CELL_PY = CLOTH_H / GRID_H;
  const FSIZ    = clothConfig.fontSize > 0
    ? clothConfig.fontSize
    : Math.round(Math.max(9, Math.min(CELL_PX * 0.88, CELL_PY)));
  const OY      = NAV_H;

  canvas.width  = CW;
  canvas.height = CH;
  const ctx = canvas.getContext('2d');

  const n   = GRID_W * GRID_H;
  const gid = (j, i) => j + i * GRID_H;

  const px  = new Float32Array(n), py  = new Float32Array(n);
  const opx = new Float32Array(n), opy = new Float32Array(n);
  const ax  = new Float32Array(n), ay  = new Float32Array(n);
  const pin  = new Uint8Array(n);
  const chr  = new Array(n);

  for (let i = 0; i < GRID_W; i++) {
    for (let j = 0; j < GRID_H; j++) {
      const id = gid(j, i);
      px[id]  = i * CELL_PX;  py[id]  = j * CELL_PY;
      opx[id] = px[id];       opy[id] = py[id];
      pin[id] = j === 0 ? 1 : 0;
      chr[id] = TEXT[(i + j * GRID_W) % TEXT.length];
    }
  }

  /* Constraints */
  const numC = GRID_W * (GRID_H - 1) + (GRID_W - 1) * GRID_H;
  const cp1  = new Int32Array(numC), cp2  = new Int32Array(numC);
  const clen = new Float32Array(numC);
  const cmin = new Float32Array(numC), cmax = new Float32Array(numC);
  const dwnC = new Int32Array(n).fill(-1);

  let ci = 0;
  for (let i = 0; i < GRID_W; i++) {
    for (let j = 0; j < GRID_H - 1; j++) {
      const id = gid(j, i), bt = gid(j + 1, i);
      cp1[ci] = id; cp2[ci] = bt;
      clen[ci] = CELL_PY; cmin[ci] = CELL_PY * 0.02; cmax[ci] = CELL_PY * 1.1;
      dwnC[id] = ci; ci++;
    }
  }
  for (let i = 0; i < GRID_W - 1; i++) {
    for (let j = 0; j < GRID_H; j++) {
      const id = gid(j, i), rt = gid(j, i + 1);
      cp1[ci] = id; cp2[ci] = rt;
      clen[ci] = CELL_PX; cmin[ci] = CELL_PX * 0.02; cmax[ci] = CELL_PX * 6;
      ci++;
    }
  }



  /* Mouse / touch — radial repulsion, reads clothConfig live each event */
  let grabId = -1;
  function ssFalloff(e0, e1, x) {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  }
  function onMove(e) {
    if (e.target.closest('#cloth-ctrl')) return;
    // canvas.getBoundingClientRect().top is 0 only while the hero sits at
    // the very top of the viewport; once the page can scroll past it (this
    // hero is now one section in a longer one-page site), the real offset
    // between viewport space and the canvas's own internal coordinate
    // space must be read live, not assumed to equal the nav height alone.
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top - OY;
    if (grabId >= 0) {
      px[grabId] = mx; py[grabId] = my;
      opx[grabId] = mx; opy[grabId] = my;
      return;
    }
    const mSize = clothConfig.mouseRadius * clothConfig.mouseRadius;
    for (let id = 0; id < n; id++) {
      const dx = mx - px[id], dy = my - py[id];
      const ls = dx*dx + dy*dy;
      if (ls < mSize) {
        const a = Math.atan2(dy, dx) - Math.PI;
        const str = ssFalloff(mSize, -2000, ls) * clothConfig.mouseStrength;
        ax[id] += Math.cos(a) * str;
        ay[id] += Math.sin(a) * str;
      }
    }
  }
  function onDown(e) {
    if (e.target.closest('#cloth-ctrl')) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top - OY;
    for (let id = 0; id < n; id++) {
      if (pin[id]) continue;
      const dx = mx - px[id], dy = my - py[id];
      if (dx*dx + dy*dy < 400) { grabId = id; pin[id] = 2; break; }
    }
  }
  function onUp() {
    if (grabId >= 0) { if (pin[grabId] === 2) pin[grabId] = 0; grabId = -1; }
  }
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerdown', onDown);
  document.addEventListener('pointerup',   onUp);

  /* RAF loop */
  let rafId;
  function loop() {
    // Must check THIS canvas specifically, not "does #cloth-canvas exist
    // anywhere" — a rebuild (variant toggle, slider drag) creates a new
    // canvas under the same id, which would otherwise make this stale
    // loop think it's still current and run forever in the background.
    if (!canvas.isConnected) {
      cancelAnimationFrame(rafId);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup',   onUp);
      return;
    }
    rafId = requestAnimationFrame(loop);

    // The hero now sits inside a scrollable one-page site instead of being
    // the only thing on screen, so skip the physics/draw work entirely
    // while it's scrolled out of view (still resumes seamlessly — points
    // just sit frozen until they're visible again).
    const heroRect = canvas.getBoundingClientRect();
    if (heroRect.bottom <= 0 || heroRect.top >= window.innerHeight) return;

    /* Verlet */
    for (let id = 0; id < n; id++) {
      if (pin[id]) { ax[id] = ay[id] = 0; continue; }
      const vx = (px[id] - opx[id]) * clothConfig.damping;
      const vy = (py[id] - opy[id]) * clothConfig.damping;
      opx[id] = px[id]; opy[id] = py[id];
      px[id] += vx + ax[id];
      py[id] += vy + ay[id] + clothConfig.gravity;
      ax[id] = ay[id] = 0;
    }

    /* Constraints */
    for (let iter = 0; iter < 3; iter++) {
      for (let k = 0; k < numC; k++) {
        const a = cp1[k], b2 = cp2[k];
        const dx = px[b2] - px[a], dy = py[b2] - py[a];
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist === 0) continue;
        let tgt = clen[k];
        if (dist < cmin[k]) tgt = cmin[k];
        else if (dist > cmax[k]) tgt = cmax[k];
        else continue;
        const diff = (tgt - dist) / dist * 0.5;
        const ox = dx*diff, oy2 = dy*diff;
        if (!pin[a])  { px[a]  -= ox; py[a]  -= oy2; }
        if (!pin[b2]) { px[b2] += ox; py[b2] += oy2; }
      }
    }

    /* Draw — white text over photo background */
    ctx.clearRect(0, 0, CW, CH);
    ctx.font = `bold ${FSIZ}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    // Intro reveal: as curtainProgress rises, the text parts away from
    // the canvas's own center toward the left/right edges and fades out —
    // a pure draw-time offset, so it doesn't disturb the physics state
    // (dragging cloth points with the mouse still works underneath).
    // Uses the eased value so the motion isn't linear/mechanical.
    const eased = curtainEased();
    const splitOffset = eased * CW * 0.6;
    const midX = CW / 2;
    ctx.globalAlpha = Math.max(0, 1 - eased * 1.3);

    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_H; j++) {
        const id = gid(j, i);
        const ch = chr[id];
        if (ch === ' ') continue;
        const dx = splitOffset === 0 ? 0 : (px[id] < midX ? -splitOffset : splitOffset);
        ctx.fillText(ch, px[id] + dx, py[id] + OY);
      }
    }
    ctx.globalAlpha = 1;
  }

  rafId = requestAnimationFrame(loop);
}

/* =============================================
   Info Page — module-level data so editor can access
   ============================================= */
const portfolioItems = [
  { cat: '專案管理', role: '專案經理',   name: '智慧5G防災教育',                          date: '2023.02' },
  { cat: '專案管理', role: '專案管理師', name: '勤美工家2.0 工地計畫',                    date: '2022.10' },
  { cat: '專案管理', role: '專案管理師', name: '臺灣文博會 — 寶島冰菓室',                  date: '2022.03' },
  { cat: '專案管理', role: '專案管理師', name: '台東食育提案所',                           date: '2021.10' },
  { cat: '展覽設計', role: '策劃設計',   name: '臺灣文博會 — 寶島冰菓室',                  date: '2022.07' },
  { cat: '展覽設計', role: '策劃設計',   name: '台東食育提案所 × 知本老爺酒店',            date: '2022.02' },
  { cat: '展覽設計', role: '策劃設計',   name: '台灣設計展 — 電美',                        date: '2020' },
  { cat: '出版設計', role: '編輯設計',   name: '斯土斯民‧臺灣的故事',                     date: '2022.01' },
  { cat: '出版設計', role: '編輯設計',   name: '台東食育提案所 — 美味食旅',               date: '2021.11' },
  { cat: '工作坊',   role: '企劃主持',   name: '勤美璞真 × 朝陽科大 工家2.0 田調工作坊', date: '2022.10' },
  { cat: '演講',     role: '講師',       name: '信義學堂線上講座《水越設計色彩行動》',    date: '2022.03' },
  { cat: '工作坊',   role: '企劃主持',   name: '基隆太平山城 × 實踐大學 實驗指標工作坊', date: '2021.12' },
  { cat: '工作坊',   role: '企劃主持',   name: '墾丁國家森林遊樂區 — 墾丁森友會',        date: '2021.09' },
  { cat: '演講',     role: '講師',       name: '宜蘭國際設計教育',                        date: '2020.07' },
  { cat: '協助執行', role: '品牌設計',   name: '台中樂居管家品牌重塑',                    date: '2023.01' },
  { cat: '協助執行', role: '空間指標',   name: '林物局國家森林遊樂區賣店計畫',            date: '2022.03' },
  { cat: '協助執行', role: '空間指標',   name: '新北美術館指標設計',                      date: '2022.02' },
  { cat: '協助執行', role: '品牌設計',   name: '墾森旅遊意象重塑計畫 旅遊意向書',        date: '2021.12' },
];
let infoTextData  = {};  // { key: { text, size, weight, color } }
let infoPhotoUrl  = null; // Info header's own photo block — null = show the "Photo" placeholder
let infoPhotoUrl2 = null; // Easter egg: crossfades in on hover over the photo block, if set
let portfolioOrder = []; // indices into portfolioItems

/* Font-size multipliers (1 = 100%) for the three Info lists — each list's
   columns keep their relative size differences, just scaled together. */
let infoProjTableScale = 1;
let infoExpScale       = 1;
let infoAwardScale     = 1;

/* Project table columns — Excel-like: each has its own editable label,
   its own independently draggable width, can be hidden/restored, and the
   whole set can be reordered by dragging a header. editor.js owns the
   drag/edit/hide/reorder wiring; these are just the data. */
let projColOrder  = ['cat', 'note', 'name', 'role', 'date'];
let projColLabels = { cat: '類別', note: '備註', role: '負責內容', name: '專案名稱', date: '執行時間' };
let projColWidths = { cat: 90, note: 120, role: 150, name: 300, date: 90 }; // px
let projHiddenCols = []; // subset of projColOrder

/* Shared row height per list — null = auto. Dragging any one row's
   height handle sets the WHOLE list's height at once (see
   wireRowHeightHandle in editor.js), rather than each row independently. */
let projRowHeight   = null;
let expRowHeight    = null;
let awardRowHeight  = null;
let creditRowHeight = null;

/* Width of each credit row's label column (see .meta-label) — px,
   dragged via .credit-label-handle (edit mode only). The visual
   distance to the value is this column's own width, not a separate
   gap — .meta-label has flex-shrink:0, so its reserved width (not how
   much of it the label text actually uses) is what determines how much
   space shows before the value starts. Smaller than the original
   5.5rem/88px default so short labels don't leave dead space by
   default; still wide enough for a handful of CJK characters at the
   credit block's usual font size. */
let creditLabelWidth = 56;

/* Horizontal gap between the Experience/Awards columns (see
   .info-lists-row) — px, adjustable via a number input in edit mode. */
let infoListsGap = 39; // matches the original 3rem at the 13px root size

const experienceItems = [
  { company: '光陣三維科技 LightMatrix', role: '專案經理',  period: '2023 — now' },
  { company: '水越設計 AGUA Design',     role: '專案設計師', period: '2021 — 2023' },
  { company: '沼設計 Design Pool',       role: '企劃執行',   period: '2019 — 2020' },
  { company: '驚喜製造 Surprise Lab',    role: '體驗引導',   period: '2018' },
  { company: '大同大學 工業設計學系',     role: '學士',       period: '2017 — 2021' },
];

const awardItems = [
  { name: 'Peca 多功能寵物購物推車', award: '金點新秀獎 年度最佳產品設計 入圍', date: '2021.05' },
  { name: 'Peca 多功能寵物購物推車', award: '放視大賞 產品設計 入圍',            date: '2021.06' },
  { name: 'Vivid 便攜式靜脈注射儀',  award: '放視大賞 產品設計 入圍',            date: '2020.06' },
  { name: 'Vivid 便攜式靜脈注射儀',  award: '晨銘盃 產品設計 入圍',             date: '2020.03' },
];

function buildInfoSectionHTML() {
  const iv = (k, fb) => infoTextData[k]?.text ?? fb;
  const is = k => {
    const d = infoTextData[k];
    if (!d) return '';
    const parts = [];
    if (d.size)   parts.push(`font-size:${d.size}px`);
    if (d.weight) parts.push(`font-weight:${d.weight}`);
    if (d.color)  parts.push(`color:${d.color}`);
    return parts.length ? ` style="${parts.join(';')}"` : '';
  };
  const ik = k => ` data-info-key="${k}"`;
  const order = portfolioOrder.length === portfolioItems.length
    ? portfolioOrder : portfolioItems.map((_, i) => i);

  const ihbFixed = {
    photo:     () => infoPhotoUrl
      ? `<div class="info-photo-stack">
          <img class="info-photo-img" src="${cloudinaryUrl(infoPhotoUrl, 400)}" alt="">
          ${infoPhotoUrl2 ? `<img class="info-photo-img info-photo-img-2" src="${cloudinaryUrl(infoPhotoUrl2, 400)}" alt="">` : ''}
        </div>`
      : `<div class="info-photo-ph">Photo</div>`,
    name:      () => `<h1 class="info-name"${ik('name')}${is('name')}>${iv('name','張 耀中')}</h1>`,
    location:  () => `<p class="info-location"${ik('location')}${is('location')}>${iv('location','Taipei, Taiwan')}</p>`,
    skills:    () => `<p class="info-skills-row"${ik('skills')}${is('skills')}>${iv('skills','Project Management · Exhibition · Social Design · Product Design · Workshop')}</p>`,
    email:     () => `<a href="mailto:po1222555888@gmail.com" class="info-contact-link"><span${ik('email')}${is('email')}>${iv('email','po1222555888@gmail.com')}</span></a>`,
    phone:     () => `<a href="tel:+886988372487" class="info-contact-link"><span${ik('phone')}${is('phone')}>${iv('phone','+886 988 372 487')}</span></a>`,
  };

  return `
  <div class="ihb-toolbar">
    <div class="itr-restore-row${infoHeaderHidden.length ? ' has-hidden' : ''}">
      ${infoHeaderHidden.map(id => `<button class="itr-restore-chip" data-ihb-restore="${id}">+ ${IHB_LABELS[id] || id}</button>`).join('')}
    </div>
    <button class="ihb-add-btn" id="ihb-add-btn">+ 新增文字方塊</button>
  </div>
  <div class="info-header-canvas-wrap" id="info-header-canvas-wrap">
    <div class="info-header-canvas" id="info-header-canvas">
      ${infoHeaderBlocks.filter(b => !infoHeaderHidden.includes(b.id)).map(b => `
      <div class="ihb-block" data-ihb-id="${b.id}">
        ${ihbFixed[b.id] ? ihbFixed[b.id]() : ''}
        <button class="ihb-del" data-ihb-hide="${b.id}" title="移除此方塊">✕</button>
      </div>`).join('')}
      ${infoCustomBlocks.map(b => `
      <div class="ihb-block ihb-custom" data-ihb-custom-id="${b.id}">
        <p style="font-size:${b.fontSize || 13}px;color:${b.color || '#6B6B65'};font-weight:${b.weight || 400}">${b.text || '雙擊以編輯文字'}</p>
        <button class="ihb-del" data-ihb-custom-del="${b.id}" title="刪除此方塊">✕</button>
      </div>`).join('')}
    </div>
  </div>

  <div class="info-total-line-outer">
    <div class="info-total-line" id="info-total-line">
      <span${ik('total-prefix')}${is('total-prefix')}>${iv('total-prefix','Associated with____')}</span>
      <span class="info-total-count">${totalCounterShown ? portfolioItems.length : 0}</span>
      <span${ik('total-suffix')}${is('total-suffix')}>${iv('total-suffix','Projects')}</span>
    </div>
  </div>

  <div class="info-proj-table" style="--row-scale:${infoProjTableScale}${projRowHeight ? `;--row-h:${projRowHeight}px` : ''}">
    <div class="itr-scale-ctrl">
      <span>字級</span>
      <input type="number" class="itr-scale-input" data-scale-target="proj" min="50" max="200" step="5" value="${Math.round(infoProjTableScale * 100)}">
      <span>%</span>
    </div>
    <div class="itr-restore-row${projHiddenCols.length ? ' has-hidden' : ''}">
      ${projHiddenCols.map(k => `<button class="itr-restore-chip" data-restore-key="${k}">+ ${projColLabels[k]}</button>`).join('')}
    </div>
    <div class="info-proj-head">
      ${projColOrder.filter(k => !projHiddenCols.includes(k)).map(k => `
      <span class="itr-head-cell" data-col-key="${k}">
        <span class="itr-head-drag" title="拖曳調整欄位順序">⋮⋮</span>
        <span class="itr-head-label">${projColLabels[k]}</span>
        <button class="itr-head-del" data-col-key="${k}" title="隱藏此欄">✕</button>
      </span>`).join('')}
    </div>
    ${(() => {
      const editingNow = document.body.classList.contains('editor-active');
      const showAll = projListExpanded || editingNow;
      const visible = showAll ? order : order.slice(0, PROJ_LIST_COLLAPSE_COUNT);
      const isCollapsed = !showAll && order.length > visible.length;
      // Only animate the newly-revealed rows the one time this render is
      // the direct result of clicking "+" — consumed immediately so it
      // never replays on later, unrelated re-renders.
      const animateExpand = projListJustExpanded && showAll;
      projListJustExpanded = false;
      const rowsHtml = visible.map((origIdx, i) => { const p = portfolioItems[origIdx];
        const fade = isCollapsed && i === visible.length - 1 ? ' itr-row-fade' : '';
        const reveal = animateExpand && i >= PROJ_LIST_COLLAPSE_COUNT ? ' itr-row-reveal' : '';
        const delay = reveal ? ` style="transition-delay:${(i - PROJ_LIST_COLLAPSE_COUNT) * 35}ms"` : '';
        return `
    <div class="info-proj-row${fade}${reveal}" data-proj-idx="${origIdx}"${p.linkSlug ? ` data-proj-link="${p.linkSlug}"` : ''}${delay}>
      <span class="itr-handle">⋮⋮</span>
      ${projColOrder.filter(k => !projHiddenCols.includes(k)).map(k => `<span class="itr-${k}">${p[k] ?? ''}</span>`).join('')}
      <div class="itr-row-actions"></div>
      ${fade ? '<div class="itr-fade-overlay"></div>' : ''}
    </div>`; }).join('');
      const expandHtml = isCollapsed
        ? `<button class="itr-expand-btn" onclick="expandProjList()" title="顯示全部 ${order.length} 個專案" aria-label="顯示全部 ${order.length} 個專案">+</button>`
        : (projListExpanded && !editingNow
          ? `<button class="itr-expand-btn itr-collapse-btn" onclick="collapseProjList()" title="收合專案列表" aria-label="收合專案列表">−</button>`
          : '');
      return rowsHtml + expandHtml;
    })()}
  </div>

  <div class="ihb-toolbar">
    <span></span>
    <div class="itr-scale-ctrl">
      <span>間距</span>
      <input type="number" class="itr-scale-input" id="info-lists-gap-input" min="-150" max="120" step="4" value="${infoListsGap}">
      <span>px</span>
    </div>
  </div>
  <div class="info-lists-row" style="column-gap:${Math.max(infoListsGap, 0)}px">
    <div class="info-section" id="info-exp-section" style="--row-scale:${infoExpScale}${expRowHeight ? `;--row-h:${expRowHeight}px` : ''}">
      <h2 class="info-section-title"${ik('exp-title')}${is('exp-title')}>${iv('exp-title','Experience')}</h2>
      <div class="itr-scale-ctrl">
        <span>字級</span>
        <input type="number" class="itr-scale-input" data-scale-target="exp" min="50" max="200" step="5" value="${Math.round(infoExpScale * 100)}">
        <span>%</span>
      </div>
      ${experienceItems.map((e, i) => `
      <div class="info-exp-row" data-exp-idx="${i}">
        <span class="itr-handle">⋮⋮</span>
        <div class="info-exp-left">
          <span class="info-exp-company">${e.company}</span>
          <span class="info-exp-role">${e.role}</span>
        </div>
        <span class="info-exp-period">${e.period}</span>
      </div>`).join('')}
    </div>

    <div class="info-section" id="info-award-section" style="--row-scale:${infoAwardScale}${awardRowHeight ? `;--row-h:${awardRowHeight}px` : ''}${infoListsGap < 0 ? `;margin-left:${infoListsGap}px` : ''}">
      <h2 class="info-section-title"${ik('awards-title')}${is('awards-title')}>${iv('awards-title','Awards')}</h2>
      <div class="itr-scale-ctrl">
        <span>字級</span>
        <input type="number" class="itr-scale-input" data-scale-target="award" min="50" max="200" step="5" value="${Math.round(infoAwardScale * 100)}">
        <span>%</span>
      </div>
      ${awardItems.map((a, i) => `
      <div class="info-exp-row" data-award-idx="${i}">
        <span class="itr-handle">⋮⋮</span>
        <div class="info-exp-left">
          <span class="info-exp-company">${a.name}</span>
          <span class="info-exp-role">${a.award}</span>
        </div>
        <span class="info-exp-period">${a.date}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

/* Contact section — dark inverted block with two free-form draggable text
   blocks (phone/email) over the site footer text. The two blocks start
   pre-filled from whatever the About section's own email/phone already
   contain (or their defaults), then become independently editable. */
function defaultContactBlocks() {
  const phoneText = infoTextData.phone?.text ?? '+886 988 372 487';
  const emailText = infoTextData.email?.text ?? 'po1222555888@gmail.com';
  return [
    { id: 'phone', x: 0, y: 0,    w: 0.5, h: 0.09, text: phoneText, fontSize: 22, weight: 500, color: '#F5F4F0' },
    { id: 'email', x: 0, y: 0.13, w: 0.6, h: 0.09, text: emailText, fontSize: 22, weight: 500, color: '#F5F4F0' },
  ];
}

function buildContactSectionHTML() {
  if (!contactBlocks) contactBlocks = defaultContactBlocks();
  const isFixed = id => id === 'phone' || id === 'email';
  return `
  <div class="ihb-toolbar">
    <span></span>
    <button class="ihb-add-btn" id="contact-add-btn">+ 新增文字方塊</button>
  </div>
  <div class="contact-canvas-wrap" id="contact-canvas-wrap">
    <div class="contact-canvas" id="contact-canvas">
      ${contactBlocks.map(b => `
      <div class="contact-block" data-contact-id="${b.id}">
        <p style="font-size:${b.fontSize || 22}px;color:${b.color || '#F5F4F0'};font-weight:${b.weight || 500}">${b.text || '雙擊以編輯文字'}</p>
        ${isFixed(b.id) ? '' : `<button class="ihb-del" data-contact-del="${b.id}" title="刪除此方塊">✕</button>`}
      </div>`).join('')}
    </div>
  </div>
  <footer class="contact-footer">Air Chang © All rights reserved.</footer>`;
}

/* Patches just the contact section's content in place, same reasoning as
   renderInfo(). */
function renderContact() {
  const section = document.getElementById('contact-section');
  if (!section) { renderHome(); return; }
  section.innerHTML = buildContactSectionHTML();
  requestAnimationFrame(applyContactPositions);
}

/* Patches just the info section's content in place — same reasoning as
   renderProjects(): the merged home page stays mounted, so scroll position
   and the hero's animation are never disturbed by an info-only edit. */
function renderInfo() {
  const section = document.getElementById('info-section');
  if (!section) { renderHome(); return; }
  section.innerHTML = buildInfoSectionHTML();
  initTotalCounterObserver(); // no-op once already shown this session
  requestAnimationFrame(applyInfoHeaderPositions);
  requestAnimationFrame(applyProjRowLineOffset);
  requestAnimationFrame(applyTotalLineFit);
  requestAnimationFrame(applyInfoListsOverlapCheck);

  // Newly-revealed rows (see .itr-row-reveal) start hidden; flip them to
  // their visible state one frame later so the browser actually paints
  // the hidden state first and the transition has something to animate
  // from — same double-rAF trick setPage() uses for .page.visible.
  const revealRows = section.querySelectorAll('.itr-row-reveal');
  if (revealRows.length) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      revealRows.forEach(el => el.classList.add('itr-row-reveal-in'));
    }));
  }
}

/* =============================================
   Project Detail
   ============================================= */
function renderDetail(slug) {
  const p = projects.find(x => x.slug === slug);
  if (!p) { renderNotFound(); return; }

  const idx  = projects.indexOf(p);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  const number = String(idx + 1).padStart(3, '0');
  const coverUrl = p.cover ? cloudinaryUrl(p.cover, 2400) : null;
  const gallery = p.gallery || [];

  const galleryHtml = gallery.map(g => g.ratio ? `
    <div class="gallery-item gallery-item-cropped" data-gallery-id="${g.id}" style="aspect-ratio:${g.ratio}">
      <img class="gi-crop-img" src="${cloudinaryUrl(g.url, 1800)}" draggable="false">
    </div>` : `
    <div class="gallery-item" data-gallery-id="${g.id}">
      <img src="${cloudinaryUrl(g.url, 1800)}" draggable="false">
    </div>`).join('');

  const albumPhotos = p.albumPhotos || [];
  const albumSlidesHtml = albumPhotos.map((ph, i) => `
    <div class="album-slide" style="opacity:${i === 0 ? 1 : 0}">
      <img src="${cloudinaryUrl(ph.url, 1400)}" draggable="false">
    </div>`).join('');

  const sectionGaps = p.sectionGaps || [80, 80];
  const sectionLines = p.sectionDividers || [true, false];
  const dividerHtml = idx => `
    <div class="section-divider" data-divider-idx="${idx}" style="height:${sectionGaps[idx]}px">
      <div class="section-divider-line" style="display:${sectionLines[idx] ? '' : 'none'}"></div>
    </div>`;

  const customBlocks = p.customBlocks || [];
  const customHtml = customBlocks.map(b => {
    if (b.type === 'line') {
      return `<div class="custom-line" data-custom-id="${b.id}" data-custom-type="line"></div>`;
    }
    return `<div class="custom-text" data-custom-id="${b.id}" data-custom-type="text">
      <p style="font-size:${b.fontSize || 13}px;color:${b.color || '#6B6B65'};font-weight:${b.weight || 400}">${b.text || '雙擊以編輯文字'}</p>
    </div>`;
  }).join('');

  setPage(`
<div class="page detail-page">
  ${coverUrl ? `<div class="detail-cover-img"><div class="dc-frame"><img class="dc-img" src="${coverUrl}" alt="${p.name}" draggable="false"></div></div>` : ''}

  <div class="detail-split">
    <div class="detail-left">
      <div class="detail-header">
        <span class="detail-number">${number}</span>
        <h1 class="detail-title">${p.name}</h1>
        <p class="detail-subtitle" data-text-block="subtitle" style="font-size:${p.subFontSize || 13}px;font-weight:${p.subWeight || 400};color:${p.subColor || '#9B9B93'}">${p.subtitle}</p>
      </div>

      <div class="detail-meta-row" data-project-slug="${p.slug}">
        ${p.stHidden ? '' : `
        <div class="detail-statement" data-text-block="statement" style="${(p.stWidth > 0 && p.stWidth <= 1) ? `width:${(p.stWidth * 100).toFixed(2)}%;` : ''}">
          <p style="font-size:${p.stFontSize || 12}px;color:${p.stColor || '#6B6B65'};font-weight:${p.stWeight || 400}">${p.desc}</p>
        </div>`}
      </div>

      <div class="credit-canvas" id="credit-canvas" data-project-slug="${p.slug}">
        <div class="detail-credit" data-text-block="credit" style="font-size:${p.crFontSize || 11}px${creditRowHeight ? `;--row-h:${creditRowHeight}px` : ''};--meta-label-w:${creditLabelWidth}px">
          ${p.meta.map((m, i) => { const crStyle = (p.crColor || p.crWeight) ? ` style="${p.crColor ? `color:${p.crColor};` : ''}${p.crWeight ? `font-weight:${p.crWeight};` : ''}"` : ''; return `
          <div class="meta-row" data-meta-idx="${i}">
            <span class="meta-label"${crStyle}>${m.label}</span>
            <span class="meta-value"${crStyle}>${m.value}</span>
          </div>`; }).join('')}
        </div>
      </div>

      ${dividerHtml(0)}

      <div class="outro-row">
        <div class="outro-canvas" id="outro-canvas" data-project-slug="${p.slug}">
          <div class="project-album" data-outro-block="album">
            <div class="album-track">
              ${albumSlidesHtml}
              ${!albumPhotos.length ? `<div class="album-empty">尚未上傳照片</div>` : ''}
            </div>
            ${albumPhotos.length > 1 ? `
            <button class="hero-arrow prev album-arrow" aria-label="Previous">‹</button>
            <button class="hero-arrow next album-arrow" aria-label="Next">›</button>
            <div class="hero-dots album-dots">
              ${albumPhotos.map((_, i) => `<div class="hero-dot${i === 0 ? ' active' : ''}"></div>`).join('')}
            </div>` : ''}
          </div>
          ${p.linkHidden ? '' : `
          <a href="${p.linkUrl || '#'}" class="full-project-link" data-outro-block="link"
             ${p.linkUrl ? 'target="_blank" rel="noopener noreferrer"' : 'onclick="return false;"'}>
            <span class="fpl-text" style="font-size:${p.linkFontSize || 13}px;color:${p.linkColor || '#1A1A18'};font-weight:${p.linkWeight || 600}">${p.linkText || 'Full Project'}</span>
            <span class="fpl-arrow">⟶</span>
          </a>`}
        </div>
      </div>
    </div>

    <div class="detail-right">
      <div class="detail-gallery-list" id="gallery-canvas" data-project-slug="${p.slug}">${galleryHtml}</div>
      <div class="custom-canvas" id="custom-canvas" data-project-slug="${p.slug}">${customHtml}</div>
    </div>
  </div>

  <nav class="detail-nav">
    <div class="detail-nav-item" onclick="navigate('/projects/${prev.slug}')" tabindex="0">
      <span class="nav-dir">← Previous</span>
      <span class="nav-proj">${prev.name}</span>
    </div>
    <div class="detail-nav-item" onclick="navigate('/projects/${next.slug}')" tabindex="0">
      <span class="nav-dir">Next →</span>
      <span class="nav-proj">${next.name}</span>
    </div>
  </nav>
</div>`);

  requestAnimationFrame(() => {
    applyOutroPositions(p);
    applyCreditPosition(p);
    applyCustomPositions(p);
    applyCoverCrop(p);
    applyGalleryCrops(p);
    const albumEl = document.querySelector('.project-album');
    if (albumEl) startAlbumCarousel(albumEl);
    initGalleryRevealObserver();
    applyMobileOutroOrder();
  });
}

/* On mobile, the album + "Full Project" link are moved to the very end
   of the page, side by side, after the gallery images — which live in a
   different container (.detail-right) than their normal home inside
   .outro-canvas/.detail-left, so this can't be done with a CSS order
   property alone without flattening both containers. A wrapper div
   (mobile-only, created here) holds the pair so CSS can lay them out as
   a row; on desktop everything is moved back to its original free-form
   position inside .outro-canvas and the wrapper is discarded. Moving
   the actual DOM nodes (not cloning) keeps their drag/upload listeners
   and the carousel timer intact across the move. */
function applyMobileOutroOrder() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const album = document.querySelector('.project-album');
  const link = document.querySelector('.full-project-link');
  const outroCanvas = document.getElementById('outro-canvas');
  const detailSplit = document.querySelector('.detail-split');
  if (!album || !link || !outroCanvas || !detailSplit) return;
  if (isMobile) {
    let wrap = document.getElementById('mobile-outro-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'mobile-outro-wrap';
      wrap.className = 'mobile-outro-wrap';
      detailSplit.appendChild(wrap);
    }
    wrap.appendChild(album);
    wrap.appendChild(link);
  } else {
    outroCanvas.insertBefore(album, outroCanvas.firstChild);
    outroCanvas.appendChild(link);
    document.getElementById('mobile-outro-wrap')?.remove();
  }
}
window.addEventListener('resize', applyMobileOutroOrder);

/* Scroll reveal for the detail-page gallery images — same mechanic as
   initProjectRevealObserver on the home page (see there for the full
   rationale): each .gallery-item fades/rises in via .in-view, and the
   effect replays every time it re-enters the viewport. */
let galleryRevealObserver = null;
function initGalleryRevealObserver() {
  if (galleryRevealObserver) galleryRevealObserver.disconnect();
  const canvas = document.getElementById('gallery-canvas');
  if (!canvas) return;
  galleryRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  canvas.querySelectorAll('.gallery-item').forEach(el => galleryRevealObserver.observe(el));
}

/* =============================================
   404
   ============================================= */
function renderNotFound() {
  setPage(`
<div class="page not-found">
  <span class="not-found-num">404</span>
  <a href="/" class="not-found-back" data-link>← Back to Home</a>
</div>`);
}

/* =============================================
   Routes
   ============================================= */
router.add(/^\/$/, () => renderHome());
// Legacy standalone routes now just land on the matching section of the
// merged one-page site (old bookmarks/links keep working).
router.add(/^\/projects$/, () => { history.replaceState({}, '', '/#projects-section'); pendingScrollTarget = 'projects-section'; renderHome(); });
router.add(/^\/info$/,     () => { history.replaceState({}, '', '/#info-section');     pendingScrollTarget = 'info-section';     renderHome(); });
router.add(/^\/contact$/,  () => { history.replaceState({}, '', '/#contact-section');  pendingScrollTarget = 'contact-section';  renderHome(); });
router.add(/^\/projects\/([^/]+)$/, m => renderDetail(m[1]));
router.add(/.*/, () => renderNotFound());

// router.init() is called by editor.js after loadAll() so saved data
// (cover images, block layout) is ready before the first render.
