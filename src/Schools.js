import React from 'react';

const Schools = ({ schools, students, deleteSchool }) => {
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
									{student.firstName} {student.lastName}
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
							{filtered.length === 0 && <button onClick={() => deleteSchool(school.id)}>x</button>}
							<ul>
								{filtered.map((student) => {
									return (
										<li key={student.id}>
											{student.firstName} {student.lastName}
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
