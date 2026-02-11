export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, ratio, duration, image } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    if (!image) {
      return res.status(400).json({ error: "Image required" });
    }

    // Prompt safety (500 belgigacha)
    const safePrompt =
      prompt.length > 500 ? prompt.slice(0, 500) : prompt;

    // Mock video URL
    const mockVideo =
      "https://www.w3schools.com/html/mov_bbb.mp4";

    // Real API kabi delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return res.status(200).json({
      success: true,
      video: mockVideo,
      duration: duration || "5s"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
