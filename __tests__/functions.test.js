// tests.js
const express = require('express');
const bodyParser = require('body-parser');
const routes_user = require('../routes/user_routes');
const routes_log = require('../routes/logbook_routes');
const request = require('supertest');

const app = express();
const connection  = require('../conn/db');
const randomEmail = `test${Math.floor(Math.random() * 10000)}@test.com`;
const randomPassword = `password${Math.floor(Math.random() * 10000)}`;

app.use(bodyParser.json());
app.use('/user', routes_user);
app.use('/activity', routes_log);

let newID = 1;
let token;

describe('POST /user/signup', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .post('/user/signup')
      .send({
        name: 'testaa',
        email: randomEmail,
        password: randomPassword
      })
      .expect('Content-Type', /json/)
      .expect(201);

    // Add more assertions as needed
  });
});

describe('POST /user/login', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: randomEmail,
        password: randomPassword
      })
      .expect('Content-Type', /json/)
      .expect(200);

    token = response.body.token; // Save the token for later use

    // Add more assertions as needed
  });
});

describe('GET /user', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Add more assertions as needed
  });
});

describe('GET /user/logout', () => {
  it('responds with json', async () => {
    const response = await request(app)
      .get('/user/logout')
      .expect('Content-Type', /json/)
      .expect(200);

    // Add more assertions as needed
  });
});

describe('Logbook routes', () => {
    test('createLog', async () => {
      const log = { place_id: 1, visited_time: new Date(), text: 'Test log', user_id: 1 };
      const response = await request(app).post('/activity/log/').send(log);
      // newID =  response.body.insertId;
      console.log(response.body);
      expect(response.statusCode).toBe(201);
    });
  
    test('getLogs', async () => {
      const response = await request(app).get('/activity/logs');
      console.log(response.body);
      expect(response.statusCode).toBe(200);
    });
  
    test('getLog', async () => {
      const log_id = 4; // replace with an existing log ID
      const response = await request(app).get(`/activity/log/${log_id}`);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
    });
  
    test('updateLog', async () => {
      const log_id = 4; // replace with an existing log ID
      date = new Date();
      const updatedLog = { place_id: 1, visited_time: date , text: 'Updated log', user_id: 1 };
      const response = await request(app).put(`/activity/log/${log_id}`).send(updatedLog);
      console.log(response.body)
      expect(response.statusCode).toBe(200);
    });
  
    test('deleteLog', async () => {
      const log_id = 6; // replace with an existing log ID
      const response = await request(app).delete(`/activity/log/${log_id}`);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
    });
  });

afterAll(() => {
  connection.end();
});