import React, { useState, useEffect } from 'react';

const StudentEdit = ({ student, schools, updateStudent, deleteStudent }) => {
	const [ firstName, setFirstName ] = useState('');
	const [ lastName, setLastName ] = useState('');
	const [ schoolId, setSchoolId ] = useState('');
	const [ error, setError ] = useState('');

	useEffect(
		() => {
			if (student) {
				setFirstName(student.firstName);
				setLastName(student.lastName);
				setSchoolId(student.schoolId);
			}
		},
		[ student ]
	);

	const onSubmitUpdate = (ev) => {
		ev.preventDefault();
		updateStudent({ ...student, firstName, lastName, schoolId })
			.then(() => {
				setFirstName('');
				setLastName('');
				setSchoolId('');
				setError('');
				window.location.hash = '#';
			})
			.catch((ex) => setError(ex.response.data.message));
	};
	const onClickDelete = () => {
		deleteStudent(student.id);
		window.location.hash = '#';
	};

	return (
		<div>
			<form onSubmit={onSubmitUpdate}>
				<h2>Edit Student</h2>
				{error && <div>{error}</div>}
				<input value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
				<input value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
				<select value={schoolId} onChange={(ev) => setSchoolId(ev.target.value)}>
					<option value="">-- Select School --</option>
					{schools.map((school) => {
						return (
							<option value={school.id} key={school.id}>
								{school.name}
							</option>
						);
					})}
				</select>
				<button
					disabled={
						!firstName ||
						!lastName ||
						(student &&
							student.firstName === firstName &&
							student.lastName === lastName &&
							student.schoolId === schoolId)
					}
				>
					Update
				</button>
			</form>
			<button onClick={onClickDelete}>Delete Student</button>
		</div>
	);
};

export default StudentEdit;
