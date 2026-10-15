export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // Mengambil API Key dari Environment Variable Cloudflare (aman dari publik)
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key belum diset di Cloudflare" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Mengarahkan permintaan ke API resmi Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
