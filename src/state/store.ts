import { configureStore } from '@reduxjs/toolkit';
import trainingDetailsReducer from './trainingDetailsSlice';
import appStateReducer from './appStateSlice';

export const store = configureStore({
	reducer: {
		trainingDetails: trainingDetailsReducer,
		appState: appStateReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
