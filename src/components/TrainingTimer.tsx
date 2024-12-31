import React, { useEffect, useState } from 'react';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';

import { Stage } from '../types/Stage';

const labelObj: Record<Stage, string> = {
	exercise: 'Ćwiczenie',
	rest: 'Odpoczynek',
	'rest-between-sets': 'Odpoczynek między setami',
	done: 'Dobra robota, trening skończony :)',
};

export const TrainingTimer: React.FC = () => {
	const trainingArr = useSelector(
		(state: RootState) => state.trainingArrState.trainingArr
	);
	console.log(trainingArr);
	const [state, setState] = useState({
		secCounter: 0,
		stageSecCounter: 0,
		index: 0,
	});

	const formatTime = () => {
		const trainingTime =
			trainingArr.reduce((acc, training) => acc + training.length, 0) -
			state.secCounter;
		const minutes = Math.floor(trainingTime / 60);
		const formattedMinutes = minutes.toString().padStart(2, '0');

		const seconds = trainingTime % 60;
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			setState((prevState) => {
				const tempObj = { ...prevState };
				if (trainingArr[tempObj.index].type === 'done') {
					clearInterval(intervalId);
					return tempObj;
				}
				tempObj.secCounter++;
				tempObj.stageSecCounter++;
				console.log(tempObj.secCounter);
				if (tempObj.stageSecCounter === trainingArr[tempObj.index].length) {
					tempObj.index++;
					tempObj.stageSecCounter = 0;
				}
				return tempObj;
			});
		}, 1000);
		return () => clearInterval(intervalId);
	}, []);
	return (
		<div className='flex flex-col items-center'>
			<p>{formatTime()}</p>

			<p>Numer setu: {trainingArr[state.index].setIndex}</p>
			<p>Numer cyklu: {trainingArr[state.index].cycleIndex}</p>

			<p>{trainingArr[state.index].length - state.stageSecCounter}</p>
			<p>{labelObj[trainingArr[state.index].type]}</p>
		</div>
	);
};
