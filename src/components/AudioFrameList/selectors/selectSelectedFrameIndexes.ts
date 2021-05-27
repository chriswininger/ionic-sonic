import { RootState } from '../../../store/store';

export default function selectSelectedFrameIndexes(rootState: RootState): number [] {
  return rootState.audioFramesSlice.selectedFrames;
}

