// Skrip sekali pakai: membuang SVG (`art`) dari daftar tema dan menyiapkan slot gambar (`preview`).
// Jalankan di folder project:  node convert-themes.mjs
import fs from 'node:fs';

const file = 'src/config/themes.ts';
let src = fs.readFileSync(file, 'utf8');
if (!fs.existsSync(file + '.bak')) fs.writeFileSync(file + '.bak', src); // cadangan (tidak menimpa cadangan lama)

// 1) hapus properti art: "..." dari setiap tema
src = src.replace(/\s*art:\s*"(?:[^"\\]|\\.)*",/g, '');

// 2) tambahkan preview: '/themes/<id>.jpg' pada tema yang belum punya
src = src
  .split('\n')
  .map((line) => {
    const m = line.match(/^\s*\{ id: "([^"]+)"/);
    if (!m || line.includes('preview:')) return line;
    return line.replace(/\s*\},?\s*$/, (end) => `, preview: '/themes/${m[1]}.jpg' }${end.includes(',') ? ',' : ''}`);
  })
  .join('\n');

// 3) rapikan tipe dan komentar
src = src.replace(/\n\s*art: string;[^\n]*/, '');
src = src.replace(
  /\/\/ bg \+ art = [^\n]*\n\/\/   dengan path[^\n]*\n/,
  "// bg = warna cadangan kartu. preview = gambar kartu: taruh file di public/themes/<id>.jpg\n// (selama file belum ada, kartu hanya menampilkan warna bg).\n"
);
src = src.replace(/preview\?: string; \/\/[^\n]*/, "preview?: string; // gambar kartu, mis. '/themes/dokter-hebat.jpg'");

fs.writeFileSync(file, src);
const count = (src.match(/^\s*\{ id: "/gm) || []).length;
console.log(`Selesai: ${count} tema diproses. Cadangan: ${file}.bak`);