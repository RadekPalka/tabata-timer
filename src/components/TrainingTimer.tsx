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
	elapsedTime: number;
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

	useEffect(() => {
		soundStateRef.current = soundState;
	}, [soundState]);

	const [state, setState] = useState<TimerState>({
		timerStart: Date.now(),
		index: 0,
		elapsedTime: 0,
		pauseStartTime: 0,
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
			trainingArr[trainingArr.length - 1].timeStamp - state.elapsedTime;

		const minutes = Math.floor(trainingTime / 60);
		const formattedMinutes = minutes.toString().padStart(2, '0');

		const seconds = trainingTime % 60;
		const formattedSeconds = seconds.toString().padStart(2, '0');

		return `${formattedMinutes}:${formattedSeconds}`;
	};

	const startBlinking = () => {
		blinkingIntervalRef.current = setInterval(() => {
			setIsDisplay((prev) => !prev);
		}, 1000);
	};

	const checkStageIndex = (obj: TimerState) => {
		for (const [index, el] of trainingArr.entries()) {
			if (obj.elapsedTime <= el.timeStamp) {
				break;
			}

			obj.index = index + 1;
		}
	};

	const calculateStageSec = () =>
		trainingArr[state.index] &&
		trainingArr[state.index].timeStamp - state.elapsedTime;

	const displayStageSec = () => {
		if (trainingArr[state.index].type === 'done') {
			return;
		}
		const stageSec = calculateStageSec();

		if (stageSec) {
			return stageSec;
		} else if (!stageSec && state.index === trainingArr.length - 2) {
			intervalIdRef.current && clearInterval(intervalIdRef.current);
			setState({ ...state, index: state.index + 1 });
			return 0;
		} else {
			return trainingArr[state.index + 1].timeStamp - state.elapsedTime;
		}
	};

	const startInterval = () => {
		const timerStart = state.timerStart;
		intervalIdRef.current = setInterval(() => {
			setState((prev) => {
				const tempObj = { ...prev };
				const timeDifference = Date.now() - tempObj.timerStart;
				tempObj.elapsedTime = Math.floor(timeDifference / 1000);

				if (tempObj.pauseStartTime) {
					tempObj.timerStart = timerStart + Date.now() - tempObj.pauseStartTime;
				}

				checkStageIndex(tempObj);
				return tempObj;
			});
		}, 1000);
	};

	const stopInterval = () => {
		if (intervalIdRef.current !== null) {
			clearInterval(intervalIdRef.current);
			intervalIdRef.current = null;
		}
	};

	const restartInterval = () => {
		if (!intervalIdRef.current) return;
		clearInterval(intervalIdRef.current);
		startInterval();
	};

	const startPause = () => {
		setState({
			...state,
			pauseStartTime: Date.now(),
		});
		restartInterval();
		startBlinking();
	};

	const stopPause = () => {
		setState({
			...state,
			pauseStartTime: 0,
		});
		blinkingIntervalRef.current && clearInterval(blinkingIntervalRef.current);
		setIsDisplay(true);
	};

	useEffect(() => {
		if (
			state.elapsedTime === trainingArr[trainingArr.length - 1].timeStamp &&
			intervalIdRef.current
		) {
			clearInterval(intervalIdRef.current);
		}
	}, [state.elapsedTime, state.index]);

	useEffect(() => {
		const stageSecCounter = calculateStageSec();
		if (stageSecCounter < 4 && soundStateRef.current) {
			playSound(trainingArr[state.index].type, stageSecCounter);
		}
	}, [state.elapsedTime, state.index]);

	useEffect(() => {
		startInterval();
		return () => stopInterval();
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
