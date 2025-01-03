import React, { useEffect, useRef, useState } from 'react';
import { RootState } from '../state/store';
import { useSelector } from 'react-redux';
import blipSoundFile from '../assets/audio/blip.mp3';
import bellSoundFile from '../assets/audio/bell.mp3';
import whistleSoundFile from '../assets/audio/whistle.mp3';
import { Stage } from '../types/Stage';

const labelObj: Record<Stage, string> = {
	exercise: 'Ćwiczenie',
	rest: 'Odpoczynek',
	'rest-between-sets': 'Odpoczynek między setami',
	done: 'Dobra robota, trening skończony :)',
};

export const TrainingTimer: React.FC = () => {
	const blipSound = useRef(new Audio(blipSoundFile));
	const bellSound = useRef(new Audio(bellSoundFile));
	const whistleSound = useRef(new Audio(whistleSoundFile));
	const trainingArr = useSelector(
		(state: RootState) => state.trainingArrState.trainingArr
	);
	const soundState = useSelector(
		(state: RootState) => state.soundSwitcherState.isSoundsEnabled
	);

	const [state, setState] = useState({
		secCounter: 0,
		stageSecCounter: 0,
		index: 0,
	});

	const playSound = (stage: Stage, secCounter: number) => {
		if (secCounter > 0) {
			blipSound.current.play();
		} else if (stage === 'exercise') {
			bellSound.current.play();
		} else if (stage === 'rest') {
			whistleSound.current.play();
		}
	};

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
				console.log(soundState);
				tempObj.secCounter++;
				tempObj.stageSecCounter++;
				const numberOfRemainingSeconds =
					trainingArr[tempObj.index].length - tempObj.stageSecCounter;
				if (numberOfRemainingSeconds <= 3 && soundState) {
					playSound(trainingArr[tempObj.index].type, numberOfRemainingSeconds);
				}

				if (tempObj.stageSecCounter === trainingArr[tempObj.index].length) {
					tempObj.index++;
					tempObj.stageSecCounter = 0;
				}
				return tempObj;
			});
		}, 1000);
		return () => clearInterval(intervalId);
	}, [soundState]);
	return (
		<div className='flex flex-col text-center items-center gap-4 w-3/4 mx-auto my-2 border border-white rounded-lg pb-6 pt-3 bg-blue-950'>
			<p>{formatTime()}</p>

			<p>Numer setu: {trainingArr[state.index].setIndex}</p>
			<p>Numer cyklu: {trainingArr[state.index].cycleIndex}</p>

			<p>{trainingArr[state.index].length - state.stageSecCounter}</p>
			<p>{labelObj[trainingArr[state.index].type]}</p>
		</div>
	);
};
