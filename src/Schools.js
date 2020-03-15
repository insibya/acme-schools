import React, { useState } from 'react';

//Fix onSubmitEnroll to update the student --- (Why isn't it working?! No errors, but the table isn't being updated?)
//Fix onSubmitUnenroll to update the student --- (Why isn't it working?! No errors, but the table isn't being updated?)

const Schools = ({ schools, students, updateStudent }) => {
	const [ enrollId, setEnrollId ] = useState('');
	const [ unenroll, setUnenroll ] = useState('');
	const [ schoolId, setSchoolId ] = useState('');

	const onSubmitEnroll = (ev) => {
		ev.preventDefault();
		const enroll = students.find((student) => student.id === enrollId);
		updateStudent({ ...enroll, schoolId }).then(() => {
			setEnrollId('');
			setSchoolId('');
		});
	};
	const onSubmitUnenroll = (ev) => {
		ev.preventDefault();
		setSchoolId('');
		updateStudent({ ...unenroll, schoolId }).then(() => {
			setUnenroll('');
		});
	};

	return (
		<div>
			<ul className="display">
				<li className="schoolBox" key="0">
					Unenrolled ({students.filter((student) => !student.schoolId).length} students)
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
						<li className="schoolBox" key={school.id}>
							<div>
								<a href={`#view=school&id=${school.id}`}>{school.name}</a> ({filtered.length} students)
							</div>
							<form onSubmit={onSubmitEnroll}>
								<select
									onChange={(ev) => {
										setEnrollId(ev.target.value), setSchoolId(school.id);
									}}
								>
									<option value="">-- Enroll Student --</option>
									{students.filter((student) => !student.schoolId).map((student) => {
										return (
											<option value={student.id} key={student.id}>
												{student.firstName} {student.lastName}
											</option>
										);
									})}
								</select>
								<button disabled={!enrollId}>Enroll</button>
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
