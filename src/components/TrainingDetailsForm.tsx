import React, { useState } from 'react';

export const TrainingDetailsForm: React.FC = () => {
	const [exerciseLength, setExerciseLength] = useState(20);
	const [restLength, setRestLength] = useState(10);
	const [numberOfSets, setNumberOfSets] = useState(8);
	return (
		<form>
			<label htmlFor='exercise-length'>Długość ćwiczenia w sekundach</label>
			<input
				type='range'
				id='exercise-length'
				min='10'
				max='60'
				value={exerciseLength}
				onChange={(e) => setExerciseLength(Number(e.target.value))}
			/>
			<output>{exerciseLength}</output>
			<label htmlFor='rest-length'>Długość odpoczynku w sekundach</label>
			<input
				type='range'
				id='rest-length'
				min='0'
				max='30'
				value={restLength}
				onChange={(e) => setRestLength(Number(e.target.value))}
			/>
			<output>{restLength}</output>
			<label htmlFor='number-of-sets'>Ilość serii</label>
			<input
				type='range'
				id='number-of-sets'
				min='4'
				max='16'
				value={numberOfSets}
				onChange={(e) => setNumberOfSets(Number(e.target.value))}
			/>
			<output>{numberOfSets}</output>
		</form>
	);
};
