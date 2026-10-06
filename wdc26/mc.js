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

  const rand = (n) => Math.floor(Math.random() * n);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const cls = (v) => 'v' + Math.min(v, 5);
  const mean = (pool) => pool.reduce((a, b) => a + b, 0) / pool.length;

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

  // Flies a copy of `fromEl` onto `toEl` (both positioned relative to `stage`).
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
    const dx = b.left - a.left, dy = b.top - a.top;
    const anim = chip.animate(
      [
        { transform: 'translate(0,0) scale(1.15)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.3)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(1)` }
      ],
      { duration: pace.flyMs, easing: 'ease-in-out', fill: 'forwards' }
    );
    await anim.finished;
    chip.remove();
  }

  // ---------------- stats ----------------
  // Nearest rank: "p% of runs finished within this many days".
  function percentileAsc(sortedAsc, p) {
    return sortedAsc[Math.max(0, Math.ceil((p / 100) * sortedAsc.length) - 1)];
  }

  global.MC = {
    DEFAULT_POOL,
    rand, sleep, cls, mean,
    mountPool, flicker, fly,
    percentileAsc
  };
})(typeof window !== 'undefined' ? window : globalThis);
