import { useEffect } from 'react';
import useAudio from '../../utils/useAudio';
import AudioFilesService from '../../services/AudioFilesService';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { AudioFramePoint, frameAcquired } from '../../store/globalReducers/audioFramesReducer';
import { Nullable } from '../../utils/nullable';

const CANVAS_ID = 'is-oscilloscope-canvas';

const FILE_NAME = 'Bad_Kids_to_the_Front__Dearhoof.mp3';

const WIDTH = 400;
const HEIGHT = 400;

export default function Oscilloscope() {
  const dispatch = useDispatch();
  const { audioCtx, analyser } = useAudio();
  const currentFrame: Nullable<AudioFramePoint[]> =
    useSelector((state: RootState) => state.audioFramesSlice.currentFrame);

  useEffect(() => {
    AudioFilesService.get(FILE_NAME)
      .then((src: AudioBufferSourceNode) => {
        src.connect(analyser);
        src.start(0);
        src.connect(audioCtx.destination);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;

        startAudioFrameAcquisitionLoop(bufferLength);
      });
  }, []);

  useEffect(() => {
    const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!canvasCtx || !currentFrame) {
      return;
    }

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    drawGraph(currentFrame, canvasCtx);
  }, [currentFrame]);

  return (
    <canvas id={CANVAS_ID} width={WIDTH} height={HEIGHT}>
    </canvas>
  );

  function startAudioFrameAcquisitionLoop(bufferLength: number) {
    requestAnimationFrame(() => startAudioFrameAcquisitionLoop(bufferLength));

    const graph = collectPointsForFrame(bufferLength);
    dispatch(frameAcquired(graph));
  }

  function collectPointsForFrame(bufferLength: number): AudioFramePoint[] {
    const dataArray = new Uint8Array(bufferLength);
    const points: [number, number, number][] = [];

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

  function drawGraph(graph:  AudioFramePoint [], canvasCtx: CanvasRenderingContext2D) {
    beginFrame(canvasCtx);

    for (let i = 0; i < graph.length; i++) {
      const point = graph[i];
      const x = point[0];
      const y = point[1];

      addPointToPath(canvasCtx, x, y, i);
    }

    endFrame(canvasCtx);
  }

  function beginFrame(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();
  }

  function endFrame(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.lineTo(WIDTH, HEIGHT/2);
    canvasCtx.stroke();
  }

  function addPointToPath(canvasCtx: CanvasRenderingContext2D, x: number, y: number, i: number) {
    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  }
}
