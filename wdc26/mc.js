/*
 * Shared helpers for the Monte Carlo demos in this folder.
 *
 * Classic script (not an ES module) so it also loads over file://.
 * Defines window.MC. Nothing here touches `document` or `location` at load
 * time, so the pure math can be exercised from Node:
 *   global.window = {}; require('./mc.js'); window.MC...
 */
(function (global) {
  'use strict';

  // Issues completed per day by the whole team (30 days, weekends included).
  // Many zeros, some ones, a few bigger days.
  const DEFAULT_POOL = [
    0, 1, 0, 0, 2, 0, 1, 0, 0, 3,
    0, 1, 1, 0, 0, 5, 0, 0, 2, 1,
    0, 0, 1, 0, 2, 0, 1, 0, 0, 2
  ];
  const DEFAULTS = { items: 10, days: 20, confidence: 85 };
  const LIMITS = { items: [1, 1000], days: [1, 1000], confidence: [1, 99] };

  const rand = (n) => Math.floor(Math.random() * n);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const cls = (v) => 'v' + Math.min(v, 5);
  const mean = (pool) => pool.reduce((a, b) => a + b, 0) / pool.length;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // ---------------- params / URL ----------------
  function parseIntParam(raw, key) {
    const [lo, hi] = LIMITS[key];
    if (raw == null || !/^[+-]?\d+$/.test(raw.trim())) return DEFAULTS[key];
    return clamp(parseInt(raw, 10), lo, hi);
  }

  function parsePool(raw) {
    if (raw == null) return DEFAULT_POOL.slice();
    const parts = raw.split(',').map((s) => s.trim());
    if (parts.length < 1 || parts.length > 200) return DEFAULT_POOL.slice();
    if (!parts.every((s) => /^\d+$/.test(s))) return DEFAULT_POOL.slice();
    const pool = parts.map(Number);
    return pool.some((v) => v > 0) ? pool : DEFAULT_POOL.slice();
  }

  function readParams() {
    const q = new URLSearchParams(location.search);
    return {
      pool: parsePool(q.get('pool')),
      items: parseIntParam(q.get('items'), 'items'),
      days: parseIntParam(q.get('days'), 'days'),
      confidence: parseIntParam(q.get('confidence'), 'confidence')
    };
  }

  function serializeParams(p) {
    let qs = `items=${p.items}&days=${p.days}&confidence=${p.confidence}`;
    if (p.pool && p.pool.join(',') !== DEFAULT_POOL.join(',')) qs += `&pool=${p.pool.join(',')}`;
    return qs;
  }

  function writeParams(p) {
    try {
      history.replaceState(null, '', '?' + serializeParams(p));
    } catch (_) {
      // Some browsers refuse replaceState on file:// URLs; the URL is a nicety.
    }
  }

  function pageUrl(page, p) {
    return `sim-${page}.html?${serializeParams(p)}`;
  }

  // ---------------- pool + frequency table ----------------
  function mountPool(poolEl, freqEl, pool) {
    pool.forEach((v, i) => {
      const t = document.createElement('div');
      t.className = 'tile ' + cls(v);
      t.textContent = v;
      t.dataset.i = i;
      poolEl.appendChild(t);
    });
    const tiles = [...poolEl.children];

    const counts = {};
    pool.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
    const values = Object.keys(counts).map(Number).sort((a, b) => a - b);
    values.forEach((v) => {
      const pct = Math.round((counts[v] / pool.length) * 100);
      const row = document.createElement('div');
      row.className = 'freq-row';
      row.dataset.v = v;
      row.innerHTML =
        `<span><b>${v}</b> issue${v === 1 ? '' : 's'}</span>` +
        `<span class="bar"><i style="width:${pct}%"></i></span>` +
        `<span class="n">${counts[v]} of ${pool.length} days · ${pct}%</span>`;
      freqEl.appendChild(row);
    });

    return {
      tiles,
      highlight(value) {
        freqEl.querySelectorAll('.freq-row').forEach((r) => r.classList.toggle('hit', +r.dataset.v === value));
      },
      clear() {
        tiles.forEach((t) => t.classList.remove('picked', 'flicker'));
        freqEl.querySelectorAll('.freq-row').forEach((r) => r.classList.remove('hit'));
      }
    };
  }

  // ---------------- animation ----------------
  const PACE_MANUAL = { mode: 'full', flickerSteps: 8, flickerDelay: 70, flyMs: 700, gapMs: 0, daysPerTick: 1 };

  const AUTO_BASE_DAY_MS = 575;   // pace per day of the original autoplay (3*45 + 320 + 120)
  const AUTO_BUDGET_MS = 10000;   // target max duration of one auto-played run

  // Pace for auto-play, scaled so a run of `expectedDays` takes at most ~10 s.
  function pacing(expectedDays) {
    const perDay = Math.min(AUTO_BASE_DAY_MS, AUTO_BUDGET_MS / Math.max(1, expectedDays));
    if (perDay >= 400) { // full animation, proportionally faster
      const f = perDay / AUTO_BASE_DAY_MS;
      return { mode: 'full', flickerSteps: 3, flickerDelay: 45 * f, flyMs: 320 * f, gapMs: 120 * f, daysPerTick: 1 };
    }
    if (perDay >= 120) { // skip flicker, keep the flying chip
      return { mode: 'quick', flickerSteps: 0, flickerDelay: 0, flyMs: perDay * 0.7, gapMs: perDay * 0.3, daysPerTick: 1 };
    }
    // no chip: mark the picked tile, drop the value straight into its slot
    const daysPerTick = Math.max(1, Math.ceil(16 / perDay)); // never faster than ~1 frame per tick
    return { mode: 'instant', flickerSteps: 0, flickerDelay: 0, flyMs: 0, gapMs: perDay * daysPerTick, daysPerTick };
  }

  function slotDensity(expectedDays) {
    if (expectedDays <= 40) return 'normal';
    if (expectedDays <= 150) return 'compact';
    return 'dense';
  }

  function relRect(stage, el) {
    const r = el.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
  }

  // Highlights random pool tiles `pace.flickerSteps` times, then marks the
  // chosen one as picked. With zero steps it only marks the pick.
  async function flicker(tiles, finalIdx, pace) {
    let prev = -1;
    for (let k = 0; k < pace.flickerSteps; k++) {
      let j;
      do { j = rand(tiles.length); } while (j === prev && tiles.length > 1);
      if (prev >= 0) tiles[prev].classList.remove('flicker');
      tiles[j].classList.add('flicker');
      prev = j;
      await sleep(pace.flickerDelay);
    }
    if (prev >= 0) tiles[prev].classList.remove('flicker');
    tiles.forEach((t) => t.classList.remove('picked'));
    tiles[finalIdx].classList.add('picked');
  }

  // Flies a copy of `fromEl` onto `toEl` (both positioned relative to `stage`),
  // scaling to the target's size. Resolves immediately when pace.flyMs is 0.
  async function fly(stage, fromEl, toEl, value, pace) {
    if (!pace.flyMs) return;
    const a = relRect(stage, fromEl);
    const b = relRect(stage, toEl);
    const chip = document.createElement('div');
    chip.className = 'tile chip ' + cls(value);
    chip.textContent = value;
    chip.style.left = a.left + 'px';
    chip.style.top = a.top + 'px';
    chip.style.width = a.width + 'px';
    chip.style.height = a.height + 'px';
    stage.appendChild(chip);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = chip.animate(
      [
        { transform: 'translate(0,0) scale(1.15)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.3)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(${b.width / a.width})` }
      ],
      { duration: pace.flyMs, easing: 'ease-in-out', fill: 'forwards' }
    );
    await anim.finished;
    chip.remove();
  }

  // ---------------- stats ----------------
  // Nearest rank: "p% of runs finished within this many days".
  function percentileAsc(sortedAsc, p) {
    const n = sortedAsc.length;
    return sortedAsc[Math.max(0, Math.ceil((p * n) / 100) - 1)];
  }

  // Largest N such that at least c% of runs had value >= N. Mirrors the CLI's
  // simulate.ItemsAtConfidence. Not percentileAsc(sorted, 100 - c): that is
  // off by one at the boundary.
  function atLeastAtConfidence(sortedAsc, c) {
    const n = sortedAsc.length;
    const k = Math.max(1, Math.ceil((c * n) / 100));
    return sortedAsc[n - k];
  }

  function fractionAtLeast(values, x) {
    let k = 0;
    for (const v of values) if (v >= x) k++;
    return values.length ? k / values.length : 0;
  }

  // ---------------- histogram ----------------
  // Bins integer results into at most ~maxBins bins. When bins are wider than
  // 1, `anchor` is forced onto a bin edge so a highlighted region never splits
  // a bin.
  function binResults(values, maxBins, anchor) {
    let lo = Infinity, hi = -Infinity; // don't spread a 100k array into Math.min
    for (const v of values) { if (v < lo) lo = v; if (v > hi) hi = v; }
    const width = Math.max(1, Math.ceil((hi - lo + 1) / maxBins));
    let start = lo;
    if (anchor != null && width > 1) start = anchor - Math.ceil((anchor - lo) / width) * width; // start <= lo
    const n = Math.floor((hi - start) / width) + 1;
    const bins = Array.from({ length: n }, (_, i) => ({ lo: start + i * width, hi: start + i * width + width - 1, count: 0 }));
    for (const v of values) bins[Math.floor((v - start) / width)].count++;
    return { bins, width };
  }

  function renderHistogram(opts) {
    const { histEl, axisEl, results, anchor, classFor, titleFor, marker } = opts;
    const maxBins = opts.maxBins || 60;
    if (results.length === 0) {
      histEl.innerHTML =
        '<span class="hist-empty">Each finished run adds a result here. Click "Run 1,000 simulations" to see the shape emerge.</span>';
      axisEl.innerHTML = '';
      return;
    }
    const { bins, width } = binResults(results, maxBins, anchor);
    let maxCount = 0;
    for (const b of bins) if (b.count > maxCount) maxCount = b.count;
    const labelEvery = Math.ceil(bins.length / 22);

    let bars = '', labels = '';
    bins.forEach((b, i) => {
      const range = width === 1 ? `${b.lo}` : `${b.lo}–${b.hi}`;
      const title = titleFor ? titleFor(b) : `${range}: ${b.count.toLocaleString()} run${b.count === 1 ? '' : 's'}`;
      const c = classFor ? classFor(b) : '';
      bars += `<div class="col ${c}" title="${title}"><div class="b" style="height:${(b.count / maxCount) * 100}%"></div></div>`;
      labels += `<span>${i % labelEvery === 0 ? b.lo : ''}</span>`;
    });

    let markerHtml = '';
    if (marker) {
      let idx = bins.findIndex((b) => b.lo >= marker.value);
      if (idx < 0) idx = bins.length;
      const left = (idx / bins.length) * 100;
      // Keep the label on-screen if the line sits at the far edge.
      let side = marker.side;
      if (side === 'right' && left > 80) side = 'flip';
      markerHtml = `<div class="marker" style="left:${left}%"><span class="marker-label ${side}">${marker.label}</span></div>`;
    }
    histEl.innerHTML = bars + markerHtml;
    axisEl.innerHTML = labels;
  }

  // ---------------- triangle nav ----------------
  const SVGNS = 'http://www.w3.org/2000/svg';

  function renderTriangle(el, o) {
    const p = { items: o.items, days: o.days, confidence: o.confidence, pool: o.pool };
    const known = o.answer != null;
    if (known) {
      p[o.solve] = o.solve === 'confidence' ? clamp(Math.floor(o.answer), 1, 99) : o.answer;
    }

    const node = (key, cx, cy, value, target, tip) => {
      const solved = o.solve === key;
      let state = solved ? 'solved' : 'given';
      let text = value;
      if (solved) {
        text = known
          ? (key === 'confidence' ? `${o.answer}%` : `≈${o.answer}`)
          : '?';
        if (!known) state += ' pulse';
      }
      const circle = `<circle cx="${cx}" cy="${cy}" r="26"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" class="val">${text}</text>`;
      if (solved) return `<g class="node ${state}"><title>${tip}</title>${circle}</g>`;
      return `<a href="${pageUrl(target, p)}" class="node ${state}"><title>${tip}</title>${circle}</a>`;
    };

    const label = (x, y, name, sub, cls2 = '') =>
      `<text x="${x}" y="${y}" text-anchor="middle" class="lbl ${cls2}">${name}</text>` +
      (sub ? `<text x="${x}" y="${y + 13}" text-anchor="middle" class="lbl-sub">${sub}</text>` : '');

    const svg =
      `<svg xmlns="${SVGNS}" viewBox="0 -28 240 262" role="img" aria-label="The forecasting triangle: items, days and engineers, with confidence in the middle">` +
      `<polygon class="edges" points="120,34 40,168 200,168"/>` +
      // Engineers (fixed, never a link)
      `<g class="node fixed"><title>Engineers: the full team, baked into the sample pool. Not adjustable in these demos.</title>` +
      `<circle cx="120" cy="34" r="26"/><text x="120" y="39" text-anchor="middle" class="val">team</text></g>` +
      node('days', 40, 168, o.days, 'days', `Solve for days: how many days to finish ${p.items} items at ${p.confidence}% confidence?`) +
      node('items', 200, 168, o.items, 'items', `Solve for items: how many items can we finish in ${p.days} days at ${p.confidence}% confidence?`) +
      node('confidence', 120, 123, `${o.confidence}%`, 'probability', `Solve for confidence: what are the odds of finishing ${p.items} items in ${p.days} days?`) +
      label(120, -12, 'ENGINEERS', 'cost') +
      label(40, 208, 'DAYS', 'time') +
      label(200, 208, 'ITEMS', 'scope') +
      label(120, 163, 'CONFIDENCE', '', 'inner') +
      `</svg>`;

    el.innerHTML = svg +
      '<p class="triangle-note">Engineers: full team, baked into the pool. Confidence: the odds that the whole triangle holds.</p>';
  }

  function isTypingTarget(e) {
    const t = e.target;
    if (!t || !t.tagName) return false;
    const tag = t.tagName.toLowerCase();
    return tag === 'input' || tag === 'select' || tag === 'textarea' || !!t.isContentEditable;
  }

  global.MC = {
    DEFAULT_POOL, DEFAULTS, LIMITS,
    rand, sleep, cls, mean,
    readParams, writeParams, pageUrl,
    mountPool,
    PACE_MANUAL, pacing, flicker, fly, slotDensity,
    percentileAsc, atLeastAtConfidence, fractionAtLeast,
    binResults, renderHistogram,
    renderTriangle, isTypingTarget
  };
})(typeof window !== 'undefined' ? window : globalThis);
