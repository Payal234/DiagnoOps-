# DiagnoOps Backend API Documentation

## Super Admin API Endpoints

Base URL: `http://localhost:5000/api/superadmin`

### 1. Register Super Admin

**Endpoint:** `POST /api/superadmin/register`

**Description:** Create a new super admin account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "admin@example.com",
  "password": "securepassword123",
  "organizationName": "DiagnoOps Healthcare",
  "phoneNumber": "+1234567890"
}
```

**Validation:**
- All fields are required
- Email must be valid format
- Password must be at least 8 characters
- Email must be unique

**Success Response (201):**
```json
{
  "message": "Super admin registered successfully",
  "token": "jwt-token-here",
  "superAdmin": {
    "id": "admin-id",
    "fullName": "John Doe",
    "email": "admin@example.com",
    "organizationName": "DiagnoOps Healthcare",
    "phoneNumber": "+1234567890",
    "role": "superadmin"
  }
}
```

**Error Responses:**
- `400` - Validation error (missing fields, invalid email/password)
- `409` - Email already exists
- `500` - Server error

---

### 2. Login Super Admin

**Endpoint:** `POST /api/superadmin/login`

**Description:** Authenticate super admin and get access token

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "superAdmin": {
    "id": "admin-id",
    "fullName": "John Doe",
    "email": "admin@example.com",
    "organizationName": "DiagnoOps Healthcare",
    "phoneNumber": "+1234567890",
    "role": "superadmin",
    "lastLogin": "2026-03-12T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `404` - Super admin not found
- `401` - Invalid password
- `403` - Account deactivated
- `500` - Server error

---

### 3. Get Super Admin Profile (Protected)

**Endpoint:** `GET /api/superadmin/profile/:id`

**Description:** Get super admin profile details

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "superAdmin": {
    "id": "admin-id",
    "fullName": "John Doe",
    "email": "admin@example.com",
    "organizationName": "DiagnoOps Healthcare",
    "phoneNumber": "+1234567890",
    "role": "superadmin",
    "isActive": true,
    "createdAt": "2026-03-12T10:00:00.000Z",
    "lastLogin": "2026-03-12T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Invalid or expired token
- `403` - Insufficient privileges
- `404` - Super admin not found
- `500` - Server error

---

### 4. Update Super Admin Profile (Protected)

**Endpoint:** `PUT /api/superadmin/profile/:id`

**Description:** Update super admin profile information

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "organizationName": "Updated Healthcare",
  "phoneNumber": "+9876543210"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "superAdmin": {
    "id": "admin-id",
    "fullName": "Jane Doe",
    "email": "admin@example.com",
    "organizationName": "Updated Healthcare",
    "phoneNumber": "+9876543210",
    "role": "superadmin"
  }
}
```

**Error Responses:**
- `401` - Invalid or expired token
- `403` - Insufficient privileges
- `404` - Super admin not found
- `500` - Server error

---

## Frontend Integration Example

### Register Super Admin

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/superadmin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        organizationName: formData.organizationName,
        phoneNumber: formData.phoneNumber
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('superAdmin', JSON.stringify(data.superAdmin));
      // Redirect to dashboard
      console.log('Registration successful:', data);
    } else {
      // Handle error
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Login Super Admin

```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/superadmin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('superAdmin', JSON.stringify(data.superAdmin));
      // Redirect to dashboard
      console.log('Login successful:', data);
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Get Profile (Authenticated)

```javascript
const getProfile = async (adminId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5000/api/superadmin/profile/${adminId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Profile:', data.superAdmin);
    } else {
      console.error('Failed to fetch profile:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Environment Variables

Create a `.env` file in the backend folder:

```env
MONGO_URL=your-mongodb-connection-string
PORT=5000
JWT_SECRET=your-secret-key-here
```

---

## Running the Backend

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

---

## Database Schema

### SuperAdmin Model

```javascript
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  organizationName: String (required),
  phoneNumber: String (required),
  role: String (default: 'superadmin', immutable),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  lastLogin: Date
}
```
