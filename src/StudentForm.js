import React, { useState } from 'react';

const StudentForm = ({ createStudent, schools }) => {
	const [ firstName, setFirstName ] = useState('');
	const [ lastName, setLastName ] = useState('');
	const [ schoolId, setSchoolId ] = useState('');
	let enrollment;
	schoolId ? enrollment === schoolId : null;
	const onSubmit = (ev) => {
		ev.preventDefault();
		createStudent({ firstName, lastName, enrollment }).then(() => {
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
				<option value="">-- Select School --</option>
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
