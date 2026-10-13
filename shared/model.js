/*
 * 마이파크 990 파트너스 계산 모듈 (숫자의 유일한 원천), 장비 기준판
 *
 * 2026-10-13 개정: 인테리어와 설비는 비교에서 뺐다. 장비 대금과 본사에 내는 비용만 다룬다.
 *   - 기준 규모: 10대 (SSOT 표준 10타석)
 *   - 기존 일시불: 1대 2,300만원, 창업 1년 후부터 1대당 월 5만원 시스템 라이선스
 *   - 파트너스: 1대 990만원, 월 고정비 0원, 플레이된 게임에 1인 1게임(18홀)당 500원
 *   - 200대 이후 예정가: 1대 1,200만원 안팎 (확정 아님)
 * 출처: 대표님 지시(2026-10-13), 마이파크_창업수익분석_990과금모델(완성본).xlsx 의 게임비, 로열티, 영업일
 *
 * 월 본사 비용(파트너스) = 대수 x 하루 회전 x 4인 x 30일 x 500원  (1대, 1회전이면 월 6만원)
 * 매출, 임대료, 인건비 같은 매장 운영비는 두 방식이 같아 비교에서 제외한다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MP = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── 1. 입력값 ──────────────────────────────────────────────
  var P = {
    unitPartners: 9900000,    // 파트너스(선착순 200대) 1대 가격
    unitLegacy: 23000000,     // 기존 일시불 1대 가격
    unitAfter: 12000000,      // 200대 이후 예정가 (확정 아님)
    limit: 200,
    royalty: 500,             // 1인 1게임(18홀)당 (원)
    gameFee: 7000,            // 1인 18홀 게임비 (원)
    players: 4,               // 1팀 인원
    days: 30,                 // 월 영업일
    licenseLegacy: 50000,     // 기존 방식 시스템 라이선스 (1대, 월, 창업 1년 후부터)
    licenseFreeMonths: 12,
    baseUnits: 10             // 기준 대수 (SSOT 표준 10타석)
  };
  var TURNS = [1, 2, 3, 4, 5];       // 계산기에서 고르는 하루 회전
  var TABLE_TURNS = [3, 4, 5];       // 표에 싣는 회전 (엑셀 기준 구간)
  var DEFAULT_TURNS = 3;
  var MAX_UNITS = 200;

  // ── 2. 계산 ────────────────────────────────────────────────
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

  // 파트너스 월 라운드 비용 (n대, 하루 turns회전)
  function feeMonth(n, turns) { return n * turns * P.players * P.days * P.royalty; }
  // 기존 방식 월 고정비 (창업 1년 후부터)
  function legacyMonth(n) { return n * P.licenseLegacy; }

  // months개월 누적 비용 (장비 대금 + 본사에 내는 비용)
  function cumulative(n, turns, months) {
    return {
      partners: n * P.unitPartners + feeMonth(n, turns) * months,
      legacy: n * P.unitLegacy + legacyMonth(n) * Math.max(0, months - P.licenseFreeMonths)
    };
  }

  // 누적 비용이 같아지는 시점(개월). 대수와 무관하다. 그 전까지는 파트너스가 더 적다.
  function crossover(turns) {
    var gap = P.unitLegacy - P.unitPartners;                  // 1대당 기기값 차이
    var fee = turns * P.players * P.days * P.royalty;         // 1대 월 라운드 비용
    var m0 = gap / fee;                                       // 1년 안에 같아지는 경우
    if (m0 <= P.licenseFreeMonths) return m0;
    var d = fee - P.licenseLegacy;
    if (d <= 0) return Infinity;
    return (gap - P.licenseLegacy * P.licenseFreeMonths) / d;
  }

  function costView(n, turns) {
    if (TURNS.indexOf(turns) < 0) return null;
    var c3 = cumulative(n, turns, 36), c5 = cumulative(n, turns, 60);
    return {
      n: n, turns: turns,
      feePartners: feeMonth(n, turns), feeLegacy: legacyMonth(n),
      diff3: c3.legacy - c3.partners,      // 양수면 파트너스가 적음
      diff5: c5.legacy - c5.partners,
      cross: crossover(turns)
    };
  }

  // ── 3. 표기 ────────────────────────────────────────────────
  var NB = ' ';   // 금액이 줄 중간에서 끊기지 않도록 줄바꿈 금지 공백
  function comma(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function man(won) { return comma(won / 10000) + '만원'; }
  function manX(won) { var v = won / 10000; return (v % 1 === 0 ? comma(v) : String(+v.toFixed(1))) + '만원'; }
  function eok(won) {
    var total = Math.round(won / 10000);
    var e = Math.floor(total / 10000), m = total - e * 10000;
    if (e === 0) return comma(m) + '만원';
    if (m === 0) return e + '억원';
    return e + '억' + NB + comma(m) + '만원';
  }
  function pct(x) { return (x * 100).toFixed(1) + '%'; }
  function pct0(x) { return Math.round(x * 100) + '%'; }
  function won(x) { return comma(x) + '원'; }
  // 개월 수를 "8년", "5년 6개월", "4년 2개월"로. 10년 이상은 "10년 이상"
  function span(months) {
    if (!isFinite(months) || months >= 120) return '10년 이상';
    var m = Math.round(months), y = Math.floor(m / 12), r = m - y * 12;
    if (y === 0) return r + '개월';
    return r === 0 ? y + '년' : y + '년' + NB + r + '개월';
  }
  // 누적 차이: 양수 파트너스가 적음, 음수 기존이 적음
  function diffText(x) {
    var r = Math.round(x / 10000);
    if (r === 0) return '같음';
    return (r > 0 ? '파트너스 ' : '기존 ') + eok(Math.abs(r) * 10000) + ' 적음';
  }

  // ── 4. 문서에 쓰는 표기값 ──────────────────────────────────
  var N = P.baseUnits;
  var d10 = discount(N);
  var V = {
    base: N + '대',
    unitLegacy: man(P.unitLegacy), unitNew: man(P.unitPartners), unitAfter: man(P.unitAfter),
    unitSave: man(P.unitLegacy - P.unitPartners), unitSaveAfter: man(P.unitAfter - P.unitPartners),
    limit: P.limit + '대',
    royalty: won(P.royalty), gameFee: won(P.gameFee), teamFee: won(P.gameFee * P.players),
    ownerPerPerson: won(P.gameFee - P.royalty),
    teamOwner: won((P.gameFee - P.royalty) * P.players),
    royaltyTeam: won(P.royalty * P.players),
    licenseLegacy: manX(P.licenseLegacy), licenseLegacy10: man(legacyMonth(N)),
    feeOne: manX(P.players * P.days * P.royalty),              // 1대 1회전 월 라운드 비용
    playersMonth: P.licenseLegacy / P.royalty + '명',          // 월 5만원에 해당하는 1대 월 이용 인원
    equipLegacy10: eok(d10.legacy), equipNew10: eok(d10.partners), equipAfter10: eok(d10.after),
    save10: eok(d10.saveVsLegacy), saveAfter10: eok(d10.saveVsAfter),
    pctSaveLegacy: pct0(d10.pctVsLegacy), pctSaveAfter: pct0(d10.pctVsAfter),
    off8: man(discount(8).saveVsAfter), off10: man(discount(10).saveVsAfter), off20: man(discount(20).saveVsAfter),
    offLegacy8: eok(discount(8).saveVsLegacy), offLegacy10: eok(discount(10).saveVsLegacy), offLegacy20: eok(discount(20).saveVsLegacy)
  };
  TABLE_TURNS.forEach(function (t) {
    var c = costView(N, t);
    V['fee10_' + t] = man(c.feePartners);
    V['cross' + t] = span(c.cross);
  });

  var TABLES = {
    // 10대 장비 기준 비교
    compare: [
      ['기기 1대 가격', V.unitLegacy, V.unitNew, V.unitSave + ' 적음'],
      [N + '대 장비 대금', V.equipLegacy10, V.equipNew10, V.save10 + ' 적음'],
      ['월 시스템 라이선스', '창업 1년 후 1대당 ' + V.licenseLegacy, '0원 (전액 면제)', N + '대 월 ' + V.licenseLegacy10 + ' 적음'],
      ['게임당 로열티', '없음', '1인 ' + V.royalty, '플레이된 게임만']
    ],
    // 누적 비용 (10대, 하루 회전별)
    cost: TABLE_TURNS.map(function (t) {
      var c = costView(N, t);
      return { turns: t, feePartners: c.feePartners, feeLegacy: c.feeLegacy, diff3: c.diff3, diff5: c.diff5, cross: c.cross,
        feePartnersText: man(c.feePartners), feeLegacyText: man(c.feeLegacy),
        diff3Text: diffText(c.diff3), diff5Text: diffText(c.diff5), crossText: span(c.cross) };
    })
  };

  return {
    P: P, TURNS: TURNS, TABLE_TURNS: TABLE_TURNS, DEFAULT_TURNS: DEFAULT_TURNS, MAX_UNITS: MAX_UNITS,
    discount: discount, feeMonth: feeMonth, legacyMonth: legacyMonth, cumulative: cumulative,
    crossover: crossover, costView: costView,
    fmt: { comma: comma, man: man, manX: manX, eok: eok, pct: pct, pct0: pct0, won: won, span: span, diffText: diffText },
    V: V, TABLES: TABLES
  };
});
