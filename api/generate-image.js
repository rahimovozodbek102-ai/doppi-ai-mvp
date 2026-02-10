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
  "ultra high quality, sharp focus, 8k, professional composition, masterpiece";

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

const NEGATIVE_PROMPT = `
low quality, blurry, bad anatomy, bad hands, extra fingers, missing fingers,
deformed hands, deformed face, distorted face, cross-eye, lazy eye,
poor lighting, flat lighting, oversaturated, undersaturated,
jpeg artifacts, watermark, logo, text, cropped, out of frame
`;

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
    const finalPrompt = buildPrompt({ prompt, style, ratio });

    const formData = new FormData();
    formData.append("model", "sd3.5-large-turbo");
    formData.append("prompt", finalPrompt);
    formData.append("negative_prompt", NEGATIVE_PROMPT);
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
      image: data.image,
      used_prompt: finalPrompt // debug uchun (keyin o‘chirsa bo‘ladi)
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
