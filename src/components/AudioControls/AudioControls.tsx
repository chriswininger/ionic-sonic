import React, { useEffect, useState } from 'react';
import './AudioControls.scss';
import AudioFilesService from '../../services/AudioFilesService';
import useAudio from '../../utils/useAudio';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Nullable } from '../../utils/nullable';
import { AudioFramePoint, frameAcquired } from '../../store/globalReducers/audioFramesReducer';
import { audioSourceLoaded, audioSourcePlayed, audioSourceStopped } from '../../store/globalReducers/audioSourceReducer';
import selectSelectedFrames from '../AudioFrameList/selectors/selectSelectedFrames';

const FILE_NAME = 'Bad_Kids_to_the_Front__Dearhoof.mp3';

const WIDTH = 400;
const HEIGHT = 400;

let global_stopped = false;

export default function AudioControls() {
  const dispatch = useDispatch();
  const [audioSource, setAudioSource] = useState<Nullable<AudioBufferSourceNode>>(null);
  const { audioCtx, analyser } = useAudio();
  // const audioSource: Nullable<AudioBufferSourceNode> = useSelector((state: RootState) => state.audioSource.source);
  const isNotPlaying: boolean = useSelector((state: RootState) => !state.audioSource.isPlaying);
  const isPlaying: boolean = useSelector((state: RootState) => state.audioSource.isPlaying);
  const selectedFrames: AudioFramePoint[][] = useSelector(selectSelectedFrames);

  const bufferLength = analyser.frequencyBinCount;

  useEffect(() => {
    AudioFilesService.get(FILE_NAME)
      .then((src: AudioBufferSourceNode) => {
        src.connect(analyser);
        src.connect(audioCtx.destination);

        setAudioSource(src);
        //dispatch(audioSourceLoaded(src));
      });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startAudioFrameAcquisitionLoop();
    }
  }, [isPlaying]);

  return (
    <div className="is-audio-controls is-page-content">
      <button disabled={!audioSource || isPlaying} onClick={onPlayClick}>
        Play
      </button>

      <button disabled={isNotPlaying} onClick={onStopClick}>
        Stop
      </button>

      <button onClick={onPlaySelectedClick}>
        Play Selected
      </button>
    </div>
  );

  function startAudioFrameAcquisitionLoop() {
    if (!isPlaying || global_stopped) {
      return;
    }

    requestAnimationFrame(startAudioFrameAcquisitionLoop);

    const graph = collectPointsForFrame();
    dispatch(frameAcquired(graph));
  }

  function collectPointsForFrame(): AudioFramePoint[] {
    const points: [number, number, number][] = [];

    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    const sliceWidth = WIDTH / bufferLength;

    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] / 128.0;

      let y = value * HEIGHT/2;

      points.push([x, y, value]);

      x += sliceWidth;
    }

    return points;
  }

  function onPlayClick() {
    if (audioSource) {
      dispatch(audioSourcePlayed());

      // this should be done in a thunk
      audioSource.start(0);
    }
  }

  function onStopClick() {
    if (audioSource) {
      dispatch(audioSourceStopped());

      global_stopped = true;
      audioSource.stop(0);
    }
  }

  function onPlaySelectedClick() {
    const node = audioCtx.createScriptProcessor(analyser.frequencyBinCount, 1, 2);

    node.onaudioprocess = processSoundFrame;  // processSoundFrameWhiteNoise

    node.connect(audioCtx.destination);

    let selectedPlayNdx = 0;

    function processSoundFrame(e: AudioProcessingEvent) {
      const L = e.outputBuffer.getChannelData(0);
      const R = e.outputBuffer.getChannelData(1);

      const frameToPlay = selectedFrames[selectedPlayNdx];

      for (let i = 0; i < L.length; i++) {
        const val = frameToPlay[i][2];
        // @ts-ignore
        L[i] = val;
        // @ts-ignore
        R[i] = val;
      }

      selectedPlayNdx = Math.floor((selectedPlayNdx + 1) % selectedFrames.length);
    }
  }

  function processSoundFrameWhiteNoise(e: AudioProcessingEvent) {
    const L = e.outputBuffer.getChannelData(0);
    const R = e.outputBuffer.getChannelData(1);

    for (let i = 0; i < L.length; i++) {
      L[i] = ((Math.random() * 2) - 1);
      R[i] = L[i];
    }
  }


}
