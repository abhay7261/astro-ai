# 🚀 AstroAI — Backend API Specification & Developer Handover Guide

> **Target Audience:** Backend Developer (Node.js/Express, Python/FastAPI, or Go/Java)  
> **Frontend Stack:** Next.js 16.4 (App Router, Turbopack, Tailwind CSS v4, TypeScript)  
> **Base URL Target:** `http://localhost:5000/api/v1` or `https://api.yourdomain.com/v1`

---

## 📋 1. Third-Party Credentials & Accounts Needed (Kya-kya Provide Karana Hai)

Apne dost ya backend dev ko ye 5 accounts/API keys arrange karni hongi:

| Service | Purpose | Recommended Free/Affordable Provider |
| :--- | :--- | :--- |
| **1. AI Model API Key** | AI Pandit Ji Chatbot (`/ai-chat`) ke jawab ke liye | **Google Gemini 1.5 Flash/Pro** (Free tier available) ya **OpenAI GPT-4o-mini** |
| **2. Payment Gateway** | ₹4 Trial + ₹299 UPI Auto-Pay Mandate (`/vip-pass`) ke liye | **Razorpay Subscriptions (AutoPay)** ya **Cashfree Subscriptions** / **PhonePe PG** |
| **3. Database** | Users, Astrologers, Reels, aur Chat logs store karne ke liye | **MongoDB Atlas** (Free M0 Cluster) ya **PostgreSQL (Supabase/Neon)** |
| **4. Media / Video Storage** | Astro Reels MP4 videos aur Astrologers ke avatars host karne ke liye | **Cloudinary** (Free 25GB) ya **AWS S3 / Supabase Storage** |
| **5. Push Notifications** | Admin panel se broadcast bhejne ke liye | **Firebase Cloud Messaging (FCM)** (100% Free) |

---

## 🌐 2. Complete List of Required APIs (Module-Wise)

### A. Authentication & User Profile (`/api/v1/auth` & `/api/v1/users`)

#### 1. User Login / Register
* **Method:** `POST /api/v1/auth/login`
* **Request Body:**
  ```json
  {
    "email": "sainiabhay070@gmail.com",
    "name": "Abhay Saini",
    "googleId": "optional_google_sub_token"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "jwt_access_token_here",
    "user": {
      "id": "u-101",
      "name": "Abhay",
      "email": "sainiabhay070@gmail.com",
      "walletBalance": 250,
      "isVIP": true,
      "trialExpiresAt": "2026-10-18T23:00:00Z"
    }
  }
  ```

#### 2. Update Display Name (Namaste ke baad change karne ke liye)
* **Method:** `PUT /api/v1/users/profile/name`
* **Request Body:** `{ "name": "Abhay Saini" }`
* **Response:** `{ "success": true, "name": "Abhay Saini" }`

---

### B. 24/7 AI Astrologer Chatbot (`/api/v1/ai`)

#### 1. Send Message to AI Pandit Ji
* **Method:** `POST /api/v1/ai/chat`
* **Request Body:**
  ```json
  {
    "message": "Meri shaadi kab tak hogi aur kya Manglik dosha hai?",
    "personaId": "ai-1",
    "history": [
      { "role": "user", "content": "Pranam Pandit Ji" },
      { "role": "assistant", "content": "Kalyan ho vats!..." }
    ],
    "userKundliDetails": {
      "dob": "1998-05-15",
      "tob": "14:30",
      "pob": "Jaipur, Rajasthan"
    }
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "reply": "Aapki kundli ke 7th house par Brihaspati ki shubh drishti 2027 ke pratham charan me vivah yog bana rahi hai...",
    "remedy": "Pratidin subah Surya Dev ko tambe ke lote se jal arpit karein aur Gayatri Mantra ka 108 baar jaap karein.",
    "mantra": "ॐ श्री गणेशाय नमः",
    "remainingFreeQuestions": 2
  }
  ```

---

### C. Verified Astrologers Directory (`/api/v1/astrologers`)

#### 1. Get All Astrologers (Sorted by Online status)
* **Method:** `GET /api/v1/astrologers`
* **Query Params:** `?category=all` or `?category=Love`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 6,
    "astrologers": [
      {
        "id": "astro-1",
        "name": "Acharya Vidyadhar Shastri",
        "title": "Vedic Astrologer & Kundli Expert",
        "category": "Kundli",
        "experience": "18+ Yrs Exp",
        "pricePerMin": 25,
        "rating": 4.95,
        "totalConsultations": "34.5K+",
        "image": "https://cdn.example.com/vidyadhar.jpg",
        "specialty": "Lagna Dosha, Graha Shanti",
        "isOnline": true
      }
    ]
  }
  ```

#### 2. Start Live Chat / Deduct Wallet Coins
* **Method:** `POST /api/v1/astrologers/:id/consult`
* **Request Body:** `{ "durationMinutes": 5 }`
* **Response:** `{ "status": "connected", "sessionId": "chat_session_8891" }`

---

### D. ₹4 Trial + ₹299 Auto-Debit UPI Mandate (`/api/v1/subscriptions`)

*Yeh fintech flow StoryTV/Kuku FM jaisa UPI e-mandate banata hai:*

#### 1. Create UPI Auto-Pay Mandate Order
* **Method:** `POST /api/v1/subscriptions/create-mandate`
* **Request Body:**
  ```json
  {
    "trialFee": 4,
    "trialDays": 3,
    "recurringAmount": 299,
    "upiApp": "phonepe"
  }
  ```
* **Backend Action:** Razorpay / Cashfree AutoPay Subscriptions API call karke `mandate_id` create karega.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "mandateId": "sub_mandate_99812",
    "orderId": "order_4inr_8829",
    "amount": 4,
    "currency": "INR"
  }
  ```

#### 2. Verify Mandate / Webhook
* **Method:** `POST /api/v1/subscriptions/verify-mandate`
* **Request Body:** `{ "mandateId": "sub_mandate_99812", "paymentId": "pay_9829" }`
* **Backend Action:** User profile ko `isVIP = true` mark karega aur `trialExpiresAt = now + 3 days` set karega.

#### 3. Cancel UPI Auto-Pay Mandate (1-Click Cancel)
* **Method:** `POST /api/v1/subscriptions/cancel-mandate`
* **Response:** `{ "success": true, "message": "Mandate cancelled. Agla koi deduction nahi hoga." }`

---

### E. Astro Reels Feed (`/api/v1/reels`)

#### 1. Get Reels Feed
* **Method:** `GET /api/v1/reels?page=1&limit=10`
* **Response:**
  ```json
  {
    "reels": [
      {
        "id": "reel-1",
        "title": "Shanivaar ko Shani Dev ko prasann karne ka 1 achook upay!",
        "astrologerName": "Acharya Vidyadhar",
        "videoUrl": "https://assets.mixkit.co/.../video.mp4",
        "likes": 1240,
        "commentsCount": 84,
        "tag": "#ShaniUpay"
      }
    ]
  }
  ```

#### 2. Like Reel
* **Method:** `POST /api/v1/reels/:id/like`

---

### F. Master Admin Controls (`/api/v1/admin`)

*Protected by Header `Authorization: Bearer <ADMIN_JWT_OR_PIN>`*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/admin/login` | Verify Master PIN (`7788`) and issue Admin Token |
| `GET` | `/api/v1/admin/analytics` | Total Reels, Revenue, Active UPI Mandates count |
| `POST` | `/api/v1/admin/astrologers` | Add new Astrologer profile |
| `DELETE` | `/api/v1/admin/astrologers/:id` | **Delete Astrologer** (Instantly removes from live app) |
| `PATCH` | `/api/v1/admin/astrologers/:id/status` | Toggle Online/Offline status |
| `POST` | `/api/v1/admin/ai-bots` | Add new AI Persona bot |
| `DELETE` | `/api/v1/admin/ai-bots/:id` | **Delete AI Bot Persona** |
| `POST` | `/api/v1/admin/reels` | Upload new video short |
| `DELETE` | `/api/v1/admin/reels/:id` | **Delete Reel video** |
| `PUT` | `/api/v1/admin/mandate-config` | Update ₹4 trial fee, 3 days trial, ₹299 auto-debit |
| `POST` | `/api/v1/admin/broadcast` | Send Firebase push notification to all users |

---

## 🛠️ 3. Quick Connection Guide (Frontend se Connect Kaise Hoga)

Frontend me environment variable set karke bas API URL connect karna hoga:

**`.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx
```

Jaise hi aapka dost ye API endpoints create kar dega, hum frontend ke mock calls ko 1 click me replace karke full production live kar denge!
