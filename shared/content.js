/*
 * 마이파크 990 파트너스 문구 모듈 (장비 기준판)
 *
 * 규칙
 *  - 모든 문장은 여기 한 곳에서만 쓴다. 디자인 5종과 1장 이미지가 같은 문장을 가져간다.
 *  - 숫자는 직접 적지 않고 {토큰}으로 쓴다. 토큰은 model.js 의 MP.V 에서 채운다.
 *  - 토큰 뒤 조사는 풀린 값의 받침에 맞게 직접 확인한다 (원 + 은/이/을/으로, 대 + 는/가/를/로).
 *  - 독자는 창업을 검토하는 50~70대 예비 점주다. 쉬운 말, 짧은 문장.
 *  - 금지: 엠대시, 가운뎃점, 화살표, 이모지, 원문자, 영어 약어, 과장어
 */
(function () {
  'use strict';
  var MP = (typeof module === 'object' && module.exports) ? require('./model.js') : window.MP;

  MP.contact = { phone: '1544-1448', tel: 'tel:1544-1448', site: 'www.mypark-golf.com', url: 'https://www.mypark-golf.com', analyzerUrl: 'https://market-analysis-zeta.vercel.app' };

  MP.copy = {
    brand: '마이파크 스크린 파크골프',

    // 첫 번째 큰 주제: 10대 장비 9,900만원 파트너스 매장 모집
    hero: {
      badge: '선착순 200대 한정 파트너스 창업 모집',
      title: '스크린 파크골프 매장 창업, {base} 기준 {equipNew10}',
      titleAlt: '기존 기기값보다 장비 대금을 {save10} 적게 창업합니다',
      sub: '초기 투자금은 대폭 낮추고 손익분기점을 가장 빠르게 앞당기는 최적의 창업 방식입니다. 선착순 200대 한정으로 기기 1대 {unitNew}, {base} 장비 대금 {equipNew10}에 파트너스 매장을 모집합니다.',
      scope: '장비 대금 기준입니다. 인테리어와 설비 등 장비 외 비용은 별도입니다.',
      ctaPrimary: '내 대수 계산해 보기',
      ctaSecondary: '파트너스 핵심 보기'
    },

    point: {
      tag: '파트너스 창업 핵심',
      line1: '초기 투자금은 대폭 낮추고',
      line2: '손익분기점을 가장 빠르게 앞당기는 최적의 창업 방식',
      desc: '{base} 기준 초기 장비 투자금을 {save10} 줄여 시작하므로 손익분기점 도달 시점이 앞당겨집니다.'
    },

    stats: [
      { label: '{base} 장비 대금', value: '{equipNew10}', note: '기존 기기값은 {equipLegacy10}' },
      { label: '기기 1대 가격', value: '{unitNew}', note: '기존 기기값은 {unitLegacy}' },
      { label: '월 고정 로열티', value: '0원', note: '플레이된 게임에만 1인 {royalty}' }
    ],

    // 파트너스 방식과 기존 방식을 먼저 설명한 뒤 비교로 넘어간다
    intro: {
      title: '파트너스 방식이란 무엇인가요?',
      lead: '마이파크가 선착순 200대에 한해 공급하는 방식입니다. 초기 투자금은 대폭 낮추고, 매달 내던 고정비는 손님이 올 때만 내는 방식으로 바꿨습니다.',
      items: [
        { title: '기기 1대 {unitNew}', body: '기기를 {unitNew}에 구매합니다. {base}이면 {equipNew10}입니다.' },
        { title: '월 기기당 고정비 0원', body: '매달 내는 기기당 고정비는 0원입니다. 시스템 라이선스도 월 0원입니다.' },
        { title: '손님이 올 때만 1인 {royalty}', body: '손님이 와서 게임(18홀)을 플레이할 때만 1인당 {royalty}씩 차감됩니다. 이것을 라운드 비용이라고 부릅니다.' },
        { title: '소프트웨어 업그레이드 무상', body: '코스와 펌웨어를 포함한 소프트웨어 업그레이드를 무상으로 계속 제공합니다.' }
      ],
      legacy: '기존 방식은 기기를 1대 {unitLegacy}에 구매하고, 창업 1년 후부터 기기 1대당 월 {licenseLegacy}의 고정비를 냅니다.'
    },

    compare: {
      title: '{base} 장비 대금을 비교했습니다',
      lead: '같은 {base}를 구매할 때 기기 값과 본사에 내는 비용이 어떻게 다른지 정리했습니다.',
      headers: ['항목', '기존 기기값', '파트너스 방식', '차이'],
      saveLabel: '{base} 장비 대금 차이',
      saveValue: '{save10}',
      foot: '장비 대금 기준입니다. 인테리어와 설비 등 장비 외 비용은 별도입니다.'
    },

    // 두 번째 큰 주제: 기존(2,300만원 + 1년 후 월 5만원) 대 파트너스(990만원 + 라운드 비용)
    vs: {
      title: '기기값과 매달 내는 비용이 이렇게 다릅니다',
      lead: '기존은 매달 고정비, 파트너스는 이용한 만큼만 내므로 초기 투자금을 낮춰 손익분기점을 빠르게 앞당깁니다.',
      mid: '비교',
      legacy: { tag: '기존 기기값', price: '{unitLegacy}', priceNote: '기기 1대', feeTitle: '창업 1년 후부터', fee: '월 {licenseLegacy}', feeNote: '기기 1대당 고정비, {base} 월 {licenseLegacy10}' },
      partners: { tag: '파트너스 방식', price: '{unitNew}', priceNote: '기기 1대', feeTitle: '월 기기당 고정비 0원', fee: '1인 {royalty}', feeNote: '플레이된 게임당 라운드 비용, 4인 1팀 {royaltyTeam}' },
      points: [
        '월 기기당 고정비와 시스템 라이선스가 모두 0원입니다.',
        '라운드 비용은 손님이 와서 플레이된 게임에만 1인당 {royalty}씩 차감됩니다.',
        '기기 1대당 {unitSave}, {base} 기준 {save10}을 먼저 아낀 상태로 시작해 손익분기점을 빠르게 앞당깁니다.'
      ]
    },

    partnership: {
      title: '본사도 매장 이용이 늘어야 수입이 늘어나는 구조입니다',
      lead: '기기 값은 낮추고, 본사 수입은 1인 1게임당 {royalty}의 라운드 과금으로 받습니다. 매장 이용이 늘어야 본사 수입도 늘기 때문에 점주와 본사의 방향이 같습니다.',
      steps: [
        { title: '이용객이 늘어납니다', body: '매장 이용이 늘면 점주 매출이 늘어납니다.' },
        { title: '수입이 함께 늘어납니다', body: '본사 수입도 1인 {royalty}씩 이용량과 함께 늘어납니다.' },
        { title: '본사가 계속 지원합니다', body: '소프트웨어 업그레이드를 무상으로 계속 제공합니다.' }
      ],
      owner: {
        title: '점주에게 돌아가는 것',
        items: [
          '기기 1대 {unitNew}, {base} 장비 대금 {equipNew10}',
          '월 고정 로열티 0원, 시스템 관리 및 클라우드 라이선스 월 0원',
          '손님이 와서 플레이된 게임에만 1인당 {royalty}씩 차감됩니다',
          '게임비 {gameFee} 중 {ownerPerPerson}은 점주 매출입니다'
        ]
      },
      hq: {
        title: '본사가 하는 일',
        items: [
          '매장 이용량과 함께 수입이 움직입니다',
          '코스와 펌웨어를 포함한 소프트웨어 업그레이드를 무상으로 계속 제공합니다',
          '매장 운영을 돕는 프로그램을 운영합니다'
        ]
      },
      support: {
        title: '운영 지원 프로그램',
        items: ['마이파크 대학', '커뮤니티 형성 지원', '용품 보증금 제도 (사입 비용 0원)', '본사와 스폰서십 대회를 통한 매출 증대 지원']
      },
      trust: '스마일스퀘어는 14년간 스크린 시뮬레이터 사업을 운영해 왔고, 내부 개발진이 앱 업데이트를 꾸준히 진행합니다.'
    },

    billing: {
      title: '과금 방식은 이렇게 단순합니다',
      lead: '본사에 내는 월 기기당 고정비는 0원이고, 손님이 와서 플레이된 게임에만 1인당 {royalty}씩 차감됩니다.',
      items: [
        { title: '본사에 내는 월 기기당 고정비 0원', body: '시스템 라이선스 월 0원, 월 고정 로열티 0원입니다. 기존 방식은 창업 1년 후부터 1대당 월 {licenseLegacy}이므로 {base} 기준 월 {licenseLegacy10}이 듭니다.' },
        { title: '실제 플레이된 게임에만 과금', body: '손님이 와서 18홀 게임이 플레이될 때만 1인당 {royalty}씩 차감됩니다. 매장 이용량에 맞춰 투명하게 정산됩니다.' },
        { title: '금액을 바로 계산할 수 있습니다', body: '4인 1팀 한 게임 {teamFee} 중 라운드 비용은 {royaltyTeam}이고, 나머지 {teamOwner}은 모두 매장 매출입니다.' },
        { title: '매출 흐름에 맞춰 합리적으로 운영합니다', body: '매달 고정비 없이 실제 이용 인원에 비례해 과금되므로 매장 상황에 맞춰 효율적으로 운영할 수 있습니다.' }
      ]
    },

    calc: {
      title: '몇 대로 창업하고 싶으신가요?',
      lead: '창업하고 싶은 대수를 고르면 기존 기기값 대비 절감되는 초기 장비 투자금이 바로 계산됩니다.'
    },

    footer: '마이파크 공식 창업지원 제휴법인 (주)커넥트'
  };

  // ── 토큰 치환과 바인딩 ─────────────────────────────────────
  MP.t = function (s) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      if (!(k in MP.V)) throw new Error('알 수 없는 토큰: ' + m);
      return MP.V[k];
    });
  };
  MP.get = function (path) {
    var v = MP.copy;
    path.split('.').forEach(function (k) { v = v == null ? v : v[k]; });
    if (v == null) throw new Error('문구 경로 없음: ' + path);
    return v;
  };
  MP.resolve = function (v) {
    if (typeof v === 'string') return MP.t(v);
    if (Array.isArray(v)) return v.map(MP.resolve);
    if (v && typeof v === 'object') {
      var o = {}; Object.keys(v).forEach(function (k) { o[k] = MP.resolve(v[k]); }); return o;
    }
    return v;
  };
  // 사용: <h1 data-bind="hero.title"></h1>   <b data-v="equipNew10"></b>
  MP.bind = function (root) {
    root = root || document;
    root.querySelectorAll('[data-bind]').forEach(function (el) {
      el.textContent = MP.t(MP.get(el.getAttribute('data-bind')));
    });
    root.querySelectorAll('[data-v]').forEach(function (el) {
      var k = el.getAttribute('data-v');
      if (!(k in MP.V)) throw new Error('알 수 없는 값: ' + k);
      el.textContent = MP.V[k];
    });
  };
  MP.copyR = MP.resolve(MP.copy);

  if (typeof module === 'object' && module.exports) module.exports = MP;
})();
