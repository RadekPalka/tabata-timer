import { TrainingObjectType } from '../types/TrainingObjectType';
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
		updateTrainingArr: (state, action: PayloadAction<TrainingObjectType>) => {
			const {
				exerciseLength,
				restLength,
				numberOfCycles,
				numberOfSets,
				restBetweenSets,
			} = action.payload;
			const arr: StageObj[] = [];
			let cycleIndex = 0;
			let secCounter = 0;
			for (let j = 0; j < numberOfSets; j++) {
				for (let i = 0; i < numberOfCycles; i++) {
					cycleIndex = i + 1;
					secCounter += exerciseLength;
					arr.push({
						type: 'exercise',
						secCounter,
						setIndex: j + 1,
						cycleIndex,
					});

					if (!restLength || i === numberOfCycles - 1) continue;
					secCounter += restLength;
					arr.push({
						type: 'rest',
						secCounter,
						setIndex: j + 1,
						cycleIndex,
					});
				}

				if (numberOfSets > 1 && j < numberOfSets - 1) {
					secCounter += restBetweenSets;
					arr.push({
						type: 'rest-between-sets',
						secCounter,
						setIndex: j + 1,
						cycleIndex,
					});
				} else if (j === numberOfSets - 1) {
					arr.push({
						type: 'done',
						secCounter,
						setIndex: j + 1,
						cycleIndex,
					});
				}
			}
			state.trainingArr = arr;
		},
	},
});

export const { updateTrainingArr } = trainingArrSlice.actions;

export default trainingArrSlice.reducer;
