# 🚀 OpenD – NFT Marketplace (Local Edition)

A full-stack NFT Marketplace inspired by OpenSea, rebuilt to run entirely on a local development environment without blockchain dependencies.

The original project was based on the Internet Computer Protocol (ICP), Motoko, and Canisters. This version replaces the blockchain layer with a traditional backend built using **Node.js, Express, PostgreSQL, and Prisma**, making it easier to develop, test, and deploy while preserving the core marketplace workflow.

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 🎨 Mint and list NFTs
- 📤 Upload NFT images
- 🛍 Browse marketplace listings
- 🔍 Search and filter NFTs
- 💰 Purchase NFTs
- 🔄 Automatic ownership transfer
- 📜 Transaction history
- 👤 My NFTs dashboard
- 📱 Responsive user interface

---

## 🏗 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- React Hook Form
- Bootstrap

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer

### Database
- PostgreSQL
- Prisma ORM

---

# 📁 Project Structure

```text
OpenD/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   │
│   ├── package.json
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── uploads/
│   ├── lib/
│   ├── app.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# ⚙ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/opend.git

cd opend
```

---

## 2. Install Dependencies

From the project root

```bash
npm install
```

---

## 3. Configure PostgreSQL

Create a database

```sql
CREATE DATABASE opend;
```

Copy

```
server/.env.example
```

to

```
server/.env
```

Configure

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/opend?schema=public"

JWT_SECRET=your_secret_key
```

---

## 4. Run Database Migration

```bash
npm run migrate
```

This command creates the database tables using Prisma.

---

# ▶ Running the Project

Start the backend

```bash
npm run server
```

Backend runs on

```
http://localhost:5000
```

Open another terminal and start the frontend

```bash
npm start
```

Frontend runs on

```
http://localhost:3000
```

---

# 🛒 Marketplace Workflow

### Create NFT

- Login
- Upload image
- Enter NFT details
- Set price
- Publish

---

### Buy NFT

When a user purchases an NFT:

- Verify the NFT exists
- Check ownership
- Mark NFT as sold
- Transfer ownership
- Record transaction
- Remove NFT from Discover
- Display NFT in My NFTs

---

# 📡 REST API

## Authentication

| Method | Endpoint |
|----------|----------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |

---

## NFT

| Method | Endpoint |
|----------|---------------------|
| POST | /api/nft/create |
| GET | /api/nft |
| GET | /api/nft/:id |
| PUT | /api/nft/buy/:id |

---

## User

| Method | Endpoint |
|----------|-----------------------|
| GET | /api/user/my-nfts |

---

## Transactions

| Method | Endpoint |
|----------|--------------------------|
| GET | /api/transactions |

---

# 🗄 Database Models

### User

- id
- username
- email
- password
- NFTs
- Transactions

---

### NFT

- id
- title
- description
- image
- price
- ownerId
- creatorId
- category
- isSold

---

### Transaction

- id
- buyerId
- sellerId
- nftId
- amount
- purchasedAt

---

# 🎯 Key Highlights

- Complete NFT marketplace workflow
- Local development without blockchain dependencies
- JWT-based authentication
- Image upload support
- Ownership transfer logic
- Transaction history
- Responsive React interface
- Clean REST API architecture
- Prisma ORM with PostgreSQL

---

# 🔮 Future Improvements

- Wishlist
- User profiles
- NFT collections
- Favorites
- Admin dashboard
- Stripe payment integration
- Cloudinary image storage
- Docker support
- Email verification
- Dark mode

---

# 👨‍💻 Author

**Avinish Kumar Mahato**

Software Engineering Student

Areas of Interest

- Full Stack Development
- Machine Learning
- Artificial Intelligence
- Generative AI
- Computer Vision

---
