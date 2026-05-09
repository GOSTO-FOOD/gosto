# GOSTO FOOD

تطبيق ويب لطلب الطعام — مبني بـ React + Vite + Firebase.

## التقنيات المستخدمة

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Firebase (Firestore + Storage)
- Framer Motion
- shadcn/ui

## تشغيل المشروع محلياً

```bash
npm install
npm run dev
```

## بناء للإنتاج

```bash
npm run build
```

## إعداد Firebase

البيانات موجودة مباشرة في `src/lib/firebase.ts`. يمكنك تغييرها بمشروع Firebase خاص بك.

## هيكل المشروع

```
src/
├── assets/          # الصور والملفات الثابتة
├── components/      # مكونات الواجهة
│   └── ui/          # مكونات shadcn/ui
├── context/         # React Context (السلة)
├── data/            # بيانات المنيو
├── hooks/           # Custom hooks
├── lib/             # Firebase وأدوات مساعدة
└── pages/           # صفحات التطبيق
```
