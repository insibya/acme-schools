import React from 'react';

const Schools = ({ schools }) => {
	return (
		<div>
			<h2>Schools ({schools.length})</h2>
			<ul>
				{schools.map((school) => {
					return <li key={school.id}> {school.name}</li>;
				})}
			</ul>
		</div>
	);
};

export default Schools;
