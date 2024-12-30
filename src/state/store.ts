import { configureStore } from '@reduxjs/toolkit';
import trainingDetailsReducer from './trainingDetailsSlice';

export const store = configureStore({
	reducer: {
		trainingDetails: trainingDetailsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
