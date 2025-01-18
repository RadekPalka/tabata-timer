import { useSelector } from 'react-redux';
import { TrainingDetailsForm } from './components/TrainingDetailsForm';
import { TrainingTimer } from './components/TrainingTimer';
import { AppState } from './types/AppState';
import { SoundButton } from './components/SoundButton';

function App() {
	const appState = useSelector(
		(state: { appState: AppState }) => state.appState.value
	);

	return (
		<>
			<SoundButton />
			<h1 className='text-center text-xl mt-3 mb-5'>Stoper Tabata</h1>
			{appState === 'edit' && <TrainingDetailsForm />}

			{appState === 'timer' && <TrainingTimer />}
		</>
	);
}

export default App;
