export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    prompt,
    ratio = "1:1",
    style = "Realistic"
  } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  let width = 1024;
  let height = 1024;

  switch (ratio) {
    case "16:9":
      width = 1280;
      height = 720;
      break;
    case "9:16":
      width = 720;
      height = 1280;
      break;
    case "4:5":
      width = 819;
      height = 1024;
      break;
    case "3:2":
      width = 1024;
      height = 683;
      break;
    case "21:9":
      width = 1344;
      height = 576;
      break;
  }

  const styles = {
    Anime:
      "anime, manga, japanese animation, vibrant colors",
    Realistic:
      "photorealistic, realistic photo, DSLR, ultra detailed",
    Cinematic:
      "cinematic lighting, movie still, dramatic light",
    Illustration:
      "digital illustration, concept art",
    Dark:
      "dark atmosphere, moody lighting",
    Rationiy:
      "minimalist, clean design"
  };

  const finalPrompt =
    `${prompt}, ${styles[style] || ""}, masterpiece, best quality`;

  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&model=flux&seed=${Math.floor(Math.random()*1000000000)}`;

  try {

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return res.status(200).json({
      image: buffer.toString("base64")
    });

  } catch (e) {

    console.error(e);

    return res.status(500).json({
      error: e.message
    });

  }
}
