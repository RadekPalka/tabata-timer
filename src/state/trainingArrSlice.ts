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

			for (let j = 0; j < numberOfSets; j++) {
				for (let i = 0; i < numberOfCycles; i++) {
					cycleIndex = i + 1;

					arr.push({
						type: 'exercise',
						length: exerciseLength,
						setIndex: j + 1,
						cycleIndex,
					});

					if (!restLength || i === numberOfCycles - 1) continue;

					arr.push({
						type: 'rest',
						length: restLength,
						setIndex: j + 1,
						cycleIndex,
					});
				}

				if (numberOfSets > 1 && j < numberOfSets - 1) {
					arr.push({
						type: 'rest-between-sets',
						length: restBetweenSets || 0,
						setIndex: j + 1,
						cycleIndex,
					});
				} else if (j === numberOfSets - 1) {
					arr.push({
						type: 'done',
						length: 0,
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
