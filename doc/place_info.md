# API Places

> API untuk kebutuhan Mengambil Semua lokasi atau lokasi spesifik

## Get All Places

Get all places with return JSON Array Document

**URL**

?>`/places/`

**METHOD**

?>GET

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

## Get Places with Specific ID

Get specific place from ID with return JSON Array Document 

**URL**

?>`/places/:id`

**METHOD**

?>GET

**Response**
```json
{
    "id": int,
    "name": String,
    "city": String,
    "category": String,
    "description":String,
    "img_link": String
}
```
---

## Get Places with multiple name places

Get specific places from JSON input with return JSON Array Document 

**URL**

?>`/places/filter`

**METHOD**

?>POST

**Body Parameters (JSON):**

- `place_id`: int1, int2, etc 

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

## Like Places

Like place API

**URL**

?>`/places/likeplace`

**Authentication:**
This route requires Firebase authentication.

**METHOD**

?>POST

**Body Parameters (JSON):**

- `place_name`:  String, required

**Response**
```json
{
  "message": 'Thank you for your like'
}
```
---

## Get Liked Places

Get liked place API

**URL**

?>`/places/getlikeplace`

**Authentication:**
This route requires Firebase authentication.

**METHOD**

?>GET

**Body Parameters (JSON):**

- `place_name`:  String, required

**Response**
```json
{
  "message":"Success Get Data",
  "like":[
    {
      "name":"Test",
      "img_link":"https://storage.googleapis.com/roamer-storage/e96fa367-ac02-45f0-9a1a-7809939f5b16.png"
    },
    {
      "name":"Test",
      "img_link":"https://storage.googleapis.com/roamer-storage/e96fa367-ac02-45f0-9a1a-7809939f5b16.png"
    }
  ]
}
```
---

