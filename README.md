# ToDo API

A simple RESTful API for managing tasks using Node.js and Express. Includes unit tests and Docker support.

## Scripts

- `npm start` — run the server
- `npm test` — run Jest tests

## Docker

```bash
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```