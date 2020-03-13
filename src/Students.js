import React from 'react';

const Students = ({ students, schools, deleteStudent }) => {
	return (
		<div>
			<h2>Students ({students.length})</h2>
			<ul>
				{students.map((student) => {
					const school = schools.find((school) => school.id === student.schoolId);
					return (
						<li key={student.id}>
							<a href={`#view=student&id=${student.id}`}>
								{student.firstName} {student.lastName}
							</a>{' '}
							<button onClick={() => deleteStudent(student.id)}>x</button>
							{student.schoolId ? ` enrolled at ${!!school && school.name}` : ' unenrolled'}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Students;
