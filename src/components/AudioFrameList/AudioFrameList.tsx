import { useDispatch, useSelector } from 'react-redux';
import { AudioFramePoint, frameSelected, toggleFrameSelected } from '../../store/globalReducers/audioFramesReducer';
import { RootState } from '../../store/store';
import AudioFrame from './AudioFrame/AudioFrame';
import './AudioFrameList.scss';
import { useState } from 'react';
import selectPageFromFames from './selectors/selectPageFromFrames';

const WIDTH = 400;
const HEIGHT = 400;
const PAGE_SIZE = 30;

export default function AudioFrameList() {
  const dispatch = useDispatch();
  const [page, setPage]  = useState(0);

  const frames: AudioFramePoint[][] = useSelector((state: RootState) => selectPageFromFames(state, page, PAGE_SIZE));

  return (
    <>
      <div className="is-audio-frame-list">
        {
          frames.map((audioFrame: AudioFramePoint[], ndx: number) => (
            <AudioFrame
              id={`${ndx}`}
              frameNdx={ndx}
              key={ndx}
              frame={audioFrame}
              width={WIDTH}
              height={HEIGHT}
              onClick={() => dispatch(toggleFrameSelected(ndx))}
            />))
        }
      </div>

      <div className="is-audio-frame-pagination-controls">
        <button onClick={() => setPage(page - 1)}>{'<<'}</button>

        <button onClick={() => setPage(page + 1)}>{'>>'}</button>
      </div>
    </>
  )
}
