import { AudioFramePoint } from '../../../store/globalReducers/audioFramesReducer';
import selectSelectedFrameIndexes from './selectSelectedFrameIndexes';
import { RootState } from '../../../store/store';

export default function selectSelectedFrames(rootState: RootState): AudioFramePoint[] [] {
  const selectedIndexes = selectSelectedFrameIndexes(rootState);

  return rootState.audioFramesSlice.frames;
  // return selectedIndexes.map(ndx => {
  //   return rootState.audioFramesSlice.frames[ndx];
  // });
}
