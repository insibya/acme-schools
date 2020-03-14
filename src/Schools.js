import React, { useState } from 'react';

//Fix onSubmitEnroll so each form has its own state?
//Fix onSubmitEnroll to update the student

//Fix onSubmitUnenroll to update the student --- (Why isn't it working?! No errors, but the table isn't being updated?)

const Schools = ({ schools, students, updateStudent }) => {
	const [ unenroll, setUnenroll ] = useState('');
	const [ schoolId, setSchoolId ] = useState('');

	const onSubmitEnroll = (ev) => {
		ev.preventDefault();
		updateStudent({ student, schoolId }).then(() => {
			setSchoolId('');
			setEnroll('');
		});
	};
	const onSubmitUnenroll = (ev) => {
		ev.preventDefault();
		updateStudent({ ...unenroll, schoolId }).then(() => {
			setSchoolId('');
			setUnenroll('');
		});
	};

	return (
		<div>
			<h2>Schools ({schools.length})</h2>
			<ul>
				<li key="0">
					Unenrolled
					<ul>
						{students.filter((student) => !student.schoolId).map((student) => {
							return (
								<li key={student.id}>
									<a href={`#view=student&id=${student.id}`}>
										{student.firstName} {student.lastName}
									</a>
								</li>
							);
						})}
					</ul>
				</li>
				{schools.map((school) => {
					const filtered = students.filter((student) => student.schoolId === school.id);
					return (
						<li key={school.id}>
							<a href={`#view=school&id=${school.id}`}>{school.name}</a>
							<form onSubmit={onSubmitEnroll}>
								<select value={schoolId} onChange={(ev) => setSchoolId(ev.target.value)}>
									<option value="">-- Enroll Student --</option>
									{students.filter((student) => !student.schoolId).map((student) => {
										return (
											<option value={student.id} key={student.id}>
												{student.firstName} {student.lastName}
											</option>
										);
									})}
								</select>
								<button disabled={!schoolId}>Enroll</button>
							</form>
							<ul>
								{filtered.map((student) => {
									return (
										<li key={student.id}>
											<form onSubmit={onSubmitUnenroll}>
												<a href={`#view=student&id=${student.id}`}>
													{student.firstName} {student.lastName}
												</a>
												<button onClick={() => setUnenroll(student)}>Unenroll</button>
											</form>
										</li>
									);
								})}
							</ul>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Schools;
