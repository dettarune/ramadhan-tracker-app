# Daily Budget API

## Deskripsi
API untuk aplikasi Daily Budget yang memungkinkan pengguna untuk melakukan registrasi, login, verifikasi email, pemulihan akun, serta menghitung luas dan keliling persegi panjang.

## Endpoints

### 1. **Sign Up**
- **URL**: `/api/users/`
- **Method**: `POST`
- **Body**: 
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
Response:
json
Copy
{
  "message": "Akun Dengan Username {username} Berhasil Didaftarkan, Silahkan Cek Email untuk Verifikasi",
  "data": { 
    "username": "string",
    "email": "string"
  }
}
2. Verify Account
URL: /api/users/verify
Method: POST
Headers:
email: string (Email yang digunakan saat sign up)
Body:
json
Copy
{
  "token": "string"
}
Response:
json
Copy
{
  "message": "Login Success!",
  "token": "jwtToken"
}
3. Login
URL: /api/users/login
Method: POST
Body:
json
Copy
{
  "username": "string",
  "password": "string"
}
Response:
json
Copy
{
  "message": "Succes Send Verif Token To: {email}",
  "email": "string"
}
4. Get User by ID
URL: /api/users/{id}
Method: GET
Params:
id: number (ID user)
Response:
json
Copy
{
  "userInfo": {
    "username": "string",
    "password": "string",
    "email": "string",
    "created_at": "date",
    "money": "number"
  }
}
5. Recovery
URL: /api/users/recovery
Method: POST
Body:
json
Copy
{
  "email": "string"
}
Response:
json
Copy
{
  "message": "Succes Send Recovery Token To: {email}"
}
