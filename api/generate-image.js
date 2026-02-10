export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, ratio, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio: ratio || "1:1",
          style_preset: style || "realistic",
          output_format: "png",
        }),
      }
    );

    const data = await response.json();

    if (!data.image) {
      return res.status(500).json({ error: "No image returned" });
    }

    res.status(200).json({ image: data.image });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
