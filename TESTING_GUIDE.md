## 🧪 Testing Guide - Automotive Service API

This guide provides step-by-step instructions to test all endpoints.

### Prerequisites

- API running on Render: `https://your-app-name.onrender.com`
- cURL, Postman, or VS Code REST Client installed

---

## 1️⃣ AUTHENTICATION

### Login to get JWT Token

**Endpoint:** `POST /auth/login`

**Request:**

```bash
curl -X POST https://your-app-name.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@automotive.com",
    "password": "admin123"
  }'
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

**Save this token** - You'll use it for protected endpoints.

---

## 2️⃣ CLIENTS ENDPOINTS

### Get All Clients (Public)

**Endpoint:** `GET /clients`

```bash
curl https://your-app-name.onrender.com/clients
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John",
    "last_name": "Doe",
    "phone": "12345678",
    "email": "john@example.com",
    "address": "123 Main St",
    "dni": "12345678",
    "registration_date": "2026-05-27",
    "customer_status": "active"
  }
]
```

---

### Get Single Client (Public)

**Endpoint:** `GET /clients/{id}`

```bash
curl https://your-app-name.onrender.com/clients/507f1f77bcf86cd799439011
```

**Response (200):** Single client object

**Response (404):** If client not found

```json
{
  "error": "Client not found"
}
```

---

### Create New Client (Protected - Requires Token)

**Endpoint:** `POST /clients`

```bash
curl -X POST https://your-app-name.onrender.com/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane",
    "last_name": "Smith",
    "phone": "87654321",
    "email": "jane@example.com",
    "address": "456 Oak Ave",
    "dni": "98765432",
    "registration_date": "2026-05-28",
    "customer_status": "active"
  }'
```

**Response (201):**

```json
{
  "message": "Client created successfully",
  "id": "507f1f77bcf86cd799439012"
}
```

**Response (400):** Validation error

```json
{
  "errors": [
    "Name is required and must have at least 2 characters",
    "Valid email is required"
  ]
}
```

**Response (401):** No token provided

```json
{
  "error": "Access denied. No token provided.",
  "message": "Please provide a valid Bearer token in the Authorization header"
}
```

---

### Update Client (Protected - Requires Token)

**Endpoint:** `PUT /clients/{id}`

```bash
curl -X PUT https://your-app-name.onrender.com/clients/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John",
    "last_name": "Updated",
    "phone": "11111111",
    "email": "john.updated@example.com",
    "address": "789 Pine Rd",
    "dni": "11111111",
    "registration_date": "2026-05-27",
    "customer_status": "inactive"
  }'
```

**Response (200):**

```json
{
  "message": "Client updated successfully"
}
```

**Response (400):** Invalid ID format

```json
{
  "error": "Invalid client ID format"
}
```

---

### Delete Client (Protected - Requires Token)

**Endpoint:** `DELETE /clients/{id}`

```bash
curl -X DELETE https://your-app-name.onrender.com/clients/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**

```json
{
  "message": "Client deleted successfully"
}
```

**Response (404):** Client not found

```json
{
  "error": "Client not found"
}
```

---

## 3️⃣ SERVICES ENDPOINTS

### Get All Services (Public)

**Endpoint:** `GET /services`

```bash
curl https://your-app-name.onrender.com/services
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "license_plate": "ABC-1234",
    "model": "Civic",
    "brand": "Honda",
    "service_type": "Oil Change",
    "description": "Full synthetic oil change and filter replacement",
    "cost": 89.99,
    "entry_date": "2026-05-27",
    "delivery_date": "2026-05-28",
    "status": "pending"
  }
]
```

---

### Get Single Service (Public)

**Endpoint:** `GET /services/{id}`

```bash
curl https://your-app-name.onrender.com/services/507f1f77bcf86cd799439021
```

**Response (200):** Single service object

---

### Create New Service (Protected - Requires Token)

**Endpoint:** `POST /services`

```bash
curl -X POST https://your-app-name.onrender.com/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "license_plate": "XYZ-9876",
    "model": "Accord",
    "brand": "Honda",
    "service_type": "Tire Replacement",
    "description": "Replace all four tires with Michelin Defender",
    "cost": 450.00,
    "entry_date": "2026-05-28",
    "delivery_date": "2026-05-29",
    "status": "pending"
  }'
```

**Response (201):**

```json
{
  "message": "Service created successfully",
  "id": "507f1f77bcf86cd799439022"
}
```

---

### Update Service (Protected - Requires Token)

**Endpoint:** `PUT /services/{id}`

```bash
curl -X PUT https://your-app-name.onrender.com/services/507f1f77bcf86cd799439021 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "license_plate": "ABC-1234",
    "model": "Civic",
    "brand": "Honda",
    "service_type": "Oil Change",
    "description": "Oil change completed",
    "cost": 89.99,
    "entry_date": "2026-05-27",
    "delivery_date": "2026-05-28",
    "status": "completed"
  }'
```

**Response (200):**

```json
{
  "message": "Service updated successfully"
}
```

---

### Delete Service (Protected - Requires Token)

**Endpoint:** `DELETE /services/{id}`

```bash
curl -X DELETE https://your-app-name.onrender.com/services/507f1f77bcf86cd799439021 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**

```json
{
  "message": "Service deleted successfully"
}
```

---

## 🔐 Error Testing

### Test 1: Access Protected Endpoint Without Token

```bash
curl -X POST https://your-app-name.onrender.com/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","last_name":"User","email":"test@example.com","phone":"12345678","dni":"12345678"}'
```

**Expected Response (401):**

```json
{
  "error": "Access denied. No token provided.",
  "message": "Please provide a valid Bearer token in the Authorization header"
}
```

---

### Test 2: Validation Error (Missing Required Field)

```bash
curl -X POST https://your-app-name.onrender.com/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test",
    "phone": "12345678",
    "dni": "12345678"
  }'
```

**Expected Response (400):**

```json
{
  "errors": [
    "Last name is required and must have at least 2 characters",
    "Valid email is required"
  ]
}
```

---

### Test 3: Invalid Email Format

```bash
curl -X POST https://your-app-name.onrender.com/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test",
    "last_name": "User",
    "email": "invalid-email",
    "phone": "12345678",
    "dni": "12345678"
  }'
```

**Expected Response (400):**

```json
{
  "errors": ["Valid email is required"]
}
```

---

## 📊 Database Verification

To verify that data is actually being stored in MongoDB:

1. Go to MongoDB Atlas
2. Navigate to your cluster
3. Click "Collections"
4. Check `clients` collection for newly created clients
5. Check `services` collection for newly created services
6. Verify timestamps and data integrity

---

## ✅ Test Checklist

- [ ] Login returns valid JWT token
- [ ] GET /clients works without token
- [ ] GET /clients/:id works without token
- [ ] POST /clients returns 401 without token
- [ ] POST /clients returns 400 with invalid data
- [ ] POST /clients creates record with token (201)
- [ ] PUT /clients/:id updates record with token (200)
- [ ] DELETE /clients/:id removes record with token (200)
- [ ] Same tests work for /services endpoints
- [ ] Data appears in MongoDB after create/update
- [ ] Data is removed from MongoDB after delete
- [ ] Swagger UI is accessible at /api-docs

---

**All tests should pass before recording the video! ✅**
