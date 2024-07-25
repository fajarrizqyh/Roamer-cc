# API Log Activity

>API untuk CRUD Logbook activity

## Create LOG 

Create Log.

**URL**

?>`/activity/log`

**METHOD**

?>POST

**Body Parameters (JSON):**

- `place_id`: int, required
- `visited_time`: Date, required
- `text`: String, required
- `user_id`: int, required

**Response**
```json
{
    "message": "Log Created"
}
```
---

## Get All LOG 

Retrieve All LOG.

**URL**

?>`/activity/logs`

**METHOD**

?>GET

**Response**
```json
{
  ["all LOG"]
}
```
---

## Get One LOG

Retrieve One LOG.

**URL**

?>`/activity/log/:log_id`

**METHOD**

?>GET

**Response**
```json
{
    "log_id": "int" ,"place_id": "int" ,"visited_time":"date","text":"string","user_id":"int","created_at":"datetime"
}
```
---

## Update LOG

Update Log.

**URL**

?>`/activity/log/:log_id`

**METHOD**

?>PUT

**Body Parameters (JSON):**

- `place_id`: int, required
- `visited_time`: Date, required
- `text`: String, required
- `user_id`: int, required


**Response**
```json
{
    "message": "Log Updated"
}
```
---

## Delete LOG

Update Log.

**URL**

?>`/activity/log/:log_id`

**METHOD**

?>DELETE

**Response**
```json
{
    "message": "Log Deleted"
}
```
---