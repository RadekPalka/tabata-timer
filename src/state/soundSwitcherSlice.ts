import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isSoundsEnabled: true,
};

const soundSwitcherSlice = createSlice({
	name: 'sound-switcher',
	initialState,
	reducers: {
		switchSoundState: (state) => {
			state.isSoundsEnabled = !state.isSoundsEnabled;
		},
	},
});

export const { switchSoundState } = soundSwitcherSlice.actions;
export default soundSwitcherSlice.reducer;
