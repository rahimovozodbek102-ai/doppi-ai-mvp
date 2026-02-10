export default function handler(req, res) {
  res.status(200).json({ ok: true, message: "API ishlayapti" });
}
export default async function handler(req, res) {
  const apiKey = process.env.STABILITY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "API key topilmadi"
    });
  }

  return res.status(200).json({
    ok: true,
    message: "API ishlayapti",
    keyPreview: apiKey.slice(0, 6) + "****"
  });
}
