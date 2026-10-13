/*
 * 대수별 할인 계산기 (5개 디자인 공통)
 *
 * 사용: <div id="mp-calc"></div> 를 두고 MP.mountCalc(document.getElementById('mp-calc'))
 * 숫자는 모두 model.js, 문구는 이 파일의 UI 객체와 content.js 에서 온다.
 *
 * 디자인별로 바꾸는 방법: 아래 CSS 변수만 덮어쓴다 (필요하면 .mpc__* 클래스를 직접 덮어써도 된다).
 *   --mpc-fg  --mpc-muted  --mpc-bg  --mpc-card  --mpc-line  --mpc-accent  --mpc-accent-fg
 *   --mpc-hero-bg  --mpc-hero-fg  --mpc-radius  --mpc-font  --mpc-num-font
 * 클래스: mpc, mpc__group, mpc__label, mpc__chips, mpc__chip(--on), mpc__stepper, mpc__result,
 *   mpc__hero, mpc__hero-label, mpc__hero-value, mpc__hero-sub, mpc__rows, mpc__row(--key),
 *   mpc__save2, mpc__store, mpc__seg, mpc__seg-btn(--on), mpc__note
 */
(function () {
  'use strict';
  var MP = (typeof module === 'object' && module.exports) ? require('./content.js') : window.MP;
  var F = MP.fmt;

  var UI = {
    chipsLabel: '구매 대수',
    chips: [6, 8, 10, 12, 20, 30],
    inputLabel: '직접 입력',
    unit: '대',
    minus: '1대 줄이기',
    plus: '1대 늘리기',
    heroLabel: '200대 이후 예정가보다 적게 드는 금액',
    heroSub: '{pct} 할인 (200대 이후 예정가 기준)',
    rowLegacy: '기존 일시불 방식',
    rowAfter: '200대 이후 예정가',
    rowPartners: '파트너스 가격',
    rowFormula: '{n}대 × {unit}',
    save2: '기존 일시불 방식과 비교하면 {amount} 적게 듭니다 ({pct} 절감)',
    storeTitle: '매장으로 계산하면',
    turnsLabel: '하루 회전',
    turnsUnit: '회전',
    sRows: {
      capexNew: '총 창업 비용 (파트너스)',
      capexLegacy: '총 창업 비용 (일시불 방식)',
      capexAfter: '총 창업 비용 (200대 이후 예정가)',
      revenue: '월 매출',
      profit: '월 순수익 (파트너스)',
      bepNew: '투자금 회수 기간 (파트너스)',
      bepLegacy: '투자금 회수 기간 (일시불 방식)',
      roi: '연 수익률 (파트너스)'
    },
    noteStore: '6, 8, 10, 12대는 매장 규모에 맞춰 총 창업 비용과 회수 기간도 계산합니다. 월 순수익은 세전이며, 계산 기준은 아래 안내를 참고하세요.',
    noteEquip: '{n}대는 기기 대금만 계산합니다. 6, 8, 10, 12대를 고르면 총 창업 비용과 회수 기간도 보여 드립니다.',
    note200: '200대 이후 가격은 예정 단계이며 변경될 수 있습니다.',
    max: 200
  };
  MP.UI = UI;

  // 화면에 찍는 문자열을 한 곳에서 만든다 (테스트 대상)
  MP.calcView = function (n, turns) {
    n = Math.max(1, Math.min(UI.max, Math.floor(Number(n) || 0)));
    var d = MP.discount(n);
    var v = {
      n: n,
      heroValue: F.eok(d.saveVsAfter),
      heroSub: UI.heroSub.replace('{pct}', F.pct(d.pctVsAfter)),
      rows: [
        { key: 'legacy', label: UI.rowLegacy, value: F.eok(d.legacy), formula: UI.rowFormula.replace('{n}', n).replace('{unit}', MP.V.unitLegacy) },
        { key: 'after', label: UI.rowAfter, value: F.eok(d.after), formula: UI.rowFormula.replace('{n}', n).replace('{unit}', MP.V.unitAfter) },
        { key: 'partners', label: UI.rowPartners, value: F.eok(d.partners), formula: UI.rowFormula.replace('{n}', n).replace('{unit}', MP.V.unitNew) }
      ],
      save2: UI.save2.replace('{amount}', F.eok(d.saveVsLegacy)).replace('{pct}', F.pct(d.pctVsLegacy)),
      store: null
    };
    var st = turns ? MP.store(n, turns) : null;
    if (st) {
      var S = UI.sRows;
      v.store = {
        turns: turns,
        rows: [
          { key: 'capexNew', label: S.capexNew, value: F.eok(st.capexNew), strong: true },
          { key: 'capexLegacy', label: S.capexLegacy, value: F.eok(st.capexLegacy) },
          { key: 'capexAfter', label: S.capexAfter, value: F.eok(st.capexAfter) },
          { key: 'revenue', label: S.revenue, value: F.man(st.revenue) },
          { key: 'profit', label: S.profit, value: F.man(st.profitNew), strong: true },
          { key: 'bepNew', label: S.bepNew, value: F.months(st.bepNew), strong: true },
          { key: 'bepLegacy', label: S.bepLegacy, value: F.months(st.bepLegacy) },
          { key: 'roi', label: S.roi, value: F.pct(st.roiNew) }
        ]
      };
    }
    v.note = (st ? UI.noteStore : UI.noteEquip.replace('{n}', n)) + ' ' + UI.note200;
    return v;
  };

  var CSS = [
    '.mpc{--_fg:var(--mpc-fg,#12211C);--_muted:var(--mpc-muted,#4A5D54);--_card:var(--mpc-card,#fff);--_line:var(--mpc-line,#D8DED9);',
    '--_acc:var(--mpc-accent,#0F7A5C);--_accfg:var(--mpc-accent-fg,#fff);--_herobg:var(--mpc-hero-bg,#0F7A5C);--_herofg:var(--mpc-hero-fg,#fff);',
    '--_r:var(--mpc-radius,16px);font-family:var(--mpc-font,inherit);color:var(--_fg);font-size:17px;line-height:1.55;display:grid;gap:20px;min-width:0}',
    '.mpc *{box-sizing:border-box;min-width:0}',
    '.mpc__group{display:grid;gap:10px}',
    '.mpc__label{font-weight:700;font-size:1rem;color:var(--_muted)}',
    '.mpc__chips{display:flex;flex-wrap:wrap;gap:10px}',
    '.mpc__chip{appearance:none;font:inherit;font-weight:700;min-height:52px;min-width:72px;padding:0 18px;border-radius:999px;border:2px solid var(--_line);background:var(--_card);color:var(--_fg);cursor:pointer}',
    '.mpc__chip:hover{border-color:var(--_acc)}',
    '.mpc__chip--on{background:var(--_acc);border-color:var(--_acc);color:var(--_accfg)}',
    '.mpc__chip:focus-visible,.mpc__seg-btn:focus-visible,.mpc__stepper button:focus-visible,.mpc__stepper input:focus-visible{outline:3px solid var(--_acc);outline-offset:2px}',
    '.mpc__stepper{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.mpc__stepper span.t{font-weight:700;color:var(--_muted)}',
    '.mpc__stepper button{appearance:none;font:inherit;font-size:1.4rem;font-weight:700;width:52px;height:52px;border-radius:12px;border:2px solid var(--_line);background:var(--_card);color:var(--_fg);cursor:pointer}',
    '.mpc__stepper input{font:inherit;font-weight:700;font-size:1.2rem;width:92px;height:52px;text-align:center;border-radius:12px;border:2px solid var(--_line);background:var(--_card);color:var(--_fg)}',
    '.mpc__result{display:grid;gap:16px}',
    '.mpc__hero{background:var(--_herobg);color:var(--_herofg);border-radius:var(--_r);padding:22px 24px;display:grid;gap:4px}',
    '.mpc__hero-label{font-weight:700;font-size:1rem;opacity:.9}',
    '.mpc__hero-value{font-family:var(--mpc-num-font,inherit);font-weight:800;font-size:clamp(2rem,7vw,3.4rem);line-height:1.15;letter-spacing:-.02em;overflow-wrap:anywhere}',
    '.mpc__hero-sub{font-size:1rem;opacity:.9}',
    '.mpc__rows{margin:0;display:grid;gap:0;border:1px solid var(--_line);border-radius:var(--_r);background:var(--_card);overflow:hidden}',
    '.mpc__row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;align-items:baseline;padding:14px 18px;border-top:1px solid var(--_line)}',
    '.mpc__row:first-child{border-top:0}',
    '.mpc__row dt{margin:0;font-weight:600}',
    '.mpc__row dd{margin:0;text-align:right;font-weight:800;font-variant-numeric:tabular-nums;font-family:var(--mpc-num-font,inherit)}',
    '.mpc__row small{grid-column:1/-1;color:var(--_muted);font-size:.9rem;font-weight:500}',
    '.mpc__row--key{background:color-mix(in srgb,var(--_acc) 9%,var(--_card))}',
    '.mpc__row--key dd{color:var(--_acc)}',
    '.mpc__save2{font-weight:700}',
    '.mpc__store{display:grid;gap:14px;padding-top:6px;border-top:2px dashed var(--_line)}',
    '.mpc__store-title{font-weight:800;font-size:1.15rem;margin:0}',
    '.mpc__seg{display:inline-flex;border:2px solid var(--_line);border-radius:999px;overflow:hidden;background:var(--_card);width:max-content;max-width:100%}',
    '.mpc__seg-btn{appearance:none;font:inherit;font-weight:700;min-height:48px;padding:0 22px;border:0;background:transparent;color:var(--_fg);cursor:pointer}',
    '.mpc__seg-btn--on{background:var(--_acc);color:var(--_accfg)}',
    '.mpc__note{margin:0;color:var(--_muted);font-size:.92rem}',
    '@media (max-width:480px){.mpc__chip{min-width:64px;padding:0 14px}.mpc__row{padding:12px 14px}.mpc__hero{padding:18px}}'
  ].join('');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  MP.mountCalc = function (root, opts) {
    opts = opts || {};
    if (!document.getElementById('mpc-style')) {
      var st = el('style'); st.id = 'mpc-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    var state = { n: opts.n || 8, turns: opts.turns || 4 };
    root.textContent = '';
    var wrap = el('div', 'mpc');

    var g1 = el('div', 'mpc__group');
    g1.appendChild(el('div', 'mpc__label', UI.chipsLabel));
    var chips = el('div', 'mpc__chips'); chips.setAttribute('role', 'radiogroup'); chips.setAttribute('aria-label', UI.chipsLabel);
    var chipEls = UI.chips.map(function (c) {
      var b = el('button', 'mpc__chip', c + UI.unit); b.type = 'button'; b.setAttribute('role', 'radio');
      b.addEventListener('click', function () { set(c); }); chips.appendChild(b); return b;
    });
    g1.appendChild(chips);
    var stepper = el('div', 'mpc__stepper');
    stepper.appendChild(el('span', 't', UI.inputLabel));
    var minus = el('button', null, '-'); minus.type = 'button'; minus.setAttribute('aria-label', UI.minus);
    var input = el('input'); input.type = 'number'; input.min = 1; input.max = UI.max; input.inputMode = 'numeric'; input.setAttribute('aria-label', UI.chipsLabel);
    var plus = el('button', null, '+'); plus.type = 'button'; plus.setAttribute('aria-label', UI.plus);
    stepper.appendChild(minus); stepper.appendChild(input); stepper.appendChild(plus); stepper.appendChild(el('span', 't', UI.unit));
    g1.appendChild(stepper);
    wrap.appendChild(g1);

    var result = el('div', 'mpc__result'); result.setAttribute('aria-live', 'polite'); wrap.appendChild(result);
    var storeBox = el('div', 'mpc__store'); wrap.appendChild(storeBox);
    var note = el('p', 'mpc__note'); wrap.appendChild(note);
    root.appendChild(wrap);

    function rows(list, cls) {
      var dl = el('dl', cls || 'mpc__rows');
      list.forEach(function (r) {
        var d = el('div', 'mpc__row' + ((r.key === 'partners' || r.strong) ? ' mpc__row--key' : ''));
        d.appendChild(el('dt', null, r.label)); d.appendChild(el('dd', null, r.value));
        if (r.formula) d.appendChild(el('small', null, r.formula));
        dl.appendChild(d);
      });
      return dl;
    }

    function set(n) {
      n = Math.max(1, Math.min(UI.max, Math.floor(Number(n) || 1)));
      state.n = n; if (!MP.STORE[n]) state.turns = state.turns || 4;
      draw();
    }

    function draw() {
      var hasStore = !!MP.STORE[state.n];
      var v = MP.calcView(state.n, hasStore ? state.turns : 0);
      chipEls.forEach(function (b, i) {
        var on = UI.chips[i] === state.n;
        b.classList.toggle('mpc__chip--on', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      if (document.activeElement !== input) input.value = state.n;
      result.textContent = '';
      var hero = el('div', 'mpc__hero');
      hero.appendChild(el('div', 'mpc__hero-label', UI.heroLabel));
      hero.appendChild(el('div', 'mpc__hero-value', v.heroValue));
      hero.appendChild(el('div', 'mpc__hero-sub', v.heroSub));
      result.appendChild(hero);
      result.appendChild(rows(v.rows));
      result.appendChild(el('div', 'mpc__save2', v.save2));
      storeBox.textContent = '';
      if (v.store) {
        storeBox.style.display = '';
        storeBox.appendChild(el('h3', 'mpc__store-title', state.n + UI.unit + ' ' + UI.storeTitle));
        storeBox.appendChild(el('div', 'mpc__label', UI.turnsLabel));
        var seg = el('div', 'mpc__seg'); seg.setAttribute('role', 'radiogroup'); seg.setAttribute('aria-label', UI.turnsLabel);
        MP.TURNS.forEach(function (t) {
          var b = el('button', 'mpc__seg-btn' + (t === state.turns ? ' mpc__seg-btn--on' : ''), t + UI.turnsUnit);
          b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', t === state.turns ? 'true' : 'false');
          b.addEventListener('click', function () { state.turns = t; draw(); });
          seg.appendChild(b);
        });
        storeBox.appendChild(seg);
        storeBox.appendChild(rows(v.store.rows));
      } else storeBox.style.display = 'none';
      note.textContent = v.note;
    }

    minus.addEventListener('click', function () { set(state.n - 1); });
    plus.addEventListener('click', function () { set(state.n + 1); });
    input.addEventListener('input', function () {
      var x = parseInt(input.value, 10);
      if (isFinite(x) && x >= 1) { state.n = Math.min(UI.max, x); draw(); }
    });
    input.addEventListener('blur', function () { input.value = state.n; });
    draw();
    return { set: set, state: state };
  };

  if (typeof module === 'object' && module.exports) module.exports = MP;
})();
