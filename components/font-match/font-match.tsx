"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CandidateResults } from "./candidate-results";
import { CANDIDATE_FONTS, RESULT_LIMIT, SAMPLE_TEXT, type CandidateFont } from "./catalog";
import { measureCrop, rankFonts, type PixelRegion } from "./ranking";
import { ScreenshotCropper } from "./screenshot-cropper";

export function FontMatch() {
  const [region, setRegion] = useState<PixelRegion | null>(null);
  const [text, setText] = useState("");
  const [results, setResults] = useState<CandidateFont[] | null>(null);

  const previewText = text.trim() || SAMPLE_TEXT;

  const handleRecommend = () => {
    if (!region) return;
    const measurement = measureCrop(region, previewText.length);
    setResults(rankFonts(measurement, CANDIDATE_FONTS, RESULT_LIMIT));
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">레퍼런스 폰트 찾기</h1>
        <p className="text-sm text-muted-foreground">
          레퍼런스 영상 스크린샷을 올리고 텍스트 영역을 지정하면, 비슷해 보이는 무료
          폰트를 추천하고 다운로드 링크를 드립니다.
        </p>
      </header>

      <ScreenshotCropper onRegionChange={setRegion} />

      <div className="flex flex-col gap-2">
        <label htmlFor="crop-text" className="text-sm font-medium">
          이미지 속 글자
        </label>
        <input
          id="crop-text"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`비워 두면 "${SAMPLE_TEXT}"로 미리보기`}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        />
      </div>

      <Button type="button" disabled={!region} onClick={handleRecommend} className="self-start">
        비슷한 무료 폰트 추천
      </Button>

      {results ? <CandidateResults fonts={results} previewText={previewText} /> : null}
    </div>
  );
}
