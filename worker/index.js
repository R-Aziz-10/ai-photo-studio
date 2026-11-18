// Worker produksi: menerima foto + prompt dari aplikasi, memanggil FLUX.2 klein 4B
// (Cloudflare Workers AI), mengembalikan gambar hasil (base64).
//
// Pasang: Cloudflare Dashboard > Worker Anda > Edit code > tempel file ini > Deploy.
// Syarat: Settings > Bindings > Workers AI dengan nama variabel: AI
// Opsional: Settings > Variables > tambah EVENT_KEY (teks bebas). Jika diisi,
//           aplikasi wajib mengirim kunci yang sama (VITE_EVENT_KEY di .env).

const MODEL = '@cf/black-forest-labs/flux-2-klein-4b';
const ALLOWED_SIZES = ['512', '768', '1024'];

// Penyaring kata untuk teks kustom pengunjung. Samakan dengan src/config/safety.ts.
const BLOCKED_WORDS = [
  'nude', 'naked', 'nsfw', 'porn', 'sex', 'sexy', 'erotic', 'topless', 'lingerie', 'fetish',
  'telanjang', 'bugil', 'bokep', 'porno', 'seks', 'seksi', 'mesum', 'sensual',
  'gore', 'mutilated', 'mutilasi', 'suicide', 'bunuh diri',
  'nazi', 'swastika', 'hitler',
  'narkoba',
];
const BLOCK_RE = new RegExp('\\b(' + BLOCKED_WORDS.join('|') + ')\\b', 'i');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Event-Key',
};

const json = (body, status = 200) => Response.json(body, { status, headers: CORS });

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (request.method === 'GET') {
      return new Response('Selfie Studio Worker aktif.', { headers: CORS });
    }

    if (request.method === 'POST' && url.pathname === '/generate') {
      if (env.EVENT_KEY && request.headers.get('X-Event-Key') !== env.EVENT_KEY) {
        return json({ error: 'Tidak diizinkan.' }, 401);
      }

      try {
        const incoming = await request.formData();
        const image = incoming.get('image');
        const prompt = String(incoming.get('prompt') || '').slice(0, 3000);
        const requested = String(incoming.get('size') || '512');
        const size = ALLOWED_SIZES.includes(requested) ? requested : '512';

        if (!image || typeof image === 'string') return json({ error: 'Foto tidak diterima.' }, 400);
        if (!prompt) return json({ error: 'Prompt kosong.' }, 400);
        if (BLOCK_RE.test(prompt)) {
          return json({ error: 'Permintaan ditolak karena memuat kata yang tidak diperbolehkan.' }, 400);
        }

        const form = new FormData();
        form.append('prompt', prompt);
        form.append('input_image_0', image, 'photo.png');
        form.append('width', size);
        form.append('height', size);

        // Pola resmi Cloudflare untuk mengirim multipart ke model FLUX.2
        const formRequest = new Request('http://dummy', { method: 'POST', body: form });

        const result = await env.AI.run(MODEL, {
          multipart: {
            body: formRequest.body,
            contentType: formRequest.headers.get('content-type'),
          },
        });

        if (!result || !result.image) {
          return json({ error: 'Model tidak mengembalikan gambar.' }, 502);
        }
        return json({ image: result.image });
      } catch (err) {
        return json({ error: String(err && err.message ? err.message : err) }, 502);
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
