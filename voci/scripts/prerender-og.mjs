// Gjeneron faqe statike /produkt/<id>/index.html me OG/meta tags të sakta për çdo
// punim, që linqet e ndara në WhatsApp/Facebook/Instagram të shfaqin parapamje korrekte
// (këta bots nuk ekzekutojnë JavaScript, kështu që tags e vendosura vetëm në runtime
// nuk mjaftojnë). Ekzekuto pas "ng build" — jo në vend të tij.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist', 'voci', 'browser');
const indexPath = join(distDir, 'index.html');

const firebaseConfig = {
  apiKey: 'AIzaSyBuEs3wnHCzubuEr1vCZa9JNFDC_CAsie4',
  authDomain: 'vocimobileri.firebaseapp.com',
  projectId: 'vocimobileri',
  storageBucket: 'vocimobileri.firebasestorage.app',
  messagingSenderId: '741046042018',
  appId: '1:741046042018:web:a05e47f0882296f4c986fb'
};
const SITE_URL = 'https://vocimobileri.com';

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    console.warn(`Kujdes: pattern ${pattern} nuk u gjet në index.html — kontrollo strukturën.`);
  }
  return html.replace(pattern, replacement);
}

async function main() {
  if (!existsSync(indexPath)) {
    console.error(`Nuk u gjet ${indexPath} — ekzekuto "ng build" (ose "npm run build:prod") para "npm run prerender:og".`);
    process.exit(1);
  }
  const template = readFileSync(indexPath, 'utf8');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, 'products'));

  let count = 0;
  for (const docSnap of snap.docs) {
    const p = docSnap.data();
    const id = docSnap.id;
    const title = `${p.title} — VOCI Mobileri`;
    const description = (p.description && p.description.trim())
      ? p.description.trim().slice(0, 160)
      : `${p.title} — ${p.material || 'mobileri artizanale'}. Punuar me porosi nga VOCI, Tiranë.`;
    const firstImage = Array.isArray(p.images) ? p.images.find(i => i.type !== 'video') : null;
    const image = firstImage?.url || `${SITE_URL}/assets/og-image.jpg`;
    const url = `${SITE_URL}/produkt/${id}`;

    let html = template;
    html = replaceTag(html, /<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = replaceTag(html, /<meta name="description" content=".*?">/, `<meta name="description" content="${escapeHtml(description)}">`);
    html = replaceTag(html, /<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${url}">`);
    html = replaceTag(html, /<meta property="og:type" content=".*?">/, `<meta property="og:type" content="product">`);
    html = replaceTag(html, /<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${url}">`);
    html = replaceTag(html, /<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeHtml(title)}">`);
    html = replaceTag(html, /<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeHtml(description)}">`);
    html = replaceTag(html, /<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${image}">`);
    html = replaceTag(html, /<meta name="twitter:title" content=".*?">/, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
    html = replaceTag(html, /<meta name="twitter:description" content=".*?">/, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
    html = replaceTag(html, /<meta name="twitter:image" content=".*?">/, `<meta name="twitter:image" content="${image}">`);

    const outDir = join(distDir, 'produkt', id);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    count++;
  }

  console.log(`Prerender OG: u gjeneruan ${count} faqe statike nën /produkt/<id>/.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Prerender OG dështoi:', err);
  process.exit(1);
});
