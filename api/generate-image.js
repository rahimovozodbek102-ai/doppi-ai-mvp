export default function handler(req, res) {
  try {
    const apiKey = process.env.STABILITY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "STABILITY_API_KEY yo‘q"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "API ishlayapti",
      keyPreview: apiKey.substring(0, 6) + "****"
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
