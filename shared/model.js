/*
 * 마이파크 990 파트너스 계산 모듈 (숫자의 유일한 원천)
 *
 * 출처: 마이파크_창업수익분석_990과금모델(완성본).xlsx 의 수식을 그대로 옮겼다.
 *   - 시트1 [창업수익분석기]  : 8대 90평 기준 CAPEX / OPEX / 매출 / 회수기간
 *   - 시트2 [타석규모별_종합비교표] : 6, 8, 10, 12대 (13대는 개별 입점 조건이 섞여 있어 제외)
 * 변경점 (2026-10-13 지시 반영):
 *   - 기존 일시불 비교 기준을 대당 2,300만원으로 통일 (엑셀은 2,000만/1,500만 두 기준)
 *   - 200대 이후 예정가 1,200만원 추가 (확정 아님, 예정)
 *   - 엑셀 시트2의 기존 모델 월 순수익 하드코딩 오류 2건을 수식으로 바로잡음
 *     (6대 9,415,000 -> 9,055,000 / 12대 19,575,000 -> 19,335,000)
 *
 * 페이지, 이미지, 계산기는 이 파일만 읽는다. 숫자를 다른 곳에 직접 적지 않는다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MP = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── 1. 입력값 ──────────────────────────────────────────────
  var P = {
    unitPartners: 9900000,    // 파트너스(선착순 200대) 대당 가격
    unitLegacy: 23000000,     // 기존 일시불 방식 대당 가격 (비교 기준)
    unitAfter: 12000000,      // 200대 이후 예정가 (확정 아님)
    limit: 200,               // 파트너스 한정 대수
    royalty: 500,             // 1인 1게임(18홀)당 로열티(원)
    gameFee: 7000,            // 1인 18홀 게임비(원)
    players: 4,               // 1팀 인원
    days: 30,                 // 월 영업일
    fnbPerTeam: 3000,         // 4인 1팀당 식음료 매출(원)
    cogsRate: 0.5,            // 용품·식음료 매입원가율
    interiorPerPyeong: 1000000,
    acPerUnit: 3000000,       // 냉난방 30평당 1대
    acPyeong: 30,
    fixedItems: 17000000,     // 간판 500 + 가구 500 + 진열장 300 + 초도용품 400 (만원)
    rentPerPyeong: 30000,
    mgmtPerPyeong: 15000,
    licenseLegacy: 50000,     // 기존 방식 시스템 라이선스(1대당 월, 창업 1년 후부터). 파트너스는 전액 면제
    licenseFreeMonths: 12,    // 라이선스가 시작되기 전 무료 기간(개월)
    telecom: 300000,          // 통신, POS
    supplies: 300000          // 소모품, 유지보수
  };
  // 용품 판매 월 매출 (회전별, 엑셀 시트1 49행)
  var GOODS = { 3: 750000, 4: 1200000, 5: 1500000 };
  // 매장 규모 (엑셀 시트2): 대수 -> 면적(평), 월 인건비(원)
  var STORE = {
    6: { area: 70, labor: 3500000 },
    8: { area: 90, labor: 3500000 },
    10: { area: 120, labor: 3500000 },
    12: { area: 140, labor: 6000000 }   // 12대는 점주 외 직원 포함
  };
  var TURNS = [3, 4, 5];
  var STORE_SIZES = [6, 8, 10, 12];
  var BASE_UNITS = 8;

  // ── 2. 계산 ────────────────────────────────────────────────
  function baseCost(area) {
    // 인테리어 + 냉난방 + 간판/가구/진열장/초도용품 (기기 대금 제외 공통 비용)
    return area * P.interiorPerPyeong +
      Math.ceil(area / P.acPyeong) * P.acPerUnit + P.fixedItems;
  }

  function discount(n) {
    return {
      n: n,
      partners: n * P.unitPartners,
      after: n * P.unitAfter,
      legacy: n * P.unitLegacy,
      saveVsAfter: n * (P.unitAfter - P.unitPartners),
      saveVsLegacy: n * (P.unitLegacy - P.unitPartners),
      pctVsAfter: (P.unitAfter - P.unitPartners) / P.unitAfter,
      pctVsLegacy: (P.unitLegacy - P.unitPartners) / P.unitLegacy
    };
  }

  // 투자금 회수 개월 수. 1년 후부터 월 라이선스가 빠지는 방식(기존)과 그렇지 않은 방식을 모두 계산한다.
  function payback(capex, profit, licMonthly) {
    var free = P.licenseFreeMonths;
    if (!licMonthly || capex <= profit * free) return capex / profit;
    var p2 = profit - licMonthly;
    return p2 > 0 ? free + (capex - profit * free) / p2 : Infinity;
  }
  // legacyUnit: 기존 일시불 단가를 바꿔 볼 때만 넣는다 (검증용, 기본은 2,300만원)
  function store(n, turns, legacyUnit) {
    var s = STORE[n];
    if (!s || !GOODS[turns]) return null;
    var base = baseCost(s.area);
    var game = n * P.players * P.gameFee * P.days * turns;
    var goods = GOODS[turns];
    var fnb = n * P.fnbPerTeam * P.days * turns;
    var revenue = game + goods + fnb;
    var fixed = s.area * P.rentPerPyeong + s.area * P.mgmtPerPyeong +
      s.labor + P.telecom + P.supplies;
    var cogs = (goods + fnb) * P.cogsRate;
    var royalty = n * turns * P.players * P.days * P.royalty;
    var profitNew = revenue - fixed - cogs - royalty;
    var profitLegacy = revenue - fixed - cogs;       // 일시불 방식은 월 사용료 없음으로 계산
    var capexNew = n * P.unitPartners + base;
    var capexLegacy = n * (legacyUnit || P.unitLegacy) + base;
    var capexAfter = n * P.unitAfter + base;
    return {
      n: n, turns: turns, area: s.area, labor: s.labor, base: base,
      game: game, goods: goods, fnb: fnb, revenue: revenue,
      fixed: fixed, cogs: cogs, royalty: royalty,
      profitNew: profitNew, profitLegacy: profitLegacy,
      capexNew: capexNew, capexLegacy: capexLegacy, capexAfter: capexAfter,
      licenseLegacyMonthly: n * P.licenseLegacy,
      bepNew: capexNew / profitNew,
      bepLegacy: payback(capexLegacy, profitLegacy, n * P.licenseLegacy),   // 창업 1년 후 라이선스 반영
      bepLegacyNoLicense: capexLegacy / profitLegacy,                       // 엑셀 원본 방식(검증용)
      roiNew: profitNew * 12 / capexNew, roiLegacy: profitLegacy * 12 / capexLegacy,
      saveCapex: capexLegacy - capexNew
    };
  }

  function bepSeries(n) {
    return TURNS.map(function (t) { return store(n || BASE_UNITS, t); });
  }

  // ── 3. 표기 ────────────────────────────────────────────────
  function comma(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  // 만원 미만은 반올림 (예: 12,025,000원 -> 1,203만원)
  function man(won) { return comma(won / 10000) + '만원'; }
  function eok(won) {
    var total = Math.round(won / 10000);          // 만원 단위 정수
    var e = Math.floor(total / 10000), m = total - e * 10000;
    if (e === 0) return comma(m) + '만원';
    if (m === 0) return e + '억원';
    return e + '억 ' + comma(m) + '만원';   // 금액이 줄 중간에서 끊기지 않도록 줄바꿈 금지 공백
  }
  // 1만원 미만 소수가 필요한 값(예: 15,000원 -> 1.5만원)
  function manX(won) { var v = won / 10000; return (v % 1 === 0 ? comma(v) : String(+v.toFixed(1))) + '만원'; }
  function months(x) { return x.toFixed(1) + '개월'; }
  function pct(x) { return (x * 100).toFixed(1) + '%'; }
  function pct0(x) { return Math.round(x * 100) + '%'; }
  function won(x) { return comma(x) + '원'; }

  function gap(s) { return months(+s.bepLegacy.toFixed(1) - +s.bepNew.toFixed(1)); }

  // ── 4. 문서에 쓰는 표기값 (한 번 만들어 모든 표면이 공유) ──
  var d8 = discount(BASE_UNITS);
  var s3 = store(8, 3), s4 = store(8, 4), s5 = store(8, 5);
  var V = {
    unitLegacy: man(P.unitLegacy), unitNew: man(P.unitPartners), unitAfter: man(P.unitAfter),
    unitSave: man(P.unitLegacy - P.unitPartners), unitSaveAfter: man(P.unitAfter - P.unitPartners),
    limit: P.limit + '대',
    licenseLegacy: manX(P.licenseLegacy), licenseLegacy8: man(8 * P.licenseLegacy),
    royaltyTeam: won(P.royalty * P.players),
    royaltyMonth3: man(s3.royalty),
    royalty: won(P.royalty), gameFee: won(P.gameFee), teamFee: won(P.gameFee * P.players),
    ownerPerPerson: won(P.gameFee - P.royalty),
    royaltyShare: (P.royalty / P.gameFee * 100).toFixed(1) + '%',
    equipLegacy8: eok(d8.legacy), equipNew8: eok(d8.partners), equipAfter8: eok(d8.after),
    baseCost8: eok(s3.base),
    capexLegacy8: eok(s3.capexLegacy), capexNew8: eok(s3.capexNew), capexAfter8: eok(s3.capexAfter),
    save8: eok(s3.saveCapex),
    area8: STORE[8].area + '평',
    pctSaveLegacy: pct0(d8.pctVsLegacy), pctSaveAfter: pct0(d8.pctVsAfter),
    profit3: man(s3.profitNew), profit4: man(s4.profitNew), profit5: man(s5.profitNew),
    profitLegacy3: man(s3.profitLegacy), profitLegacy4: man(s4.profitLegacy), profitLegacy5: man(s5.profitLegacy),
    bepNew3: months(s3.bepNew), bepNew4: months(s4.bepNew), bepNew5: months(s5.bepNew),
    bepLegacy3: months(s3.bepLegacy), bepLegacy4: months(s4.bepLegacy), bepLegacy5: months(s5.bepLegacy),
    roiNew3: pct(s3.roiNew), roiNew4: pct(s4.roiNew), roiNew5: pct(s5.roiNew),
    roiLegacy3: pct(s3.roiLegacy), roiLegacy4: pct(s4.roiLegacy), roiLegacy5: pct(s5.roiLegacy),
    revenue3: man(s3.revenue), revenue4: man(s4.revenue), revenue5: man(s5.revenue),
    royalty3: man(s3.royalty), royalty4: man(s4.royalty), royalty5: man(s5.royalty),
    fixed8: man(s3.fixed),
    // 화면에 찍힌 두 값의 차이와 어긋나지 않도록 반올림한 값끼리 뺀다
    bepGain3: gap(s3), bepGain4: gap(s4), bepGain5: gap(s5),
    // 계산 기준 문구용
    interior: manX(P.interiorPerPyeong), ac: manX(P.acPerUnit), fixedItems: manX(P.fixedItems),
    goods3: manX(GOODS[3]), goods4: manX(GOODS[4]), goods5: manX(GOODS[5]),
    fnb: won(P.fnbPerTeam), cogs: pct0(P.cogsRate),
    rent: manX(P.rentPerPyeong), mgmt: manX(P.mgmtPerPyeong),
    labor: manX(STORE[8].labor), labor12: manX(STORE[12].labor),
    telecom: manX(P.telecom), supplies: manX(P.supplies),
    area6: STORE[6].area + '평', area10: STORE[10].area + '평', area12: STORE[12].area + '평',
    // 8, 10, 20대 구매 시 200대 이후 예정가 대비 할인
    off8: man(discount(8).saveVsAfter), off10: man(discount(10).saveVsAfter), off20: man(discount(20).saveVsAfter),
    offLegacy8: eok(discount(8).saveVsLegacy), offLegacy10: eok(discount(10).saveVsLegacy), offLegacy20: eok(discount(20).saveVsLegacy)
  };

  // 표에 쓰는 행 (웹, 이미지 공통)
  var TABLES = {
    // 8대 90평, 같은 매장 조건
    compare: [
      ['기기 1대 가격', V.unitLegacy, V.unitNew, V.unitSave + ' 적음'],
      ['기기 8대 대금', V.equipLegacy8, V.equipNew8, eok(d8.saveVsLegacy) + ' 적음'],
      ['인테리어, 설비, 집기', V.baseCost8, V.baseCost8, '같음'],
      ['총 창업 비용', V.capexLegacy8, V.capexNew8, V.save8 + ' 적음'],
      ['월 시스템 라이선스', '창업 1년 후 1대당 ' + V.licenseLegacy, '0원 (전액 면제)', '8대 월 ' + V.licenseLegacy8 + ' 적음'],
      ['게임당 로열티', '없음', '1인 ' + V.royalty, '플레이된 게임만']
    ],
    payback: [3, 4, 5].map(function (t) {
      var s = store(8, t);
      return { turns: t, profitNew: s.profitNew, profitLegacy: s.profitLegacy,
        bepNew: s.bepNew, bepLegacy: s.bepLegacy, roiNew: s.roiNew, roiLegacy: s.roiLegacy,
        revenue: s.revenue, royalty: s.royalty };
    }),
    // 매장 규모별 (6, 8, 10, 12대) 3회전과 4회전 요약
    sizes: STORE_SIZES.map(function (n) {
      var a = store(n, 3), b = store(n, 4);
      return { n: n, area: a.area, capexNew: a.capexNew, capexLegacy: a.capexLegacy, save: a.saveCapex,
        profit3: a.profitNew, profit4: b.profitNew, bep3: a.bepNew, bep4: b.bepNew,
        bepLegacy3: a.bepLegacy, bepLegacy4: b.bepLegacy };
    })
  };

  return {
    P: P, GOODS: GOODS, STORE: STORE, TURNS: TURNS, STORE_SIZES: STORE_SIZES, BASE_UNITS: BASE_UNITS,
    discount: discount, store: store, bepSeries: bepSeries, baseCost: baseCost,
    fmt: { comma: comma, man: man, manX: manX, eok: eok, months: months, pct: pct, pct0: pct0, won: won },
    V: V, TABLES: TABLES
  };
});
