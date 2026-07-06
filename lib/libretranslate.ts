const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL ?? "https://libretranslate.com";
const LIBRETRANSLATE_API_KEY = process.env.LIBRETRANSLATE_API_KEY ?? "";

function withKey(body: Record<string, unknown>) {
  if (LIBRETRANSLATE_API_KEY) {
    return { ...body, api_key: LIBRETRANSLATE_API_KEY };
  }
  return body;
}

export async function detectLanguage(text: string): Promise<string> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(withKey({ q: text })),
  });

  if (!res.ok) {
    throw new Error(`Detect failed: ${res.status}`);
  }

  const data = (await res.json()) as Array<{ language: string; confidence: number }>;
  const best = data.sort((a, b) => b.confidence - a.confidence)[0];
  return best?.language ?? "en";
}

export async function translateText(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(withKey({ q: text, source, target, format: "text" })),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Translate failed (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as { translatedText: string };
  return data.translatedText;
}

export async function getLanguages(): Promise<Array<{ code: string; name: string }>> {
  const res = await fetch(`${LIBRETRANSLATE_URL}/languages`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Languages fetch failed: ${res.status}`);
  }

  return res.json();
}
