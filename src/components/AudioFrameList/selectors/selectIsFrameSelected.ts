import { RootState } from '../../../store/store';

export default function selectIsFrameSelected(state: RootState, ndx: number) {
  return typeof state.audioFramesSlice.selectedFrames.find((curr) => curr === ndx) === 'number';
}
