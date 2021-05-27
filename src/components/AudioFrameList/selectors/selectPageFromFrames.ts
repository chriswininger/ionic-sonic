import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export default function selectPageFromFames(state: RootState, page: number, pageSize: number) {
  const numFrames = state.audioFramesSlice.frames.length;
  const startNdx = page * pageSize;

  if (numFrames < pageSize) {
    return state.audioFramesSlice.frames;
  }
  else if (startNdx > numFrames) {
    return [];
  }
  else {
    return state.audioFramesSlice.frames.slice(page * pageSize, pageSize)
  }
}
