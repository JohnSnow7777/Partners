/*
 * 마이파크 990 파트너스 문구 모듈
 *
 * 규칙
 *  - 모든 문장은 여기 한 곳에서만 쓴다. 디자인 5종과 1장 이미지가 같은 문장을 가져간다.
 *  - 숫자는 직접 적지 않고 {토큰}으로 쓴다. 토큰은 model.js 의 MP.V 에서 채운다.
 *  - 독자는 창업을 검토하는 50~70대 예비 점주다. 쉬운 말, 짧은 문장.
 *  - 금지: 엠대시, 가운뎃점(·), 화살표, 이모지, 원문자, BEP 같은 영어 약어, 과장어(압도적, 파격, 무조건 등)
 *  - 근거가 없는 약속은 쓰지 않는다. 출처는 shared/README 기준표 참고.
 */
(function () {
  'use strict';
  var MP = (typeof module === 'object' && module.exports) ? require('./model.js') : window.MP;

  MP.contact = { phone: '1544-1448', tel: 'tel:1544-1448', site: 'www.mypark-golf.com', url: 'https://www.mypark-golf.com' };

  MP.copy = {
    brand: '마이파크 스크린 파크골프',

    hero: {
      badge: '선착순 200대 한정 파트너스',
      title: '기기 1대 {unitNew}으로 시작하는 스크린 파크골프 매장',
      titleAlt: '{save8} 적게 시작하고, 투자금은 더 빨리 되찾습니다',
      sub: '8대 기준 총 창업 비용은 {capexNew8}입니다. 같은 조건에서 기기를 일시불로 구매하는 방식은 {capexLegacy8}입니다.',
      ctaPrimary: '내 매장 계산해 보기',
      ctaSecondary: '상담 문의하기'
    },

    stats: [
      { label: '8대 총 창업 비용', value: '{capexNew8}', note: '일시불 방식은 {capexLegacy8}' },
      { label: '기기 1대 가격', value: '{unitNew}', note: '일시불 방식은 {unitLegacy}' },
      { label: '월 고정 로열티', value: '0원', note: '플레이된 게임에만 1인 {royalty}' }
    ],

    compare: {
      title: '같은 8대, 같은 매장 조건으로 비교했습니다',
      lead: '{area8} 매장에 8대를 설치하는 경우입니다. 인테리어, 설비, 집기 비용은 두 방식이 같고 기기 값만 다릅니다.',
      headers: ['항목', '기존 일시불 방식', '파트너스 방식', '차이'],
      saveLabel: '총 창업 비용 차이',
      saveValue: '{save8}',
      foot: '일시불 방식은 창업 1년 후부터 시스템 라이선스를 1대당 월 {licenseLegacy}으로 계산했고 게임당 로열티는 없습니다. 임대보증금, 권리금, 부가세, 세금은 별도입니다.'
    },

    payback: {
      title: '투자금이 적으면 되찾는 시간도 짧아집니다',
      lead: '손익분기점은 투자한 돈을 매장 수익으로 모두 되찾는 시점입니다. 타석 1대가 하루에 손님 한 팀(4명)을 받는 횟수를 회전이라고 부릅니다.',
      points: [
        '회전이 늘수록 두 방식 모두 회수가 빨라지고, 월 순수익도 늘어납니다.',
        '같은 회전에서는 파트너스 방식이 3회전 {bepGain3}, 4회전 {bepGain4}, 5회전 {bepGain5} 더 빨리 회수합니다.',
        '창업 첫해 월 순수익은 게임당 로열티만큼 일시불 방식이 많습니다. 투자금이 {save8} 적어서 투자금 회수와 투자금 대비 연 수익률은 파트너스가 앞섭니다.'
      ],
      headers: ['하루 회전', '월 매출', '월 순수익', '투자금 회수 (파트너스)', '투자금 회수 (일시불)', '연 수익률 (파트너스)'],
      foot: '8대 90평 기준입니다. 월 순수익은 월 매출에서 임대료, 관리비, 인건비, 로열티, 상품 원가를 뺀 세전 금액이며 연 수익률은 창업 첫해 기준입니다. 일시불 방식의 회수 기간에는 창업 1년 후부터 시스템 라이선스(1대당 월 {licenseLegacy})를 반영했습니다.'
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
          '기기 1대 {unitNew}, 초기 투자 부담이 작습니다',
          '월 고정 로열티 0원, 시스템 관리 및 클라우드 라이선스 월 0원',
          '손님이 와서 플레이된 게임에만 1인당 {royalty}씩 차감됩니다',
          '게임비 {gameFee} 중 {royalty}만 본사 몫이고 나머지 {ownerPerPerson}은 점주 몫입니다'
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
        items: ['마이파크 대학', '커뮤니티 형성 지원', '용품 보증금 제도 (사입 부담 없음)', '본사와 스폰서십 대회를 통한 매출 증대 지원']
      },
      trust: '스마일스퀘어는 14년간 스크린 시뮬레이터 사업을 운영해 왔고, 내부 개발진이 앱 업데이트를 꾸준히 진행합니다.'
    },

    billing: {
      title: '과금 방식은 이렇게 단순합니다',
      lead: '본사에 내는 월 고정비는 없고, 손님이 와서 플레이된 게임에만 1인당 {royalty}씩 차감됩니다.',
      items: [
        { title: '본사에 내는 월 고정비 0원', body: '시스템 라이선스 월 0원, 월 고정 로열티 0원입니다. 기존 방식은 창업 1년 후부터 1대당 월 {licenseLegacy}이므로 8대 기준 월 {licenseLegacy8}이 듭니다.' },
        { title: '플레이된 게임에만 과금', body: '손님이 와서 게임이 플레이될 때만 1인당 {royalty}씩 차감됩니다. 손님이 없는 날은 과금이 없습니다.' },
        { title: '금액을 바로 계산할 수 있습니다', body: '4인 1팀 한 게임은 {teamFee} 중 {royaltyTeam}입니다. 게임비의 {royaltyShare}가 본사 몫이고 나머지는 점주 몫입니다.' },
        { title: '손님이 많을수록 유리합니다', body: '로열티보다 매출이 더 크게 늘어서, 하루 회전이 3회전에서 5회전이 되면 투자금 회수가 {bepNew3}에서 {bepNew5}로 짧아집니다.' }
      ]
    },

    limited: {
      title: '선착순 200대 한정, 초기 참여 조건',
      lead: '처음 200대까지는 기기 1대를 {unitNew}에 공급합니다. 200대 이후에는 기기 1대 {unitAfter} 안팎으로 진행할 예정이며, 게임당 로열티도 올라갈 수 있습니다.',
      headers: ['항목', '선착순 200대 (파트너스)', '200대 이후 (예정)'],
      rows: [
        ['기기 1대 가격', '{unitNew}', '{unitAfter} 안팎'],
        ['게임당 로열티', '1인 {royalty}', '인상될 수 있음'],
        ['8대 구매 시 기기 대금', '{equipNew8}', '{equipAfter8} 안팎']
      ],
      examplesTitle: '지금 구매하면 200대 이후 예정가보다 이만큼 적게 듭니다',
      note: '200대 이후의 가격과 로열티는 예정 단계이며 변경될 수 있습니다.'
    },

    calc: {
      title: '몇 대를 하실지 골라 보세요',
      lead: '대수를 고르면 할인 금액과 총 창업 비용이 바로 계산됩니다.'
    },

    basis: {
      title: '계산 기준',
      lead: '아래 기준으로 계산한 값입니다. 후보 상가가 정해지면 그 조건으로 다시 계산해 드립니다.',
      items: [
        '매장: 6대 {area6}, 8대 {area8}, 10대 {area10}, 12대 {area12}',
        '기기: 파트너스 1대 {unitNew}, 일시불 방식 1대 {unitLegacy}, 200대 이후 예정가 1대 {unitAfter}',
        '공사와 설비: 인테리어 평당 {interior}, 냉난방 30평당 1대 {ac}, 간판과 가구와 진열장과 초도 용품 합계 {fixedItems}',
        '게임비: 1인 18홀 {gameFee}, 4인 1팀 {teamFee}',
        '로열티: 1인 1게임당 {royalty}, 월 고정 로열티와 시스템 관리 라이선스는 0원',
        '영업: 월 30일, 하루 회전 3, 4, 5회전으로 계산',
        '용품 판매: 월 {goods3}(3회전), {goods4}(4회전), {goods5}(5회전). 식음료는 4인 1팀당 {fnb}. 두 항목의 매입 원가는 {cogs}',
        '월 비용: 임대료 평당 {rent}, 관리비 평당 {mgmt}, 점주 인건비 월 {labor}(12대는 직원 포함 {labor12}), 통신과 POS 월 {telecom}, 소모품과 유지보수 월 {supplies}',
        '일시불 방식은 창업 1년 후부터 시스템 라이선스 1대당 월 {licenseLegacy}, 게임당 로열티 없음으로 계산',
        '총 창업 비용에서 제외한 항목: 임대보증금, 권리금, 부가세, 세금',
        '오픈 직후 이용객이 늘어나는 정착 기간은 제외하고, 운영이 자리 잡은 상태의 값으로 계산했습니다. 투자금 회수 기간은 총 창업 비용을 월 순수익으로 나눈 값입니다.'
      ],
      notice: [
        '이 문서의 수치는 표준 모델과 위 기준으로 계산한 값이며 장래 수익을 보장하지 않습니다. 실제 매출과 비용은 상권, 임대 조건, 운영 방식에 따라 달라집니다.',
        '계약 전 담당자와 상담하시고 정보공개서를 확인해 주십시오. 가맹계약은 정보공개서를 받으신 날부터 14일이 지난 뒤에 체결하실 수 있습니다.'
      ]
    },

    cta: {
      title: '후보 상가 조건에 맞춰 함께 계산해 드립니다',
      body: '담당자와 상담하시면 후보 상가의 면적과 임대 조건으로 총 창업 비용과 회수 기간을 다시 계산해 드립니다. 후보 상가 확인과 필요한 자료 조사는 담당자가 대신해 드립니다.',
      phoneLabel: '문의전화',
      siteLabel: '홈페이지 창업문의'
    },

    footer: '마이파크 스크린 파크골프 | 문의전화 1544-1448 | www.mypark-golf.com'
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
  // 문구 전체를 토큰까지 풀어서 돌려준다 (문자열, 배열, 객체 모두)
  MP.resolve = function (v) {
    if (typeof v === 'string') return MP.t(v);
    if (Array.isArray(v)) return v.map(MP.resolve);
    if (v && typeof v === 'object') {
      var o = {}; Object.keys(v).forEach(function (k) { o[k] = MP.resolve(v[k]); }); return o;
    }
    return v;
  };
  // 사용: <h1 data-bind="hero.title"></h1>   <b data-v="capexNew8"></b>
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
  MP.copyR = MP.resolve(MP.copy);   // 토큰이 풀린 사본: 반복문 렌더링에 쓴다

  if (typeof module === 'object' && module.exports) module.exports = MP;
})();
