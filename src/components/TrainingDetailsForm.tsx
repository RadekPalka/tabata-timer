import React, { FormEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { TrainingObjectType } from '../types/TrainingObjectType';
import { updateTrainingDetails } from '../state/trainingDetailsSlice';
export const TrainingDetailsForm: React.FC = () => {
	const trainingDetails = useSelector(
		(state: RootState) => state.trainingDetails
	);
	const [exerciseLength, setExerciseLength] = useState(
		trainingDetails.exerciseLength
	);
	const [restLength, setRestLength] = useState(trainingDetails.restLength);
	const [numberOfCycles, setNumberOfCycles] = useState(
		trainingDetails.numberOfCycles
	);
	const [numberOfSets, setNumberOfSets] = useState(
		trainingDetails.numberOfSets
	);
	const [restBetweenSets, setRestBetweenSets] = useState(
		trainingDetails.restBetweenSets
	);

	const dispatch = useDispatch();

	const trainingConfig = [
		{
			id: 'exercise-length',
			label: 'Długość ćwiczenia w sekundach',
			min: 5,
			max: 60,
			value: exerciseLength,
			setValue: setExerciseLength,
		},
		{
			id: 'rest-length',
			label: 'Długość odpoczynku między ćwiczeniami w sekundach',
			min: 0,
			max: 60,
			value: restLength,
			setValue: setRestLength,
		},
		{
			id: 'number-of-cycles',
			label: 'Liczba cykli',
			min: 1,
			max: 20,
			value: numberOfCycles,
			setValue: setNumberOfCycles,
		},
		{
			id: 'number-of-sets',
			label: 'Liczba setów',
			min: 1,
			max: 10,
			value: numberOfSets,
			setValue: setNumberOfSets,
		},
		{
			id: 'rest-between-sets',
			label: 'Długość odpoczynku między cyklami w sekundach',
			min: 0,
			max: 120,
			value: restBetweenSets,
			setValue: setRestBetweenSets,
		},
	];
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		dispatch(
			updateTrainingDetails({
				exerciseLength,
				restLength,
				numberOfCycles,
				numberOfSets,
				restBetweenSets,
			})
		);
	};

	const setTrainingMode = ({
		exerciseLength,
		restLength,
		numberOfCycles,
		numberOfSets,
		restBetweenSets,
	}: TrainingObjectType) => {
		setExerciseLength(exerciseLength);
		if (restLength) setRestLength(restLength);
		setNumberOfCycles(numberOfCycles);
		setNumberOfSets(numberOfSets);
		if (restBetweenSets) setRestBetweenSets(restBetweenSets);
	};
	return (
		<form onSubmit={handleSubmit}>
			<h2>Stwórz swój trening</h2>
			{trainingConfig.map((el) => (
				<div key={el.id}>
					<label htmlFor={el.id}>{el.label}</label>
					<input
						type='range'
						id={el.id}
						min={el.min}
						max={el.max}
						value={el.value}
						onChange={(e) => el.setValue(Number(e.target.value))}
						disabled={el.id === 'rest-between-sets' && numberOfSets === 1}
					/>
					<output>{el.value}</output>
				</div>
			))}
			<button
				type='button'
				onClick={() =>
					setTrainingMode({
						exerciseLength: 20,
						restLength: 10,
						numberOfCycles: 8,
						numberOfSets: 1,
						restBetweenSets: 0,
					})
				}
			>
				Tabata
			</button>
			<button
				type='button'
				onClick={() =>
					setTrainingMode({
						exerciseLength: 30,
						restLength: 3,
						numberOfCycles: 5,
						numberOfSets: 3,
						restBetweenSets: 60,
					})
				}
			>
				Trening obwodowy
			</button>
			<button type='submit'>Zapisz</button>
		</form>
	);
};
