# vitest jsdom 환경이 Node 20에서 워커 시작에 실패한다

## 증상

`bun run test`(= `vitest run`, 기본 environment `jsdom`)가 테스트를 하나도 실행하지
못하고 끝난다.

```
Caused by: TypeError: webidl.util.markAsUncloneable is not a function
 ❯ new CacheStorage node_modules/undici/lib/web/cache/cachestorage.js:20:17
 ❯ Object.<anonymous> node_modules/jsdom/lib/api.js:12:33
```

`--pool=threads`, `--pool=forks` 모두 같은 지점에서 죽는다. 템플릿이 원래 가지고
있던 `lib/utils.test.ts`, `app/page.test.tsx`도 같은 이유로 실행되지 않는다. 이번
작업에서 처음 생긴 문제가 아니다.

## 원인(확인함)

- 이 환경의 Node는 `v20.20.2`. `require('worker_threads').markAsUncloneable`가
  `undefined`다(Node 21+에서 추가됨).
- `jsdom@30.0.1`은 `undici@^8.9.0`을 요구하고, 설치된 `undici@8.10.0`은
  `markAsUncloneable`가 있다고 가정한다. 그래서 jsdom 로딩 시점에 터진다.
- `undici`를 7.x로 내리면 jsdom의 선언된 범위(`^8.9.0`)를 벗어난다.

## 시도한 것

- environment `node`로는 정상 동작. 순수 로직 테스트는 아래로 통과 확인:
  `bunx vitest run components/font-match/ranking.test.ts --environment node`
  → 10 passed.

## 제안하는 다음 단계

- Node를 22 LTS로 올리거나, `jsdom`을 Node 20과 맞는 버전으로 내리거나,
  jsdom 대신 `happy-dom` 등으로 교체. 셋 다 템플릿 차원의 결정이라 이 작업 범위
  밖으로 둔다.
- 그 전까지 컴포넌트/DOM 테스트의 런타임 검증은 Playwright E2E(`bun run test:e2e`)로
  대체한다. `components/font-match`의 흐름은 `e2e/font-match.spec.ts`가 커버한다.
