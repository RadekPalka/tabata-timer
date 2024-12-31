import { configureStore } from '@reduxjs/toolkit';
import trainingDetailsReducer from './trainingDetailsSlice';
import appStateReducer from './appStateSlice';
import trainingArrReducer from './trainingArrSlice';

export const store = configureStore({
	reducer: {
		trainingDetails: trainingDetailsReducer,
		appState: appStateReducer,
		trainingArrState: trainingArrReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
