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
    return res.status(400).json({
      error: "Prompt required"
    });
  }

  try {
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

      default:
        width = 1024;
        height = 1024;
    }

    // STYLE
    let stylePrompt = "";

    switch (style) {

      case "Anime":
        stylePrompt =
          "anime style, manga, vibrant colors, cel shading, masterpiece";
        break;

      case "Realistic":
        stylePrompt =
          "photorealistic, DSLR photo, ultra realistic skin, highly detailed, 8k";
        break;

      case "Cinematic":
        stylePrompt =
          "cinematic lighting, movie scene, dramatic shadows, volumetric light";
        break;

      case "Illustration":
        stylePrompt =
          "digital illustration, concept art, detailed artwork";
        break;

      case "Dark":
        stylePrompt =
          "dark fantasy, moody atmosphere, dramatic lighting";
        break;

      case "Rationiy":
        stylePrompt =
          "minimalist, clean composition, elegant design";
        break;

      default:
        stylePrompt = "";
    }

    const finalPrompt = `
${prompt},
${stylePrompt},
ultra high quality,
masterpiece,
sharp focus,
high detail
`.trim();

    const seed = Date.now();

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Pollinations Error ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return res.status(200).json({
      image: buffer.toString("base64")
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });

  }
}
