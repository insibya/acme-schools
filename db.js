const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_db');
client.connect();

const sync = async () => {
	const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS schools;
    CREATE TABLE schools(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(50) NOT NULL UNIQUE,
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE students(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "firstName" VARCHAR(50) NOT NULL,
      CHECK (char_length("firstName") > 0),
      "lastName" VARCHAR(50) NOT NULL,
      CHECK (char_length("lastName") > 0),
      "schoolId" UUID REFERENCES schools(id) DEFAULT NULL
    );
  `;
	await client.query(SQL);

	const [ ucla, ucsb, biola ] = await Promise.all([
		createSchool({ name: 'UCLA' }),
		createSchool({ name: 'UCSB' }),
		createSchool({ name: 'BIOLA' })
	]);
	const [ janice, maxwell, tiffany, barbara, marj ] = await Promise.all([
		createStudent({ firstName: 'Janice', lastName: 'Griffith', schoolId: ucla.id }),
		createStudent({ firstName: 'Maxwell', lastName: 'Smart', schoolId: ucsb.id }),
		createStudent({ firstName: 'Tiffany', lastName: 'Tolliver' }),
		createStudent({ firstName: 'Barbara', lastName: 'Walters' }),
		createStudent({ firstName: 'Marj', lastName: 'Simpson' })
	]);
	updateSchool({ name: 'UC Los Angeles', id: ucla.id });
	updateStudent({ firstName: 'Tiffany', lastName: 'Tolliverson', schoolId: ucla.id, id: tiffany.id });
	//The update functions work here, but not when called from the UI. What am I missing?!
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

const updateSchool = async ({ name, id }) => {
	const SQL = 'UPDATE schools SET name=($1) WHERE id=($2) RETURNING *';
	return (await client.query(SQL, [ name, id ])).rows[0];
};
const updateStudent = async ({ firstName, lastName, schoolId, id }) => {
	const SQL = 'UPDATE students SET "firstName"=($1), "lastName"=($2), "schoolId"=($3) WHERE id=($4) RETURNING *';
	return (await client.query(SQL, [ firstName, lastName, schoolId, id ])).rows[0];
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
