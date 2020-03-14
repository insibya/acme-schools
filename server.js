const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/schools', (req, res, next) => {
	db.createSchool(req.body).then((school) => res.status(201).send(school)).catch(next);
});
app.post('/api/students', (req, res, next) => {
	db.createStudent(req.body).then((student) => res.status(201).send(student)).catch(next);
});

app.get('/api/schools', (req, res, next) => {
	db.readSchools().then((schools) => res.send(schools)).catch(next);
});
app.get('/api/students', (req, res, next) => {
	db.readStudents().then((students) => res.send(students)).catch(next);
});

app.put('/api/schools/:id', (req, res, next) => {
	db.updateSchool(req.params.id).then((school) => res.send(school)).catch(next);
});
app.put('/api/students/:id', (req, res, next) => {
	db.updateStudent(req.params.id).then((student) => res.send(student)).catch(next);
});

app.delete('/api/schools/:id', (req, res, next) => {
	db.deleteSchool(req.params.id).then(() => res.sendStatus(204)).catch(next);
});
app.delete('/api/students/:id', (req, res, next) => {
	db.deleteStudent(req.params.id).then(() => res.sendStatus(204)).catch(next);
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
	app.listen(port, () => console.log(`listening on port ${port}`));
});
