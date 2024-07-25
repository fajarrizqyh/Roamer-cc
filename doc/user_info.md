# API User

>API untuk kebutuhan mengenai user seperti Login, Signup, dan Logout

## GetUser

Redirect to the home if authenticate, if not redirect to login

**URL**

?>`/user/`

**Authentication:**
This route requires Firebase authentication.

**Response**
```json
{
    "id": "string",
    "email": "string",
    "message": "Authorized",
    "name":"string"
}
```

---

## SIGNUP

Create a new user.

**URL**

?>`/user/signup`

**METHOD**

?>POST

**Body Parameters (JSON):**

- `name`: String, required
- `email`: String, required
- `password`: String, required

**Response**
```json
{
    "id": "string",
    "email": "string",
    "message": "User registered successfully"
}
```

---

## LOGIN

Authenticate a user.

**URL**

?>`/user/login`

**METHOD**

?>POST

**Body Parameters (JSON):**

- `email`: String, required
- `password`: String, required

**Response**
```json
{
    "message": "Login successful",
    "id": "string",
    "email": "string",
    "name":"string"
}
```
---

## Upload Preference

Upload user place preference

**URL**

?>`/user/preference`

**Authentication:**
This route requires Firebase authentication.

**METHOD**

?>POST

**Body Parameters (JSON):**

- `preference`: string_1, string_2, etc 

**Response**
```json
[
  {
    "id": int,
    "name": String,
    "city": String,
    "category": String,
    "description":String,
    "img_link": String
  },
  {
    "id": int,
    "name": String,
    "city": String,
    "category": String,
    "description":String,
    "img_link": String
  },
  {
    .......
  }
]
```
---

## LOGOUT

Logout a user.

**URL**

?>`/user/logout`

**METHOD**

?>GET

**Response**
```json
{
    "message": "Logout successful"
}
```
---