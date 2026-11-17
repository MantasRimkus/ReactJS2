# Receptų programėlė (Praktinė užduotis Nr. 2)

React programėlė su registracija, prisijungimu, apsaugotais maršrutais ir asmeniniu mėgstamiausių receptų sąrašu.
Receptai gaunami iš [DummyJSON](https://dummyjson.com/docs/recipes), naudotojai ir mėgstamiausi saugomi vietiniame `json-server`.

## Naudotos versijos

| Priemonė | Versija |
| --- | --- |
| Node.js | 26 |
| React / React DOM | 19 |
| React Router (`react-router-dom`) | 7 |
| Vite | 8 |
| json-server | **0.17.4** (tiksliai ši versija – 1.x versijose užklausų filtravimo sintaksė kitokia) |

Tikslios įdiegtos versijos užfiksuotos `package-lock.json` faile.

## Paleidimas

```bash
# 1. Įdiegti priklausomybes
npm install

# 2. Paleisti serverį (1-as terminalas) – http://localhost:3001
npm run server

# 3. Paleisti React programėlę (2-as terminalas) – adresas rodomas terminale (pvz. http://localhost:5173)
npm run dev
```

Abu procesai turi veikti vienu metu.

## Demonstraciniai naudotojai (išgalvoti)

| Vardas | El. paštas | Slaptažodis |
| --- | --- | --- |
| Jonas Jonaitis | jonas@example.com | jonas123 |
| Ona Onaitė | ona@example.com | ona123 |

## Maršrutai

| Maršrutas | Turinys | Prieiga |
| --- | --- | --- |
| `/` | Pradžia | Vieša |
| `/login` | Prisijungimas | Vieša |
| `/register` | Registracija | Vieša |
| `/dashboard` | Receptų sąrašas (5 per puslapį) | Tik prisijungus |
| `/recipe/:id` | Recepto peržiūra | Tik prisijungus |
| `/favorites` | Mėgstamiausi receptai | Tik prisijungus |

## Projekto struktūra

```
src/
  api/          – užklausos (fetch) į json-server ir DummyJSON
  context/      – AuthContext + AuthProvider, FavoritesContext + FavoritesProvider
  components/   – Navbar, ProtectedRoute, RecipeCard, FavoriteButton, FormField, StatusMessage
  pages/        – Home, Login, Register, RecipeList, RecipeDetail, Favorites, NotFound
  utils/        – formų validacija
```

## API (json-server)

- `GET /users?email=...` – naudotojo paieška (registracijoje dublikatui tikrinti, prisijungime – duomenims patikrinti)
- `POST /users` – naujas naudotojas
- `GET /favorites?userId=...` – prisijungusio naudotojo mėgstamiausi
- `POST /favorites` – `{ userId, recipeId, name, image }`
- `DELETE /favorites/:id` – šalinama pagal įrašo `id`, ne pagal `recipeId`

## Mokomojo sprendimo ribos

Tai autentifikacijos imitacija: json-server neturi tikrų sesijų ir teisių tikrinimo, slaptažodžiai `db.json` saugomi atviru tekstu,
o `ProtectedRoute` apsaugo tik React puslapius, bet ne serverio duomenis. Tikrame projekte reikėtų serverio autentifikacijos,
slaptažodžių maišymo ir teisių tikrinimo kiekvienai užklausai.
