# 폼 입력에서 caret-color 하이드레이션 경고가 뜬다

## 증상

`/`를 열면 `next dev` 오버레이에 "1 Issue"가 뜬다. 브라우저 콘솔 로그:

```
A tree hydrated but some attributes of the server rendered HTML didn't match
the client properties.
-  style={{caret-color:"transparent"}}   (#screenshot-file, #crop-text)
```

## 확인한 것

- SSR HTML(`curl`)에는 `caret-color`가 전혀 없다. 클라이언트에서 두 `<input>`에
  인라인 `style="caret-color: transparent"`가 붙어 생기는 속성 불일치다.
- 저장소 코드(app, components, lib)와 의존성(tw-animate-css, shadcn, @base-ui)
  어디에도 `caret-color`를 넣는 곳이 없다.
- 페이지 동작에는 영향이 없다. 하이드레이션은 끝나고 E2E도 통과한다.

## 의심되는 원인

브라우저 확장 프로그램이나 자동화 하니스가 입력 요소에 캐럿 스타일을 주입하는
것으로 보인다. React 공식 문서가 하이드레이션 불일치의 정상적인 외부 원인으로
드는 사례와 일치한다.

## 제안하는 다음 단계

- 확장 프로그램이 없는 깨끗한 Chrome 프로필에서 재현되는지 확인.
- 저장소가 원인이 아니라고 확정되면, 두 입력에 `suppressHydrationWarning`을 붙이는
  선에서 마무리.
