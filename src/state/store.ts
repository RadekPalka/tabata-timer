import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from './appStateSlice';
import trainingArrReducer from './trainingArrSlice';
import soundSwitchReducer from './soundSwitcherSlice';

export const store = configureStore({
	reducer: {
		appState: appStateReducer,
		trainingArrState: trainingArrReducer,
		soundSwitcherState: soundSwitchReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
