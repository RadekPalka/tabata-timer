import React, { useEffect, useState } from 'react';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';

type Stage = 'exercise' | 'rest' | 'done' | 'rest-between-sets';

const labelObj: Record<Stage, string> = {
	exercise: 'Ćwiczenie',
	rest: 'Odpoczynek',
	'rest-between-sets': 'Odpoczynek między setami',
	done: 'Dobra robota, trening skończony :)',
};
type StageObj = {
	type: Stage;
	length: number;
	cycleIndex: number;
	setIndex: number;
};
export const TrainingTimer: React.FC = () => {
	const trainingDetails = useSelector(
		(state: RootState) => state.trainingDetails
	);
	const [trainingArr, setTrainingArr] = useState<StageObj[]>([]);
	const [secCounter, setSecCounter] = useState(trainingDetails.exerciseLength);
	const [stage, setStage] = useState<Stage>('exercise');
	const [trainingTime, setTrainingTime] = useState(0);
	const [setNumber, setSetNumber] = useState(1);
	const [cycleNumber, setCycleNumber] = useState(1);
	const formatTime = () => {
		const minutes = Math.floor(trainingTime / 60);
		const formattedMinutes = minutes.toString().padStart(2, '0');
		console.log(trainingTime / 60);
		const seconds = trainingTime % 60;
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};
	useEffect(() => {
		const arr: StageObj[] = [];
		let cycleIndex = 0;
		let trainingLength = 0;
		for (let j = 0; j < trainingDetails.numberOfSets; j++) {
			for (let i = 0; i < trainingDetails.numberOfCycles; i++) {
				cycleIndex = i + 1;
				trainingLength += trainingDetails.exerciseLength;
				arr.push({
					type: 'exercise',
					length: trainingDetails.exerciseLength,
					setIndex: j + 1,
					cycleIndex,
				});
				if (
					!trainingDetails.restLength ||
					i === trainingDetails.numberOfCycles - 1
				)
					continue;
				trainingLength += trainingDetails.restLength;
				arr.push({
					type: 'rest',
					length: trainingDetails.restLength,
					setIndex: j + 1,
					cycleIndex,
				});
			}
			if (
				trainingDetails.numberOfSets > 1 &&
				j < trainingDetails.numberOfSets - 1
			) {
				trainingLength += trainingDetails.restBetweenSets;
				arr.push({
					type: 'rest-between-sets',
					length: trainingDetails.restBetweenSets || 0,
					setIndex: j + 1,
					cycleIndex,
				});
			}
		}

		setTrainingArr(arr);
		setTrainingTime(trainingLength);
	}, []);
	useEffect(() => {
		if (!trainingArr.length) return;
		let index = 0;

		let timeCounter = trainingTime;
		let counter = trainingArr[index].length;
		const intervalId = setInterval(() => {
			timeCounter--;
			setTrainingTime(timeCounter);
			counter--;
			setSecCounter(counter);
			if (counter === 0 && index === trainingArr.length - 1) {
				setStage('done');
				clearInterval(intervalId);
			} else if (counter === 0) {
				index++;
				setStage(trainingArr[index].type);
				counter = trainingArr[index].length;
				setSecCounter(counter);
				setCycleNumber(trainingArr[index].cycleIndex);
				setSetNumber(trainingArr[index].setIndex);
			}
		}, 1000);
		return () => clearInterval(intervalId);
	}, [trainingArr.length]);
	return (
		<div>
			<p>{formatTime()}</p>
			<p>Numer setu: {setNumber}</p>
			<p>Numer cyklu: {cycleNumber}</p>
			<p>{labelObj[stage]}</p>
			<p>{secCounter}</p>
		</div>
	);
};
