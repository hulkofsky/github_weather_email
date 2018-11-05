# Get weather for github user

A simple api which takes github users email and location and sends him weather forecast from https://openweathermap.org/api via email. Technologies used: NodeJs/Express, Knex/Bookshelf, PostgreSQL, Nodemailer.

## Installation
1) Install [NodeJs](https://nodejs.org/en/download/) 
2) Install [PostgreSQL](https://www.postgresql.org/download/)
3) Create database named "backend_test" with user - username: "cubex", password "cubex".
4) Run following commands in console:
```bash
git clone https://github.com/hulkofsky/github_weather_email
```
```bash
cd github_weather_email
```
Rename "example.env" to ".env"
```bash
node_modules/.bin/knex migrate:latest
```
```bash
node_modules/.bin/knex seed:run
```
```bash
npm i
```
```bash
npm run start
```
## API documentation

1) Register a new user:

- Route: /register

- Request(form-data): 
```json
{
    email: String,
    password: String,
    avatar: Image,
}
```

- Response:
```json
{
    "success": Boolean,
    "token": String,
    "avatar": String
}
```


2) Login as registered user:

- Route: /login

- Request(x-www-form-urlencoded): 
```json
{
    email: String,
    password: String
}
```

- Response:
```json
{
    "success": Boolean,
    "user": {
        "email": String,
        "id": Number,
        "password": String,
        "avatar": String,
        "token": String
    }
}
```
3) Send weather forecast to github user:
- Route: /:userId/getweather

- Request(x-www-form-urlencoded): 
```json
{
    username: String
    message: String
}
```
- Response:
```json
{
    "success": Boolean,
    "status": String,
    "message": String
}
```
## License
[ISC](https://choosealicense.com/licenses/isc/)