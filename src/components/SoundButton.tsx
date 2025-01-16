import React from 'react';
import { switchSoundState } from '../state/soundSwitcherSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
export const SoundButton: React.FC = () => {
	const dispatch = useDispatch();
	const soundState = useSelector(
		(state: RootState) => state.soundSwitcherState.isSoundsEnabled
	);
	return (
		<button
			className='btn bg-teal-700'
			onClick={() => dispatch(switchSoundState())}
		>
			{soundState ? 'Wyłącz dźwięki' : 'Włącz dźwięki'}
		</button>
	);
};
