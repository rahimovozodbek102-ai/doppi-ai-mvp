export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, ratio, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  try {
    const formData = new FormData();
    formData.append("model", "sd3.5-large-turbo");
    formData.append("prompt", `${prompt}, style: ${style || "realistic"}`);
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

    res.status(200).json({
      image: data.image,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
