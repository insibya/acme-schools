const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_db');
client.connect();

const sync = async () => {
	const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS schools;
    CREATE TABLE schools(
      id UUID PRIMARY KEY default uuid_generate_v4(),
      name VARCHAR(50) NOT NULL UNIQUE,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE students(
      id UUID PRIMARY KEY default uuid_generate_v4(),
      "firstName" VARCHAR(50) NOT NULL UNIQUE,
      CHECK (char_length("firstName") > 0),
      "lastName" VARCHAR(50) NOT NULL UNIQUE,
      CHECK (char_length("lastName") > 0),
      "schoolId" UUID REFERENCES schools(id)
    );
  `;
	await client.query(SQL);

	const [ ucla, ucsb, biola ] = await Promise.all([
		createSchool({ name: 'UCLA' }),
		createSchool({ name: 'UCSB' }),
		createSchool({ name: 'BIOLA' })
	]);
	const [ janice, maxwell, tiffany ] = await Promise.all([
		createStudent({ firstName: 'Janice', lastName: 'Griffith', schoolId: ucla.id }),
		createStudent({ firstName: 'Maxwell', lastName: 'Smart', schoolId: ucsb.id }),
		createStudent({ firstName: 'Tiffany', lastName: 'Tolliver' })
	]);
};

const createSchool = async ({ name }) => {
	const SQL = 'INSERT INTO schools(name) values($1) RETURNING *';
	return (await client.query(SQL, [ name ])).rows[0];
};
const createStudent = async ({ firstName, lastName, schoolId }) => {
	const SQL = 'INSERT INTO students("firstName", "lastName", "schoolId") values($1, $2, $3) RETURNING *';
	return (await client.query(SQL, [ firstName, lastName, schoolId ])).rows[0];
};

const readSchools = async () => {
	const SQL = 'SELECT * FROM schools';
	return (await client.query(SQL)).rows;
};
const readStudents = async () => {
	const SQL = 'SELECT * FROM students';
	return (await client.query(SQL)).rows;
};

const updateSchool = async (name, id) => {
	return (await client.query('UPDATE schools SET name=$1 WHERE id=$2 RETURNING *', [ name, id ])).rows[0];
};
const updateStudent = async (student) => {
	const map = [ 'firstName', 'lastName', 'schoolId' ].reduce((acc, key, idx) => {
		if (!!student[key]) {
			acc[key] = student[key];
		}
		return acc;
	}, {});
	let SQL = Object.keys(map).reduce((acc, key, idx) => {
		acc = `${acc}${idx ? ',' : ''}"${key}"=$${idx + 1}`;
		return acc;
	}, '');
	SQL = `UPDATE students SET ${SQL} WHERE id=$${Object.keys(map).length + 1} RETURNING *;`;
	return (await client.query(SQL, [ ...Object.values(map), student.id ])).rows[0];
};

const deleteSchool = async (id) => {
	await client.query('DELETE FROM schools WHERE id=$1', [ id ]);
};
const deleteStudent = async (id) => {
	await client.query('DELETE FROM students WHERE id=$1', [ id ]);
};

module.exports = {
	sync,
	createSchool,
	createStudent,
	readSchools,
	readStudents,
	updateSchool,
	updateStudent,
	deleteSchool,
	deleteStudent
};
