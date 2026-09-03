/* =============================================
   Air Chang — Front-end Editor  (free-form canvas)
   ============================================= */
(function () {

  const KEY_PROJECTS    = 'airchang_projects_v4';
  const KEY_BLOCKS      = 'airchang_blocks_v5';
  const KEY_BLOCKS_V4   = 'airchang_blocks_v4';
  const KEY_LEGACY      = 'airchang_projects_v3';
  const KEY_PROJECTS_BG = 'airchang_projects_bg';
  const KEY_CAROUSEL    = 'airchang_carousel';
  const KEY_INFO_TEXT   = 'airchang_info_text';
  const KEY_INFO_PHOTO  = 'airchang_info_photo';
  const KEY_INFO_PHOTO2 = 'airchang_info_photo2';
  const KEY_INFO_ORDER  = 'airchang_info_order';
  const KEY_DETAIL_INSET = 'airchang_detail_inset';
  const KEY_DETAIL_SPLIT = 'airchang_detail_split';
  const KEY_DETAIL_COVER_RATIO = 'airchang_detail_cover_ratio';
  const KEY_TABLE_COLS   = 'airchang_table_cols';
  const KEY_INFO_ITEMS   = 'airchang_info_items';
  const KEY_EXP_ITEMS    = 'airchang_exp_items';
  const KEY_AWARD_ITEMS  = 'airchang_award_items';
  const KEY_INFO_SCALES  = 'airchang_info_scales';
  const KEY_PROJ_COLS    = 'airchang_proj_cols';
  const KEY_ROW_HEIGHTS  = 'airchang_row_heights';
  const KEY_LISTS_GAP    = 'airchang_lists_gap';
  const KEY_INFO_HEADER  = 'airchang_info_header';
  const KEY_CONTACT      = 'airchang_contact';
  const KEY_INFO_MAX_WIDTH = 'airchang_info_max_width';
  const PH_COLORS       = ['#C8BBA8','#B8C5CC','#A8B4A0','#C9AEB5','#C8B888','#B8A898'];

  const CLOUDINARY_CLOUD  = 'ddi1otddv';
  const CLOUDINARY_PRESET = 'air chang';

  let projectsBg = '#FFFFFF';

  /* ——— Layout constants ——— */
  const COLS     = 48;
  const SNAP_X   = 1 / COLS;          // 1/48 column snap
  const SNAP_Y   = 1 / (COLS * 2);    // 1/96 row snap (finer)
  const MIN_W    = SNAP_X;
  const MIN_H    = SNAP_Y * 2;
  const GUIDE_PX = 8;                  // pixel tolerance for alignment guides

  let isEditing = false;

  /* =============================================
     IndexedDB  — stores cover images (no quota limit)
     ============================================= */
  const idb = (() => {
    let db = null;
    function open() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open('airchang_covers', 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore('covers');
        req.onsuccess  = e => { db = e.target.result; resolve(); };
        req.onerror    = () => reject(req.error);
      });
    }
    function store(mode) { return db.transaction('covers', mode).objectStore('covers'); }
    return {
      open,
      get:    key      => new Promise(r => { const q = store('readonly').get(key);     q.onsuccess = () => r(q.result ?? null); q.onerror = () => r(null); }),
      put:    (key, v) => new Promise(r => { const q = store('readwrite').put(v, key); q.onsuccess = r; q.onerror = r; }),
      delete: key      => new Promise(r => { const q = store('readwrite').delete(key); q.onsuccess = r; q.onerror = r; }),
    };
  })();

  /* =============================================
     Persist / Restore
     ============================================= */

  function saveAll() {
    // Cloudinary covers are short URLs → safe to keep in localStorage
    // Legacy base64 covers → strip from localStorage, store in IndexedDB
    const forStorage = projects.map(p => {
      if (!p.cover || p.cover.startsWith('http')) return p;
      const { cover, ...rest } = p;
      return rest;
    });
    localStorage.setItem(KEY_PROJECTS,  JSON.stringify(forStorage));
    localStorage.setItem(KEY_BLOCKS,    JSON.stringify(blocks));
    localStorage.setItem(KEY_CAROUSEL,   JSON.stringify(carouselSlugs));
    localStorage.setItem(KEY_INFO_TEXT,  JSON.stringify(infoTextData));
    localStorage.setItem(KEY_INFO_PHOTO, JSON.stringify(infoPhotoUrl));
    localStorage.setItem(KEY_INFO_PHOTO2, JSON.stringify(infoPhotoUrl2));
    localStorage.setItem(KEY_INFO_ORDER, JSON.stringify(portfolioOrder));
    localStorage.setItem(KEY_DETAIL_INSET, JSON.stringify({
      navL: detailNavInsetL, navR: detailNavInsetR,
    }));
    localStorage.setItem(KEY_DETAIL_SPLIT, JSON.stringify({
      leftPct: detailSplitLeftPct, insetL: detailSplitInsetL, insetR: detailSplitInsetR,
    }));
    localStorage.setItem(KEY_DETAIL_COVER_RATIO, JSON.stringify(detailCoverRatio));
    localStorage.setItem(KEY_INFO_ITEMS, JSON.stringify(portfolioItems));
    localStorage.setItem(KEY_EXP_ITEMS,  JSON.stringify(experienceItems));
    localStorage.setItem(KEY_AWARD_ITEMS, JSON.stringify(awardItems));
    localStorage.setItem(KEY_INFO_SCALES, JSON.stringify({
      proj: infoProjTableScale, exp: infoExpScale, award: infoAwardScale,
    }));
    localStorage.setItem(KEY_PROJ_COLS, JSON.stringify({
      labels: projColLabels, widths: projColWidths, hidden: projHiddenCols, order: projColOrder,
    }));
    localStorage.setItem(KEY_ROW_HEIGHTS, JSON.stringify({
      proj: projRowHeight, exp: expRowHeight, award: awardRowHeight, credit: creditRowHeight,
      creditLabelW: creditLabelWidth,
    }));
    localStorage.setItem(KEY_LISTS_GAP, JSON.stringify(infoListsGap));
    localStorage.setItem(KEY_INFO_HEADER, JSON.stringify({
      blocks: infoHeaderBlocks, hidden: infoHeaderHidden, custom: infoCustomBlocks,
    }));
    if (contactBlocks) localStorage.setItem(KEY_CONTACT, JSON.stringify(contactBlocks));
    localStorage.setItem(KEY_INFO_MAX_WIDTH, JSON.stringify({
      page: infoPageMaxWidth, exp: infoExpWidth, award: infoAwardWidth,
    }));
    // Persist any remaining legacy base64 covers to IndexedDB
    projects.forEach(p => {
      if (p.cover && !p.cover.startsWith('http')) idb.put(p.slug, p.cover).catch(() => {});
      else if (p.cover === null) idb.delete(p.slug).catch(() => {});
    });
  }

  async function loadAll() {
    try { await idb.open(); } catch (e) { /* IDB unavailable — fall back gracefully */ }

    try {
      /* Projects (text metadata only) */
      const sp = JSON.parse(storedItem(KEY_PROJECTS));
      if (Array.isArray(sp) && sp.length) projects.splice(0, projects.length, ...sp);

      /* Load covers: if already in memory (old localStorage format) migrate to IDB,
         otherwise fetch from IDB */
      await Promise.all(projects.map(async p => {
        if (p.cover) {
          // Old format: cover was inside localStorage — move it to IDB, keep in memory
          await idb.put(p.slug, p.cover).catch(() => {});
          return;
        }
        const cover = await idb.get(p.slug).catch(() => null);
        if (cover) p.cover = cover;
      }));

      /* Background color */
      const savedBg = storedItem(KEY_PROJECTS_BG);
      if (savedBg) projectsBg = savedBg;

      /* Blocks v5 (free-form), else migrate from v4 (grid size format),
         else migrate from legacy v3. These used to each `return` on
         success, which — since v5 blocks are essentially always present
         once the site's been used at all — meant EVERYTHING below this
         (carousel order, info text, portfolio items, column/row settings,
         page insets, etc.) never actually loaded back from localStorage
         on a normal page refresh. Restructured as if/else so loading
         blocks no longer skips the rest of this function. */
      const sb = JSON.parse(storedItem(KEY_BLOCKS));
      if (Array.isArray(sb) && sb.length && sb[0].x !== undefined) {
        blocks.splice(0, blocks.length, ...sb);
      } else {
        const sb4 = JSON.parse(storedItem(KEY_BLOCKS_V4));
        if (Array.isArray(sb4) && sb4.length) {
          blocks.splice(0, blocks.length, ...migrateToFreeform(sb4));
          saveAll();
        } else {
          const legacy = JSON.parse(storedItem(KEY_LEGACY));
          if (Array.isArray(legacy) && legacy.length) {
            const legBlocks = legacy.map(p => ({ id: p.id, projectSlug: p.slug, size: p.size || 1 }));
            blocks.splice(0, blocks.length, ...migrateToFreeform(legBlocks));
            if (!(Array.isArray(sp) && sp.length)) {
              projects.splice(0, projects.length, ...legacy.map(({ size, ...p }) => p));
            }
            saveAll();
          }
        }
      }

      /* Carousel slug order */
      const sc = JSON.parse(storedItem(KEY_CAROUSEL));
      if (Array.isArray(sc) && sc.length) carouselSlugs.splice(0, carouselSlugs.length, ...sc);

      const it = JSON.parse(storedItem(KEY_INFO_TEXT));
      if (it && typeof it === 'object') Object.assign(infoTextData, it);

      const ip = JSON.parse(storedItem(KEY_INFO_PHOTO));
      if (typeof ip === 'string' && ip) infoPhotoUrl = ip;

      const ip2 = JSON.parse(storedItem(KEY_INFO_PHOTO2));
      if (typeof ip2 === 'string' && ip2) infoPhotoUrl2 = ip2;
      /* Items must load before the order check — after add/delete the saved
         order length only matches the saved items, not the hard-coded list */
      const ii = JSON.parse(storedItem(KEY_INFO_ITEMS));
      if (Array.isArray(ii) && ii.length) portfolioItems.splice(0, portfolioItems.length, ...ii);
      const io = JSON.parse(storedItem(KEY_INFO_ORDER));
      if (Array.isArray(io) && io.length === portfolioItems.length)
        portfolioOrder.splice(0, portfolioOrder.length, ...io);

      const ex = JSON.parse(storedItem(KEY_EXP_ITEMS));
      if (Array.isArray(ex) && ex.length) experienceItems.splice(0, experienceItems.length, ...ex);
      const aw = JSON.parse(storedItem(KEY_AWARD_ITEMS));
      if (Array.isArray(aw) && aw.length) awardItems.splice(0, awardItems.length, ...aw);

      const scl = JSON.parse(storedItem(KEY_INFO_SCALES));
      if (scl && typeof scl === 'object') {
        // Guard against a corrupt/out-of-range stored value (NaN or wildly
        // outside the 50%-200% the UI slider allows) blowing up text size
        // and breaking the list's width — same bug class as the other
        // stored-width issues.
        const isSaneScale = v => typeof v === 'number' && isFinite(v) && v >= 0.3 && v <= 3;
        if (isSaneScale(scl.proj))  infoProjTableScale = scl.proj;
        if (isSaneScale(scl.exp))   infoExpScale       = scl.exp;
        if (isSaneScale(scl.award)) infoAwardScale     = scl.award;
      }

      const di = JSON.parse(storedItem(KEY_DETAIL_INSET));
      if (di && typeof di === 'object') {
        if (typeof di.navL === 'number') detailNavInsetL = di.navL;
        if (typeof di.navR === 'number') detailNavInsetR = di.navR;
      }
      applyDetailInsets();

      const ds = JSON.parse(storedItem(KEY_DETAIL_SPLIT));
      if (typeof ds === 'number') {
        // Legacy format: KEY_DETAIL_SPLIT used to store just the bare percentage.
        detailSplitLeftPct = clamp(ds, 20, 60);
      } else if (ds && typeof ds === 'object') {
        if (typeof ds.leftPct === 'number') detailSplitLeftPct = clamp(ds.leftPct, 20, 60);
        if (typeof ds.insetL === 'number')  detailSplitInsetL  = ds.insetL;
        if (typeof ds.insetR === 'number')  detailSplitInsetR  = ds.insetR;
      }
      applyDetailSplit();

      const dcr = JSON.parse(storedItem(KEY_DETAIL_COVER_RATIO));
      if (typeof dcr === 'number' && dcr > 0) detailCoverRatio = dcr;
      applyDetailCoverRatio();

      const tc = JSON.parse(storedItem(KEY_TABLE_COLS));
      if (tc && typeof tc === 'object') {
        // Legacy format from before columns had independent widths/labels/
        // hide state: {cols:[cat,role,date]} — migrate into projColWidths.
        if (Array.isArray(tc.cols) && tc.cols.length === 3) {
          [projColWidths.cat, projColWidths.role, projColWidths.date] = tc.cols;
        }
      }

      const pc = JSON.parse(storedItem(KEY_PROJ_COLS));
      if (pc && typeof pc === 'object') {
        if (pc.labels && typeof pc.labels === 'object') Object.assign(projColLabels, pc.labels);
        if (pc.widths && typeof pc.widths === 'object') Object.assign(projColWidths, pc.widths);
        if (Array.isArray(pc.hidden)) projHiddenCols.splice(0, projHiddenCols.length, ...pc.hidden);
        if (Array.isArray(pc.order) && pc.order.length === projColOrder.length
          && pc.order.every(k => projColOrder.includes(k))) {
          projColOrder.splice(0, projColOrder.length, ...pc.order);
        }
      }
      applyTableColWidths();

      const rh = JSON.parse(storedItem(KEY_ROW_HEIGHTS));
      if (rh && typeof rh === 'object') {
        if (typeof rh.proj === 'number')   projRowHeight   = rh.proj;
        if (typeof rh.exp === 'number')    expRowHeight    = rh.exp;
        if (typeof rh.award === 'number')  awardRowHeight  = rh.award;
        if (typeof rh.credit === 'number') creditRowHeight = rh.credit;
        if (typeof rh.creditLabelW === 'number' && isFinite(rh.creditLabelW)) creditLabelWidth = clamp(rh.creditLabelW, 16, 240);
      }

      const lg = JSON.parse(storedItem(KEY_LISTS_GAP));
      if (typeof lg === 'number') infoListsGap = clamp(lg, -150, 120);

      const ihbRaw = JSON.parse(storedItem(KEY_INFO_HEADER));
      const ihbSavedBlocks = Array.isArray(ihbRaw) ? ihbRaw : ihbRaw?.blocks; // legacy: bare array
      if (Array.isArray(ihbSavedBlocks)) {
        ihbSavedBlocks.forEach(saved => {
          const b = infoHeaderBlocks.find(x => x.id === saved.id);
          if (b && typeof saved.x === 'number' && typeof saved.y === 'number'
            && typeof saved.w === 'number' && typeof saved.h === 'number') {
            b.x = saved.x; b.y = saved.y; b.w = saved.w; b.h = saved.h;
          }
        });
      }
      if (ihbRaw && !Array.isArray(ihbRaw)) {
        if (Array.isArray(ihbRaw.hidden)) infoHeaderHidden.splice(0, infoHeaderHidden.length, ...ihbRaw.hidden);
        if (Array.isArray(ihbRaw.custom)) infoCustomBlocks.splice(0, infoCustomBlocks.length, ...ihbRaw.custom);
      }

      const cbRaw = JSON.parse(storedItem(KEY_CONTACT));
      const isFrac = v => typeof v === 'number' && isFinite(v) && v >= -0.2 && v <= 3;
      if (Array.isArray(cbRaw) && cbRaw.every(b => b && (typeof b.id === 'string' || typeof b.id === 'number') && isFrac(b.x) && isFrac(b.y) && isFrac(b.w) && isFrac(b.h))) {
        contactBlocks = cbRaw;
      }

      const imw = JSON.parse(storedItem(KEY_INFO_MAX_WIDTH));
      if (typeof imw === 'number' && imw > 0) {
        infoPageMaxWidth = imw; // legacy format: a bare number, page width only
      } else if (imw && typeof imw === 'object') {
        if (typeof imw.page === 'number' && imw.page > 0)  infoPageMaxWidth = imw.page;
        if (typeof imw.exp === 'number' && imw.exp > 0)    infoExpWidth   = imw.exp;
        if (typeof imw.award === 'number' && imw.award > 0) infoAwardWidth = imw.award;
      }
      infoPageWidthCtrl.apply();
      expWidthCtrl.apply();
      awardWidthCtrl.apply();
    } catch (e) { /* ignore */ }
  }

  /* Inject a <style> that sets the projects page background */
  const bgStyleEl = document.createElement('style');
  bgStyleEl.id = 'projects-bg-style';
  document.head.appendChild(bgStyleEl);

  /* Inject a <style> for dynamic table column widths */
  const tableColsStyleEl = document.createElement('style');
  tableColsStyleEl.id = 'table-cols-style';
  document.head.appendChild(tableColsStyleEl);

  const DEFAULT_COL_W = { cat: 90, role: 150, name: 300, date: 90 };
  function applyTableColWidths() {
    // Excel-like: every visible column gets its own explicit px width (no
    // auto-filling 1fr column), built from whichever columns aren't hidden.
    // On mobile, "role" is ALSO dropped (see .itr-role{display:none} in
    // the ≤768px media query) — that CSS rule only hides its own text
    // though; without excluding it here too, the grid still reserved a
    // full track for it (an empty gap, not extra room for the others),
    // since this function has no idea a column's content is invisible.
    // Dropping the track here is what actually gives that space to
    // "name" instead of leaving it stranded.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const visible = projColOrder.filter(k => !projHiddenCols.includes(k) && !(isMobile && k === 'role'));
    let corrected = false;
    let totalPx = 0;
    const track = visible.map(k => {
      const w = projColWidths[k];
      // Guard against a corrupt/out-of-range stored value (NaN, negative,
      // absurdly huge) breaking the whole table's layout — same bug class
      // as the detail-page statement width issue.
      if (!(typeof w === 'number' && isFinite(w) && w >= 16 && w <= 2000)) {
        projColWidths[k] = DEFAULT_COL_W[k] || 90;
        corrected = true;
      }
      totalPx += projColWidths[k];
      // minmax(0, Npx) rather than a bare Npx track — a plain fixed-length
      // track never shrinks below its own value no matter how narrow the
      // viewport gets, which is what was forcing the whole page to overflow
      // horizontally (and show a left/right scrollbar) once the row's
      // total column width no longer fit. minmax(0, ...) lets the column
      // shrink when the container can't fit it; the row's own width/
      // max-width below is what makes it actually fill that narrower
      // space instead of just clipping.
      //
      // On mobile specifically, use the same number as a flex factor
      // (minmax(0, Nfr)) instead of a px cap. Verified empirically: at a
      // squeeze this extreme (desktop column widths crammed into a phone
      // screen), minmax(0, Npx) tracks don't actually shrink in
      // proportion to their own px value — Chromium just distributes the
      // deficit equally across all of them, landing "name" at the same
      // width as "date" regardless of how much wider it was configured
      // to be. Nfr tracks distribute space (both surplus and deficit) by
      // that ratio always, which is what actually keeps name the
      // dominant column instead of shrinking it down to match the others.
      return isMobile
        ? `minmax(0, ${projColWidths[k]}fr)`
        : `minmax(0, ${projColWidths[k]}px)`;
    }).join(' ');
    if (isMobile) {
      // Nfr tracks already fill 100% of the container on their own —
      // no width/max-width cap needed (or wanted: capping at maxW here
      // would just leave dead space on the right on mobile).
      tableColsStyleEl.textContent = `.info-proj-head,.info-proj-row{grid-template-columns:${track}}`;
      if (corrected) saveAll();
      return;
    }
    const rowEl = document.querySelector('.info-proj-row') || document.querySelector('.info-proj-head');
    const gapPx = rowEl ? (parseFloat(getComputedStyle(rowEl).columnGap) || 0) : 24;
    const maxW = totalPx + gapPx * Math.max(visible.length - 1, 0);
    // width:100% + max-width: at the row's natural (sum of user-dragged
    // column widths) size, it renders exactly as configured; on a
    // container narrower than that, it fills 100% of the container
    // instead, and the minmax(0,...) tracks above share that narrower
    // space proportionally rather than pushing the page wider.
    // Same track in both modes now — the drag handle sits outside the
    // grid (see .info-proj-row .itr-handle), so there's no extra leading
    // column to add in edit mode.
    tableColsStyleEl.textContent = `.info-proj-head,.info-proj-row{grid-template-columns:${track};width:100%;max-width:${maxW}px}`;
    if (corrected) saveAll();
  }

  function applyProjectsBg(color) {
    bgStyleEl.textContent = `.projects-page { background: ${color}; }`;
  }

  /* Width controls — one each for the whole Info page, Experience, and
     Awards, fully independent of each other. Each adjusts max-width
     itself (never a fixed padding override), so it stays responsive at
     any chosen width: it still shrinks on narrow viewports and stays
     centered via margin:auto, same as the un-adjusted default. Handles
     are appended to document.body — NOT to their target section — since
     Exp/Award/the whole page all get their innerHTML replaced on almost
     every edit (renderInfo()), which would silently wipe any handles
     appended as direct children (the exact bug the old boundary-drag
     feature had). Positioned via getBoundingClientRect() instead. */
  let infoPageMaxWidth = 820; // always a number — the page always has a max-width
  let infoExpWidth   = null;  // null = no override, fills the page's content width
  let infoAwardWidth = null;

  function makeWidthControl(cfg) {
    const styleEl = document.createElement('style');
    styleEl.id = cfg.styleElId;
    document.head.appendChild(styleEl);

    function apply() {
      const v = cfg.get();
      // Guard against a corrupt/out-of-range stored value (NaN, negative,
      // absurdly huge) breaking the section's layout — same bug class as
      // the detail-page statement width issue.
      const safe = (typeof v === 'number' && isFinite(v) && v >= 200 && v <= 4000) ? v : null;
      styleEl.textContent = safe === null ? '' :
        `${cfg.selector}{max-width:${safe}px;margin-left:auto;margin-right:auto;}`;
      applyInfoListsOverlapCheck();
    }

    let resizeWired = false;
    function inject() {
      const container = document.querySelector(cfg.selector);
      const existingL = document.getElementById(`${cfg.idPrefix}-l`);
      const existingR = document.getElementById(`${cfg.idPrefix}-r`);
      if (!container) {
        // Navigated away while still in edit mode — the handles live on
        // document.body permanently, so hide them explicitly rather than
        // leaving them stuck pointing at a stale position.
        if (existingL) existingL.style.display = 'none';
        if (existingR) existingR.style.display = 'none';
        return;
      }

      let lh = existingL, rh = existingR;
      if (lh) lh.style.display = ''; // clear any earlier hide from the branch above
      if (rh) rh.style.display = '';
      if (!lh) {
        lh = document.createElement('div');
        lh.id = `${cfg.idPrefix}-l`;
        lh.className = 'info-width-handle';
        lh.title = cfg.title;
        document.body.appendChild(lh);
      }
      if (!rh) {
        rh = document.createElement('div');
        rh.id = `${cfg.idPrefix}-r`;
        rh.className = 'info-width-handle';
        rh.title = cfg.title;
        document.body.appendChild(rh);
      }

      function positionHandles() {
        const rect = container.getBoundingClientRect();
        lh.style.left = (rect.left  - 7) + 'px';
        rh.style.left = (rect.right - 7) + 'px';
        // Constrain to this container's own vertical span — position:fixed
        // ignores any parent, so without this each handle pair would
        // stretch the full viewport height and sit on top of unrelated
        // content (including other sections' editable text).
        lh.style.top = rh.style.top = rect.top + 'px';
        lh.style.height = rh.style.height = rect.height + 'px';
      }
      positionHandles();
      if (!resizeWired) {
        resizeWired = true;
        window.addEventListener('resize', positionHandles);
        // position:fixed doesn't move with the page, so without this the
        // handles would visually detach from their section on scroll.
        window.addEventListener('scroll', positionHandles, { passive: true });
      }

      function wireHandle(h, side) {
        if (h.dataset.wireInit) return;
        h.dataset.wireInit = '1';
        h.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          const startX = e.clientX;
          const startW = cfg.get() ?? container.getBoundingClientRect().width;
          function onMove(ev) {
            const dx = ev.clientX - startX;
            // Dragging outward on either side grows max-width symmetrically —
            // margin:auto splits any width change evenly across both sides.
            const delta = (side === 'left' ? -dx : dx) * 2;
            cfg.set(clamp(Math.round(startW + delta), 200, window.innerWidth));
            apply();
            positionHandles();
          }
          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            saveAll();
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }
      wireHandle(lh, 'left');
      wireHandle(rh, 'right');
    }

    return { apply, inject };
  }

  const infoPageWidthCtrl = makeWidthControl({
    selector: '.info-page', idPrefix: 'info-width-handle', styleElId: 'info-width-style',
    title: '拖曳調整 Info 版面寬度',
    get: () => infoPageMaxWidth, set: v => { infoPageMaxWidth = v; },
  });
  const expWidthCtrl = makeWidthControl({
    selector: '#info-exp-section', idPrefix: 'exp-width-handle', styleElId: 'exp-width-style',
    title: '拖曳調整 Experience 寬度',
    get: () => infoExpWidth, set: v => { infoExpWidth = v; },
  });
  const awardWidthCtrl = makeWidthControl({
    selector: '#info-award-section', idPrefix: 'award-width-handle', styleElId: 'award-width-style',
    title: '拖曳調整 Awards 寬度',
    get: () => infoAwardWidth, set: v => { infoAwardWidth = v; },
  });

  function applyInfoPageMaxWidth() { infoPageWidthCtrl.apply(); }

  function injectInfoWidthHandles() {
    infoPageWidthCtrl.inject();
    expWidthCtrl.inject();
    awardWidthCtrl.inject();
  }

  /* Convert old size-based blocks to free-form coordinates */
  function migrateToFreeform(old) {
    let curX = 0, curY = 0, rowH = 0;
    return old.map(b => {
      const w = b.size === 3 ? 1 : b.size === 2 ? 2/3 : 1/3;
      const h = w * (9 / 16);
      if (curX + w > 1.001) { curY += rowH; curX = 0; rowH = 0; }
      const entry = { id: b.id, projectSlug: b.projectSlug, x: curX, y: curY, w, h };
      curX += w;
      rowH = Math.max(rowH, h);
      return entry;
    });
  }

  // Wait for images to load from IndexedDB before first render
  loadAll().then(() => {
    applyProjectsBg(projectsBg);
    router.init();
  });

  // Re-apply pixel positions on window resize
  window.addEventListener('resize', applyBlockPositions);
  window.addEventListener('resize', applyInfoHeaderPositions);
  window.addEventListener('resize', applyContactPositions);
  window.addEventListener('resize', applyTableColWidths);

  /* =============================================
     Floating Toolbar
     ============================================= */
  const toolbar = document.createElement('div');
  toolbar.id = 'editor-toolbar';
  toolbar.innerHTML = `
    <button id="edt-map"      title="Site Map">☰</button>
    <button id="edt-edit"     title="Edit layout">✏ Edit</button>
    <button id="edt-add"      title="新增方塊"  style="display:none">+ 方塊</button>
    <button id="edt-carousel" title="輪播管理"  style="display:none">≡ 輪播</button>
    <button id="edt-home-var" title="切換首頁版型" style="display:none">首頁 V1</button>
    <button id="edt-cover-add" title="上傳/替換主圖" style="display:none">+ 主圖</button>
    <input  type="file" id="edt-cover-file" accept="image/*" style="display:none">
    <button id="edt-gallery-add" title="新增詳述圖片" style="display:none">+ 圖片</button>
    <input  type="file" id="edt-gallery-file" accept="image/*" multiple style="display:none">
    <button id="edt-text-add" title="新增文字方塊" style="display:none">+ 文字</button>
    <button id="edt-line-add" title="新增細線"   style="display:none">+ 細線</button>
    <button id="edt-link-add" title="新增 Full Project 按鈕" style="display:none">+ Full Project</button>
    <button id="edt-statement-add" title="新增專案論述" style="display:none">+ 專案論述</button>
    <button id="edt-copy-layout" title="將此專案的排版套用到其他所有專案" style="display:none">套用排版到全部專案</button>
    <label  id="edt-bg-wrap"  title="專案頁背景色" style="display:none">
      <input type="color" id="edt-bg" value="#ffffff"> 背景
    </label>`;
  document.body.appendChild(toolbar);

  const mapBtn         = document.getElementById('edt-map');
  const editBtn        = document.getElementById('edt-edit');
  const addBtn         = document.getElementById('edt-add');
  const carouselBtn    = document.getElementById('edt-carousel');
  const homeVarBtn     = document.getElementById('edt-home-var');
  const coverAddBtn    = document.getElementById('edt-cover-add');
  const coverFileInp   = document.getElementById('edt-cover-file');
  const galleryAddBtn  = document.getElementById('edt-gallery-add');
  const galleryFileInp = document.getElementById('edt-gallery-file');
  const textAddBtn     = document.getElementById('edt-text-add');
  const lineAddBtn     = document.getElementById('edt-line-add');
  const linkAddBtn     = document.getElementById('edt-link-add');
  const statementAddBtn = document.getElementById('edt-statement-add');
  const copyLayoutBtn  = document.getElementById('edt-copy-layout');
  const bgWrap         = document.getElementById('edt-bg-wrap');
  const bgInput        = document.getElementById('edt-bg');

  bgInput.value = projectsBg;
  bgInput.addEventListener('input', e => {
    projectsBg = e.target.value;
    applyProjectsBg(projectsBg);
    localStorage.setItem(KEY_PROJECTS_BG, projectsBg);
  });

  mapBtn.addEventListener('click', toggleSiteMap);
  carouselBtn.addEventListener('click', openCarouselEditor);

  coverAddBtn.addEventListener('click', () => coverFileInp.click());
  coverFileInp.addEventListener('change', async () => {
    const p = getCurrentDetailProject();
    const file = coverFileInp.files?.[0];
    if (!p || !file) return;

    coverAddBtn.textContent = '上傳中…';
    try {
      p.cover = await uploadToCloudinary(file);
      saveAll();
      renderDetail(p.slug);
    } catch (err) {
      alert('上傳失敗：' + err.message);
    } finally {
      coverAddBtn.textContent = '+ 主圖';
      coverFileInp.value = '';
    }
  });

  galleryAddBtn.addEventListener('click', () => galleryFileInp.click());
  galleryFileInp.addEventListener('change', async () => {
    const p = getCurrentDetailProject();
    const files = Array.from(galleryFileInp.files || []);
    if (!p || !files.length) return;

    galleryAddBtn.textContent = '上傳中…';
    try {
      if (!p.gallery) p.gallery = [];
      // Sequential list now — array order is display order, so new
      // photos just get appended to the end, no x/y placement math.
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        p.gallery.push({ id: Date.now() + Math.random(), url });
      }
      saveAll();
      renderDetail(p.slug);
    } catch (err) {
      alert('上傳失敗：' + err.message);
    } finally {
      galleryAddBtn.textContent = '+ 圖片';
      galleryFileInp.value = '';
    }
  });

  textAddBtn.addEventListener('click', () => {
    const p = getCurrentDetailProject();
    if (!p) return;
    if (!p.customBlocks) p.customBlocks = [];
    const maxY = p.customBlocks.reduce((m, b) => Math.max(m, b.y + b.h), 0);
    p.customBlocks.push({ id: Date.now() + Math.random(), type: 'text', x: 0, y: maxY + 0.02, w: 0.3, h: 0.08, text: '雙擊以編輯文字' });
    saveAll();
    renderDetail(p.slug);
  });

  lineAddBtn.addEventListener('click', () => {
    const p = getCurrentDetailProject();
    if (!p) return;
    if (!p.customBlocks) p.customBlocks = [];
    const maxY = p.customBlocks.reduce((m, b) => Math.max(m, b.y + b.h), 0);
    p.customBlocks.push({ id: Date.now() + Math.random(), type: 'line', x: 0, y: maxY + 0.02, w: 0.3, h: 0.012 });
    saveAll();
    renderDetail(p.slug);
  });

  linkAddBtn.addEventListener('click', () => {
    const p = getCurrentDetailProject();
    if (!p) return;
    p.linkHidden = false;
    saveAll();
    renderDetail(p.slug);
  });

  statementAddBtn.addEventListener('click', () => {
    const p = getCurrentDetailProject();
    if (!p) return;
    p.stHidden = false;
    saveAll();
    renderDetail(p.slug);
  });

  copyLayoutBtn.addEventListener('click', () => {
    const p = getCurrentDetailProject();
    if (!p) return;
    const others = projects.filter(x => x !== p);
    if (!others.length) return;
    if (!confirm(`將「${p.name}」目前的相片牆位置、文字方塊位置、Credit 項目等套用到其他 ${others.length} 個專案，並覆蓋它們原有的內容。\n\n專案說明文字、相片牆的實際照片不會被覆蓋。確定要套用嗎？`)) return;

    const clone = v => JSON.parse(JSON.stringify(v));
    const reId  = arr => clone(arr).map(item => ({ ...item, id: Date.now() + Math.random() }));

    others.forEach(op => {
      if (p.albumPhotos)  op.albumPhotos  = reId(p.albumPhotos);
      if (p.customBlocks) op.customBlocks = reId(p.customBlocks);
      if (p.meta)     op.meta     = clone(p.meta);
      if (p.albumPos) op.albumPos = clone(p.albumPos);
      if (p.linkPos)  op.linkPos  = clone(p.linkPos);
      if (p.crPos)    op.crPos    = clone(p.crPos);
      op.linkText   = p.linkText;
      op.linkUrl    = p.linkUrl;
      op.linkHidden = p.linkHidden;
    });
    saveAll();
    alert(`已套用到其他 ${others.length} 個專案！`);
  });

  homeVarBtn.addEventListener('click', () => {
    homeVariant = homeVariant === 'v1' ? 'v2' : 'v1';
    localStorage.setItem('airchang_home_variant', homeVariant);
    homeVarBtn.textContent = `首頁 ${homeVariant.toUpperCase()}`;
    renderHome();
  });

  editBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    document.body.classList.toggle('editor-active', isEditing);
    editBtn.classList.toggle('active', isEditing);
    editBtn.innerHTML = isEditing ? '✓ Done' : '✏ Edit';

    // One-page site: Projects and Info are both sections of the same '/'
    // route now (see the MutationObserver below), so editing "home" means
    // editing both at once — there's no separate Projects/Info page to
    // distinguish between anymore.
    const onHomePage   = location.pathname === '/';
    const onDetailPage = /^\/projects\/[^/]+$/.test(location.pathname);
    addBtn.style.display        = (isEditing && onHomePage)   ? '' : 'none';
    carouselBtn.style.display   = (isEditing && onHomePage)   ? '' : 'none';
    coverAddBtn.style.display   = (isEditing && onDetailPage) ? '' : 'none';
    galleryAddBtn.style.display = (isEditing && onDetailPage) ? '' : 'none';
    textAddBtn.style.display    = (isEditing && onDetailPage) ? '' : 'none';
    lineAddBtn.style.display    = (isEditing && onDetailPage) ? '' : 'none';
    if (!(isEditing && onDetailPage)) linkAddBtn.style.display = 'none';
    if (!(isEditing && onDetailPage)) statementAddBtn.style.display = 'none';
    copyLayoutBtn.style.display  = (isEditing && onDetailPage) ? '' : 'none';
    homeVarBtn.style.display    = onHomePage ? '' : 'none';
    homeVarBtn.textContent      = `首頁 ${homeVariant.toUpperCase()}`;

    if (!isEditing) {
      saveAll();
      clearGuides();
      document.getElementById('info-text-editor')?.remove();
      document.querySelectorAll('.itr-cat,.itr-note,.itr-role,.itr-name,.itr-date,.itr-head-label,.info-exp-company,.info-exp-role,.info-exp-period').forEach(el => { el.contentEditable = 'false'; });
      return;
    }
    if (onHomePage) {
      injectFreeformControls();
      injectInfoEditors();
    } else if (onDetailPage) {
      injectGalleryControls();
    } else {
      // Other routes (e.g. 404): navigate home to edit layout
      router.navigate('/');
    }
  });

  addBtn.addEventListener('click', () => {
    const maxY = blocks.reduce((m, b) => Math.max(m, b.y + b.h), 0);
    blocks.push({ id: Date.now(), projectSlug: null, x: 0, y: maxY + 0.01, w: 1/3, h: (1/3)*(9/16) });
    renderProjects();
  });

  /* =============================================
     Site Map Panel
     ============================================= */
  function buildSiteMapHTML() {
    // Include the hash so the Projects/Info entries (now anchors into the
    // merged home page) can still highlight as active.
    const cur = location.pathname + location.hash;
    function item(name, path, sub = false) {
      const active = cur === path ? ' epp-active' : '';
      const cls    = sub ? 'epp-sub' : 'epp-page';
      return `<a href="${path}" data-link class="${cls}${active}" onclick="closeSiteMap()">
        <span class="epp-icon">${sub ? '↳' : '○'}</span>
        <span class="epp-name">${name}</span>
        <span class="epp-path">${path}</span>
      </a>`;
    }
    return `
      <div class="epp-header">
        <span class="epp-title">Site Map</span>
        <button class="epp-close" onclick="closeSiteMap()">✕</button>
      </div>
      <nav class="epp-nav">
        ${item('Home', '/')}
        <div class="epp-group">
          ${item('Projects', '/#projects-section')}
          ${projects.map(p => item(p.name, `/projects/${p.slug}`, true)).join('')}
        </div>
        ${item('About', '/#info-section')}
        ${item('Contact', '/#contact-section')}
      </nav>
      <div class="epp-footer">
        <button class="epp-add-project" onclick="addProject()">+ 新增專案</button>
      </div>`;
  }

  function toggleSiteMap() {
    const ex = document.getElementById('editor-sitemap');
    if (ex) { closeSiteMap(); return; }
    const panel = document.createElement('div');
    panel.id = 'editor-sitemap';
    panel.innerHTML = buildSiteMapHTML();
    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('open'));
    mapBtn.classList.add('active');
  }

  window.closeSiteMap = function () {
    const panel = document.getElementById('editor-sitemap');
    if (!panel) return;
    panel.classList.remove('open');
    panel.addEventListener('transitionend', () => panel.remove(), { once: true });
    mapBtn.classList.remove('active');
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSiteMap();
      document.getElementById('project-editor-modal')?.remove();
      document.getElementById('carousel-editor-modal')?.remove();
    }
  });

  new MutationObserver(() => {
    const sm = document.getElementById('editor-sitemap');
    if (sm) sm.innerHTML = buildSiteMapHTML();
    // One-page site: Projects and Info are both always-visible sections of
    // the same '/' route now, not separate pages — so a single onHome flag
    // gates every control that used to be split between them.
    const onHome   = location.pathname === '/';
    const onDetail = /^\/projects\/[^/]+$/.test(location.pathname);
    addBtn.style.display        = (isEditing && onHome)   ? '' : 'none';
    carouselBtn.style.display   = (isEditing && onHome)   ? '' : 'none';
    coverAddBtn.style.display   = (isEditing && onDetail) ? '' : 'none';
    galleryAddBtn.style.display = (isEditing && onDetail) ? '' : 'none';
    textAddBtn.style.display    = (isEditing && onDetail) ? '' : 'none';
    lineAddBtn.style.display    = (isEditing && onDetail) ? '' : 'none';
    if (!(isEditing && onDetail)) linkAddBtn.style.display = 'none';
    if (!(isEditing && onDetail)) statementAddBtn.style.display = 'none';
    copyLayoutBtn.style.display  = (isEditing && onDetail) ? '' : 'none';
    homeVarBtn.style.display    = onHome ? '' : 'none';
    homeVarBtn.textContent      = `首頁 ${homeVariant.toUpperCase()}`;
    bgWrap.style.display        = onHome ? 'flex' : 'none';
    if (onHome) bgInput.value = projectsBg;
    if (isEditing && onHome)   injectInfoEditors();
    if (isEditing && onDetail) injectGalleryControls();
    // subtree:true: renderProjects()/renderInfo() now patch a nested
    // element (#projects-canvas / #info-section) instead of swapping
    // #app's own children, so a direct-child-only observer would miss them.
  }).observe(document.getElementById('app'), { childList: true, subtree: true });

  /* =============================================
     Add Project (site map)
     ============================================= */
  window.addProject = function () {
    const slug  = 'project-' + Date.now();
    projects.push({
      id: Date.now(), slug,
      name: 'New Project', subtitle: 'Project Subtitle', category: 'Category',
      year: new Date().getFullYear().toString(), client: 'Client', scope: 'Scope',
      bg: PH_COLORS[projects.length % PH_COLORS.length],
      meta: [
        { label: '類別', value: 'Category' },
        { label: '日期', value: new Date().getFullYear().toString() },
      ],
      desc: 'Add your project description here.',
    });
    saveAll();
    document.querySelectorAll('.ec-proj-select').forEach(sel => {
      const bid = parseInt(sel.closest('[data-block-id]')?.dataset.blockId);
      const b   = blocks.find(x => x.id === bid);
      sel.innerHTML = buildProjectOptions(b ? b.projectSlug : null);
    });
    const sm = document.getElementById('editor-sitemap');
    if (sm) sm.innerHTML = buildSiteMapHTML();
  };

  /* =============================================
     Project Editor Modal
     ============================================= */
  function esc(s) {
    return String(s || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function uploadToCloudinary(file) {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', CLOUDINARY_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
      { method: 'POST', body: form }
    );
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()).secure_url;
  }

  function coverBg(p, w = 800) {
    const url = p.cover ? cloudinaryUrl(p.cover, w) : null;
    return url
      ? `background:${p.bg};background-image:url('${url}');background-size:cover;background-position:center`
      : `background:${p.bg}`;
  }

  function openProjectEditor(slug, srcEl) {
    const p = projects.find(x => x.slug === slug);
    if (!p) return;
    document.getElementById('project-editor-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'project-editor-modal';
    modal.innerHTML = `
      <div class="pem-backdrop"></div>
      <div class="pem-panel">
        <div class="pem-header">
          <span class="pem-title">編輯專案</span>
          <button class="pem-close">✕</button>
        </div>
        <div class="pem-body">
          <div class="pem-cover-section">
            <div class="pem-cover-preview" id="pem-preview" style="${coverBg(p)}">
              ${!p.cover ? '<span class="pem-cover-ph">封面圖片</span>' : ''}
            </div>
            <div class="pem-cover-actions">
              <label class="pem-upload-label"><span>上傳封面圖</span><input type="file" id="pem-file" accept="image/*" hidden></label>
              ${p.cover ? '<button class="pem-remove-cover">移除圖片</button>' : ''}
            </div>
          </div>
          <div class="pem-fields">
            <label class="pem-field"><span>專案名稱</span><input type="text" id="pem-name" value="${esc(p.name)}"></label>
            <label class="pem-field"><span>副標題</span><input type="text" id="pem-subtitle" value="${esc(p.subtitle)}"></label>
            <label class="pem-field"><span>類別</span><input type="text" id="pem-category" value="${esc(p.category)}"></label>
            <label class="pem-field"><span>年份</span><input type="text" id="pem-year" value="${esc(p.year)}"></label>
            <label class="pem-field"><span>客戶</span><input type="text" id="pem-client" value="${esc(p.client||'')}"></label>
            <label class="pem-field"><span>範疇</span><input type="text" id="pem-scope" value="${esc(p.scope||'')}"></label>
            <label class="pem-field"><span>主色</span><input type="color" id="pem-bg" value="${p.bg}"></label>
            <label class="pem-field pem-field-full"><span>專案說明</span><textarea id="pem-desc" rows="5">${esc(p.desc||'')}</textarea></label>
          </div>
        </div>
        <div class="pem-footer">
          <span class="pem-hint">儲存後自動更新卡片</span>
          <button class="pem-save">儲存</button>
        </div>
      </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));

    const preview = modal.querySelector('#pem-preview');

    const labelSpan  = modal.querySelector('.pem-upload-label span');
    const uploadLabel = modal.querySelector('.pem-upload-label');

    modal.querySelector('#pem-file').addEventListener('change', async function () {
      if (!this.files.length) return;
      labelSpan.textContent = '上傳中…';
      uploadLabel.style.pointerEvents = 'none';
      try {
        p.cover = await uploadToCloudinary(this.files[0]);
        preview.style.cssText = coverBg(p);
        preview.querySelector('.pem-cover-ph')?.remove();
        if (!modal.querySelector('.pem-remove-cover')) {
          const btn = document.createElement('button');
          btn.className = 'pem-remove-cover'; btn.textContent = '移除圖片';
          btn.addEventListener('click', rmCover);
          modal.querySelector('.pem-cover-actions').appendChild(btn);
        }
      } catch (e) {
        alert('圖片上傳失敗，請確認網路連線後再試。');
      } finally {
        labelSpan.textContent = '上傳封面圖';
        uploadLabel.style.pointerEvents = '';
      }
    });

    function rmCover() {
      p.cover = null;
      preview.style.cssText = `background:${p.bg}`;
      preview.innerHTML = '<span class="pem-cover-ph">封面圖片</span>';
      modal.querySelector('.pem-remove-cover')?.remove();
    }
    modal.querySelector('.pem-remove-cover')?.addEventListener('click', rmCover);

    modal.querySelector('#pem-bg').addEventListener('input', e => {
      p.bg = e.target.value;
      if (!p.cover) preview.style.background = p.bg;
    });

    function closeModal() {
      modal.classList.remove('open');
      modal.addEventListener('transitionend', () => modal.remove(), { once: true });
    }
    modal.querySelector('.pem-close').addEventListener('click', closeModal);
    modal.querySelector('.pem-backdrop').addEventListener('click', closeModal);

    modal.querySelector('.pem-save').addEventListener('click', () => {
      const name = modal.querySelector('#pem-name').value.trim();
      if (name) p.name = name;
      p.subtitle = modal.querySelector('#pem-subtitle').value.trim();
      p.category = modal.querySelector('#pem-category').value.trim();
      p.year     = modal.querySelector('#pem-year').value.trim();
      p.client   = modal.querySelector('#pem-client').value.trim();
      p.scope    = modal.querySelector('#pem-scope').value.trim();
      p.desc     = modal.querySelector('#pem-desc').value.trim();
      try { saveAll(); } catch (e) {
        alert('儲存失敗，請重新整理後再試。'); return;
      }
      if (srcEl) updateBlockVisuals(srcEl, p);
      document.querySelectorAll(`.ec-proj-select option[value="${p.slug}"]`)
        .forEach(opt => { opt.textContent = p.name; });
      const sm = document.getElementById('editor-sitemap');
      if (sm) sm.innerHTML = buildSiteMapHTML();
      closeModal();
    });
  }

  /* =============================================
     Carousel Editor Modal
     ============================================= */
  function openCarouselEditor() {
    document.getElementById('carousel-editor-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'carousel-editor-modal';
    document.body.appendChild(modal);

    function buildOptions(selectedSlug) {
      return projects.map(p =>
        `<option value="${p.slug}" ${selectedSlug === p.slug ? 'selected' : ''}>${p.name}</option>`
      ).join('');
    }

    function buildListHTML() {
      return carouselSlugs.map((slug, i) => {
        const p   = projects.find(x => x.slug === slug);
        const bg  = p ? coverBg(p, 400) : 'background:var(--bg2)';
        const isFirst = i === 0;
        const isLast  = i === carouselSlugs.length - 1;
        return `<div class="cem-row">
          <div class="cem-thumb" style="${bg}"></div>
          <select class="cem-select" data-idx="${i}">${buildOptions(slug)}</select>
          <button class="cem-up" data-idx="${i}" title="上移" ${isFirst ? 'disabled' : ''}>↑</button>
          <button class="cem-dn" data-idx="${i}" title="下移" ${isLast  ? 'disabled' : ''}>↓</button>
          <button class="cem-rm" data-idx="${i}" title="移除">✕</button>
        </div>`;
      }).join('');
    }

    function bindListEvents(listEl) {
      listEl.querySelectorAll('.cem-select').forEach(sel => {
        sel.addEventListener('change', e => {
          carouselSlugs[parseInt(e.target.dataset.idx)] = e.target.value;
          onChange();
        });
      });
      listEl.querySelectorAll('.cem-up').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.idx);
          if (i > 0) {
            [carouselSlugs[i - 1], carouselSlugs[i]] = [carouselSlugs[i], carouselSlugs[i - 1]];
            onChange();
          }
        });
      });
      listEl.querySelectorAll('.cem-dn').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.idx);
          if (i < carouselSlugs.length - 1) {
            [carouselSlugs[i], carouselSlugs[i + 1]] = [carouselSlugs[i + 1], carouselSlugs[i]];
            onChange();
          }
        });
      });
      listEl.querySelectorAll('.cem-rm').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.dataset.idx);
          if (carouselSlugs.length > 1) { carouselSlugs.splice(i, 1); onChange(); }
        });
      });
    }

    function bindAddBtn(btn) {
      btn.addEventListener('click', () => {
        if (carouselSlugs.length >= 6) return;
        const unused = projects.find(p => !carouselSlugs.includes(p.slug));
        carouselSlugs.push((unused || projects[0]).slug);
        onChange();
      });
    }

    function onChange() {
      saveAll();
      renderHome();
      // Rebuild only the list + add-button, keeping the modal open
      const listEl = modal.querySelector('.cem-list');
      if (!listEl) return;
      listEl.innerHTML = buildListHTML();
      bindListEvents(listEl);
      const existingAdd = modal.querySelector('.cem-add');
      if (carouselSlugs.length < 6 && !existingAdd) {
        const addBtn = document.createElement('button');
        addBtn.className = 'cem-add';
        addBtn.textContent = '+ 新增';
        bindAddBtn(addBtn);
        modal.querySelector('.cem-body').appendChild(addBtn);
      } else if (carouselSlugs.length >= 6 && existingAdd) {
        existingAdd.remove();
      }
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.addEventListener('transitionend', () => modal.remove(), { once: true });
    }

    modal.innerHTML = `
      <div class="cem-backdrop"></div>
      <div class="cem-panel">
        <div class="cem-header">
          <span class="cem-title">首頁輪播管理</span>
          <button class="cem-close">✕</button>
        </div>
        <div class="cem-body">
          <p class="cem-hint">最多 6 張。使用 ↑↓ 調整順序。</p>
          <div class="cem-list">${buildListHTML()}</div>
          ${carouselSlugs.length < 6 ? '<button class="cem-add">+ 新增</button>' : ''}
        </div>
      </div>`;

    modal.querySelector('.cem-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.cem-close').addEventListener('click', closeModal);
    bindListEvents(modal.querySelector('.cem-list'));
    const addEl = modal.querySelector('.cem-add');
    if (addEl) bindAddBtn(addEl);

    requestAnimationFrame(() => modal.classList.add('open'));
  }

  /* =============================================
     Info Page — text editing + row reorder
     ============================================= */
  function openInfoTextEditor(el) {
    document.getElementById('info-text-editor')?.remove();
    const key     = el.dataset.infoKey;
    const cur     = infoTextData[key] || {};
    const curSize = cur.size || parseInt(window.getComputedStyle(el).fontSize);
    const curText = cur.text ?? el.textContent.trim();

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">${key}</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-row">
        <span class="ite-lbl">大小</span>
        <input type="range" class="ite-sz" min="8" max="150" value="${curSize}">
        <span class="ite-sv">${curSize}px</span>
      </div>
      <div class="ite-btns">
        <button class="ite-del">還原預設</button>
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 230)}px;`;
    document.body.appendChild(ped);
    ped.querySelector('.ite-ta').focus();

    const szR = ped.querySelector('.ite-sz');
    const szV = ped.querySelector('.ite-sv');
    szR.addEventListener('input', () => { el.style.fontSize = szR.value + 'px'; szV.textContent = szR.value + 'px'; });
    ped.querySelector('.ite-ta').addEventListener('input', e => { el.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save) { el.textContent = curText; el.style.fontSize = cur.size ? cur.size + 'px' : ''; }
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-del').addEventListener('click', () => {
      delete infoTextData[key]; saveAll(); renderInfo(); ped.remove(); document.removeEventListener('click', onDoc);
    });
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      infoTextData[key] = { text: ped.querySelector('.ite-ta').value, size: parseInt(szR.value) };
      saveAll(); renderInfo(); ped.remove(); document.removeEventListener('click', onDoc);
    });
  }

  /* Generic wiring for the Experience / Awards list sections:
     drag-to-reorder, inline cell editing, delete, row height, add. */
  function wireInfoListSection(cfg) {
    const section = document.getElementById(cfg.sectionId);
    if (!section) return;

    section.querySelectorAll(cfg.selector).forEach(row => {
      if (row.dataset.listInit) return;
      row.dataset.listInit = '1';

      // Drag-to-reorder (live, same as the project table)
      const handle = row.querySelector('.itr-handle');
      if (handle) handle.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        row.classList.add('itr-dragging');
        function onMove(ev) {
          const rows = [...section.querySelectorAll(cfg.selector)].filter(r => r !== row);
          let placed = false;
          for (const r of rows) {
            const rect = r.getBoundingClientRect();
            if (ev.clientY < rect.top + rect.height / 2) {
              if (r.previousElementSibling !== row) section.insertBefore(row, r);
              placed = true;
              break;
            }
          }
          if (!placed) {
            const last = rows[rows.length - 1];
            if (last) section.insertBefore(row, last.nextSibling);
          }
        }
        function onUp() {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup',   onUp);
          row.classList.remove('itr-dragging');
          const domRows = [...section.querySelectorAll(cfg.selector)];
          const newArr = domRows.map(r => cfg.items[parseInt(r.dataset[cfg.attr])]);
          cfg.items.splice(0, cfg.items.length, ...newArr);
          domRows.forEach((r, i) => { r.dataset[cfg.attr] = i; });
          saveAll();
        }
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup',   onUp);
      });

      // Inline cell editing
      cfg.fields.forEach(([cls, field]) => {
        const cell = row.querySelector('.' + cls);
        if (!cell) return;
        cell.contentEditable = 'true';
        cell.addEventListener('mousedown', e => e.stopPropagation());
        cell.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); cell.blur(); } });
        cell.addEventListener('blur', () => {
          const item = cfg.items[parseInt(row.dataset[cfg.attr])];
          if (item) { item[field] = cell.textContent.trim(); saveAll(); }
        });
      });

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'itr-del-btn';
      delBtn.title = '刪除此行';
      delBtn.textContent = '✕';
      delBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = parseInt(row.dataset[cfg.attr]);
        cfg.items.splice(idx, 1);
        row.remove();
        section.querySelectorAll(cfg.selector).forEach(r => {
          const v = parseInt(r.dataset[cfg.attr]);
          if (v > idx) r.dataset[cfg.attr] = v - 1;
        });
        saveAll();
      });
      row.appendChild(delBtn);

      wireRowHeightHandle(row, cfg.heightKey);
    });

    // Add-row button at the end of the section
    if (!section.querySelector('.itr-add-btn-sec')) {
      const b = document.createElement('button');
      b.className = 'itr-add-btn-sec';
      b.textContent = cfg.addLabel;
      b.addEventListener('click', () => {
        const item = { ...cfg.newItem };
        cfg.items.push(item);
        saveAll();
        const rowEl = document.createElement('div');
        rowEl.className = 'info-exp-row';
        rowEl.dataset[cfg.attr] = cfg.items.length - 1;
        rowEl.innerHTML = `
      <span class="itr-handle">⋮⋮</span>
      <div class="info-exp-left">
        <span class="info-exp-company">${item[cfg.fields[0][1]]}</span>
        <span class="info-exp-role">${item[cfg.fields[1][1]]}</span>
      </div>
      <span class="info-exp-period">${item[cfg.fields[2][1]]}</span>`;
        section.insertBefore(rowEl, b);
        injectInfoEditors();
      });
      section.appendChild(b);
    }
  }

  function injectTableColResize() {
    const head = document.querySelector('.info-proj-head');
    if (!head || head.dataset.colResizeInit) return;
    head.dataset.colResizeInit = '1';

    // Per-column: width-drag handle, editable label, hide button
    head.querySelectorAll('.itr-head-cell[data-col-key]').forEach(cell => {
      const key = cell.dataset.colKey;

      const handle = document.createElement('span');
      handle.className = 'col-resize-handle';
      handle.title = '拖曳調整欄寬';
      cell.appendChild(handle);
      handle.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const startX = e.clientX, startW = projColWidths[key];
        // Trade width with the next visible column rather than just
        // growing this one in isolation: growing this column always
        // shrinks its neighbor by the same amount, keeping the row's
        // total width constant. Without this, once the row's total
        // column width already exceeds the table's available space (the
        // shrink-to-fit rule that stops the whole page from overflowing
        // horizontally — see applyTableColWidths), dragging a handle on
        // an already-compressed large column visibly did nothing: its
        // displayed size is capped by the container regardless of how
        // large a value the drag wrote to projColWidths, which read as
        // "the handle doesn't work". Trading with a neighbor instead
        // means every drag has an immediate, visible effect regardless
        // of whether the row happens to be over-cap.
        const visible = projColOrder.filter(k => !projHiddenCols.includes(k));
        const nextKey = visible[visible.indexOf(key) + 1];
        const startNextW = nextKey ? projColWidths[nextKey] : null;
        function onMove(ev) {
          let delta = Math.round(ev.clientX - startX);
          if (nextKey) {
            // Clamp so neither side crosses the 16px minimum.
            delta = Math.max(16 - startW, Math.min(startNextW - 16, delta));
            projColWidths[nextKey] = startNextW - delta;
          }
          projColWidths[key] = startW + delta;
          applyTableColWidths();
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          saveAll();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      const label = cell.querySelector('.itr-head-label');
      if (label) {
        label.contentEditable = 'true';
        label.addEventListener('mousedown', e => e.stopPropagation());
        label.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); label.blur(); } });
        label.addEventListener('blur', () => {
          projColLabels[key] = label.textContent.trim() || projColLabels[key];
          saveAll();
        });
      }

      const delBtn = cell.querySelector('.itr-head-del');
      if (delBtn) {
        delBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
        delBtn.addEventListener('click', e => {
          e.stopPropagation();
          const stillVisible = projColOrder.length - projHiddenCols.length;
          if (stillVisible <= 1) return; // keep at least one column
          if (!projHiddenCols.includes(key)) projHiddenCols.push(key);
          applyTableColWidths();
          saveAll();
          renderInfo();
        });
      }

      // Drag-to-reorder columns — live reorder, same pattern as the
      // project-row drag above, just horizontal instead of vertical.
      const dragHandle = cell.querySelector('.itr-head-drag');
      if (dragHandle) dragHandle.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        cell.classList.add('itr-col-dragging');
        function onMove(ev) {
          const cells = [...head.querySelectorAll('.itr-head-cell[data-col-key]')].filter(c => c !== cell);
          let placed = false;
          for (const c of cells) {
            const rect = c.getBoundingClientRect();
            if (ev.clientX < rect.left + rect.width / 2) {
              if (c.previousElementSibling !== cell) head.insertBefore(cell, c);
              placed = true;
              break;
            }
          }
          if (!placed) {
            const last = cells[cells.length - 1];
            if (last) head.insertBefore(cell, last.nextSibling);
          }
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          cell.classList.remove('itr-col-dragging');
          // Header only shows VISIBLE columns, so rebuild the full order
          // from the new visible arrangement, then tack any hidden
          // columns back on (their own relative order preserved).
          const newVisible = [...head.querySelectorAll('.itr-head-cell[data-col-key]')].map(c => c.dataset.colKey);
          const stillHidden = projColOrder.filter(k => projHiddenCols.includes(k));
          projColOrder.splice(0, projColOrder.length, ...newVisible, ...stillHidden);
          applyTableColWidths();
          saveAll();
          renderInfo();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });

    // Restore chips for hidden columns
    document.querySelectorAll('.itr-restore-chip[data-restore-key]').forEach(chip => {
      if (chip.dataset.restoreInit) return;
      chip.dataset.restoreInit = '1';
      chip.addEventListener('click', () => {
        const key = chip.dataset.restoreKey;
        const idx = projHiddenCols.indexOf(key);
        if (idx >= 0) projHiddenCols.splice(idx, 1);
        applyTableColWidths();
        saveAll();
        renderInfo();
      });
    });

    // Left/right boundary dragging was removed — the page's width should
    // just track the viewport responsively (max-width + centered margin),
    // not be pinned to a fixed px value that stops adapting on resize.
  }

  function injectInfoEditors() {
    if (!isEditing || location.pathname !== '/') return;

    // Editable text elements. Ones inside a free-form header block (see
    // injectInfoHeaderControls) use double-click instead of single-click,
    // since single-click+drag on the block now moves it.
    document.querySelectorAll('[data-info-key]').forEach(el => {
      if (el.dataset.infoInit) return;
      el.dataset.infoInit = '1';
      const evt = el.closest('.ihb-block') ? 'dblclick' : 'click';
      el.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); openInfoTextEditor(el); });
    });

    injectInfoHeaderControls();
    injectInfoWidthHandles();
    injectContactControls();

    // Drag-to-reorder project rows
    document.querySelectorAll('.info-proj-row[data-proj-idx]').forEach(row => {
      if (row.dataset.dragInit) return;
      row.dataset.dragInit = '1';

      const handle = row.querySelector('.itr-handle');
      if (!handle) return;

      handle.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        const tbl = row.closest('.info-proj-table');
        if (!tbl) return;
        row.classList.add('itr-dragging');

        // Live reorder — move the row in the DOM as the pointer crosses
        // the midpoint of a sibling row; no ghost, no page re-render.
        function onMove(ev) {
          const rows = [...tbl.querySelectorAll('.info-proj-row[data-proj-idx]')].filter(r => r !== row);
          let placed = false;
          for (const r of rows) {
            const rect = r.getBoundingClientRect();
            if (ev.clientY < rect.top + rect.height / 2) {
              if (r.previousElementSibling !== row) tbl.insertBefore(row, r);
              placed = true;
              break;
            }
          }
          if (!placed) {
            // Below every row — park at the end, before the add button
            tbl.insertBefore(row, tbl.querySelector('#itr-add-btn'));
          }
        }

        function onUp() {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup',   onUp);
          row.classList.remove('itr-dragging');
          const newOrd = [...tbl.querySelectorAll('.info-proj-row[data-proj-idx]')]
            .map(r => parseInt(r.dataset.projIdx));
          portfolioOrder.splice(0, portfolioOrder.length, ...newOrd);
          saveAll();
        }

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup',   onUp);
      });
    });

    // Inline cell editing, delete button, row height handle
    document.querySelectorAll('.info-proj-row[data-proj-idx]').forEach(row => {
      if (row.dataset.editInit) return;
      row.dataset.editInit = '1';
      const origIdx = parseInt(row.dataset.projIdx);

      // Inline editing for cat / role / name / date cells
      [['itr-cat','cat'],['itr-note','note'],['itr-role','role'],['itr-name','name'],['itr-date','date']].forEach(([cls, field]) => {
        const cell = row.querySelector('.' + cls);
        if (!cell) return;
        cell.contentEditable = 'true';
        cell.addEventListener('mousedown', e => e.stopPropagation()); // don't start drag
        cell.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); cell.blur(); } });
        cell.addEventListener('blur', () => {
          const item = portfolioItems[parseInt(row.dataset.projIdx)];
          if (item) { item[field] = cell.textContent.trim(); saveAll(); }
        });
      });

      // Link + delete buttons, grouped in .itr-row-actions (flush
      // against the row's right edge, see the CSS) — both revealed only
      // on row hover. Which project page (if any) clicking this row
      // navigates to in normal browsing is set via the link button's
      // popup — see the delegated click listener in app.js for the
      // actual navigation.
      const actions = row.querySelector('.itr-row-actions');
      if (actions) {
        const initialItem = portfolioItems[origIdx];

        const linkBtn = document.createElement('button');
        linkBtn.className = 'itr-link-btn' + (initialItem?.linkSlug ? ' itr-link-btn-active' : '');
        linkBtn.title = '設定此列要連結到哪個專案頁面';
        linkBtn.textContent = '🔗';
        linkBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
        linkBtn.addEventListener('click', e => {
          e.stopPropagation();
          openProjLinkPicker(linkBtn, portfolioItems[parseInt(row.dataset.projIdx)], row);
        });
        actions.appendChild(linkBtn);

        const delBtn = document.createElement('button');
        delBtn.className = 'itr-del-btn';
        delBtn.title = '刪除此行';
        delBtn.textContent = '✕';
        delBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
        delBtn.addEventListener('click', e => {
          e.stopPropagation();
          const idx = parseInt(row.dataset.projIdx);
          portfolioItems.splice(idx, 1);
          const pos = portfolioOrder.indexOf(idx);
          if (pos >= 0) portfolioOrder.splice(pos, 1);
          portfolioOrder.forEach((v, i) => { if (v > idx) portfolioOrder[i]--; });
          saveAll();
          // DOM patch — remove the row and remap the shifted indices
          const tbl = row.closest('.info-proj-table');
          row.remove();
          if (tbl) tbl.querySelectorAll('.info-proj-row[data-proj-idx]').forEach(r => {
            const v = parseInt(r.dataset.projIdx);
            if (v > idx) r.dataset.projIdx = v - 1;
          });
          const num = document.querySelector('.info-total-count');
          if (num) num.textContent = portfolioItems.length;
          applyTotalLineFit();
        });
        actions.appendChild(delBtn);
      }

      wireRowHeightHandle(row, 'proj');
    });

    // Add-row button (injected once, lives inside the table)
    const table = document.querySelector('.info-proj-table');
    if (table && !table.querySelector('#itr-add-btn')) {
      const addBtn = document.createElement('button');
      addBtn.id = 'itr-add-btn';
      addBtn.textContent = '+ 新增一行';
      addBtn.addEventListener('click', () => {
        portfolioItems.push({ cat: '類別', note: '', role: '負責內容', name: '新項目', date: '2025' });
        if (portfolioOrder.length === portfolioItems.length - 1) portfolioOrder.push(portfolioItems.length - 1);
        else portfolioOrder.splice(0, portfolioOrder.length, ...portfolioItems.map((_, i) => i));
        saveAll();
        // Full re-render rather than a hand-built DOM patch — the row's
        // cells depend on the current (user-editable) column order/
        // visibility, so building it here would risk drifting out of
        // sync with that.
        renderInfo();
      });
      table.appendChild(addBtn);
    }

    wireInfoListSection({
      sectionId: 'info-exp-section',
      selector:  '.info-exp-row[data-exp-idx]',
      attr:      'expIdx',
      items:     experienceItems,
      fields:    [['info-exp-company','company'],['info-exp-role','role'],['info-exp-period','period']],
      addLabel:  '+ 新增經歷',
      newItem:   { company: '公司名稱', role: '職稱', period: '2025' },
      heightKey: 'exp',
    });

    wireInfoListSection({
      sectionId: 'info-award-section',
      selector:  '.info-exp-row[data-award-idx]',
      attr:      'awardIdx',
      items:     awardItems,
      fields:    [['info-exp-company','name'],['info-exp-role','award'],['info-exp-period','date']],
      addLabel:  '+ 新增獎項',
      newItem:   { name: '作品名稱', award: '獎項名稱', date: '2025' },
      heightKey: 'award',
    });

    injectTableColResize();
    injectInfoScaleControls();
    injectInfoListsGapControl();
  }

  /* Font-size (%) inputs for the three Info lists — each just sets a
     --row-scale CSS custom property on its own container, so every
     column in that list grows/shrinks together while keeping their
     relative size differences (see the calc() rules in style.css). */
  const INFO_SCALE_TARGETS = {
    proj:  { getEl: () => document.querySelector('.info-proj-table'), get: () => infoProjTableScale, set: v => { infoProjTableScale = v; } },
    exp:   { getEl: () => document.getElementById('info-exp-section'), get: () => infoExpScale, set: v => { infoExpScale = v; } },
    award: { getEl: () => document.getElementById('info-award-section'), get: () => infoAwardScale, set: v => { infoAwardScale = v; } },
  };
  function injectInfoScaleControls() {
    document.querySelectorAll('.itr-scale-input').forEach(input => {
      if (input.dataset.scaleInit) return;
      input.dataset.scaleInit = '1';
      const cfg = INFO_SCALE_TARGETS[input.dataset.scaleTarget];
      if (!cfg) return;
      input.addEventListener('mousedown', e => e.stopPropagation());
      input.addEventListener('input', () => {
        const pct = clamp(parseInt(input.value) || 100, 50, 200);
        cfg.set(pct / 100);
        cfg.getEl()?.style.setProperty('--row-scale', pct / 100);
      });
      input.addEventListener('change', () => { saveAll(); });
    });
  }

  // CSS gap can't go negative (an invalid value is simply ignored), so a
  // negative infoListsGap instead pulls Awards closer via a negative
  // margin-left on it specifically, while gap itself floors at 0.
  function applyInfoListsGap() {
    const row = document.querySelector('.info-lists-row');
    const award = document.getElementById('info-award-section');
    if (row) row.style.columnGap = Math.max(infoListsGap, 0) + 'px';
    if (award) award.style.marginLeft = infoListsGap < 0 ? infoListsGap + 'px' : '';
    applyInfoListsOverlapCheck();
  }

  function injectInfoListsGapControl() {
    const input = document.getElementById('info-lists-gap-input');
    if (input && !input.dataset.gapInit) {
      input.dataset.gapInit = '1';
      input.addEventListener('mousedown', e => e.stopPropagation());
      input.addEventListener('input', () => {
        infoListsGap = clamp(parseInt(input.value) || 0, -150, 120);
        applyInfoListsGap();
        positionInfoListsGapHandle();
      });
      input.addEventListener('change', () => { saveAll(); });
    }
    injectInfoListsGapHandle();
  }

  // Positions the gap-drag-handle at the current midpoint between the two
  // columns — re-queries fresh each time rather than closing over element
  // references, so a single resize listener (wired once, below) keeps
  // working correctly even after info-lists-row gets recreated by a
  // later renderInfo().
  function positionInfoListsGapHandle() {
    const row = document.querySelector('.info-lists-row');
    const exp = document.getElementById('info-exp-section');
    const award = document.getElementById('info-award-section');
    const handle = row?.querySelector('.ilg-handle');
    if (!row || !exp || !award || !handle) return;
    const rowRect = row.getBoundingClientRect();
    const expRect = exp.getBoundingClientRect();
    const awardRect = award.getBoundingClientRect();
    const midX = (expRect.right + awardRect.left) / 2 - rowRect.left;
    handle.style.left = (midX - 7) + 'px';
  }

  let ilgResizeWired = false;
  function injectInfoListsGapHandle() {
    const row = document.querySelector('.info-lists-row');
    if (!row) return;
    let handle = row.querySelector('.ilg-handle');
    if (!handle) {
      handle = document.createElement('div');
      handle.className = 'ilg-handle';
      handle.title = '拖曳調整 Experience / Awards 間距';
      row.appendChild(handle);
    }
    positionInfoListsGapHandle();
    if (!ilgResizeWired) {
      ilgResizeWired = true;
      window.addEventListener('resize', positionInfoListsGapHandle);
    }
    if (handle.dataset.wireInit) return;
    handle.dataset.wireInit = '1';
    handle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX;
      const startGap = infoListsGap;
      function onMove(ev) {
        const dx = ev.clientX - startX;
        infoListsGap = clamp(Math.round(startGap + dx), -150, 120);
        applyInfoListsGap();
        const input = document.getElementById('info-lists-gap-input');
        if (input) input.value = infoListsGap;
        positionInfoListsGapHandle();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* Drag handle for the credit block's label column width (see
     creditLabelWidth in app.js / --meta-label-w — that comment explains
     why the label's own width, not a separate flex gap, is what actually
     controls the visible distance to the value). Positioned at the
     boundary between the first row's label and value — every row shares
     the same width via the CSS var on .detail-credit, so one row's
     boundary is representative of them all. */
  function positionCreditLabelHandle() {
    const creditEl = document.querySelector('.detail-credit');
    const row = creditEl?.querySelector('.meta-row[data-meta-idx]');
    const handle = creditEl?.querySelector('.credit-label-handle');
    if (!creditEl || !row || !handle) return;
    const label = row.querySelector('.meta-label');
    if (!label) return;
    const creditRect = creditEl.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();
    handle.style.left = (labelRect.right - creditRect.left - 7) + 'px';
  }

  let creditLabelResizeWired = false;
  function injectCreditLabelHandle() {
    const creditEl = document.querySelector('.detail-credit');
    if (!creditEl) return;
    let handle = creditEl.querySelector('.credit-label-handle');
    if (!handle) {
      handle = document.createElement('div');
      handle.className = 'credit-label-handle';
      handle.title = '拖曳調整分工項目與人員的間距';
      creditEl.appendChild(handle);
    }
    positionCreditLabelHandle();
    if (!creditLabelResizeWired) {
      creditLabelResizeWired = true;
      window.addEventListener('resize', positionCreditLabelHandle);
    }
    if (handle.dataset.wireInit) return;
    handle.dataset.wireInit = '1';
    handle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX;
      const startW = creditLabelWidth;
      function onMove(ev) {
        creditLabelWidth = clamp(Math.round(startW + (ev.clientX - startX)), 16, 240);
        creditEl.style.setProperty('--meta-label-w', creditLabelWidth + 'px');
        positionCreditLabelHandle();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* Shared row height per list — dragging ANY row's height handle sets
     the height for the WHOLE list at once (via --row-h on the shared
     container), rather than each row independently. */
  const ROW_HEIGHT_TARGETS = {
    proj:   { getEl: () => document.querySelector('.info-proj-table'), set: v => { projRowHeight = v; }, min: 28 },
    exp:    { getEl: () => document.getElementById('info-exp-section'), set: v => { expRowHeight = v; }, min: 28 },
    award:  { getEl: () => document.getElementById('info-award-section'), set: v => { awardRowHeight = v; }, min: 28 },
    // Credit rows have no fixed padding of their own (see .meta-row CSS),
    // so they can shrink much further than the info lists before text
    // starts getting cramped.
    credit: { getEl: () => document.querySelector('.detail-credit'), set: v => { creditRowHeight = v; }, min: 14 },
  };
  function wireRowHeightHandle(row, targetKey) {
    const hHandle = document.createElement('div');
    hHandle.className = 'itr-h-handle';
    hHandle.title = '拖曳調整所有行高';
    row.appendChild(hHandle);
    const tgt = ROW_HEIGHT_TARGETS[targetKey];
    hHandle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startY = e.clientY, startH = row.offsetHeight;
      let newH = startH;
      function onMove(ev) {
        newH = Math.max(tgt.min ?? 28, startH + ev.clientY - startY);
        tgt.getEl()?.style.setProperty('--row-h', newH + 'px');
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        tgt.set(newH);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* Free-form Info header blocks (photo/name/location/skills/email/
     phone/total-num/total-sub/total-word) — drag + resize + alignment
     snap, same mechanics as the project grid / gallery / statement
     blocks elsewhere, just scoped to infoHeaderBlocks + its own canvas. */
  function renderInfoHeaderGuides(vLines, hLines, W) {
    const canvas = document.getElementById('info-header-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  // All CURRENTLY VISIBLE blocks (fixed + custom) — used as the alignment-
  // snap target set, so custom text blocks can snap against fixed ones
  // and vice versa, and a hidden fixed block is never snapped against.
  function infoHeaderAlignItems() {
    return [...infoHeaderBlocks.filter(b => !infoHeaderHidden.includes(b.id)), ...infoCustomBlocks];
  }

  // Below INFO_HEADER_MIN_W (app.js), the canvas is frozen at that width
  // and visually scaled down as a whole (see applyInfoHeaderPositions) —
  // real mouse-pixel deltas during a drag/resize need dividing by this
  // scale too (on top of W) to land back in the frozen fraction space,
  // since on screen everything is smaller than its layout box implies.
  function getInfoHeaderScale() {
    const wrap = document.getElementById('info-header-canvas-wrap');
    if (!wrap) return 1;
    return Math.min(1, wrap.offsetWidth / INFO_HEADER_MIN_W);
  }

  function updateInfoHeaderCanvasHeight(canvas, W) {
    const maxBottom = Math.max(80 / W, infoHeaderAlignItems().reduce((m, b) => Math.max(m, b.y + b.h), 0));
    canvas.style.height = (maxBottom * W) + 'px';
    const wrap = document.getElementById('info-header-canvas-wrap');
    if (wrap) wrap.style.height = (maxBottom * W * getInfoHeaderScale()) + 'px';
  }

  function openInfoCustomTextEditor(el, b) {
    document.getElementById('info-text-editor')?.remove();
    const curText = b.text || '';

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">文字方塊</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-btns">
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 160)}px;`;
    document.body.appendChild(ped);
    const ta = ped.querySelector('.ite-ta');
    ta.focus(); ta.select();
    const textEl = el.querySelector('p');
    ta.addEventListener('input', e => { if (textEl) textEl.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save && textEl) textEl.textContent = curText;
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      b.text = ta.value;
      document.removeEventListener('click', onDoc);
      ped.remove();
      saveAll();
    });
  }

  // Small popup for picking which project page (if any) a project-list
  // row links to — opened by the row's .itr-link-btn, same floating-
  // panel convention as openInfoCustomTextEditor above.
  function openProjLinkPicker(btn, item, row) {
    document.getElementById('proj-link-picker')?.remove();
    if (!item) return;

    const panel = document.createElement('div');
    panel.id = 'proj-link-picker';
    panel.innerHTML = `
      <div class="plp-head">
        <span class="plp-tag">連結專案</span>
        <button class="plp-x">✕</button>
      </div>
      <select class="plp-select">
        <option value="">（無連結）</option>
        ${projects.map(pr => `<option value="${pr.slug}"${item.linkSlug === pr.slug ? ' selected' : ''}>${pr.name}</option>`).join('')}
      </select>`;

    const rect = btn.getBoundingClientRect();
    panel.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 220)}px;top:${Math.min(rect.bottom + 6, window.innerHeight - 100)}px;`;
    document.body.appendChild(panel);

    const select = panel.querySelector('.plp-select');
    select.focus();
    select.addEventListener('change', () => {
      item.linkSlug = select.value || null;
      btn.classList.toggle('itr-link-btn-active', !!item.linkSlug);
      if (row) {
        if (item.linkSlug) row.dataset.projLink = item.linkSlug;
        else delete row.dataset.projLink;
      }
      saveAll();
      close();
    });

    const onDoc = ev => { if (!panel.contains(ev.target) && ev.target !== btn) close(); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);
    function close() {
      document.removeEventListener('click', onDoc);
      panel.remove();
    }
    panel.querySelector('.plp-x').addEventListener('click', close);
  }

  function injectInfoHeaderControls() {
    const canvas = document.getElementById('info-header-canvas');
    if (!canvas) return;

    const CURSORS = {
      n:'n-resize', ne:'ne-resize', e:'e-resize', se:'se-resize',
      s:'s-resize', sw:'sw-resize', w:'w-resize', nw:'nw-resize',
    };
    function addResizeHandles(el, b) {
      Object.keys(CURSORS).forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `rh rh-${dir}`;
        handle.style.cursor = CURSORS[dir];
        handle.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          startInfoHeaderResize(e, b, dir, canvas, el);
        });
        el.appendChild(handle);
      });
    }

    // Fixed blocks (photo/name/location/skills/email/phone/total-*)
    document.querySelectorAll('.ihb-block[data-ihb-id]').forEach(el => {
      if (el.dataset.ihbInit) return;
      el.dataset.ihbInit = '1';

      const id = el.dataset.ihbId;
      const b = infoHeaderBlocks.find(x => x.id === id);
      if (!b) return;

      addResizeHandles(el, b);

      // Font-size/weight/color panel — every fixed block that carries
      // real, styleable text (not the photo placeholder).
      if (id !== 'photo') {
        const key = id;
        const target = el.querySelector('[data-info-key]');
        if (target && !el.querySelector('.tb-panel')) {
          const cur = infoTextData[key] || {};
          const panel = document.createElement('div');
          panel.className = 'tb-panel';
          panel.innerHTML = `
            <input type="number" class="tb-fs" min="6" max="150" title="字級 (px)" value="${cur.size ?? parseInt(getComputedStyle(target).fontSize)}">
            <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${cur.weight ?? (parseInt(getComputedStyle(target).fontWeight) || 400)}">
            <input type="color" class="tb-color" title="顏色" value="${cur.color ?? '#1A1A18'}">`;
          el.appendChild(panel);
          panel.addEventListener('mousedown', e => e.stopPropagation());
          panel.addEventListener('click', e => e.stopPropagation());
          panel.querySelector('.tb-fs').addEventListener('change', e => {
            const v = clamp(parseInt(e.target.value) || 13, 6, 150);
            e.target.value = v;
            infoTextData[key] = { ...infoTextData[key], size: v };
            target.style.fontSize = v + 'px';
            saveAll();
          });
          panel.querySelector('.tb-weight').addEventListener('change', e => {
            const v = clamp(parseInt(e.target.value) || 400, 100, 900);
            e.target.value = v;
            infoTextData[key] = { ...infoTextData[key], weight: v };
            target.style.fontWeight = v;
            saveAll();
          });
          panel.querySelector('.tb-color').addEventListener('input', e => {
            infoTextData[key] = { ...infoTextData[key], color: e.target.value };
            target.style.color = e.target.value;
            saveAll();
          });
        }
      }

      // Upload/replace/remove panel for the photo block — same pattern as
      // the cover image's .dc-panel and gallery items' .gb-panel.
      if (id === 'photo' && !el.querySelector('.info-photo-panel')) {
        const panel = document.createElement('div');
        panel.className = 'info-photo-panel';
        panel.innerHTML = `
          <button class="info-photo-upload" title="${infoPhotoUrl ? '更換照片' : '上傳照片'}">${infoPhotoUrl ? '⟳' : '+ 上傳'}</button>
          <input type="file" class="info-photo-file" accept="image/*" style="display:none">
          ${infoPhotoUrl ? `
          <button class="info-photo-upload2" title="${infoPhotoUrl2 ? '更換彩蛋照片（滑鼠移過時顯示）' : '上傳彩蛋照片（滑鼠移過時顯示）'}">${infoPhotoUrl2 ? '⟳2' : '+2'}</button>
          <input type="file" class="info-photo-file2" accept="image/*" style="display:none">
          ${infoPhotoUrl2 ? '<button class="info-photo-del2" title="移除彩蛋照片">✕2</button>' : ''}
          <button class="info-photo-del" title="移除照片">✕</button>` : ''}`;
        el.appendChild(panel);
        panel.addEventListener('mousedown', e => e.stopPropagation());
        panel.addEventListener('click', e => e.stopPropagation());
        const uploadBtn = panel.querySelector('.info-photo-upload');
        const fileInput = panel.querySelector('.info-photo-file');
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', async () => {
          const file = fileInput.files?.[0];
          if (!file) return;
          uploadBtn.textContent = '…';
          try {
            infoPhotoUrl = await uploadToCloudinary(file);
            saveAll();
            renderInfo();
          } catch (err) {
            alert('上傳失敗：' + err.message);
            uploadBtn.textContent = infoPhotoUrl ? '⟳' : '+ 上傳';
            fileInput.value = '';
          }
        });
        panel.querySelector('.info-photo-del')?.addEventListener('click', () => {
          infoPhotoUrl = null;
          infoPhotoUrl2 = null; // no base photo left to crossfade from
          saveAll();
          renderInfo();
        });

        const uploadBtn2 = panel.querySelector('.info-photo-upload2');
        const fileInput2 = panel.querySelector('.info-photo-file2');
        uploadBtn2?.addEventListener('click', () => fileInput2.click());
        fileInput2?.addEventListener('change', async () => {
          const file = fileInput2.files?.[0];
          if (!file) return;
          uploadBtn2.textContent = '…';
          try {
            infoPhotoUrl2 = await uploadToCloudinary(file);
            saveAll();
            renderInfo();
          } catch (err) {
            alert('上傳失敗：' + err.message);
            uploadBtn2.textContent = infoPhotoUrl2 ? '⟳2' : '+2';
            fileInput2.value = '';
          }
        });
        panel.querySelector('.info-photo-del2')?.addEventListener('click', () => {
          infoPhotoUrl2 = null;
          saveAll();
          renderInfo();
        });
      }

      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        if (e.target.classList.contains('rh')) return;
        if (e.target.closest('.ihb-del')) return;
        if (e.target.closest('.tb-panel')) return;
        if (e.target.closest('.info-photo-panel')) return;
        e.preventDefault();
        startInfoHeaderDrag(e, b, canvas, el);
      });

      // The block itself must never navigate (email/phone wrap an <a>)
      // while editing — double-click on the text opens the editor instead.
      el.addEventListener('click', e => {
        if (isEditing) { e.preventDefault(); e.stopPropagation(); }
      });

      const delBtn = el.querySelector('.ihb-del');
      delBtn?.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
      delBtn?.addEventListener('click', e => {
        e.stopPropagation();
        if (!infoHeaderHidden.includes(id)) infoHeaderHidden.push(id);
        saveAll();
        renderInfo();
      });
    });

    // Custom (user-added) text blocks
    document.querySelectorAll('.ihb-custom[data-ihb-custom-id]').forEach(el => {
      if (el.dataset.ihbInit) return;
      el.dataset.ihbInit = '1';

      const id = el.dataset.ihbCustomId;
      const b = infoCustomBlocks.find(x => String(x.id) === id);
      if (!b) return;

      addResizeHandles(el, b);

      const panel = document.createElement('div');
      panel.className = 'tb-panel';
      panel.innerHTML = `
        <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${b.fontSize ?? 13}">
        <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${b.weight ?? 400}">
        <input type="color" class="tb-color" title="顏色" value="${b.color ?? '#6B6B65'}">`;
      el.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());
      panel.querySelector('.tb-fs').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 13, 6, 96);
        e.target.value = v; b.fontSize = v;
        const t = el.querySelector('p'); if (t) t.style.fontSize = v + 'px';
        saveAll();
      });
      panel.querySelector('.tb-weight').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 400, 100, 900);
        e.target.value = v; b.weight = v;
        const t = el.querySelector('p'); if (t) t.style.fontWeight = v;
        saveAll();
      });
      panel.querySelector('.tb-color').addEventListener('input', e => {
        b.color = e.target.value;
        const t = el.querySelector('p'); if (t) t.style.color = e.target.value;
        saveAll();
      });

      const delBtn = el.querySelector('.ihb-del');
      delBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        infoCustomBlocks.splice(infoCustomBlocks.indexOf(b), 1);
        saveAll();
        renderInfo();
      });

      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        if (e.target.classList.contains('rh')) return;
        if (e.target.closest('.tb-panel, .ihb-del')) return;
        if (e.target.closest('p')) return; // click text to edit, not drag
        e.preventDefault();
        startInfoHeaderDrag(e, b, canvas, el);
      });

      el.querySelector('p')?.addEventListener('click', e => {
        if (!isEditing) return;
        e.preventDefault(); e.stopPropagation();
        openInfoCustomTextEditor(el, b);
      });
    });

    // Restore chips for hidden fixed blocks
    document.querySelectorAll('.itr-restore-chip[data-ihb-restore]').forEach(chip => {
      if (chip.dataset.restoreInit) return;
      chip.dataset.restoreInit = '1';
      chip.addEventListener('click', () => {
        const idx = infoHeaderHidden.indexOf(chip.dataset.ihbRestore);
        if (idx >= 0) infoHeaderHidden.splice(idx, 1);
        saveAll();
        renderInfo();
      });
    });

    // Add a new custom text block
    const addBtn = document.getElementById('ihb-add-btn');
    if (addBtn && !addBtn.dataset.addInit) {
      addBtn.dataset.addInit = '1';
      addBtn.addEventListener('click', () => {
        const maxY = infoHeaderAlignItems().reduce((m, b) => Math.max(m, b.y + b.h), 0);
        infoCustomBlocks.push({ id: Date.now() + Math.random(), x: 0, y: maxY + 0.02, w: 0.3, h: 0.06, text: '雙擊以編輯文字' });
        saveAll();
        renderInfo();
      });
    }
  }

  function startInfoHeaderDrag(e, b, canvas, el) {
    const W = canvas.offsetWidth;
    const scale = getInfoHeaderScale();
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = b.x, by0 = b.y;
    let moved = false;

    el.classList.add('block-dragging');
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / (W * scale);
      const dy = (ev.clientY - y0) / (W * scale);
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      const { vLines, hLines, snapX, snapY } = computeGalleryAlignSnap(b.id, nx, ny, b.w, b.h, W, infoHeaderAlignItems());
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      nx = Math.max(0, Math.min(1 - b.w, nx));
      ny = Math.max(0, ny);

      b.x = nx; b.y = ny;
      el.style.left = (nx * W) + 'px';
      el.style.top  = (ny * W) + 'px';

      renderInfoHeaderGuides(vLines, hLines, W);
      updateInfoHeaderCanvasHeight(canvas, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved) {
        saveAll();
        el.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, { once: true });
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startInfoHeaderResize(e, b, dir, canvas, el) {
    const W = canvas.offsetWidth;
    const scale = getInfoHeaderScale();
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...b };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = el.querySelector(`.rh-${dir}`).style.cursor || 'default';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / (W * scale);
      const dy = (ev.clientY - y0) / (W * scale);

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e')) w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s')) h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      b.x = x; b.y = y; b.w = w; b.h = h;
      el.style.left   = (x * W) + 'px';
      el.style.top    = (y * W) + 'px';
      el.style.width  = (w * W) + 'px';
      el.style.height = (h * W) + 'px';

      const { vLines, hLines } = computeGalleryAlignSnap(b.id, x, y, w, h, W, infoHeaderAlignItems());
      renderInfoHeaderGuides(vLines, hLines, W);
      updateInfoHeaderCanvasHeight(canvas, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* Contact section — two free-form draggable text blocks (phone/email),
     same drag/resize/edit mechanics as the Info header's custom blocks
     (openInfoCustomTextEditor is reused as-is), just on their own canvas
     + array since there's no fixed/hidden/add-new distinction here —
     always exactly the two blocks seeded by app.js's defaultContactBlocks(). */
  function contactAlignItems() { return contactBlocks || []; }

  function renderContactGuides(vLines, hLines, W) {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  // Same reasoning as getInfoHeaderScale — .contact-canvas gets frozen +
  // visually scaled below CONTACT_MIN_W (app.js), so a mouse-pixel delta
  // during drag/resize needs dividing by this too, on top of W.
  function getContactScale() {
    const wrap = document.getElementById('contact-canvas-wrap');
    if (!wrap) return 1;
    return Math.min(1, wrap.offsetWidth / CONTACT_MIN_W);
  }

  function updateContactCanvasHeight(canvas, W) {
    const maxBottom = Math.max(60 / W, contactAlignItems().reduce((m, b) => Math.max(m, b.y + b.h), 0));
    canvas.style.height = (maxBottom * W) + 'px';
    const wrap = document.getElementById('contact-canvas-wrap');
    if (wrap) wrap.style.height = (maxBottom * W * getContactScale()) + 'px';
  }

  function injectContactControls() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas || !contactBlocks) return;

    const CURSORS = {
      n:'n-resize', ne:'ne-resize', e:'e-resize', se:'se-resize',
      s:'s-resize', sw:'sw-resize', w:'w-resize', nw:'nw-resize',
    };

    document.querySelectorAll('.contact-block[data-contact-id]').forEach(el => {
      if (el.dataset.contactInit) return;
      el.dataset.contactInit = '1';

      const id = el.dataset.contactId;
      // Fixed blocks (phone/email) carry string ids so this matches
      // directly; custom (user-added) blocks carry numeric ids, but
      // dataset attributes are always strings — String() bridges that,
      // same fix already applied to infoCustomBlocks' lookup.
      const b = contactBlocks.find(x => String(x.id) === id);
      if (!b) return;

      Object.keys(CURSORS).forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `rh rh-${dir}`;
        handle.style.cursor = CURSORS[dir];
        handle.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          startContactResize(e, b, dir, canvas, el);
        });
        el.appendChild(handle);
      });

      const panel = document.createElement('div');
      panel.className = 'tb-panel';
      panel.innerHTML = `
        <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${b.fontSize ?? 22}">
        <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${b.weight ?? 500}">
        <input type="color" class="tb-color" title="顏色" value="${b.color ?? '#F5F4F0'}">`;
      el.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());
      panel.querySelector('.tb-fs').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 22, 6, 96);
        e.target.value = v; b.fontSize = v;
        const t = el.querySelector('p'); if (t) t.style.fontSize = v + 'px';
        saveAll();
      });
      panel.querySelector('.tb-weight').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 500, 100, 900);
        e.target.value = v; b.weight = v;
        const t = el.querySelector('p'); if (t) t.style.fontWeight = v;
        saveAll();
      });
      panel.querySelector('.tb-color').addEventListener('input', e => {
        b.color = e.target.value;
        const t = el.querySelector('p'); if (t) t.style.color = e.target.value;
        saveAll();
      });

      // Unlike the Info header's custom text blocks (which reserve the
      // <p> for a single click that opens the editor, since the block is
      // otherwise empty and has room to grab elsewhere), a contact block's
      // <p> fills the whole draggable area — there's no gap left to grab.
      // So dragging starts from anywhere, including the text, and text
      // editing moves to double-click instead (same convention already
      // used for the header's *fixed* blocks, which have the same
      // fills-the-whole-area problem with their email/phone links).
      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        if (e.target.classList.contains('rh')) return;
        if (e.target.closest('.tb-panel')) return;
        if (e.target.closest('.ihb-del')) return;
        e.preventDefault();
        startContactDrag(e, b, canvas, el);
      });

      el.querySelector('p')?.addEventListener('dblclick', e => {
        if (!isEditing) return;
        e.preventDefault(); e.stopPropagation();
        openInfoCustomTextEditor(el, b);
      });

      const delBtn = el.querySelector('.ihb-del');
      delBtn?.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
      delBtn?.addEventListener('click', e => {
        e.stopPropagation();
        contactBlocks.splice(contactBlocks.indexOf(b), 1);
        saveAll();
        renderContact();
      });
    });

    // Add a new free-form text block, addable anywhere on the dark block
    const addBtn = document.getElementById('contact-add-btn');
    if (addBtn && !addBtn.dataset.addInit) {
      addBtn.dataset.addInit = '1';
      addBtn.addEventListener('click', () => {
        const maxY = contactAlignItems().reduce((m, b) => Math.max(m, b.y + b.h), 0);
        contactBlocks.push({
          id: Date.now() + Math.random(), x: 0, y: maxY + 0.02, w: 0.3, h: 0.08,
          text: '雙擊以編輯文字', fontSize: 22, weight: 500, color: '#F5F4F0',
        });
        saveAll();
        renderContact();
      });
    }
  }

  function startContactDrag(e, b, canvas, el) {
    const W = canvas.offsetWidth;
    const scale = getContactScale();
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = b.x, by0 = b.y;
    let moved = false;

    el.classList.add('block-dragging');
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / (W * scale);
      const dy = (ev.clientY - y0) / (W * scale);
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      const { vLines, hLines, snapX, snapY } = computeGalleryAlignSnap(b.id, nx, ny, b.w, b.h, W, contactAlignItems());
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      nx = Math.max(0, Math.min(1 - b.w, nx));
      ny = Math.max(0, ny);

      b.x = nx; b.y = ny;
      el.style.left = (nx * W) + 'px';
      el.style.top  = (ny * W) + 'px';

      renderContactGuides(vLines, hLines, W);
      updateContactCanvasHeight(canvas, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved) saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startContactResize(e, b, dir, canvas, el) {
    const W = canvas.offsetWidth;
    const scale = getContactScale();
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...b };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = el.querySelector(`.rh-${dir}`).style.cursor || 'default';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / (W * scale);
      const dy = (ev.clientY - y0) / (W * scale);

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e')) w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s')) h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      b.x = x; b.y = y; b.w = w; b.h = h;
      el.style.left   = (x * W) + 'px';
      el.style.top    = (y * W) + 'px';
      el.style.width  = (w * W) + 'px';
      el.style.height = (h * W) + 'px';

      const { vLines, hLines } = computeGalleryAlignSnap(b.id, x, y, w, h, W, contactAlignItems());
      renderContactGuides(vLines, hLines, W);
      updateContactCanvasHeight(canvas, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* =============================================
     Crop Modal — drag-anchor crop frame, locked to the
     block's own aspect ratio. Shared by project blocks and
     gallery blocks; result is stored as imgX/imgY/imgZoom and
     rendered via applyPreciseCrop() in app.js, which keeps the
     window's *center* at imgX/imgY exactly — matching this
     modal's preview for any crop position, not just centered ones.
     ============================================= */
  function openCropModal({ imageUrl, ratio, initial, onApply }) {
    document.getElementById('crop-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'crop-modal';
    modal.innerHTML = `
      <div class="cm-backdrop"></div>
      <div class="cm-panel">
        <div class="cm-header">
          <span class="cm-title">裁切圖片</span>
          <button class="cm-close">✕</button>
        </div>
        <div class="cm-stage">
          <img class="cm-image" src="${imageUrl}">
          <div class="cm-frame">
            <div class="rh rh-nw" data-h="nw"></div>
            <div class="rh rh-ne" data-h="ne"></div>
            <div class="rh rh-se" data-h="se"></div>
            <div class="rh rh-sw" data-h="sw"></div>
          </div>
        </div>
        <div class="cm-footer">
          <button class="cm-reset-btn">重設</button>
          <button class="cm-done-btn">完成</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('open'));

    const imgEl   = modal.querySelector('.cm-image');
    const stage   = modal.querySelector('.cm-stage');
    const frame   = modal.querySelector('.cm-frame');

    let dispW, dispH, coverW, coverH;
    let fx = 0, fy = 0, fw = 0, fh = 0;

    function setFrame(x, y, w, h) {
      w = clamp(w, coverW / 4, coverW);
      h = w / ratio;
      x = clamp(x, 0, dispW - w);
      y = clamp(y, 0, dispH - h);
      fx = x; fy = y; fw = w; fh = h;
      frame.style.left   = x + 'px';
      frame.style.top    = y + 'px';
      frame.style.width  = w + 'px';
      frame.style.height = h + 'px';
    }

    function layout() {
      const maxW = Math.min(window.innerWidth * 0.8, 720);
      const maxH = window.innerHeight * 0.62;
      const natAR = imgEl.naturalWidth / imgEl.naturalHeight;
      dispW = maxW; dispH = dispW / natAR;
      if (dispH > maxH) { dispH = maxH; dispW = dispH * natAR; }
      imgEl.style.width  = dispW + 'px';
      imgEl.style.height = dispH + 'px';
      stage.style.width  = dispW + 'px';
      stage.style.height = dispH + 'px';

      if (dispW / dispH > ratio) { coverH = dispH; coverW = coverH * ratio; }
      else                       { coverW = dispW; coverH = coverW / ratio; }

      const z  = Math.max(1, initial.imgZoom || 1);
      const fw0 = coverW / z, fh0 = coverH / z;
      const cx = (initial.imgX ?? 50) / 100 * dispW;
      const cy = (initial.imgY ?? 50) / 100 * dispH;
      setFrame(cx - fw0 / 2, cy - fh0 / 2, fw0, fh0);
    }

    if (imgEl.complete && imgEl.naturalWidth) layout();
    else imgEl.addEventListener('load', layout, { once: true });
    window.addEventListener('resize', layout);

    function closeModal() {
      window.removeEventListener('resize', layout);
      modal.classList.remove('open');
      modal.addEventListener('transitionend', () => modal.remove(), { once: true });
    }
    modal.querySelector('.cm-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.cm-close').addEventListener('click', closeModal);

    /* Drag frame body to move */
    frame.addEventListener('mousedown', e => {
      if (e.target.classList.contains('rh')) return;
      e.preventDefault();
      const x0 = e.clientX, y0 = e.clientY, ofx = fx, ofy = fy;
      function onMove(ev) { setFrame(ofx + (ev.clientX - x0), ofy + (ev.clientY - y0), fw, fh); }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    /* Drag corner handles to resize, aspect ratio locked */
    frame.querySelectorAll('.rh').forEach(h => {
      h.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const dir = h.dataset.h;
        const anchorX = dir.includes('w') ? fx + fw : fx;
        const anchorY = dir.includes('n') ? fy + fh : fy;
        function onMove(ev) {
          const r = stage.getBoundingClientRect();
          const mx = ev.clientX - r.left, my = ev.clientY - r.top;
          let w = Math.abs(mx - anchorX);
          let h2 = w / ratio;
          const altH = Math.abs(my - anchorY);
          if (altH > h2) { h2 = altH; w = h2 * ratio; }
          const x = dir.includes('w') ? anchorX - w : anchorX;
          const y = dir.includes('n') ? anchorY - h2 : anchorY;
          setFrame(x, y, w, h2);
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });

    modal.querySelector('.cm-reset-btn').addEventListener('click', () => {
      setFrame((dispW - coverW) / 2, (dispH - coverH) / 2, coverW, coverH);
    });

    modal.querySelector('.cm-done-btn').addEventListener('click', () => {
      const zoom = clamp(coverW / fw, 1, 4);
      const imgX = clamp((fx + fw / 2) / dispW * 100, 0, 100);
      const imgY = clamp((fy + fh / 2) / dispH * 100, 0, 100);
      onApply(imgX, imgY, zoom);
      closeModal();
    });
  }

  /* ——— In-block image crop (pan + zoom) ——— */
  function updateBlockVisuals(el, p) {
    const blockId = parseInt(el.dataset.blockId);
    const b = blocks.find(x => x.id === blockId) || {};

    const ph = el.querySelector('.project-card-ph');
    if (ph) {
      ph.style.background = p ? p.bg : 'var(--bg2)';
      // Swap cover image
      let img = ph.querySelector('.block-cover-img');
      const coverUrl = p ? cloudinaryUrl(p.cover, 1639) : null;
      if (coverUrl) {
        if (!img) {
          img = document.createElement('img');
          img.className = 'block-cover-img';
          img.draggable = false;
          ph.appendChild(img);
        }
        img.src = coverUrl;
        applyPreciseCrop(img, ph, b.imgX ?? 50, b.imgY ?? 50, b.imgZoom ?? 1);
      } else {
        img?.remove();
      }
    }
    const nameEl = el.querySelector('.project-card-name');
    const catEl  = el.querySelector('.project-card-cat');
    if (nameEl) nameEl.textContent = p ? p.name : '';
    if (catEl)  catEl.textContent  = p ? p.category : '';
    if (p) {
      el.setAttribute('href', `/projects/${p.slug}`);
      el.setAttribute('aria-label', p.name);
      if (!el.hasAttribute('data-link')) el.setAttribute('data-link', '');
    } else {
      el.removeAttribute('href');
      el.removeAttribute('data-link');
    }
    // Update crop button visibility
    const cropBtn = el.querySelector('.fb-crop');
    if (cropBtn) cropBtn.style.display = (p && p.cover) ? '' : 'none';
  }

  function buildProjectOptions(selectedSlug) {
    return [
      `<option value="" ${!selectedSlug ? 'selected' : ''}>— 空白 —</option>`,
      ...projects.map(p =>
        `<option value="${p.slug}" ${selectedSlug === p.slug ? 'selected' : ''}>${p.name}</option>`
      ),
    ].join('');
  }

  /* =============================================
     Free-form Edit Controls
     ============================================= */
  new MutationObserver(() => {
    if (isEditing && document.querySelector('.projects-canvas')) {
      requestAnimationFrame(injectFreeformControls);
    }
  }).observe(document.getElementById('app'), { childList: true, subtree: true });

  /* =============================================
     Project Detail — free-form gallery ("專案詳述")
     ============================================= */
  function getCurrentDetailProject() {
    const m = location.pathname.match(/^\/projects\/([^/]+)$/);
    return m ? projects.find(p => p.slug === m[1]) || null : null;
  }

  /* Keep data-meta-idx in sync with p.meta after a row is added/removed,
     so click handlers (which read the attribute fresh, not a stale closure
     value) always target the correct entry without needing a re-render. */
  function renumberMetaRows(creditEl) {
    creditEl.querySelectorAll('.meta-row').forEach((row, i) => {
      row.dataset.metaIdx = i;
    });
  }

  function openMetaEditor(el, p, idx, field) {
    document.getElementById('info-text-editor')?.remove();
    const curText = p.meta[idx][field] || '';

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">${field === 'label' ? 'Credit 標籤' : 'Credit 內容'}</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-btns">
        <button class="ite-del">刪除整行</button>
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 180)}px;`;
    document.body.appendChild(ped);
    const ta = ped.querySelector('.ite-ta');
    ta.focus(); ta.select();
    ta.addEventListener('input', e => { el.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save) el.textContent = curText;
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-del').addEventListener('click', () => {
      document.removeEventListener('click', onDoc);
      ped.remove();
      p.meta.splice(idx, 1);
      const row = el.closest('.meta-row');
      const creditEl = row?.closest('.detail-credit');
      row?.remove();
      if (creditEl) renumberMetaRows(creditEl);
      saveAll();
    });
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      document.removeEventListener('click', onDoc);
      ped.remove();
      p.meta[idx][field] = ta.value;
      saveAll();
    });
  }

  /* Independent left/right inset handles for the Previous/Next nav row */
  function injectDetailNavInsetHandles() {
    const nav = document.querySelector('.detail-nav');
    if (!nav || nav.dataset.insetInit) return;
    nav.dataset.insetInit = '1';

    const hl = document.createElement('div');
    hl.className = 'dnv-handle dnv-handle-l';
    hl.title = '拖曳調整左邊留白';
    const hr = document.createElement('div');
    hr.className = 'dnv-handle dnv-handle-r';
    hr.title = '拖曳調整右邊留白';
    nav.appendChild(hl);
    nav.appendChild(hr);

    hl.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const x0 = e.clientX, start = detailNavInsetL, max = nav.offsetWidth * 0.3;
      function onMove(ev) {
        detailNavInsetL = clamp(start + (ev.clientX - x0), 0, max);
        applyDetailInsets();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    hr.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const x0 = e.clientX, start = detailNavInsetR, max = nav.offsetWidth * 0.3;
      function onMove(ev) {
        detailNavInsetR = clamp(start - (ev.clientX - x0), 0, max);
        applyDetailInsets();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* Three drag handles on the fixed-left/scrolling-right split:
     - middle: sits in the gutter between .detail-left and .detail-right,
       adjusting detailSplitLeftPct. Positioned via JS (not pure CSS) so
       it always sits exactly over the gap regardless of the left
       column's current computed width.
     - left/right edges: adjust detailSplitInsetL/R (outer whitespace),
       positioned via CSS var() + calc() since they map 1:1 to the
       padding already applied to .detail-split. */
  function injectDetailSplitHandle() {
    const split = document.querySelector('.detail-split');
    if (!split || split.dataset.splitInit) return;
    split.dataset.splitInit = '1';

    const handle = document.createElement('div');
    handle.className = 'detail-split-handle';
    handle.title = '拖曳調整左右區塊寬度';
    split.appendChild(handle);

    function position() {
      const left = split.querySelector('.detail-left');
      if (!left) return;
      const splitRect = split.getBoundingClientRect();
      const leftRect = left.getBoundingClientRect();
      handle.style.left = (leftRect.right - splitRect.left) + 'px';
    }
    position();
    window.addEventListener('resize', position);

    handle.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const splitRect = split.getBoundingClientRect();
      const style = getComputedStyle(split);
      const padL = parseFloat(style.paddingLeft) || 0;
      const padR = parseFloat(style.paddingRight) || 0;
      const innerW = splitRect.width - padL - padR;
      function onMove(ev) {
        const x = ev.clientX - splitRect.left - padL;
        detailSplitLeftPct = clamp((x / innerW) * 100, 20, 60);
        applyDetailSplit();
        position();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    const hl = document.createElement('div');
    hl.className = 'detail-split-handle-l';
    hl.title = '拖曳調整左邊留白';
    const hr = document.createElement('div');
    hr.className = 'detail-split-handle-r';
    hr.title = '拖曳調整右邊留白';
    split.appendChild(hl);
    split.appendChild(hr);

    hl.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const x0 = e.clientX, start = detailSplitInsetL, max = split.offsetWidth * 0.3;
      function onMove(ev) {
        detailSplitInsetL = clamp(start + (ev.clientX - x0), 0, max);
        applyDetailSplit();
        position();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    hr.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const x0 = e.clientX, start = detailSplitInsetR, max = split.offsetWidth * 0.3;
      function onMove(ev) {
        detailSplitInsetR = clamp(start - (ev.clientX - x0), 0, max);
        applyDetailSplit();
        position();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* Drag handle on the corner of the cover image's .dc-frame, adjusting
     the site-wide detailCoverRatio (width/height) — every project's
     cover crops to this same shape via object-fit:cover. Only appears
     when the current project actually has a cover image. */
  function injectDetailCoverRatioHandle() {
    const frame = document.querySelector('.dc-frame');
    if (!frame || frame.dataset.coverInit) return;
    frame.dataset.coverInit = '1';

    const rh = document.createElement('div');
    rh.className = 'rh rh-se';
    rh.title = '拖曳調整封面圖比例（套用到全部專案）';
    frame.appendChild(rh);

    rh.addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const rect = frame.getBoundingClientRect();
      const W = rect.width;
      const y0 = e.clientY;
      const startH = rect.height;
      function onMove(ev) {
        const h = Math.max(80, startH + (ev.clientY - y0));
        detailCoverRatio = clamp(Math.round((W / h) * 1000) / 1000, 0.5, 4);
        applyDetailCoverRatio();
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        saveAll();
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* Crop/replace/remove panel on the cover image frame. Crop reuses the
     shared openCropModal (same one the home-page project cards use) —
     ratio is the site-wide detailCoverRatio, but the resulting pan/zoom
     (imgX/imgY/imgZoom) is stored per-project since each cover is a
     different photo. */
  function injectCoverImagePanel(p) {
    const frame = document.querySelector('.dc-frame');
    if (!frame || frame.dataset.panelInit) return;
    frame.dataset.panelInit = '1';

    const panel = document.createElement('div');
    panel.className = 'dc-panel';
    panel.innerHTML = `
      <button class="dc-crop" title="裁切圖片">⊞</button>
      <button class="dc-replace" title="更換圖片">⟳</button>
      <input type="file" class="dc-replace-file" accept="image/*" style="display:none">
      <button class="dc-del" title="移除主圖">✕</button>`;
    frame.appendChild(panel);
    panel.addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('click', e => e.stopPropagation());

    panel.querySelector('.dc-crop').addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const img = frame.querySelector('.dc-img');
      if (!img) return;
      openCropModal({
        imageUrl: cloudinaryUrl(p.cover, 1600),
        ratio: detailCoverRatio,
        initial: { imgX: p.coverImgX, imgY: p.coverImgY, imgZoom: p.coverImgZoom },
        onApply: (imgX, imgY, imgZoom) => {
          p.coverImgX = imgX; p.coverImgY = imgY; p.coverImgZoom = imgZoom;
          saveAll();
          applyCoverCrop(p);
        },
      });
    });

    const replaceBtn   = panel.querySelector('.dc-replace');
    const replaceInput = panel.querySelector('.dc-replace-file');
    replaceBtn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      replaceInput.click();
    });
    replaceInput.addEventListener('change', async () => {
      const file = replaceInput.files?.[0];
      if (!file) return;
      replaceBtn.textContent = '…';
      try {
        p.cover = await uploadToCloudinary(file);
        p.coverImgX = p.coverImgY = p.coverImgZoom = null;
        saveAll();
        renderDetail(p.slug);
      } catch (err) {
        alert('上傳失敗：' + err.message);
        replaceBtn.textContent = '⟳';
        replaceInput.value = '';
      }
    });

    panel.querySelector('.dc-del').addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      p.cover = null;
      p.coverImgX = p.coverImgY = p.coverImgZoom = null;
      saveAll();
      renderDetail(p.slug);
    });
  }

  /* Drag-resize handle + line toggle for the dividers between
     Statement+Credit / Gallery / Outro. Plain normal-flow elements
     (not a fractional canvas), so resizing just sets the element's
     pixel height directly — no applyXPositions() recompute needed. */
  function injectSectionDividerControls(p) {
    if (!p.sectionGaps) p.sectionGaps = [80, 80];
    if (!p.sectionDividers) p.sectionDividers = [true, false];

    document.querySelectorAll('.section-divider[data-divider-idx]').forEach(div => {
      if (div.dataset.sdInit) return;
      div.dataset.sdInit = '1';
      const idx = parseInt(div.dataset.dividerIdx);

      const handle = document.createElement('div');
      handle.className = 'sd-handle';
      handle.title = '拖曳調整間距';
      const toggle = document.createElement('button');
      toggle.className = 'sd-toggle';
      toggle.title = '顯示/隱藏分隔線';
      toggle.textContent = p.sectionDividers[idx] ? '－' : '+';
      div.appendChild(handle);
      div.appendChild(toggle);

      handle.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const y0 = e.clientY, start = p.sectionGaps[idx];
        function onMove(ev) {
          const h = clamp(start + (ev.clientY - y0), 0, 320);
          div.style.height = h + 'px';
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          p.sectionGaps[idx] = div.offsetHeight;
          saveAll();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      toggle.addEventListener('mousedown', e => e.stopPropagation());
      toggle.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        p.sectionDividers[idx] = !p.sectionDividers[idx];
        div.querySelector('.section-divider-line').style.display = p.sectionDividers[idx] ? '' : 'none';
        toggle.textContent = p.sectionDividers[idx] ? '－' : '+';
        saveAll();
      });
    });
  }

  function injectGalleryControls() {
    const p = getCurrentDetailProject();
    if (!p) return;
    if (!p.gallery) p.gallery = [];

    injectDetailNavInsetHandles();
    injectDetailSplitHandle();
    injectDetailCoverRatioHandle();
    injectCoverImagePanel(p);
    injectSectionDividerControls(p);
    injectSubtitleFontSizeControl(p);
    injectStatementBlockControls(p);
    injectCreditBlockControls(p);
    injectOutroBlockControls(p);
    injectCustomBlockControls(p);

    const canvas = document.getElementById('gallery-canvas');
    if (!canvas) return;

    // Inline credit (meta row) editing — index is read fresh from the
    // element's dataset on each click, not captured by closure, so it stays
    // correct after rows are added/removed without a full re-render.
    function wireMetaRow(row) {
      if (row.dataset.metaInit) return;
      row.dataset.metaInit = '1';
      const labelEl = row.querySelector('.meta-label');
      const valueEl = row.querySelector('.meta-value');
      labelEl?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openMetaEditor(labelEl, p, parseInt(row.dataset.metaIdx), 'label'); });
      valueEl?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openMetaEditor(valueEl, p, parseInt(row.dataset.metaIdx), 'value'); });
      wireRowHeightHandle(row, 'credit');
    }
    document.querySelectorAll('.detail-credit .meta-row[data-meta-idx]').forEach(wireMetaRow);
    injectCreditLabelHandle();

    const creditEl = document.querySelector('.detail-credit');
    if (creditEl && !creditEl.querySelector('.credit-add-row')) {
      const addRowBtn = document.createElement('button');
      addRowBtn.className = 'credit-add-row';
      addRowBtn.textContent = '+ 新增一行';
      addRowBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        p.meta.push({ label: '標籤', value: '內容' });
        saveAll();
        const row = document.createElement('div');
        row.className = 'meta-row';
        row.dataset.metaIdx = p.meta.length - 1;
        const crStyle = (p.crColor || p.crWeight)
          ? ` style="${p.crColor ? `color:${p.crColor};` : ''}${p.crWeight ? `font-weight:${p.crWeight};` : ''}"`
          : '';
        row.innerHTML = `
          <span class="meta-label"${crStyle}>標籤</span>
          <span class="meta-value"${crStyle}>內容</span>`;
        creditEl.insertBefore(row, addRowBtn);
        wireMetaRow(row);
      });
      creditEl.appendChild(addRowBtn);
    }

    if (!p.gallery.length && !canvas.querySelector('.gallery-empty-hint')) {
      const hint = document.createElement('div');
      hint.className = 'gallery-empty-hint';
      hint.textContent = '+ 用上方「+ 圖片」新增詳述圖片';
      canvas.appendChild(hint);
    } else if (p.gallery.length) {
      canvas.querySelector('.gallery-empty-hint')?.remove();
    }

    // Gallery is a single-column sequential list — drag a handle to
    // reorder (live DOM reorder, commit array order on drop, same pattern
    // as the Info page's project-row reordering). No free x/y/w/h
    // positioning, but each image can be individually cropped (g.ratio +
    // g.imgX/Y/Zoom) via the shared openCropModal.
    canvas.querySelectorAll('.gallery-item').forEach(el => {
      if (el.dataset.galInit) return;
      el.dataset.galInit = '1';

      const gid = el.dataset.galleryId;
      const g = p.gallery.find(x => String(x.id) === gid);
      if (!g) return;

      const panel = document.createElement('div');
      panel.className = 'gb-panel';
      panel.innerHTML = `
        <span class="gb-handle" title="拖曳排序">⋮⋮</span>
        <button class="gb-crop" title="裁切圖片">⊞</button>
        <button class="gb-replace" title="更換照片">⟳</button>
        <input type="file" class="gb-replace-file" accept="image/*" style="display:none">
        <button class="gb-del" title="刪除">✕</button>`;
      el.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());
      panel.querySelector('.gb-crop').addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const imgEl = el.querySelector('img');
        if (!imgEl) return;
        const ratio = g.ratio || (imgEl.naturalWidth / imgEl.naturalHeight) || 1;
        openCropModal({
          imageUrl: cloudinaryUrl(g.url, 1800),
          ratio,
          initial: { imgX: g.imgX, imgY: g.imgY, imgZoom: g.imgZoom },
          onApply: (imgX, imgY, imgZoom) => {
            g.ratio = ratio;
            g.imgX = imgX; g.imgY = imgY; g.imgZoom = imgZoom;
            saveAll();
            renderDetail(p.slug);
          },
        });
      });
      const replaceBtn   = panel.querySelector('.gb-replace');
      const replaceInput = panel.querySelector('.gb-replace-file');
      replaceBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        replaceInput.click();
      });
      replaceInput.addEventListener('change', async () => {
        const file = replaceInput.files?.[0];
        if (!file) return;
        replaceBtn.textContent = '…';
        try {
          g.url = await uploadToCloudinary(file);
          saveAll();
          renderDetail(p.slug);
        } catch (err) {
          alert('上傳失敗：' + err.message);
          replaceBtn.textContent = '⟳';
          replaceInput.value = '';
        }
      });
      panel.querySelector('.gb-del').addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        p.gallery.splice(p.gallery.indexOf(g), 1);
        saveAll();
        renderDetail(p.slug);
      });

      // Size anchor — same idea as the cover image's ratio handle, but
      // per-image and per-project (not site-wide). Dragging a natural
      // (uncropped) image's handle switches it into cropped mode first,
      // seeded with its current framing, so there's a frame to resize.
      const sizeHandle = document.createElement('div');
      sizeHandle.className = 'rh rh-se';
      sizeHandle.title = '拖曳調整圖片尺寸';
      el.appendChild(sizeHandle);
      sizeHandle.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        const rect = el.getBoundingClientRect();
        const W = rect.width;
        const y0 = e.clientY;
        const startH = rect.height;

        if (!g.ratio) {
          g.ratio = W / startH;
          g.imgX = 50; g.imgY = 50; g.imgZoom = 1;
          el.classList.add('gallery-item-cropped');
          el.querySelector('img')?.classList.add('gi-crop-img');
          el.style.aspectRatio = g.ratio;
        }
        const img = el.querySelector('.gi-crop-img');

        function onMove(ev) {
          const h = Math.max(60, startH + (ev.clientY - y0));
          g.ratio = clamp(Math.round((W / h) * 1000) / 1000, 0.3, 5);
          el.style.aspectRatio = g.ratio;
          if (img) applyPreciseCrop(img, el, g.imgX ?? 50, g.imgY ?? 50, g.imgZoom ?? 1);
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          saveAll();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      panel.querySelector('.gb-handle').addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        el.classList.add('block-dragging');
        function onMove(ev) {
          const items = [...canvas.querySelectorAll('.gallery-item')].filter(x => x !== el);
          let placed = false;
          for (const item of items) {
            const rect = item.getBoundingClientRect();
            if (ev.clientY < rect.top + rect.height / 2) {
              if (item.previousElementSibling !== el) canvas.insertBefore(el, item);
              placed = true;
              break;
            }
          }
          if (!placed) canvas.appendChild(el);
        }
        function onUp() {
          el.classList.remove('block-dragging');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          const newOrder = [...canvas.querySelectorAll('.gallery-item')]
            .map(x => p.gallery.find(y => String(y.id) === x.dataset.galleryId));
          p.gallery.splice(0, p.gallery.length, ...newOrder);
          saveAll();
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      el.addEventListener('click', e => {
        if (isEditing) { e.preventDefault(); e.stopPropagation(); }
      });
    });
  }

  /* ——— Alignment guides for the gallery canvas (mirrors computeAlignSnap) ——— */
  function computeGalleryAlignSnap(activeId, ax, ay, aw, ah, W, items) {
    const T = GUIDE_PX / W;
    const vLines = [];
    const hLines = [];
    let snapX = null, snapY = null;

    if (Math.abs(ax) < T)              { vLines.push(0);   snapX = snapX ?? 0; }
    if (Math.abs(ax + aw - 1) < T)     { vLines.push(1);   snapX = snapX ?? 1 - aw; }
    if (Math.abs(ax - 0.5 + aw/2) < T) { vLines.push(0.5); snapX = snapX ?? 0.5 - aw/2; }

    items.forEach(g => {
      if (g.id === activeId) return;
      [g.x, g.x + g.w, g.x + g.w/2].forEach(ex => {
        if (Math.abs(ax - ex) < T)        { vLines.push(ex); snapX = snapX ?? ex; }
        if (Math.abs(ax + aw - ex) < T)   { vLines.push(ex); snapX = snapX ?? ex - aw; }
        if (Math.abs(ax + aw/2 - ex) < T) { vLines.push(ex); snapX = snapX ?? ex - aw/2; }
      });
      [g.y, g.y + g.h, g.y + g.h/2].forEach(ey => {
        if (Math.abs(ay - ey) < T)        { hLines.push(ey); snapY = snapY ?? ey; }
        if (Math.abs(ay + ah - ey) < T)   { hLines.push(ey); snapY = snapY ?? ey - ah; }
        if (Math.abs(ay + ah/2 - ey) < T) { hLines.push(ey); snapY = snapY ?? ey - ah/2; }
      });
    });

    return { vLines: [...new Set(vLines)], hLines: [...new Set(hLines)], snapX, snapY };
  }

  /* Subtitle (the English/tagline line under the title) — same
     size/weight/color .tb-panel as the other text blocks. */
  function injectSubtitleFontSizeControl(p) {
    const el = document.querySelector('.detail-subtitle');
    if (!el || el.dataset.txtInit) return;
    el.dataset.txtInit = '1';

    const panel = document.createElement('div');
    panel.className = 'tb-panel';
    panel.innerHTML = `
      <input type="number" class="tb-fs" min="6" max="60" title="字級 (px)" value="${p.subFontSize ?? 13}">
      <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${p.subWeight ?? 400}">
      <input type="color" class="tb-color" title="顏色" value="${p.subColor ?? '#9B9B93'}">`;
    el.appendChild(panel);
    panel.addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('click', e => e.stopPropagation());
    panel.querySelector('.tb-fs').addEventListener('change', e => {
      const v = clamp(parseInt(e.target.value) || 13, 6, 60);
      e.target.value = v;
      p.subFontSize = v;
      el.style.fontSize = v + 'px';
      saveAll();
    });
    panel.querySelector('.tb-weight').addEventListener('change', e => {
      const v = clamp(parseInt(e.target.value) || 400, 100, 900);
      e.target.value = v;
      p.subWeight = v;
      el.style.fontWeight = v;
      saveAll();
    });
    panel.querySelector('.tb-color').addEventListener('input', e => {
      p.subColor = e.target.value;
      el.style.color = e.target.value;
      saveAll();
    });
  }

  /* =============================================
     Statement + Credit — plain document flow now (no more free-form
     positioning); only typography (size/weight/color) is still editable.
     ============================================= */
  function injectStatementBlockControls(p) {
    const row = document.querySelector('.detail-meta-row');
    if (!row) return;

    // Self-heal stale data: stWidth used to be stored as raw px before it
    // switched to a column-width fraction (so custom widths would survive
    // a window resize) — a leftover px value like 350 would now be read
    // as 35000%, blowing out the layout. Drop anything outside a sane
    // fraction range so it falls back to the default full width.
    if (p.stWidth != null && !(p.stWidth > 0 && p.stWidth <= 1)) {
      delete p.stWidth;
      saveAll();
    }

    function wire(el, cfg) {
      if (!el || el.dataset.txtInit) return;
      el.dataset.txtInit = '1';

      const panel = document.createElement('div');
      panel.className = 'tb-panel';
      panel.innerHTML = `
        <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${p[cfg.fsKey] ?? cfg.fsDefault}">
        <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${p[cfg.weightKey] ?? cfg.weightDefault}">
        <input type="color" class="tb-color" title="顏色" value="${p[cfg.colorKey] ?? cfg.colorDefault}">
        ${cfg.onDelete ? `<button class="tb-del" title="移除">✕</button>` : ''}`;
      el.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());
      panel.querySelector('.tb-fs').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || cfg.fsDefault, 6, 96);
        e.target.value = v;
        p[cfg.fsKey] = v;
        cfg.applyFs(v);
        saveAll();
      });
      panel.querySelector('.tb-weight').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || cfg.weightDefault, 100, 900);
        e.target.value = v;
        p[cfg.weightKey] = v;
        cfg.applyWeight(v);
        saveAll();
      });
      panel.querySelector('.tb-color').addEventListener('input', e => {
        p[cfg.colorKey] = e.target.value;
        cfg.applyColor(e.target.value);
        saveAll();
      });
      panel.querySelector('.tb-del')?.addEventListener('click', () => cfg.onDelete());

      // Width resize anchor — the block is normal document flow (not a
      // free-form canvas), so only its width is adjustable; the left edge
      // stays anchored to the column and height stays auto (content-driven).
      if (cfg.widthKey) {
        const rh = document.createElement('div');
        rh.className = 'rh rh-e';
        rh.title = '拖曳調整寬度';
        el.appendChild(rh);
        rh.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          const x0 = e.clientX;
          const start = el.getBoundingClientRect().width;
          const max = row.getBoundingClientRect().width;
          function onMove(ev) {
            const w = clamp(Math.round(start + (ev.clientX - x0)), 120, max);
            el.style.width = w + 'px';
          }
          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            // Store as a fraction of the column width (not raw px) so it
            // stays correct if the window/column is resized later — a
            // fixed px width wouldn't track a narrower or wider column.
            p[cfg.widthKey] = el.getBoundingClientRect().width / row.getBoundingClientRect().width;
            el.style.width = (p[cfg.widthKey] * 100) + '%';
            saveAll();
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }
    }

    const stEl = row.querySelector('.detail-statement');
    wire(stEl, {
      fsKey: 'stFontSize', fsDefault: 12,
      weightKey: 'stWeight', weightDefault: 400,
      colorKey: 'stColor', colorDefault: '#6B6B65',
      widthKey: 'stWidth',
      applyFs:     v => { const t = row.querySelector('.detail-statement p'); if (t) t.style.fontSize   = v + 'px'; },
      applyWeight: v => { const t = row.querySelector('.detail-statement p'); if (t) t.style.fontWeight = v; },
      applyColor:  v => { const t = row.querySelector('.detail-statement p'); if (t) t.style.color      = v; },
      onDelete: () => {
        p.stHidden = true;
        saveAll();
        stEl?.remove();
        if (statementAddBtn) statementAddBtn.style.display = isEditing ? '' : 'none';
      },
    });

    // Click into the description text itself to edit its content (separate
    // from the tb-panel, which only covers font size/weight/color).
    const stTextEl = stEl?.querySelector('p');
    if (stTextEl && !stTextEl.dataset.txtEditInit) {
      stTextEl.dataset.txtEditInit = '1';
      stTextEl.addEventListener('click', e => {
        if (!isEditing) return;
        e.preventDefault(); e.stopPropagation();
        openStatementTextEditor(stTextEl, p);
      });
    }

    if (statementAddBtn) statementAddBtn.style.display = (isEditing && p.stHidden) ? '' : 'none';
  }

  /* Small floating textarea popup for editing p.desc, mirroring
     openCustomTextEditor's pattern (live-updates the paragraph as you
     type, saves on confirm/outside-click cancels). */
  function openStatementTextEditor(el, p) {
    document.getElementById('info-text-editor')?.remove();
    const curText = p.desc || '';

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">專案說明</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-btns">
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 160)}px;`;
    document.body.appendChild(ped);
    const ta = ped.querySelector('.ite-ta');
    ta.focus(); ta.select();
    ta.addEventListener('input', e => { el.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save) el.textContent = curText;
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      p.desc = ta.value;
      document.removeEventListener('click', onDoc);
      ped.remove();
      saveAll();
    });
  }

  /* =============================================
     Album + "Full Project" link — free-form blocks
     ============================================= */
  function renderOutroGuides(vLines, hLines, W) {
    const canvas = document.getElementById('outro-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  function startOutroDrag(e, item, otherItem, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = item.x, by0 = item.y;
    let moved = false;

    el.classList.add('block-dragging');
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      const { vLines, hLines, snapX, snapY } = computeGalleryAlignSnap(item.id, nx, ny, item.w, item.h, W, [otherItem]);
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      nx = Math.max(0, Math.min(1 - item.w, nx));
      ny = Math.max(0, ny);

      item.x = nx; item.y = ny;
      applyOutroPositions(p);
      renderOutroGuides(vLines, hLines, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved) {
        saveAll();
        el.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { once: true });
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startOutroResize(e, item, otherItem, dir, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...item };

    document.body.style.userSelect = 'none';

    const tooltip = document.createElement('div');
    tooltip.className = 'resize-tooltip';
    el.appendChild(tooltip);

    function updateTooltip() {
      tooltip.textContent = `${Math.round(item.w * W)} × ${Math.round(item.h * W)}`;
    }
    updateTooltip();

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e')) w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s')) h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      item.x = x; item.y = y; item.w = w; item.h = h;
      applyOutroPositions(p);
      updateTooltip();

      const { vLines, hLines } = computeGalleryAlignSnap(item.id, x, y, w, h, W, [otherItem]);
      renderOutroGuides(vLines, hLines, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      tooltip.remove();
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function openLinkTextEditor(el, p) {
    document.getElementById('info-text-editor')?.remove();
    const curText = p.linkText || 'Full Project';
    const curUrl  = p.linkUrl  || '';

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">連結文字</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-row">
        <span class="ite-lbl">網址</span>
        <input type="text" class="ite-url" placeholder="https://..." value="${curUrl}">
      </div>
      <div class="ite-btns">
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 190)}px;`;
    document.body.appendChild(ped);
    const ta  = ped.querySelector('.ite-ta');
    const url = ped.querySelector('.ite-url');
    ta.focus(); ta.select();
    const textEl = el.querySelector('.fpl-text');
    ta.addEventListener('input', e => { if (textEl) textEl.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save && textEl) textEl.textContent = curText;
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      p.linkText = ta.value;
      p.linkUrl  = url.value.trim();
      // Patch the <a> element directly — no full re-render needed
      if (p.linkUrl) {
        el.setAttribute('href', p.linkUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
        el.onclick = null;
      } else {
        el.setAttribute('href', '#');
        el.removeAttribute('target');
        el.removeAttribute('rel');
        el.onclick = () => false;
      }
      document.removeEventListener('click', onDoc);
      ped.remove();
      saveAll();
    });
  }

  function injectOutroBlockControls(p) {
    const canvas = document.getElementById('outro-canvas');
    if (!canvas) return;

    if (!p.albumPos) p.albumPos = { x: 0,    y: 0,    w: 0.55, h: 0.42 };
    if (!p.linkPos)  p.linkPos  = { x: 0.62, y: 0.16, w: 0.3,  h: 0.1  };
    p.albumPos.id = 'album';
    p.linkPos.id  = 'link';

    function wire(el, item, otherItem, extraExclude) {
      if (!el || el.dataset.outroInit) return;
      el.dataset.outroInit = '1';

      ['n','ne','e','se','s','sw','w','nw'].forEach(dir => {
        const rh = document.createElement('div');
        rh.className = `rh rh-${dir}`;
        el.appendChild(rh);
        rh.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          startOutroResize(e, item, otherItem, dir, canvas, el, p);
        });
      });

      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        if (e.target.classList.contains('rh')) return;
        if (extraExclude && e.target.closest(extraExclude)) return;
        e.preventDefault();
        startOutroDrag(e, item, otherItem, canvas, el, p);
      });

      el.addEventListener('click', e => {
        if (isEditing) { e.preventDefault(); e.stopPropagation(); }
      });
    }

    const albumEl = canvas.querySelector('.project-album');
    const linkEl  = canvas.querySelector('.full-project-link');

    wire(albumEl, p.albumPos, p.linkPos, '.album-arrow, .album-dots, .album-panel');
    wire(linkEl,  p.linkPos, p.albumPos, '.fpl-text');

    // Upload / delete-current-photo panel for the album — patches the DOM
    // in place so the page never re-renders (and scroll position is kept)
    if (albumEl && !albumEl.querySelector('.album-panel')) {
      const panel = document.createElement('div');
      panel.className = 'album-panel';
      panel.innerHTML = `
        <button class="album-upload" title="新增照片">+ 上傳</button>
        <button class="album-del-cur" title="刪除目前照片">✕</button>`;
      albumEl.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());

      panel.querySelector('.album-upload').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.addEventListener('change', async () => {
          const files = Array.from(input.files || []);
          if (!files.length) return;
          const btn = panel.querySelector('.album-upload');
          btn.textContent = '上傳中…';
          try {
            if (!p.albumPhotos) p.albumPhotos = [];
            const track = albumEl.querySelector('.album-track');
            for (const file of files) {
              const url = await uploadToCloudinary(file);
              p.albumPhotos.push({ id: Date.now() + Math.random(), url });
              const slide = document.createElement('div');
              slide.className = 'album-slide';
              slide.style.opacity = '0';
              slide.innerHTML = `<img src="${cloudinaryUrl(url, 1400)}" draggable="false">`;
              track.appendChild(slide);
            }
            track.querySelector('.album-empty')?.remove();
            saveAll();
            rebuildAlbumNav(albumEl, p);
          } catch (err) {
            alert('上傳失敗：' + err.message);
          } finally {
            btn.textContent = '+ 上傳';
          }
        });
        input.click();
      });

      panel.querySelector('.album-del-cur').addEventListener('click', () => {
        const slides = albumEl.querySelectorAll('.album-slide');
        const visible = Array.from(slides).find(s => s.style.opacity !== '0') || slides[0];
        const i = visible ? Array.from(slides).indexOf(visible) : -1;
        if (i < 0 || !p.albumPhotos?.[i]) return;
        p.albumPhotos.splice(i, 1);
        visible.remove();
        const track = albumEl.querySelector('.album-track');
        if (!p.albumPhotos.length && !track.querySelector('.album-empty')) {
          const hint = document.createElement('div');
          hint.className = 'album-empty';
          hint.textContent = '尚未上傳照片';
          track.appendChild(hint);
        }
        saveAll();
        rebuildAlbumNav(albumEl, p);
      });
    }

    // Inline edit for the link text/URL
    const textEl = linkEl?.querySelector('.fpl-text');
    if (textEl && !textEl.dataset.linkInit) {
      textEl.dataset.linkInit = '1';
      textEl.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        openLinkTextEditor(linkEl, p);
      });
    }

    // Remove panel for the link block (some projects don't need it) + font size
    if (linkEl && !linkEl.querySelector('.fpl-panel')) {
      const fplPanel = document.createElement('div');
      fplPanel.className = 'fpl-panel';
      fplPanel.innerHTML = `
        <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${p.linkFontSize ?? 13}">
        <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${p.linkWeight ?? 600}">
        <input type="color" class="tb-color" title="顏色" value="${p.linkColor ?? '#1A1A18'}">
        <button class="fpl-del" title="移除按鈕">✕</button>`;
      linkEl.appendChild(fplPanel);
      fplPanel.addEventListener('mousedown', e => e.stopPropagation());
      // linkEl is an <a> — clicks must preventDefault to block navigation,
      // except on the color swatch, whose native picker only opens if the
      // click's default action survives.
      fplPanel.addEventListener('click', e => {
        e.stopPropagation();
        if (!e.target.classList.contains('tb-color')) e.preventDefault();
      });
      fplPanel.querySelector('.fpl-del').addEventListener('click', () => {
        p.linkHidden = true;
        saveAll();
        linkEl.remove();
        if (linkAddBtn) linkAddBtn.style.display = isEditing ? '' : 'none';
      });
      fplPanel.querySelector('.tb-fs').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 13, 6, 96);
        e.target.value = v;
        p.linkFontSize = v;
        const t = linkEl.querySelector('.fpl-text');
        if (t) t.style.fontSize = v + 'px';
        saveAll();
      });
      fplPanel.querySelector('.tb-weight').addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 600, 100, 900);
        e.target.value = v;
        p.linkWeight = v;
        const t = linkEl.querySelector('.fpl-text');
        if (t) t.style.fontWeight = v;
        saveAll();
      });
      fplPanel.querySelector('.tb-color').addEventListener('input', e => {
        p.linkColor = e.target.value;
        const t = linkEl.querySelector('.fpl-text');
        if (t) t.style.color = e.target.value;
        saveAll();
      });
    }

    if (linkAddBtn) linkAddBtn.style.display = (isEditing && p.linkHidden) ? '' : 'none';
  }

  /* =============================================
     Credit block — free-form draggable/resizable, same mechanics as the
     outro album/link (startOutroDrag/startOutroResize) but a single block
     with no partner to align against.
     ============================================= */
  function renderCreditGuides(vLines, hLines, W) {
    const canvas = document.getElementById('credit-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  function startCreditDrag(e, item, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = item.x, by0 = item.y;
    let moved = false;

    document.body.style.userSelect = 'none';
    el.classList.add('block-dragging');

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      const { vLines, hLines, snapX, snapY } = computeGalleryAlignSnap(item.id, nx, ny, item.w, item.h, W, []);
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      nx = Math.max(0, Math.min(1 - item.w, nx));
      ny = Math.max(0, ny);

      item.x = nx; item.y = ny;
      applyCreditPosition(p);
      renderCreditGuides(vLines, hLines, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved) {
        saveAll();
        el.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { once: true });
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startCreditResize(e, item, dir, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...item };

    document.body.style.userSelect = 'none';

    const tooltip = document.createElement('div');
    tooltip.className = 'resize-tooltip';
    el.appendChild(tooltip);

    function updateTooltip() {
      tooltip.textContent = `${Math.round(item.w * W)} × ${Math.round(item.h * W)}`;
    }
    updateTooltip();

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e')) w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s')) h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      item.x = x; item.y = y; item.w = w; item.h = h;
      applyCreditPosition(p);
      updateTooltip();

      const { vLines, hLines } = computeGalleryAlignSnap(item.id, x, y, w, h, W, []);
      renderCreditGuides(vLines, hLines, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      tooltip.remove();
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function injectCreditBlockControls(p) {
    const canvas = document.getElementById('credit-canvas');
    if (!canvas) return;
    if (!p.crPos) p.crPos = { x: 0, y: 0, w: 1, h: 0.3 };
    p.crPos.id = 'credit';

    const el = canvas.querySelector('.detail-credit');
    if (!el || el.dataset.crInit) return;
    el.dataset.crInit = '1';

    const panel = document.createElement('div');
    panel.className = 'tb-panel';
    panel.innerHTML = `
      <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${p.crFontSize ?? 11}">
      <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${p.crWeight ?? 400}">
      <input type="color" class="tb-color" title="顏色" value="${p.crColor ?? '#1A1A18'}">`;
    el.appendChild(panel);
    panel.addEventListener('mousedown', e => e.stopPropagation());
    panel.addEventListener('click', e => e.stopPropagation());
    panel.querySelector('.tb-fs').addEventListener('change', e => {
      const v = clamp(parseInt(e.target.value) || 11, 6, 96);
      e.target.value = v;
      p.crFontSize = v;
      el.style.fontSize = v + 'px';
      saveAll();
    });
    panel.querySelector('.tb-weight').addEventListener('change', e => {
      const v = clamp(parseInt(e.target.value) || 400, 100, 900);
      e.target.value = v;
      p.crWeight = v;
      el.querySelectorAll('.meta-label, .meta-value').forEach(s => s.style.fontWeight = v);
      saveAll();
    });
    panel.querySelector('.tb-color').addEventListener('input', e => {
      p.crColor = e.target.value;
      el.querySelectorAll('.meta-label, .meta-value').forEach(s => s.style.color = e.target.value);
      saveAll();
    });

    ['n','ne','e','se','s','sw','w','nw'].forEach(dir => {
      const rh = document.createElement('div');
      rh.className = `rh rh-${dir}`;
      el.appendChild(rh);
      rh.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        startCreditResize(e, p.crPos, dir, canvas, el, p);
      });
    });

    el.addEventListener('mousedown', e => {
      if (!isEditing) return;
      if (e.target.classList.contains('rh')) return;
      if (e.target.closest('.tb-panel')) return;
      if (e.target.closest('.meta-label, .meta-value, .credit-add-row')) return;
      e.preventDefault();
      startCreditDrag(e, p.crPos, canvas, el, p);
    });

    el.addEventListener('click', e => {
      if (isEditing) { e.preventDefault(); e.stopPropagation(); }
    });
  }

  /* =============================================
     User-added text blocks + thin lines — free-form,
     array-based like the gallery (multiple blocks, add/delete)
     ============================================= */
  function renderCustomGuides(vLines, hLines, W) {
    const canvas = document.getElementById('custom-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  /* Custom blocks live on an overlay canvas scoped to the right (image)
     column, while the gallery images are plain document-flow elements — so
     their x/y fractions aren't comparable directly. To let custom blocks
     snap-align against the gallery images anyway, we measure their live
     on-screen rects and convert them into custom-canvas fraction space,
     then feed those as extra "items" into the existing align-snap math. */
  function getCrossSectionAlignTargets(canvas) {
    const rect = canvas.getBoundingClientRect();
    const W = canvas.offsetWidth;
    if (!W) return [];
    const targets = [];
    document.querySelectorAll(
      '.gallery-item'
    ).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      targets.push({
        id: `xsec-${i}`,
        x: (r.left - rect.left) / W,
        y: (r.top  - rect.top)  / W,
        w: r.width  / W,
        h: r.height / W,
      });
    });
    return targets;
  }

  function startCustomDrag(e, b, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = b.x, by0 = b.y;
    let moved = false;
    const alignItems = [...p.customBlocks, ...getCrossSectionAlignTargets(canvas)];

    el.classList.add('block-dragging');
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      const { vLines, hLines, snapX, snapY } = computeGalleryAlignSnap(b.id, nx, ny, b.w, b.h, W, alignItems);
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      nx = Math.max(0, Math.min(1 - b.w, nx));
      ny = Math.max(0, ny);

      b.x = nx; b.y = ny;
      applyCustomPositions(p);
      renderCustomGuides(vLines, hLines, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (moved) {
        saveAll();
        el.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { once: true });
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function startCustomResize(e, b, dir, canvas, el, p) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...b };
    const alignItems = [...p.customBlocks, ...getCrossSectionAlignTargets(canvas)];

    document.body.style.userSelect = 'none';

    const tooltip = document.createElement('div');
    tooltip.className = 'resize-tooltip';
    el.appendChild(tooltip);

    function updateTooltip() {
      tooltip.textContent = `${Math.round(b.w * W)} × ${Math.round(b.h * W)}`;
    }
    updateTooltip();

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e')) w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s')) h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      b.x = x; b.y = y; b.w = w; b.h = h;
      applyCustomPositions(p);
      updateTooltip();

      const { vLines, hLines } = computeGalleryAlignSnap(b.id, x, y, w, h, W, alignItems);
      renderCustomGuides(vLines, hLines, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      tooltip.remove();
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      saveAll();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function openCustomTextEditor(el, b, p) {
    document.getElementById('info-text-editor')?.remove();
    const curText = b.text || '';

    const ped = document.createElement('div');
    ped.id = 'info-text-editor';
    ped.innerHTML = `
      <div class="ite-head">
        <span class="ite-tag">文字方塊</span>
        <button class="ite-x">✕</button>
      </div>
      <textarea class="ite-ta">${curText}</textarea>
      <div class="ite-btns">
        <button class="ite-ok">儲存</button>
      </div>`;

    const rect = el.getBoundingClientRect();
    ped.style.cssText = `position:fixed;left:${Math.min(rect.left, window.innerWidth - 290)}px;top:${Math.min(rect.bottom + 8, window.innerHeight - 160)}px;`;
    document.body.appendChild(ped);
    const ta = ped.querySelector('.ite-ta');
    ta.focus(); ta.select();
    const textEl = el.querySelector('p');
    ta.addEventListener('input', e => { if (textEl) textEl.textContent = e.target.value; });

    const onDoc = ev => { if (!ped.contains(ev.target) && ev.target !== el) close(false); };
    setTimeout(() => document.addEventListener('click', onDoc), 60);

    function close(save) {
      document.removeEventListener('click', onDoc);
      ped.remove();
      if (!save && textEl) textEl.textContent = curText;
    }

    ped.querySelector('.ite-x').addEventListener('click', () => close(false));
    ped.querySelector('.ite-ok').addEventListener('click', () => {
      b.text = ta.value;
      document.removeEventListener('click', onDoc);
      ped.remove();
      saveAll();
    });
  }

  function injectCustomBlockControls(p) {
    const canvas = document.getElementById('custom-canvas');
    if (!canvas) return;
    if (!p.customBlocks) p.customBlocks = [];

    canvas.querySelectorAll('[data-custom-id]').forEach(el => {
      if (el.dataset.customInit) return;
      el.dataset.customInit = '1';

      const id = el.dataset.customId;
      const b  = p.customBlocks.find(x => String(x.id) === id);
      if (!b) return;

      const panel = document.createElement('div');
      panel.className = 'custom-panel';
      panel.innerHTML = `
        ${b.type === 'text' ? `
        <input type="number" class="tb-fs" min="6" max="96" title="字級 (px)" value="${b.fontSize ?? 13}">
        <input type="number" class="tb-weight" min="100" max="900" step="100" title="粗細" value="${b.weight ?? 400}">
        <input type="color" class="tb-color" title="顏色" value="${b.color ?? '#6B6B65'}">` : ''}
        <button class="custom-del" title="刪除">✕</button>`;
      el.appendChild(panel);
      panel.addEventListener('mousedown', e => e.stopPropagation());
      panel.addEventListener('click', e => e.stopPropagation());
      panel.querySelector('.custom-del').addEventListener('click', () => {
        p.customBlocks.splice(p.customBlocks.indexOf(b), 1);
        saveAll();
        renderDetail(p.slug);
      });
      panel.querySelector('.tb-fs')?.addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 13, 6, 96);
        e.target.value = v;
        b.fontSize = v;
        const t = el.querySelector('p');
        if (t) t.style.fontSize = v + 'px';
        saveAll();
      });
      panel.querySelector('.tb-weight')?.addEventListener('change', e => {
        const v = clamp(parseInt(e.target.value) || 400, 100, 900);
        e.target.value = v;
        b.weight = v;
        const t = el.querySelector('p');
        if (t) t.style.fontWeight = v;
        saveAll();
      });
      panel.querySelector('.tb-color')?.addEventListener('input', e => {
        b.color = e.target.value;
        const t = el.querySelector('p');
        if (t) t.style.color = e.target.value;
        saveAll();
      });

      // Lines only need length (e/w) handles; text blocks get the full 8 points
      const dirs = b.type === 'line' ? ['e', 'w'] : ['n','ne','e','se','s','sw','w','nw'];
      dirs.forEach(dir => {
        const rh = document.createElement('div');
        rh.className = `rh rh-${dir}`;
        el.appendChild(rh);
        rh.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          startCustomResize(e, b, dir, canvas, el, p);
        });
      });

      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        if (e.target.classList.contains('rh')) return;
        if (e.target.closest('.custom-panel')) return;
        if (b.type === 'text' && e.target.closest('p')) return;
        e.preventDefault();
        startCustomDrag(e, b, canvas, el, p);
      });

      el.addEventListener('click', e => {
        if (isEditing) { e.preventDefault(); e.stopPropagation(); }
      });

      if (b.type === 'text') {
        const textEl = el.querySelector('p');
        textEl?.addEventListener('click', e => {
          if (!isEditing) return;
          e.preventDefault(); e.stopPropagation();
          openCustomTextEditor(el, b, p);
        });
      }
    });
  }

  /* ——— Snap helpers ——— */
  function snap(val, unit) {
    return Math.round(val / unit) * unit;
  }

  /* ——— Alignment guide logic ——— */
  function computeAlignSnap(activeId, ax, ay, aw, ah, W) {
    const T = GUIDE_PX / W;   // threshold in fractions
    const vLines = [];
    const hLines = [];
    let snapX = null, snapY = null;

    // Canvas edges
    if (Math.abs(ax) < T)            { vLines.push(0);   snapX = snapX ?? 0; }
    if (Math.abs(ax + aw - 1) < T)   { vLines.push(1);   snapX = snapX ?? 1 - aw; }
    if (Math.abs(ax - 0.5 + aw/2) < T) { vLines.push(0.5); snapX = snapX ?? 0.5 - aw/2; }

    blocks.forEach(b => {
      if (b.id === activeId) return;
      const edges = [
        { x: b.x },       { x: b.x + b.w },   { x: b.x + b.w/2 },
        { y: b.y },       { y: b.y + b.h },    { y: b.y + b.h/2 },
      ];

      // Vertical (x) snaps
      [b.x, b.x + b.w, b.x + b.w/2].forEach(ex => {
        if (Math.abs(ax - ex) < T)        { vLines.push(ex); snapX = snapX ?? ex; }
        if (Math.abs(ax + aw - ex) < T)   { vLines.push(ex); snapX = snapX ?? ex - aw; }
        if (Math.abs(ax + aw/2 - ex) < T) { vLines.push(ex); snapX = snapX ?? ex - aw/2; }
      });

      // Horizontal (y) snaps
      [b.y, b.y + b.h, b.y + b.h/2].forEach(ey => {
        if (Math.abs(ay - ey) < T)        { hLines.push(ey); snapY = snapY ?? ey; }
        if (Math.abs(ay + ah - ey) < T)   { hLines.push(ey); snapY = snapY ?? ey - ah; }
        if (Math.abs(ay + ah/2 - ey) < T) { hLines.push(ey); snapY = snapY ?? ey - ah/2; }
      });
    });

    return {
      vLines: [...new Set(vLines)],
      hLines: [...new Set(hLines)],
      snapX, snapY,
    };
  }

  function renderGuides(vLines, hLines, W) {
    const canvas = document.getElementById('projects-canvas');
    if (!canvas) return;
    clearGuides();
    vLines.forEach(x => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-v';
      ln.style.left = (x * W) + 'px';
      canvas.appendChild(ln);
    });
    hLines.forEach(y => {
      const ln = document.createElement('div');
      ln.className = 'align-guide align-guide-h';
      ln.style.top = (y * W) + 'px';
      canvas.appendChild(ln);
    });
  }

  function clearGuides() {
    document.querySelectorAll('.align-guide').forEach(g => g.remove());
  }

  /* ——— Drag to move ——— */
  function startDrag(e, b, canvas, el) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const bx0 = b.x, by0 = b.y;
    let moved = false;

    el.classList.add('block-dragging');
    document.body.style.userSelect = 'none';

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;
      if (Math.abs(dx) + Math.abs(dy) > 0.002) moved = true;

      // Grid snap
      let nx = snap(bx0 + dx, SNAP_X);
      let ny = snap(by0 + dy, SNAP_Y);

      // Alignment snap (overrides grid when close)
      const { vLines, hLines, snapX, snapY } = computeAlignSnap(b.id, nx, ny, b.w, b.h, W);
      if (snapX !== null) nx = snapX;
      if (snapY !== null) ny = snapY;

      // Clamp
      nx = Math.max(0, Math.min(1 - b.w, nx));
      ny = Math.max(0, ny);

      b.x = nx; b.y = ny;
      el.style.left = (nx * W) + 'px';
      el.style.top  = (ny * W) + 'px';

      renderGuides(vLines, hLines, W);
      updateCanvasHeight(canvas, W);
    }

    function onUp() {
      el.classList.remove('block-dragging');
      document.body.style.userSelect = '';
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      // Prevent the click event that fires right after mouseup from navigating
      if (moved) {
        el.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, { once: true });
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  /* ——— Ratio display helper ——— */
  function getRatioDisplay(w, h) {
    const r = w / h;
    const COMMON = [[1,1],[4,3],[3,2],[16,10],[16,9],[2,1],[21,9],[3,1],[9,16],[3,4],[2,3],[1,2]];
    for (const [rw, rh] of COMMON) {
      if (Math.abs(r - rw / rh) < 0.04) return `${rw}:${rh}`;
    }
    return r.toFixed(2) + ':1';
  }

  /* ——— Resize ——— */
  function startResize(e, b, dir, canvas, el) {
    const W = canvas.offsetWidth;
    const x0 = e.clientX, y0 = e.clientY;
    const { x: ox, y: oy, w: ow, h: oh } = { ...b };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = el.querySelector(`.rh-${dir}`).style.cursor || 'default';

    /* Tooltip showing dimensions + ratio */
    const tooltip = document.createElement('div');
    tooltip.className = 'resize-tooltip';
    el.appendChild(tooltip);

    function updateTooltip() {
      const pw = Math.round(b.w * W);
      const ph = Math.round(b.h * W);
      tooltip.textContent = `${pw} × ${ph}  ${getRatioDisplay(b.w, b.h)}`;
    }
    updateTooltip();

    function onMove(ev) {
      const dx = (ev.clientX - x0) / W;
      const dy = (ev.clientY - y0) / W;

      let { x, y, w, h } = { x: ox, y: oy, w: ow, h: oh };

      if (dir.includes('e'))  w = Math.max(MIN_W, snap(ow + dx, SNAP_X));
      if (dir.includes('s'))  h = Math.max(MIN_H, snap(oh + dy, SNAP_Y));
      if (dir.includes('w')) {
        const nx = snap(ox + dx, SNAP_X);
        w = Math.max(MIN_W, ow - (nx - ox));
        x = ox + ow - w;
      }
      if (dir.includes('n')) {
        const ny = snap(oy + dy, SNAP_Y);
        h = Math.max(MIN_H, oh - (ny - oy));
        y = oy + oh - h;
      }

      x = Math.max(0, Math.min(1 - w, x));
      y = Math.max(0, y);

      b.x = x; b.y = y; b.w = w; b.h = h;
      el.style.left   = (x * W) + 'px';
      el.style.top    = (y * W) + 'px';
      el.style.width  = (w * W) + 'px';
      el.style.height = (h * W) + 'px';

      updateTooltip();
      const { vLines, hLines } = computeAlignSnap(b.id, x, y, w, h, W);
      renderGuides(vLines, hLines, W);
      updateCanvasHeight(canvas, W);
    }

    function onUp() {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      tooltip.remove();
      clearGuides();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function updateCanvasHeight(canvas, W) {
    const maxBottom = Math.max(300 / W, blocks.reduce((m, b) => Math.max(m, b.y + b.h), 0));
    canvas.style.height = (maxBottom * W + 100) + 'px';
  }

  /* ——— Inject controls on each block ——— */
  function injectFreeformControls() {
    const canvas = document.getElementById('projects-canvas');
    if (!canvas) return;

    document.querySelectorAll('[data-block-id]').forEach(el => {
      if (el.dataset.freeformInit) return;
      el.dataset.freeformInit = '1';

      const blockId = parseInt(el.dataset.blockId);
      const b = blocks.find(x => x.id === blockId);
      if (!b) return;

      /* ——— Editor overlay panel ——— */
      const panel = document.createElement('div');
      const hasCover = !!(b.projectSlug && projects.find(x => x.slug === b.projectSlug)?.cover);
      panel.className = 'fb-panel';
      panel.innerHTML = `
        <div class="fb-top">
          <select class="ec-proj-select">${buildProjectOptions(b.projectSlug)}</select>
          <button class="ec-edit-btn" title="編輯專案" ${b.projectSlug ? '' : 'style="display:none"'}>✎</button>
          <button class="fb-crop"     title="裁切圖片" ${hasCover ? '' : 'style="display:none"'}>⊞</button>
          <button class="fb-del"      title="刪除">✕</button>
        </div>
        <div class="ec-assign-hint" style="${b.projectSlug ? 'display:none' : ''}">+ 指定專案</div>`;

      const projSel  = panel.querySelector('.ec-proj-select');
      const editBtn2 = panel.querySelector('.ec-edit-btn');
      const cropBtn  = panel.querySelector('.fb-crop');
      const delBtn   = panel.querySelector('.fb-del');
      const hint     = panel.querySelector('.ec-assign-hint');

      hint.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); projSel.focus(); });

      projSel.addEventListener('change', e => {
        e.stopPropagation();
        b.projectSlug = e.target.value || null;
        updateBlockVisuals(el, projects.find(x => x.slug === b.projectSlug) || null);
        editBtn2.style.display = b.projectSlug ? '' : 'none';
        hint.style.display     = b.projectSlug ? 'none' : '';
      });

      editBtn2.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        if (b.projectSlug) openProjectEditor(b.projectSlug, el);
      });

      delBtn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        blocks.splice(blocks.findIndex(x => x.id === blockId), 1);
        renderProjects();
      });

      cropBtn?.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const proj = projects.find(x => x.slug === b.projectSlug);
        if (!proj?.cover) return;
        openCropModal({
          imageUrl: cloudinaryUrl(proj.cover, 1400),
          ratio: b.w / b.h,
          initial: { imgX: b.imgX, imgY: b.imgY, imgZoom: b.imgZoom },
          onApply: (imgX, imgY, imgZoom) => {
            b.imgX = imgX; b.imgY = imgY; b.imgZoom = imgZoom;
            saveAll();
            renderProjects();
          },
        });
      });

      // Click anywhere on the panel (including the blank area over the cover image)
      // must never let the parent <a> navigate — stopPropagation alone doesn't
      // prevent the link's default action, so preventDefault is required too.
      panel.addEventListener('click',  e => { e.preventDefault(); e.stopPropagation(); });
      panel.addEventListener('change', e => e.stopPropagation());
      // Only stop mousedown propagation for interactive controls, not for blank panel area
      panel.addEventListener('mousedown', e => {
        if (e.target.closest('.ec-proj-select, .ec-edit-btn, .fb-del, .fb-crop')) {
          e.stopPropagation();
        }
      });
      el.appendChild(panel);

      /* ——— Resize handles (8 points) ——— */
      const CURSORS = {
        n:'n-resize', ne:'ne-resize', e:'e-resize', se:'se-resize',
        s:'s-resize', sw:'sw-resize', w:'w-resize', nw:'nw-resize',
      };
      Object.keys(CURSORS).forEach(dir => {
        const handle = document.createElement('div');
        handle.className = `rh rh-${dir}`;
        handle.style.cursor = CURSORS[dir];
        handle.addEventListener('mousedown', e => {
          e.preventDefault(); e.stopPropagation();
          startResize(e, b, dir, canvas, el);
        });
        el.appendChild(handle);
      });

      /* ——— Drag to move ——— */
      el.addEventListener('mousedown', e => {
        if (!isEditing) return;
        // Skip if clicking a resize handle or an interactive control
        if (e.target.classList.contains('rh')) return;
        if (e.target.closest('.ec-proj-select, .ec-edit-btn, .fb-del, .fb-crop')) return;
        e.preventDefault();
        startDrag(e, b, canvas, el);
      });

      /* Block navigation while editing */
      el.addEventListener('click', e => {
        if (isEditing) { e.preventDefault(); e.stopPropagation(); }
      });
    });
  }

  /* =============================================
     Project Editor Modal — helper styles
     ============================================= */

})();
