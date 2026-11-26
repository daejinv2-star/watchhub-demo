# Watch HUB — Watchup 스타일 클론 (데모)

두 사이트를 분석해 같은 구조·디자인·기능 흐름으로 다시 만든 정적 웹앱입니다. 빌드 도구나 패키지 설치가 필요 없습니다.

- `index.html` — 소비자 사이트 (watchup.co.kr 스타일): 히어로 캐러셀, 슈퍼검색, 브랜드 레일, 중고장터(판매 등록), 대리구매 신청, 매거진, 리테일 정가
- `pro.html` — 딜러용 Pro 앱 (pro.watchup.ai 스타일): 개요, Explore, 모델 상세(차트·신품/중고/구함·딜러 신뢰 지표·문의), Broadcast, 설정, ⌘K 검색

## 실행
```bash
node server.js        # http://localhost:5178  ,  Pro: http://localhost:5178/pro.html
```
Node가 없으면 `index.html`을 브라우저로 직접 열어도 됩니다(일반 스크립트라 file://에서도 동작).

## 구조
```
assets/common.js     가상 데이터(모델 71개, 딜러 90명, 시세 400일), 통화 환산, 사진 렌더러, localStorage 저장
assets/photos.js     모델 레퍼런스 → 사진 매핑 + 출처 정보
assets/img/          시계 사진 68장 (Wikimedia Commons·Flickr 자유 라이선스, 900px JPEG)
credits.html         사진 저작자·라이선스 목록
assets/pro.css/js    Pro 앱 (HeroUI v3 라이트 토큰을 oklch로 재현, 다크 모드)
assets/consumer.css/js  소비자 사이트 (--customer-* 토큰 재현, 모바일 하단 탭바)
server.js            의존성 없는 정적 서버
```

## 바꾸기 쉬운 곳
- 브랜드명: `assets/common.js`의 `BRAND_NAME`, 각 HTML의 로고/타이틀
- 모델·시세: `common.js`의 `RAW` 배열 (레퍼런스, 리테일가, 시세 HKD)
- 슈퍼검색 플랫폼: `consumer.js`의 `PLATFORMS`
- 매거진 글: `consumer.js`의 `ARTICLES`

## 주의
- 모든 시세·매물·딜러·후기는 가상 데이터입니다. 실제 WhatsApp 연결, 결제, 채팅은 동작하지 않습니다(데모 표시).
- 원본 사이트의 로고·사진·기사 원문은 쓰지 않았습니다. 시계 사진은 자유 라이선스 사진이며 출처는 credits.html에 있습니다.
- 설정 → 데모 데이터 초기화로 즐겨찾기·연결·후기·사용량을 지울 수 있습니다.
