import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrainingObjectType } from './../types/TrainingObjectType';

const initialState: TrainingObjectType = {
	exerciseLength: 20,
	restLength: 10,
	numberOfCycles: 8,
	numberOfSets: 1,
	restBetweenSets: 0,
};

const trainingDetailsSlice = createSlice({
	name: 'training-details',
	initialState,
	reducers: {
		updateTrainingDetails: (
			state,
			action: PayloadAction<TrainingObjectType>
		) => {
			return { ...state, ...action.payload };
		},
	},
});
export const { updateTrainingDetails } = trainingDetailsSlice.actions;
export default trainingDetailsSlice.reducer;
