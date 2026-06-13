# 🚗 Automotive Service API

RESTful API for automotive service management (workshops, appointments, work orders, etc.).

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/AguriCano/automotive-service.git
cd automotive-service
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - MongoDB Atlas connection string (MONGO_URI)
   - JWT secret key (JWT_SECRET)
   - Port (optional, defaults to 3000)

## 🔐 Authentication

### Login Endpoint

Get a JWT token to access protected endpoints.

**POST** `/auth/login`

Request body:

```json
{
  "email": "admin@automotive.com",
  "password": "admin123"
}
```

Response (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

Use the token in Authorization header:

```
Authorization: Bearer <your-token-here>
```

## 📚 API Documentation

Once the server is running, access the Swagger documentation:

```
http://localhost:3000/api-docs
```

## 🗄️ Collections

### Clients

- **GET** `/clients` - Get all clients
- **GET** `/clients/:id` - Get specific client
- **POST** `/clients` - Create client (requires auth)
- **PUT** `/clients/:id` - Update client (requires auth)
- **DELETE** `/clients/:id` - Delete client (requires auth)

### Services

- **GET** `/services` - Get all services
- **GET** `/services/:id` - Get specific service
- **POST** `/services` - Create service (requires auth)
- **PUT** `/services/:id` - Update service (requires auth)
- **DELETE** `/services/:id` - Delete service (requires auth)

## ▶️ Running the Application

### Development (with nodemon):

```bash
npm run dev
```

### Production:

```bash
npm start
```

The server will start on the configured PORT (default: 3000).

## 🚀 Deployment to Render

1. Push your code to GitHub
2. Create account on Render.com
3. Connect your GitHub repository
4. Create a Web Service
5. Configure environment variables (MONGO_URI, JWT_SECRET)
6. Deploy - Your API will be available at: `https://your-app-name.onrender.com`
7. Swagger docs will be at: `https://your-app-name.onrender.com/api-docs`
