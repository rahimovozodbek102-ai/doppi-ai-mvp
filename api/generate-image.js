// ===== NEGATIVE BLOCKS =====

const BASE_NEGATIVE = `
low quality, blurry, jpeg artifacts, watermark, logo, text,
cropped, out of frame, oversharpened
`;

const FACE_NEGATIVE = `
bad face, distorted face, asymmetrical face, cross eye, lazy eye,
bad anatomy, deformed head
`;

const HAND_NEGATIVE = `
bad hands, extra fingers, missing fingers,
deformed hands, fused fingers
`;

const REALISTIC_NEGATIVE = `
cartoon, anime, illustration, painting, unreal
`;

const ANIME_NEGATIVE = `
photorealistic, realistic skin, real photo
`;

const DARK_NEGATIVE = `
overexposed, flat lighting
`;

const WIDE_NEGATIVE = `
empty background, low detail background, flat perspective
`;

// ===== NEGATIVE BUILDER =====
function buildNegativePrompt({ prompt, style, ratio }) {
  let negative = BASE_NEGATIVE;
  const p = prompt.toLowerCase();

  if (
    p.includes("face") ||
    p.includes("portrait") ||
    p.includes("man") ||
    p.includes("woman")
  ) {
    negative += FACE_NEGATIVE + HAND_NEGATIVE;
  }

  if (style === "Realistic" || style === "Cinematic") {
    negative += REALISTIC_NEGATIVE;
  }

  if (style === "Anime") {
    negative += ANIME_NEGATIVE;
  }

  if (style === "Dark") {
    negative += DARK_NEGATIVE;
  }

  if (ratio === "16:9" || ratio === "21:9") {
    negative += WIDE_NEGATIVE;
  }

  return negative;
}

// ===== PROMPT HELPERS =====

const STYLE_MAP = {
  Realistic:
    "photorealistic, natural skin texture, realistic lighting, high detail",
  Cinematic:
    "cinematic lighting, dramatic shadows, shallow depth of field, film still",
  Anime:
    "anime style, clean lineart, vibrant colors, detailed illustration",
  Illustration:
    "digital illustration, soft shading, high detail, smooth colors",
  Dark:
    "dark mood, low key lighting, dramatic atmosphere, deep shadows",
  Rationiy:
    "minimalist, clean composition, balanced lighting"
};

const QUALITY_BOOST =
  "ultra high quality, sharp focus, professional composition, masterpiece";

function ratioHint(ratio) {
  if (ratio === "16:9" || ratio === "21:9") {
    return "wide background, detailed environment, depth and perspective";
  }
  if (ratio === "9:16") {
    return "vertical composition, full body framing";
  }
  return "";
}

function buildPrompt({ prompt, style, ratio }) {
  return [
    prompt,
    STYLE_MAP[style] || "",
    ratioHint(ratio),
    QUALITY_BOOST
  ].filter(Boolean).join(", ");
}
// ===== PROMPT SAFETY HELPERS =====
function normalizePrompt(prompt, maxLength = 500) {
  if (!prompt) return "";
  return prompt.length > maxLength
    ? prompt.slice(0, maxLength)
    : prompt;
}

function cleanPromptByStyle(prompt, style) {
  let p = prompt.toLowerCase();

  if (style === "Anime") {
    p = p.replace(/realistic|photorealistic|photo|real photo/gi, "");
  }

  if (style === "Realistic" || style === "Cinematic") {
    p = p.replace(/anime|cartoon|illustration|drawing/gi, "");
  }

  return p.trim();
}
// ===== API HANDLER =====

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, ratio, style } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const safePrompt = normalizePrompt(prompt);
const balancedPrompt = cleanPromptByStyle(safePrompt, style);

const finalPrompt = buildPrompt({
  prompt: balancedPrompt,
  style,
  ratio
});
    const negativePrompt = buildNegativePrompt({
  prompt: balancedPrompt,
  style,
  ratio
});

    const formData = new FormData();
    formData.append("model", "sd3.5-large-turbo");
    formData.append("prompt", finalPrompt);
    formData.append("negative_prompt", negativePrompt);
    formData.append("aspect_ratio", ratio || "1:1");
    formData.append("output_format", "png");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const data = await response.json();

    return res.status(200).json({
      image: data.image
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
