# ♻️ RecyConnect

**From Scrap to Formal Recycling**

RecyConnect is a full-stack MVP that connects informal e-waste collectors (kabadiwalas/scrap collectors) with authorized recyclers. The platform is designed to make e-waste collection more transparent, improve collector earnings, and move end-of-life electronics into the formal recycling ecosystem.

> **Project status:** MVP / Demo  
> **Primary stack:** React + TypeScript + Vite + Express + Google Gemini AI  
> **Target:** Mobile-first collector experience with recycler and admin portals

---

## 🚀 Problem Statement

A large share of India's end-of-life electronics reaches recyclers through informal scrap dealers, waste-pickers, and local aggregators. These collectors provide important last-mile collection but often operate outside the formal recycling ecosystem.

RecyConnect addresses this gap by providing a simple digital workflow:

**Collect → Identify → Price → Match → Sell → Handover → Payment → Track**

The application helps collectors identify e-waste, understand indicative market prices, find suitable recyclers, and track their earnings while giving recyclers a structured view of incoming material.

---

## 🎯 Key Objectives

- Bring informal e-waste collectors into a more formal digital ecosystem.
- Use AI-assisted image classification to identify common e-waste categories.
- Provide indicative material buying prices.
- Match collected materials with recyclers that accept those materials.
- Support pickup/service-area information.
- Track lots, offers, and transactions.
- Provide collector earnings visibility.
- Provide safety guidance in Hindi with text-to-speech.
- Support basic offline operation and synchronization.
- Give administrators platform-level analytics and demo-data controls.

---

## ✨ Features

### 🧑‍🔧 Collector Portal

The collector experience is optimized for a mobile-sized interface.

- Hindi-friendly interface
- Online/offline status indicator
- Camera-based e-waste capture
- AI-assisted material classification
- Material categories:
  - PCB
  - Cable
  - Battery
  - Motor
  - Mixed Plastics
- Lot creation and tracking
- Estimated material value
- Recycler matching
- Indicative market prices
- Earnings dashboard
- Transaction history
- Safety guide
- Hindi text-to-speech safety instructions
- Offline request queue and local cache

### 🏭 Recycler Portal

Recycler users can:

- View a dashboard
- See incoming e-waste lots
- Review material category and weight
- View estimated lot value
- View lot status
- View transaction records
- Work with recycler profiles containing:
  - Accepted materials
  - Authorization number/status
  - Facility location
  - Contact details
  - Pickup availability
  - Service radius

### 📊 Admin Portal

The admin dashboard provides:

- Platform analytics
- Total lots
- Material recycled
- Value handled
- Average collector earnings
- Unit-economics demo
- Reset demo data
- Dataset export placeholder
- Users/recyclers module placeholder
- Anomaly detection module placeholder

---

## 🤖 AI Classification

RecyConnect integrates Google's Gemini API through the backend.

When a collector captures an image, the backend sends the image to Gemini and requests classification into one of the supported categories:

```text
PCB
Cable
Battery
Motor
Mixed Plastics
```

The AI response contains:

```json
{
  "category": "PCB",
  "confidence": 0.94
}
```

If a Gemini API key is not configured, the application uses a demo fallback classification so the MVP can still be demonstrated.

### AI endpoint

```http
POST /api/ai/classify
Content-Type: application/json
```

Request:

```json
{
  "imageBase64": "data:image/jpeg;base64,..."
}
```

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       Collector App         │
│ React + TypeScript          │
│ Camera / Prices / Earnings  │
│ Safety / Recycler Matching  │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       Express Server        │
│                             │
│ /api/materials              │
│ /api/recyclers              │
│ /api/lots                   │
│ /api/offers                 │
│ /api/transactions           │
│ /api/ai/classify            │
└───────┬───────────┬─────────┘
        │           │
        ▼           ▼
┌─────────────┐  ┌──────────────┐
│ JSON DB     │  │ Gemini API   │
│ Local file  │  │ AI classify  │
└─────────────┘  └──────────────┘

        ▲
        │
┌───────┴─────────────────────┐
│ Recycler Portal / Admin     │
│ React + React Router        │
└─────────────────────────────┘
```

---

## 🧰 Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Recharts
- Motion
- React Webcam

### Backend

- Node.js
- Express
- TypeScript
- CORS
- dotenv
- JSON file-based database

### AI

- Google Gemini API
- `@google/genai`
- Gemini 2.5 Flash

### Offline Support

- IndexedDB
- `idb`
- Local cache
- Sync queue
- Browser online/offline events

---

## 📁 Project Structure

```text
recyconnect/
├── backend/
│   ├── db/
│   │   └── index.ts
│   └── seed.ts
│
├── public/
│   └── assets/
│
├── src/
│   ├── lib/
│   │   └── offline.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminApp.tsx
│   │   ├── collector/
│   │   │   ├── CaptureImage.tsx
│   │   │   ├── CollectorApp.tsx
│   │   │   ├── CollectorHome.tsx
│   │   │   ├── Earnings.tsx
│   │   │   ├── LotDetails.tsx
│   │   │   ├── Prices.tsx
│   │   │   ├── RecyclerMatch.tsx
│   │   │   └── Safety.tsx
│   │   └── recycler/
│   │       └── RecyclerApp.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── .env.example
├── index.html
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔄 Core User Flow

### Collector Flow

```text
Open RecyConnect
      ↓
Collector Portal
      ↓
Capture E-Waste Image
      ↓
AI Classification
      ↓
Enter / Confirm Weight & Condition
      ↓
Create E-Waste Lot
      ↓
View Estimated Value
      ↓
Find Matching Recyclers
      ↓
Receive / Review Offer
      ↓
Accept Offer
      ↓
Handover Material
      ↓
Recycler Confirmation
      ↓
Payment
      ↓
Completed Transaction
```

### Recycler Flow

```text
Recycler Dashboard
      ↓
Incoming Lots
      ↓
Review Material
      ↓
Make / Process Offer
      ↓
Handover
      ↓
Confirm Receipt
      ↓
Transaction Completed
```

---

## 🗄️ Data Model

The application currently uses a lightweight JSON database.

### Collector

```ts
Collector {
  id
  name
  language
  general_location
  created_at
}
```

### Recycler

```ts
Recycler {
  id
  name
  facility_location
  latitude
  longitude
  materials_accepted[]
  authorization_number
  authorization_status
  contact
  pickup_available
  service_area
}
```

### Material Price

```ts
MaterialPrice {
  id
  material_category
  buying_price_min
  buying_price_max
  unit
}
```

### Lot

```ts
Lot {
  id
  collector_id
  material_category
  weight
  condition
  image_reference
  estimated_value_min
  estimated_value_max
  status
  created_at
  ai_confidence
  collection_location
}
```

### Offer

```ts
Offer {
  id
  lot_id
  recycler_id
  quoted_price
  pickup_available
  status
  created_at
}
```

### Transaction

```ts
Transaction {
  id
  lot_id
  collector_id
  recycler_id
  final_price
  handover_reference
  payment_status
  transaction_status
  created_at
}
```

---

## 🔌 API Reference

### Health

```http
GET /api/health
```

### Materials

```http
GET /api/materials
```

Returns available material categories and indicative buying prices.

### Recyclers

```http
GET /api/recyclers
```

Returns recycler profiles.

### Recycler Matching

```http
GET /api/recyclers/match?material=PCB
```

Returns recyclers that accept the requested material.

### Create Lot

```http
POST /api/lots
```

Creates a new e-waste lot.

### Get Lots

```http
GET /api/lots
```

Optional collector filter:

```http
GET /api/lots?collector_id=c1
```

### Get Single Lot

```http
GET /api/lots/:id
```

### Update Lot

```http
PUT /api/lots/:id
```

### Create Offer

```http
POST /api/offers
```

Creating an offer also changes the associated lot status to `OFFER_RECEIVED`.

### Get Offers

```http
GET /api/offers
```

Optional lot filter:

```http
GET /api/offers?lot_id=EW-123
```

### Create Transaction

```http
POST /api/transactions
```

### Get Transactions

```http
GET /api/transactions
```

Optional collector filter:

```http
GET /api/transactions?collector_id=c1
```

### Update Transaction

```http
PUT /api/transactions/:id
```

### Reset Demo Database

```http
POST /api/reset
```

---

## 💻 Local Development

### Prerequisites

Install:

- Node.js 18+ recommended
- npm
- A Google Gemini API key for live AI classification

### 1. Extract the project

```bash
unzip recyconnect.zip
cd recyconnect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

> Do not commit `.env.local` or expose your Gemini API key in frontend code.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The Express server starts on port `3000` and Vite serves the React application during development.

---

## 🏭 Production Build

Build the frontend and bundled server:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The production server serves the built Vite application from the `dist` directory.

---

## 🧪 Type Checking

Run:

```bash
npm run lint
```

This executes TypeScript checking without emitting compiled files.

---

## 🌱 Demo Data

The project includes seed data for demonstration.

Sample materials include:

| Material | Indicative Price |
|---|---:|
| PCB | ₹150–₹190/kg |
| Cable | ₹80–₹120/kg |
| Battery | ₹70–₹110/kg |
| Motor | ₹90–₹140/kg |
| Mixed Plastics | ₹15–₹25/kg |

The seed data also includes sample recyclers, a collector profile, and completed demo transactions.

The data is stored locally in:

```text
recyconnect-data.json
```

This file is generated at runtime and is not part of the source archive.

---

## 📱 Offline Capability

The collector application includes basic offline support using IndexedDB.

The offline module provides:

- `sync_queue` for pending API requests
- `local_cache` for cached data
- Automatic sync when the browser comes back online

This is particularly important for collectors who may operate in locations with unreliable connectivity.

---

## 🔐 Security & Production Considerations

This repository is an MVP and should not be considered production-ready.

Before production deployment, implement:

- User authentication and authorization
- Secure password/OTP handling
- Role-based access control
- Database such as PostgreSQL/MySQL instead of JSON storage
- Input validation and schema validation
- Rate limiting
- Secure CORS configuration
- API authentication
- Encrypted sensitive data
- Secure image storage
- Audit logs
- Proper payment integration
- Recycler authorization verification against authoritative records
- Real-time market-price data
- Production monitoring and error tracking

---

## ⚠️ Current MVP Limitations

Some functionality is intentionally simplified for demonstration:

- Prices are seeded demo values rather than live market rates.
- AI has a fallback classification when the Gemini key is unavailable.
- Recycler and admin authentication is not implemented.
- Some admin functions are UI placeholders.
- Dataset export is currently a mock action.
- Recycler review/offer workflow is only partially implemented in the UI.
- Payments are represented as transaction states rather than integrated payment processing.
- The database is a local JSON file.
- Recycler authorization records are demo data.
- Location/service-area matching is represented in the data model but is not a complete geospatial matching system.

---

## 🛣️ Future Roadmap

### Phase 1 — MVP

- [x] Collector portal
- [x] Recycler portal
- [x] Admin dashboard
- [x] AI e-waste classification
- [x] Indicative pricing
- [x] Recycler matching
- [x] Lot tracking
- [x] Transaction tracking
- [x] Earnings dashboard
- [x] Safety guidance
- [x] Basic offline queue

### Phase 2 — Productionization

- [ ] Authentication and role-based access
- [ ] PostgreSQL database
- [ ] Cloud image storage
- [ ] Real recycler verification
- [ ] Real-time price feeds
- [ ] GPS-based recycler matching
- [ ] Push notifications
- [ ] WhatsApp/SMS integration
- [ ] Digital receipts
- [ ] Payment gateway / UPI integration
- [ ] Advanced analytics

### Phase 3 — Scale

- [ ] Multi-language voice-first experience
- [ ] Collector reputation/trust score
- [ ] Route optimization for pickup
- [ ] Recycler capacity management
- [ ] EPR reporting integration
- [ ] Automated compliance reports
- [ ] Fraud/anomaly detection
- [ ] Producer/recycler dashboards
- [ ] State/city-level recycling analytics

---

## 🌍 Social & Environmental Impact

RecyConnect is designed around three major outcomes:

### 1. Better Collector Income

Transparent indicative prices and direct recycler discovery can help collectors make more informed selling decisions.

### 2. Safer E-Waste Handling

The safety module promotes safer handling practices such as avoiding cable burning, handling batteries carefully, and wearing protective gloves.

### 3. More Formal Recycling

Connecting collectors with verified/authorized recyclers can help move e-waste from informal disposal channels toward formal recycling pathways.

---

## 🤝 Contributing

Contributions are welcome.

A typical workflow:

```bash
git clone <repository-url>
cd recyconnect
npm install
npm run dev
```

Create a feature branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, and submit a pull request.

---

## 📄 License

Add the project's intended open-source or proprietary license here before public distribution.

---

## 👥 Project

**RecyConnect**  
**Tagline:** *From Scrap to Formal Recycling*

Built as an MVP to demonstrate how AI, digital marketplaces, offline-first workflows, and recycler matching can help integrate informal e-waste collectors into a more transparent formal recycling ecosystem.
