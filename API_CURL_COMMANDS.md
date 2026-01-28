# Mini CRM API - cURL Commands

Base URL(currently hosted in railway): `https://mini-crm-production-f915.up.railway.app`

## Table of Contents
- [Authentication](#authentication)
- [Users Management](#users-management)
- [Customers Management](#customers-management)
- [Tasks Management](#tasks-management)

---

## Authentication

### Register a New User
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "EMPLOYEE"
  }'
```

**Available Roles:** `ADMIN`, `EMPLOYEE`

### Login
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

**Response includes `accessToken` - save this for authenticated requests.**

---

## Users Management

**Note:** All user endpoints require Admin role.

### Get All Users
```bash
curl -X GET https://mini-crm-production-f915.up.railway.app/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User by ID
```bash
curl -X GET https://mini-crm-production-f915.up.railway.app/api/users/{userId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update User Role
```bash
curl -X PATCH https://mini-crm-production-f915.up.railway.app/api/users/{userId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN"
  }'
```

---

## Customers Management

### Create a Customer (Admin Only)
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/customers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp"
  }'
```

### Get All Customers (with Pagination & Search)
```bash
# Basic - Get first page with default limit (10)
curl -X GET "https://mini-crm-production-f915.up.railway.app/api/customers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With pagination
curl -X GET "https://mini-crm-production-f915.up.railway.app/api/customers?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With search (searches name, email, phone, company)
curl -X GET "https://mini-crm-production-f915.up.railway.app/api/customers?search=acme" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Combined: pagination + search
curl -X GET "https://mini-crm-production-f915.up.railway.app/api/customers?page=2&limit=15&search=john" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Customer by ID
```bash
curl -X GET https://mini-crm-production-f915.up.railway.app/api/customers/{customerId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Customer (Admin Only)
```bash
curl -X PATCH https://mini-crm-production-f915.up.railway.app/api/customers/{customerId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "+9876543210",
    "company": "Updated Corp"
  }'
```

**Note:** All fields are optional in update.

### Delete Customer (Admin Only)
```bash
curl -X DELETE https://mini-crm-production-f915.up.railway.app/api/customers/{customerId} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Tasks Management

### Create a Task (Admin Only)
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Follow up call",
    "description": "Call the customer to confirm details",
    "assignedTo": "user-id-123",
    "customerId": "customer-id-123",
    "status": "PENDING"
  }'
```

**Available Status Values:** `PENDING`, `IN_PROGRESS`, `COMPLETED`

### Get All Tasks
```bash
curl -X GET https://mini-crm-production-f915.up.railway.app/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Note:** 
- Admins see all tasks
- Employees see only their assigned tasks

### Update Task Status
```bash
curl -X PATCH https://mini-crm-production-f915.up.railway.app/api/tasks/{taskId}/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

**Note:** 
- Employees can only update their own tasks
- Admins can update any task

---

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email/phone)

---

## Example Workflow

### 1. Register as Admin
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123456",
    "role": "ADMIN"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

Save the `accessToken` from the response.

### 3. Create an Employee
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Employee User",
    "email": "employee@example.com",
    "password": "employee123",
    "role": "EMPLOYEE"
  }'
```

### 4. Create a Customer
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/customers \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer@test.com",
    "phone": "+1234567890",
    "company": "Test Corp"
  }'
```

Save the customer `id` from the response.

### 5. Create a Task
```bash
curl -X POST https://mini-crm-production-f915.up.railway.app/api/tasks \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Contact customer",
    "description": "Initial contact call",
    "assignedTo": "EMPLOYEE_USER_ID",
    "customerId": "CUSTOMER_ID",
    "status": "PENDING"
  }'
```

### 6. Employee Updates Task
Login as employee and update the task:
```bash
# First, login as employee to get their token
curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "employee123"
  }'

# Then update task status
curl -X PATCH https://mini-crm-production-f915.up.railway.app/api/tasks/{taskId}/status \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

---

## Tips

1. **Replace Placeholders:**
   - `YOUR_ACCESS_TOKEN` - with actual JWT token from login
   - `{userId}`, `{customerId}`, `{taskId}` - with actual IDs

2. **Testing with Pretty Output:**
   Add `| jq` to format JSON responses:
   ```bash
   curl ... | jq
   ```

3. **Save Token to Variable:**
   ```bash
   TOKEN=$(curl -X POST https://mini-crm-production-f915.up.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123456"}' \
     | jq -r '.accessToken')
   
   # Then use $TOKEN in subsequent requests
   curl -X GET https://mini-crm-production-f915.up.railway.app/api/users \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **View Full Response Headers:**
   Add `-v` flag for verbose output:
   ```bash
   curl -v ...
   ```
