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

type TimerState = {
	timerStart: number;
	index: number;
	pauseStartTime: number;
	stageSec: number;
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

	const intervalIdRef = useRef<number | null>(null);
	const blinkingIntervalRef = useRef<number | null>(null);
	const [isDisplay, setIsDisplay] = useState(true);
	const [currentTime, setCurrentTime] = useState(Date.now());
	const pauseDurationRef = useRef(0);
	const soundStateRef = useRef(soundState);
	useEffect(() => {
		soundStateRef.current = soundState;
	}, [soundState]);

	const [state, setState] = useState<TimerState>({
		timerStart: currentTime,
		index: 0,
		pauseStartTime: 0,
		stageSec: trainingArr[0].secCounter,
	});

	const formatTime = () => {
		const elapsedSeconds = Math.floor(
			(currentTime - state.timerStart - pauseDurationRef.current) / 1000
		);
		const trainingTime =
			trainingArr[trainingArr.length - 1].secCounter - elapsedSeconds;

		const minutes = Math.floor(trainingTime / 60);
		const formattedMinutes = minutes.toString().padStart(2, '0');

		const seconds = trainingTime % 60;
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	const playSound = (nextStage: Stage, secCounter: number) => {
		if (!soundStateRef.current) return;

		if (secCounter === 0) {
			nextStage === 'exercise'
				? whistleSound.current.play()
				: bellSound.current.play();
		} else {
			blipSound.current.play();
		}
	};

	const startBlinking = () => {
		blinkingIntervalRef.current = setInterval(() => {
			setIsDisplay((prev) => !prev);
		}, 1000);
	};

	const checkIfTrainingIsEnded = (elapsedSeconds: number) => {
		const lastIndex = trainingArr.length - 1;
		if (
			elapsedSeconds >= trainingArr[lastIndex].secCounter &&
			intervalIdRef.current
		) {
			clearInterval(intervalIdRef.current);
			return;
		}
	};

	const calculateStageProgress = (currentTime: number, timerStart: number) => {
		const elapsedSeconds = Math.floor(
			(currentTime - timerStart - pauseDurationRef.current) / 1000
		);
		let i = 0;
		for (const [index, el] of trainingArr.entries()) {
			if (elapsedSeconds <= el.secCounter) {
				break;
			}
			i = index + 1;
		}
		checkIfTrainingIsEnded(elapsedSeconds);

		const stageSec = trainingArr[i].secCounter - elapsedSeconds;
		console.log(stageSec);
		if (stageSec <= 3) {
			playSound(trainingArr[i + 1].type, stageSec);
		}

		setState((prev) => {
			if (stageSec === 0) {
				return {
					...prev,
					index: i + 1,
					stageSec: trainingArr[i + 1].secCounter - trainingArr[i].secCounter,
				};
			}
			return { ...prev, index: i, stageSec };
		});
	};

	const startInterval = () => {
		console.log(state);
		intervalIdRef.current = setInterval(() => {
			const now = Date.now();
			setCurrentTime(() => now);
			calculateStageProgress(now, state.timerStart);
		}, 1000);
	};

	const stopInterval = (interval: number | null) => {
		if (!interval) return;
		clearInterval(interval);
	};

	const startPause = () => {
		setState({ ...state, pauseStartTime: Date.now() });
		stopInterval(intervalIdRef.current);
		startBlinking();
	};

	const stopPause = () => {
		pauseDurationRef.current += Date.now() - state.pauseStartTime;

		setState({
			...state,
			pauseStartTime: 0,
		});
		setCurrentTime(Date.now());
		stopInterval(blinkingIntervalRef.current);
		setIsDisplay(true);
		startInterval();
	};

	useEffect(() => {
		startInterval();
		return () => stopInterval(intervalIdRef.current);
	}, []);
	return (
		<div className='flex flex-col text-center items-center gap-4 w-3/4 mx-auto my-2 border border-white rounded-lg pb-6 pt-3 bg-blue-950'>
			<p className={isDisplay ? 'text-white' : 'text-transparent'}>
				{formatTime()}
			</p>
			<p>Numer setu: {trainingArr[state.index].setIndex}</p>
			<p>Numer cyklu: {trainingArr[state.index].cycleIndex}</p>
			<p>{labelObj[trainingArr[state.index]?.type]}</p>
			<p>{state.stageSec}</p>

			{trainingArr[state.index].type !== 'done' && (
				<button
					className='btn bg-red-700'
					onClick={() => (!state.pauseStartTime ? startPause() : stopPause())}
				>
					{!state.pauseStartTime ? 'Wstrzymaj stoper' : 'Wznów stoper'}
				</button>
			)}
		</div>
	);
};
