import React, { useState, useEffect } from 'react';

const SchoolEdit = ({ school, students, updateSchool, deleteSchool }) => {
	const [ name, setName ] = useState('');
	const [ error, setError ] = useState('');

	useEffect(
		() => {
			if (school) {
				setName(school.name);
			}
		},
		[ school ]
	);

	const onSubmitUpdate = (ev) => {
		ev.preventDefault();
		updateSchool({ ...school, name })
			.then(() => {
				setName('');
				setError('');
				window.location.hash = '#';
			})
			.catch((ex) => setError(ex.response.data.message));
	};
	const onClickDelete = () => {
		const disenroll = students.find((student) => student.schoolId === school.id);
		if (!!disenroll.length) {
			disenroll.foreach((student) => updateStudent(student.firstName, student.lastName, null));
		}
		deleteSchool(school.id);
		window.location.hash = '#';
	};

	return (
		<div>
			<form onSubmit={onSubmitUpdate}>
				<h2>Edit School</h2>
				{error && <div>{error}</div>}
				<input value={name} onChange={(ev) => setName(ev.target.value)} />
				<button disabled={!name || (school && school.name === name)}>Update</button>
			</form>
			<button onClick={onClickDelete}>Delete School</button>
		</div>
	);
};

export default SchoolEdit;
