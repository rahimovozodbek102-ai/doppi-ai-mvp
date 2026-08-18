export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, ratio = "1:1" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
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
    }

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error("Image generation failed");
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return res.status(200).json({
      image: buffer.toString("base64")
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
