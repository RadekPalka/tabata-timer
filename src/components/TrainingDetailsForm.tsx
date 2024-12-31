import React, { FormEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { TrainingObjectType } from '../types/TrainingObjectType';
import { updateTrainingDetails } from '../state/trainingDetailsSlice';
import { setState } from '../state/appStateSlice';
import { setTrainingArr } from '../state/trainingArrSlice';
import { StageObj } from '../types/StageObj';
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

		const updatedDetails = {
			exerciseLength,
			restLength,
			numberOfCycles,
			numberOfSets,
			restBetweenSets,
		};

		dispatch(updateTrainingDetails(updatedDetails));
		dispatch(setState('timer'));

		const arr: StageObj[] = [];
		let cycleIndex = 0;

		for (let j = 0; j < updatedDetails.numberOfSets; j++) {
			for (let i = 0; i < updatedDetails.numberOfCycles; i++) {
				cycleIndex = i + 1;

				arr.push({
					type: 'exercise',
					length: updatedDetails.exerciseLength,
					setIndex: j + 1,
					cycleIndex,
				});

				if (
					!updatedDetails.restLength ||
					i === updatedDetails.numberOfCycles - 1
				)
					continue;

				arr.push({
					type: 'rest',
					length: updatedDetails.restLength,
					setIndex: j + 1,
					cycleIndex,
				});
			}

			if (
				updatedDetails.numberOfSets > 1 &&
				j < updatedDetails.numberOfSets - 1
			) {
				arr.push({
					type: 'rest-between-sets',
					length: updatedDetails.restBetweenSets || 0,
					setIndex: j + 1,
					cycleIndex,
				});
			} else if (j === updatedDetails.numberOfSets - 1) {
				arr.push({
					type: 'done',
					length: 0,
					setIndex: j + 1,
					cycleIndex,
				});
			}
		}

		dispatch(setTrainingArr(arr));
		console.log(arr);
	};

	const setTrainingMode = ({
		exerciseLength,
		restLength,
		numberOfCycles,
		numberOfSets,
		restBetweenSets,
	}: TrainingObjectType) => {
		setExerciseLength(exerciseLength);
		setRestLength(restLength);
		setNumberOfCycles(numberOfCycles);
		setNumberOfSets(numberOfSets);
		setRestBetweenSets(restBetweenSets);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col text-center items-center gap-4 w-3/4 mx-auto my-2 border border-white rounded-lg pb-6 pt-3 bg-blue-950'
		>
			<h2 className='text-xl'>Stwórz swój trening</h2>
			{trainingConfig.map((el) => (
				<div
					key={el.id}
					className='flex flex-col sm:flex-row items-center justify-center gap-4'
				>
					<label className='text-slate-300' htmlFor={el.id}>
						{el.label}
					</label>
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
			<div className='flex flex-col sm:flex-row  items-center justify-center gap-4'>
				<button
					className='bg-green-900 btn hover:bg-green-800'
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
					className='bg-blue-800 btn hover:bg-blue-700'
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
				<button type='submit' className='btn bg-red-900 hover:bg-red-800'>
					Zacznij trening
				</button>
			</div>
		</form>
	);
};
