import React, { useState } from 'react';

//Fix students database so students can have the same first or last name (but not both)

const StudentForm = ({ createStudent, schools }) => {
	const [ firstName, setFirstName ] = useState('');
	const [ lastName, setLastName ] = useState('');
	const [ schoolId, setSchoolId ] = useState('');

	const onSubmit = (ev) => {
		ev.preventDefault();
		const params = schoolId ? { firstName, lastName, schoolId } : { firstName, lastName };
		createStudent(params).then(() => {
			setFirstName('');
			setLastName('');
			setSchoolId('');
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<h2>Create Student</h2>
			<input value={firstName} onChange={(ev) => setFirstName(ev.target.value)} />
			<input value={lastName} onChange={(ev) => setLastName(ev.target.value)} />
			<select value={schoolId} onChange={(ev) => setSchoolId(ev.target.value)}>
				<option value={null}>-- Select School --</option>
				{schools.map((school) => {
					return (
						<option value={school.id} key={school.id}>
							{school.name}
						</option>
					);
				})}
			</select>
			<button disabled={!firstName || !lastName}>Create</button>
		</form>
	);
};

export default StudentForm;
