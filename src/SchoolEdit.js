import React, { useState, useEffect } from 'react';

//Fix onSubmitUpdate --- (Why isn't it working?! No errors, but the table isn't being updated?)
//Fix onClickDelete for schools that still have students --- (Why isn't it working?! No errors, but the table isn't being updated?)

const SchoolEdit = ({ school, students, updateSchool, updateStudent, deleteSchool }) => {
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
		const disenroll = students.filter((student) => student.schoolId === school.id);
		if (disenroll) {
			disenroll.forEach((student) => {
				const schoolId = '';
				updateStudent({ ...student, schoolId });
			});
		}
		deleteSchool(school.id);
		window.location.hash = '#';
	};

	return (
		<div className="editBox">
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
