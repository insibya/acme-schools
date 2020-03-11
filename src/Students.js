import React from 'react';

const Students = ({ students }) => {
	return (
		<div>
			<h2>Students ({students.length})</h2>
			<ul>
				{students.map((student) => {
					return (
						<li key={student.id}>
							{student.firstName} {student.lastName}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
export default Students;
