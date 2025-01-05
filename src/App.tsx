import { useDispatch, useSelector } from "react-redux";
import { TrainingDetailsForm } from "./components/TrainingDetailsForm";
import { TrainingTimer } from "./components/TrainingTimer";
import { AppState } from "./types/AppState";
import { switchSoundState } from "./state/soundSwitcherSlice";
import { RootState } from "./state/store";

function App() {
  const appState = useSelector(
    (state: { appState: AppState }) => state.appState.value
  );
  const dispatch = useDispatch();
  const soundState = useSelector(
    (state: RootState) => state.soundSwitcherState.isSoundsEnabled
  );
  return (
    <>
      <button
        className="btn bg-teal-700"
        onClick={() => dispatch(switchSoundState())}
      >
        {soundState ? "Wyłącz dźwięki" : "Włącz dźwięki"}
      </button>
      <h1 className="text-center text-xl mt-3 mb-5">Stoper Tabata</h1>
      {appState === "edit" && <TrainingDetailsForm />}

      {appState === "timer" && <TrainingTimer />}
    </>
  );
}

export default App;
