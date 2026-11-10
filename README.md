# 🛍️ Sof Foyda — Kiyim Do'koni POS & Ombor Tizimi

Kiyim do'koni biznesi uchun maxsus ishlab chiqilgan zamonaviy savdo, ombor va sof foyda hisobi frontend ilovasi. 

---

## 🚀 Asosiy Imkoniyatlar

1. **📊 Boshqaruv Paneli (Dashboard):**
   - Jami tushum (Gross Revenue)
   - Jami Sof Foyda (Net Profit) va o'rtacha marja
   - Sotilgan tovarlar tannarxi (COGS)
   - Ombordagi kutilayotgan potensial sof foyda
   - Toifalar bo'yicha daromad taqsimoti

2. **🏪 Ombor & Katalog Boshqaruvi:**
   - Qidiruv (nomi, SKU, shtrix-kod, rang)
   - Filtrlar (Erkaklar, Ayollar, Bolalar, Mavsum)
   - Katak (Grid) va Jadval (Table) ko'rinishlari
   - Qoldiq sonini bir bosishda oshirish/kamaytirish (`+` / `-`)

3. **📥 Kirim (Kelgan Tovarlarni Kiritish):**
   - Yangi tovar parametrlarini qulay va tezkor kiritish
   - Razmerlar (o'lchamlar) boshqaruvi (S, M, L, XL yoki 32, 34...)
   - Rasm biriktirish (ixtiyoriy)
   - Avtomatik shtrix-kod va SKU yaratish
   - Real vaqtda **Sof Foyda** hisoblagichi (`Sotuv narxi - Tannarx`)

4. **⚡ Tezkor Kassa (POS Cashier):**
   - Shtrix-kod skaneri yoki kod orqali tezkor qo'shish
   - O'lchamlarni tanlash va savatcha boshqaruvi
   - To'lov turlari: **Naqd pul**, **Plastik karta**, **Click / Payme**, **Nasiya**
   - Xarid yakunlanganda konfetti animatsiyasi va avtomatik ombor qoldig'ini kamaytirish

5. **🖨️ Chop Etish (Print):**
   - Kiyim narx va shtrix-kod birkasi (Price tag / barcode label)
   - 80mm/58mm termal kassa cheki (Thermal receipt)

6. **📜 Savdolar Tarixi:**
   - Amalga oshirilgan barcha xaridlar va cheklar arxivi
   - Chekni qayta chop etish imkoniyati

---

## 🛠️ Texnologiyalar Steki

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Animations:** Canvas Confetti
- **Storage:** LocalStorage (avtomatik mahalliy saqlash)

---

## 💻 Ishga Tushirish

```bash
# Loyihani ishga tushirish (5180 portida)
npm run dev
```

Brauzerda: `http://localhost:5180`
