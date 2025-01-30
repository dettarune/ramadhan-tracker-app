# User API Spec

## Register User

Endpoint : POST /api/users

# Request Body :

```json
{
  "username" : "Detarune",
  "password" : "merekaAdmin123",
  "email" : "javakeren@gmail.com"
}
```

### Response Body (Success) : 

```json
{
  "message": "Sukses membuat akun dengan username Detarune"
}
```

### Response Body (Failed) :

```json
{
  "errors" : "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "Detarune",
  "password" : "merekaAdmin123"
}
```

### Response Body (Success) :

header: 'email'
```json
{
    "message": "Succes Send Verif Token To: ${javakeren@gmail.com}, Please Check Your Email"

}
```

### Response Body (Failed) :

```json
{
  "errors" : "Username or password is wrong"
}
```

## Verify User

Endpoint: POST /api/users/verify

### Request Body :

```json
{
  "token": "6digit"
}
```

### Response Body (Succes): 

Return Cookies key:"Authorization" val:"jwtTokenSession"
```json
{
  "message": "Login Succes"
}
```

### Response Body (Failed): 

```json
{
  "errors": "Token Invalid"
}
```


## Get User Info

Endpoint : GET /api/users/me

### Request (Cookies)
Cookies :
- Authorization: jwtToken (ini auto ngirim biasanya)

### Response Body (Success) :

```json
{
    "message": "Succes Get Faiz's Info!",
    "data": {
        "id": 2,
        "username": "Faiz",
        "password": "$2b$10$n9iYb/n15Tm0LgE6n9.FcubYqT3OQK0edmUIeE4l9OCS3Lnuue3.6",
        "email": "snopal75@gmail.com",
        "budget": "0",
        "created_at": "2025-01-28T23:09:59.390Z",
        "updated_at": "2025-01-28T23:09:59.390Z",
        "role": "wargaSipil",
        "usiaAkun": "1 hari."
    }
}
```

### Response Body (Failed) :

```json
{
  "errors" : "User Not Found"
}
```


## Logout User

Endpoint : DELETE /api/users/me

### Request
Cookie :
- Authorization: jwtToken (biasanya auto dikirim klo dah login)

### Response Body (Success) :

clearCookie key:"Authorization"
```json
{
    "message": "User successfully logged out"
}
```

### Response Body (Failed) 

```json
{
  "errors" : "User Not Found"
}
```
