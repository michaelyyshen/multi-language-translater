import { NextRequest, NextResponse } from "next/server";
import {
  detectLanguage,
  translateText,
  SUPPORTED_LANGUAGES,
} from "@/lib/mymemory";
import type { TranslateRequest, TranslateResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TranslateRequest;
    const { q, source, targets } = body;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return NextResponse.json({ translations: {}, detectedLanguage: undefined });
    }

    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json(
        { error: "targets must be a non-empty array" },
        { status: 400 }
      );
    }

    // Detect language if source is "auto"
    let resolvedSource = source;
    let detectedLanguage: string | undefined;
    if (!source || source === "auto") {
      try {
        detectedLanguage = await detectLanguage(q);
        resolvedSource = detectedLanguage;
      } catch {
        // If detection fails, default to English and continue
        resolvedSource = "en";
      }
    }

    // When source was "auto", the client block is labelled "auto" not the detected code,
    // so we must NOT skip the detected language from the targets list.
    const filteredTargets =
      source === "auto" ? targets : targets.filter((t) => t !== resolvedSource);
    const results = await Promise.allSettled(
      filteredTargets.map((target) => translateText(q, resolvedSource, target))
    );

    const translations: Record<string, string> = {};
    filteredTargets.forEach((target, i) => {
      const result = results[i];
      translations[target] = result.status === "fulfilled" ? result.value : "";
    });

    const response: TranslateResponse = { translations, detectedLanguage };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[/api/translate]", err);
    return NextResponse.json(
      { error: "Translation service error. Please try again." },
      { status: 500 }
    );
  }
}

/** Return the static supported language list — no external call needed */
export async function GET() {
  // Filter out "auto" from the list returned to the client (it's added by the hook)
  const languages = SUPPORTED_LANGUAGES.filter((l) => l.code !== "auto");
  return NextResponse.json({ languages });
}
