# VOCI — Website i Mobileries

Angular 17 + Firebase (Firestore + Storage + Hosting + Auth)

---

## Struktura e projektit

```
voci/
├── src/app/
│   ├── public/
│   │   ├── home/               # Faqja kryesore (galeri + filtra + WhatsApp)
│   │   └── product-detail/     # Faqja e produktit
│   ├── admin/
│   │   ├── login/              # Hyrja e adminit
│   │   ├── dashboard/          # Shell me sidebar
│   │   ├── products/           # Lista + formë shto/ndrysho
│   │   └── categories/         # Menaxhim kategorish
│   └── core/
│       ├── services/           # Firebase, Auth
│       ├── guards/             # Route guard
│       └── models/             # TypeScript interfaces
├── firestore.rules             # Rregullat e sigurisë Firestore
├── storage.rules               # Rregullat e sigurisë Storage
└── firebase.json               # Konfigurimi i hosting
```

---

## Hapi 1 — Instalo varësitë

```bash
npm install
```

---

## Hapi 2 — Krijo projektin Firebase (falas)

### 2.1 Shko te Firebase Console
1. Hap **https://console.firebase.google.com**
2. Klikoni **"Add project"**
3. Emri: `voci-furniture` (ose çfarëdo)
4. Çaktivizo Google Analytics (nuk na duhet)
5. Klikoni **"Create project"**

### 2.2 Konfiguro Autentikimin
1. Te projekti, kliko **Authentication → Get started**
2. Kliko **"Email/Password"** dhe aktivizoje
3. Shko te **Users → Add user**
4. Shto: `admin@voci.al` + fjalëkalim i sigurt
5. Ky do jetë llogaria e adminit

### 2.3 Konfiguro Firestore
1. Kliko **Firestore Database → Create database**
2. Zgjidh **"Start in production mode"**
3. Zgjidh rajonin: **europe-west3** (Frankfurt, më i afërt)
4. Klikoni **"Enable"**

### 2.4 Konfiguro Storage
1. Kliko **Storage → Get started**
2. Zgjidh **"Start in production mode"**
3. Po i njëjti rajon: **europe-west3**

### 2.5 Merr konfigurimet e Firebase
1. Te projekti, kliko ⚙️ (Settings) → **Project settings**
2. Te **"Your apps"**, kliko **"</> Web"**
3. Emri i app-it: `voci-web`
4. ☑ Aktivizo **Firebase Hosting**
5. Kliko **"Register app"**
6. Kopjo konfigurimin (duket kështu):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "voci-furniture.firebaseapp.com",
  projectId: "voci-furniture",
  storageBucket: "voci-furniture.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Hapi 3 — Konfiguro projektin lokal

### 3.1 Vendos konfigurimet Firebase
Hap `src/environments/environment.ts` dhe `environment.prod.ts` dhe zëvendëso vlerat:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "VLERA_JOT",
    authDomain: "VLERA_JOT",
    projectId: "VLERA_JOT",
    storageBucket: "VLERA_JOT",
    messagingSenderId: "VLERA_JOT",
    appId: "VLERA_JOT"
  },
  whatsappNumber: "355XXXXXXXXX"  // Numri yt pa + dhe pa hapësira
};
```

### 3.2 Vendos numrin WhatsApp
Zëvendëso `355XXXXXXXXX` me numrin tënd real, p.sh. `355692345678`.

---

## Hapi 4 — Apliko rregullat e sigurisë

### 4.1 Instalo Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase use --project PROJEKTI_YT_ID
```

### 4.2 Deploy rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## Hapi 5 — Shto kategoritë fillestare

Shko te panel admin (`/admin`), hyr me llogarinë e adminit dhe shto:
- Kuzhina (order: 1)
- Dhoma Gjumi (order: 2)
- Dhoma Ndenje (order: 3)
- Zyre (order: 4)
- Me Porosi (order: 5)

---

## Hapi 6 — Testo lokalisht

```bash
ng serve
```

Website: http://localhost:4200
Admin:   http://localhost:4200/admin

---

## Hapi 7 — Deploy në Firebase Hosting (falas)

```bash
ng build --configuration production
firebase deploy --only hosting
```

Website do jetë live te: `https://PROJEKTI_YT_ID.web.app`

### Domeni custom (opcional)
1. Blej domain (p.sh. `voci.al` tek Hostinger ~8€/vit)
2. Te Firebase Hosting → **"Add custom domain"**
3. Ndiq udhëzimet DNS (5 minuta)

---

## Çmimi i Firebase (plan Spark — falas)

| Shërbimi | Limit falas | Kosto pas limitit |
|---|---|---|
| Firestore reads | 50,000/ditë | $0.06/100k |
| Firestore writes | 20,000/ditë | $0.18/100k |
| Storage | 5GB | $0.026/GB |
| Hosting | 10GB/muaj | $0.15/GB |
| Auth | Pa limit | Falas |

Për një mobileri me ~500 vizitorë/muaj: **100% falas**.

---

## Funksionet kryesore

### Faqja publike
- Galeri produktesh me filtrim sipas kategorisë
- Çmim ose "Pyet për çmim" sipas konfigurimit
- Buton WhatsApp tek çdo produkt me mesazh të para-shkruar
- Galeri imazhesh në faqen e detajit
- Dizajn responsive (mobile/desktop)
- Buton WhatsApp fiks (floating)

### Panel admin
- Login i sigurt me Firebase Auth
- Shto / ndrysho / fshi produkte
- Ngarkim imazhesh me zvarritje & lëshim (drag & drop)
- Kompresim automatik WebP ~500KB
- Progress bar gjatë ngarkimit
- Cakto imazhin kryesor
- Fshi imazhe individuale (pastron edhe Storage)
- Menaxhim kategorish (shto, ndrysho, fshi, rendit)

---

## Zgjerim i mundshëm

- SEO meta tags dinamike
- WhatsApp Business API për mesazhe automatike
- Analitikë me Google Analytics
- Backup automatik Firestore
