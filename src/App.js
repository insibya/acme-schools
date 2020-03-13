import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import Schools from './Schools';
//import SchoolForm from './SchoolForm';
//import SchoolEdit from './SchoolEdit';
import Students from './Students';
//import StudentForm from './StudentForm';
//import StudentEdit from './StudentEdit';

const App = () => {
	const [ schools, setSchools ] = useState([]);
	const [ students, setStudents ] = useState([]);
	const [ params, setParams ] = useState(qs.parse(window.location.hash.slice(1)));
	useEffect(() => {
		window.addEventListener('hashchange', () => {
			setParams(qs.parse(window.location.hash.slice(1)));
		});
	}, []);
	const { view } = params;
	useEffect(() => {
		Promise.all([ axios.get('/api/schools'), axios.get('/api/students') ]).then((responses) => {
			setSchools(responses[0].data);
			setStudents(responses[1].data);
		});
	}, []);

	const createSchool = async (school) => {
		const created = (await axios.post('/api/schools', school)).data;
		setSchools([ ...schools, created ]);
	};
	const createStudent = async (student) => {
		const created = (await axios.post('/api/students', student)).data;
		setStudents([ ...students, created ]);
	};

	const deleteSchool = async (id) => {
		await axios.delete(`/api/schools/${id}`);
		setSchools(schools.filter((school) => school.id !== id));
	};
	const deleteStudent = async (id) => {
		await axios.delete(`/api/students/${id}`);
		setStudents(students.filter((student) => student.id !== id));
	};

	return (
		<div>
			<h1>
				<a href="#">Acme Schools</a>
			</h1>
			{!view && (
				<div>
					<Schools schools={schools} students={students} deleteSchool={deleteSchool} />
					<Students students={students} schools={schools} deleteStudent={deleteStudent} />
				</div>
			)}
		</div>
	);
};

export default App;
