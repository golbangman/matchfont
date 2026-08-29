import path from "node:path";

import { expect, test } from "@playwright/test";

const FIXTURE = path.join(__dirname, "fixtures", "reference-title.png");

test("스크린샷을 올리고 영역을 지정하면 비슷한 무료 폰트 5개와 다운로드 링크가 나온다", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByLabel("레퍼런스 스크린샷").setInputFiles(FIXTURE);

  const image = page.getByRole("img", { name: "업로드한 스크린샷" });
  await expect(image).toBeVisible();

  const recommend = page.getByRole("button", { name: "비슷한 무료 폰트 추천" });
  await expect(recommend).toBeDisabled();

  const box = await image.boundingBox();
  if (!box) throw new Error("스크린샷 이미지의 위치를 찾지 못했습니다");

  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.35);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.65, { steps: 10 });
  await page.mouse.up();

  await page.getByLabel("이미지 속 글자").fill("SUBSCRIBE");

  await expect(recommend).toBeEnabled();
  await recommend.click();

  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(5);

  const downloadLinks = page.getByRole("link", { name: "다운로드" });
  await expect(downloadLinks).toHaveCount(5);
  await expect(downloadLinks.first()).toHaveAttribute(
    "href",
    /^https:\/\/fonts\.google\.com\/specimen\//
  );
  await expect(downloadLinks.first()).toHaveAttribute("target", "_blank");
});
