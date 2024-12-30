import { useState } from 'react';
import { TrainingDetailsForm } from './components/TrainingDetailsForm';
import { TrainingTimer } from './components/TrainingTimer';

function App() {
	const [isTrainingStarted, setIsTrainingStarted] = useState(false);
	return (
		<>
			<h1 className='text-center text-lg'>Tabata timer</h1>
			<TrainingDetailsForm />
			<button onClick={() => setIsTrainingStarted(true)}>
				Zacznij trening
			</button>
			{isTrainingStarted && <TrainingTimer />}
		</>
	);
}

export default App;
