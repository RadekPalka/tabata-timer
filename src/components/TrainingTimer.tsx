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
	const soundStateRef = useRef(soundState);
	const intervalIdRef = useRef<number | null>(null);
	const blinkingIntervalRef = useRef<number | null>(null);
	const [isDisplay, setIsDisplay] = useState(true);
	const [currentTime, setCurrentTime] = useState(Date.now());
	useEffect(() => {
		soundStateRef.current = soundState;
	}, [soundState]);

	const [state, setState] = useState<TimerState>({
		timerStart: currentTime,
		index: 0,
		pauseStartTime: 0,
	});

	const formatTime = () => {
		const elapsedSeconds = Math.floor((currentTime - state.timerStart) / 1000);
		const trainingTime =
			trainingArr[trainingArr.length - 1].timeStamp - elapsedSeconds;

		const minutes = Math.floor(trainingTime / 60);
		const formattedMinutes = minutes.toString().padStart(2, '0');

		const seconds = trainingTime % 60;
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	const playSound = (nextStage: Stage, secCounter: number) => {
		if (state.pauseStartTime || !soundStateRef.current) return;
		const elapsedSeconds = Math.floor((currentTime - state.timerStart) / 1000);
		// console.log(elapsedSeconds, trainingArr[state.index].timeStamp);
		if (
			(elapsedSeconds === trainingArr[state.index].timeStamp &&
				nextStage === 'rest') ||
			nextStage === 'done'
		) {
			bellSound.current.play();
		} else if (
			elapsedSeconds === trainingArr[state.index].timeStamp &&
			nextStage === 'exercise'
		) {
			whistleSound.current.play();
		} else if (secCounter <= 3) {
			blipSound.current.play();
		}
	};

	const startBlinking = () => {
		blinkingIntervalRef.current = setInterval(() => {
			setIsDisplay((prev) => !prev);
		}, 1000);
	};

	const checkStageIndex = (currentTime: number) => {
		const elapsedSeconds = (currentTime - state.timerStart) / 1000;
		let i = 0;
		for (const [index, el] of trainingArr.entries()) {
			if (elapsedSeconds <= el.timeStamp) {
				break;
			}
			i = index + 1;
		}
		console.log('index ' + i);
		if (i === trainingArr.length) return;
		setState({ ...state, index: i });
	};

	const calculateStageSec = () => {
		const elapsedSeconds = Math.floor((currentTime - state.timerStart) / 1000);
		const stageSec = trainingArr[state.index].timeStamp - elapsedSeconds;

		playSound(trainingArr[state.index + 1].type, stageSec);
		// console.log(stageSec, state.isPaused);
		return stageSec;
	};

	const displayStageSec = () => {
		const elapsedSeconds = Math.floor((currentTime - state.timerStart) / 1000);
		if (trainingArr[state.index].type === 'done') {
			return;
		}
		const stageSec = calculateStageSec();
		// console.log(stageSec);
		if (stageSec) {
			return stageSec;
		} else if (!stageSec && state.index === trainingArr.length - 2) {
			console.log('else if');
			intervalIdRef.current && clearInterval(intervalIdRef.current);
			setState({ ...state, index: state.index + 1 });
			return 0;
		} else {
			console.log('else');
			return trainingArr[state.index + 1].timeStamp - elapsedSeconds;
		}
	};

	const startInterval = () => {
		intervalIdRef.current = setInterval(() => {
			const now = Date.now();
			setCurrentTime(now);
			checkStageIndex(now);
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
		const pauseDuration = Date.now() - state.pauseStartTime
		
		setState({
			...state,
			timerStart: state.timerStart + pauseDuration,
			pauseStartTime: 0;
		});
		setCurrentTime(Date.now());
		stopInterval(blinkingIntervalRef.current);
		setIsDisplay(true);
		startInterval();
	};

	// useEffect(() => {
	// 	const stageSecCounter = calculateStageSec();
	// 	if (stageSecCounter < 4 && soundStateRef.current) {
	// 		playSound(trainingArr[state.index].type, stageSecCounter);
	// 	}
	// }, [state.index]);

	useEffect(() => {
		console.log('ok');
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
			<p>{displayStageSec()}</p>

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
