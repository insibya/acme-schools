import React, { useState } from 'react';

const SchoolForm = ({ createSchool }) => {
	const [ name, setName ] = useState('');

	const onSubmit = (ev) => {
		ev.preventDefault();
		createSchool({ name }).then(() => {
			setName('');
		});
	};

	return (
		<div className="form">
			<form onSubmit={onSubmit}>
				<h2>Create School</h2>
				<input value={name} onChange={(ev) => setName(ev.target.value)} />
				<button disabled={!name}>Create</button>
			</form>
		</div>
	);
};

export default SchoolForm;
