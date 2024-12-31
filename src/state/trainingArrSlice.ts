import { StageObj } from './../types/StageObj';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TrainingArrState = {
	trainingArr: StageObj[];
};

const initialState: TrainingArrState = {
	trainingArr: [],
};

const trainingArrSlice = createSlice({
	name: 'training-arr',
	initialState,
	reducers: {
		setTrainingArr: (state, action: PayloadAction<StageObj[]>) => {
			state.trainingArr = action.payload;
		},
	},
});

export const { setTrainingArr } = trainingArrSlice.actions;

export default trainingArrSlice.reducer;
