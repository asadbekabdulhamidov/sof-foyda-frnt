# 🛍️ Sof Foyda — Kiyim Do'koni Uchun Aqlli POS & Ombor Tizimi

Kiyim do'koni biznesi uchun maxsus ishlab chiqilgan zamonaviy savdo, ombor va sof foyda hisobi frontend ilovasi. Ilova sun'iy intellekt (AI Vision) orqali kiyim yoki uning etiketkasi/birkasi rasmidan barcha ma'lumotlarni avtomatik aniqlab tizimga kiritadi.

---

## 🚀 Asosiy Imkoniyatlar

1. **📸 AI Kiyim & Birka Skaneri (Auto-Fill):**
   - Kiyim yoki birka rasmini yuklash yoki kameradan suratga olish.
   - Sun'iy intellekt quyidagi 10 ta parametrni aniq JSON formatida qaytaradi:
     - `category` (Kiyim kategoriyasi)
     - `type` (Turi)
     - `color` (Asosiy va qo'shimcha ranglar)
     - `material_estimated` (Taxminiy mato)
     - `pattern` (Rasmi/printi)
     - `season` (Mavsumi)
     - `target_audience` (Kim uchun)
     - `sizes_detected` (Aniqlangan razmerlar: S, M, L, XL yoki 30, 32...)
     - `short_title` (Kassa uchun qisqa va lo'nda nom)
     - `sku_code_suggestion` (Unikal SKU kodi)

2. **💰 Jonli Sof Foyda Hisobi:**
   - Har bir kiyim uchun: `Sotuv narxi - Tannarx = Sof Foyda`
   - Rentabellik foizi (% marja)
   - Butun ombordagi tovarlar sotilgandagi kutilayotgan umumiy sof foyda
   - Har bir kassa chekidan olingan aniq sof daromad

3. **🏪 Ombor & Katalog Boshqaruvi:**
   - Qidiruv (nomi, SKU, shtrix-kod, rang)
   - Filtrlar (Erkaklar, Ayollar, Bolalar, Mavsum)
   - Katak (Grid) va Jadval (Table) ko'rinishlari
   - Qoldiq sonini bir bosishda oshirish/kamaytirish

4. **⚡ Tezkor Kassa (POS Cashier):**
   - Shtrix-kod skaneri yoki klaviatura orqali tezkor qo'shish
   - Razmerlarni tanlash va savatcha boshqaruvi
   - To'lov turlari: **Naqd pul**, **Plastik karta**, **Click / Payme**, **Nasiya**
   - Xarid muvaffaqiyatli yakunlanganda konfetti animatsiyasi

5. **🖨️ Chop Etish (Print):**
   - Kiyim uchun narx va shtrix-kod birkasi (Price tag / barcode label)
   - 80mm/58mm termal kassa cheki (Thermal receipt)

6. **📈 Moliya & Analitika Dashboard:**
   - Jami tushum (Gross Revenue)
   - Jami Sof Foyda (Net Profit)
   - Sotilgan tovarlar tannarxi (COGS)
   - Toifalar bo'yicha sof daromad taqsimoti
   - Eng xaridorgir kiyimlar reytingi

---

## 🛠️ Texnologiyalar Steki

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Animations:** Canvas Confetti
- **Storage:** LocalStorage (avtomatik saqlash)
- **AI Integratsiya:** Google Gemini 2.5 Flash API (AI Vision)

---

## 💻 O'rnatish va Ishga Tushirish

```bash
# Repozitoriyani klonlash
git clone https://github.com/asadbekabdulhamidov/sof-foyda-frnt.git
cd sof-foyda-frnt

# Paketlarni o'rnatish
npm install

# Dasturni ishlab chiqish rejimida ishga tushirish
npm run dev

# Ishlab chiqarish (Production) uchun build qilish
npm run build
```

---

## 🔑 AI Sozlamalari

Ilovada sozlamalar bo'limi orqali o'zingizning [Google AI Studio](https://aistudio.google.com/app/apikey) dan olingan Gemini API kalitingizni kiritishingiz mumkin. Agar kalit kiritilmasa, tizim avtomatik aqlli simulyatsiya rejimida ishlab test qilish imkonini beradi.
