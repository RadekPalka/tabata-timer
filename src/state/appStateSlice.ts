import { AppState } from './../types/AppState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
	value: 'edit',
};

const appStateSlice = createSlice({
	name: 'app-state',
	initialState,
	reducers: {
		setState: (state, action: PayloadAction<AppState['value']>) => {
			state.value = action.payload;
		},
	},
});

export const { setState } = appStateSlice.actions;
export default appStateSlice.reducer;
