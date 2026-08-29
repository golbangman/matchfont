import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";

test("홈 화면은 폰트 찾기 제목과 스크린샷 업로드 입력을 보여준다", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { level: 1, name: "레퍼런스 폰트 찾기" })
  ).toBeInTheDocument();
  expect(screen.getByLabelText("레퍼런스 스크린샷")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "비슷한 무료 폰트 추천" })
  ).toBeDisabled();
});
