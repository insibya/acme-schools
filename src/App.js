import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import Schools from './Schools';
import SchoolForm from './SchoolForm';
import SchoolEdit from './SchoolEdit';
import StudentForm from './StudentForm';
import StudentEdit from './StudentEdit';

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

	const updateSchool = async (school) => {
		const updated = (await axios.put(`/api/schools/${school.id}`, school)).data;
		setSchools(schools.map((school) => (school.id === updated.id ? updated : school)));
	};
	const updateStudent = async (student) => {
		const updated = (await axios.put(`/api/students/${student.id}`, student)).data;
		setStudents(students.map((student) => (student.id === updated.id ? updated : student)));
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
			<ul>
				<li>
					{schools.length} school{schools.length !== 1 ? 's' : ''}
				</li>
				<li>
					{students.length} student{students.length !== 1 ? 's' : ''} ({students.filter((student) => !!student.schoolId).length}{' '}
					enrolled)
				</li>
			</ul>
			{view === 'school' && (
				<SchoolEdit
					school={schools.find((school) => school.id === params.id)}
					students={students}
					updateSchool={updateSchool}
					deleteSchool={deleteSchool}
				/>
			)}
			{view === 'student' && (
				<StudentEdit
					student={students.find((student) => student.id === params.id)}
					schools={schools}
					updateStudent={updateStudent}
					deleteStudent={deleteStudent}
				/>
			)}
			{!view && (
				<div>
					<StudentForm createStudent={createStudent} schools={schools} />
					<SchoolForm createSchool={createSchool} />
					<Schools
						schools={schools}
						students={students}
						updateSchool={updateSchool}
						updateStudent={updateStudent}
					/>
				</div>
			)}
		</div>
	);
};

export default App;
