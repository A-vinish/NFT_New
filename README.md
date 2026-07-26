<!-- npm run server
npm start -->

# OpenD — NFT Marketplace (local, no blockchain)

A local rebuild of the OpenD NFT marketplace — no Internet Computer, DFX,
Motoko, canisters, or Internet Identity. Same UI and feature set (mint,
discover, buy, own, track purchase history), backed by Express +
PostgreSQL instead of a blockchain.

## Stack

- **Client:** React 18, React Router v5, Axios, react-hook-form, Bootstrap
- **Server:** Node.js, Express, JWT auth, Multer (image uploads)
- **Database:** PostgreSQL via Prisma ORM

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (e.g. `brew install postgresql` / `apt install postgresql`, or a GUI like Postgres.app)

## Setup

```bash
# 1. Create an empty database
createdb opend
# (or: psql -U postgres -c "CREATE DATABASE opend;")

# 2. From the project root, install everything
npm install

# 3. Configure the server
cp server/.env.example server/.env
# edit server/.env — set DATABASE_URL to match your Postgres user/password,
# and set JWT_SECRET to any long random string

# 4. Create the database tables
npm run migrate
```

`npm run migrate` runs `prisma migrate dev`, which reads `server/prisma/schema.prisma`
and creates the `User`, `NFT`, and `Transaction` tables in your database.

## Run

Two terminals, from the project root:

```bash
npm run server   # Express API on http://localhost:5000
npm start        # React app on http://localhost:3000
```

The client's `package.json` proxies `/api/*` to `http://localhost:5000` in
development, so no CORS setup is needed.

## Project structure

```
client/                 React frontend
  src/
    api/axios.js          axios instance + JWT interceptor
    context/               AuthContext (login/register/logout)
    components/             Header, Gallery, Item, Minter, NFTDetails, Login, Register, PurchaseHistory
server/                  Express backend
  prisma/schema.prisma     User / NFT / Transaction models (PostgreSQL)
  lib/prisma.js             shared PrismaClient instance
  controllers/               request handlers
  routes/                     REST endpoints
  middleware/                  JWT auth guard, Multer upload config
  uploads/                      uploaded NFT images (served at /uploads/<file>)
```

## API

| Method | Route                 | Auth | Description                          |
|--------|------------------------|------|--------------------------------------|
| POST   | `/api/auth/register`   | —    | Create an account                    |
| POST   | `/api/auth/login`      | —    | Log in, returns a JWT                |
| GET    | `/api/auth/me`         | ✓    | Current user                         |
| POST   | `/api/nft/create`      | ✓    | Mint/list an NFT (multipart upload)  |
| GET    | `/api/nft`             | —    | Discover feed; `?search=&category=`  |
| GET    | `/api/nft/:id`         | —    | NFT details                          |
| PUT    | `/api/nft/buy/:id`     | ✓    | Buy an NFT                           |
| GET    | `/api/user/my-nfts`    | ✓    | NFTs the current user owns           |
| GET    | `/api/transactions`    | ✓    | Purchase/sale history                |

## Buying flow

`PUT /api/nft/buy/:id` does exactly what a canister transfer used to do,
but as one Postgres transaction:

1. Confirm the NFT exists and isn't already sold
2. Confirm the buyer isn't the current owner
3. Flip `isSold` to true and reassign `ownerId` to the buyer
4. Insert a `Transaction` row (seller, buyer, price)

The Discover feed only ever queries `isSold: false`, so a bought NFT
disappears from Discover and shows up in the buyer's My NFTs automatically
— no extra bookkeeping needed on the frontend.


