import { useEffect } from 'react';
import useAudio from '../../utils/useAudio';
import AudioFilesService from '../../services/AudioFilesService';

const CANVAS_ID = 'is-oscilloscope-canvas';

const FILE_NAME = 'Bad_Kids_to_the_Front__Dearhoof.mp3';

const WIDTH = 400;
const HEIGHT = 400;

export default function Oscilloscope() {
  const { audioCtx, analyser } = useAudio();

  useEffect(() => {
    const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    AudioFilesService.get(FILE_NAME)
      .then((src: AudioBufferSourceNode) => {
        src.connect(analyser);
        src.start(0);
        src.connect(audioCtx.destination);


        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;

        if (canvasCtx) {
          canvasCtx.clearRect(0, 0, 400, 400);
        }

        draw(canvasCtx, canvas, bufferLength);
      });
  }, []);

  return (
    <>
    <audio src="assets/audio-files/Bad_Kids_to_the_Front__Dearhoof.mp3" />
      <canvas id={CANVAS_ID} width={400} height={400}>
      </canvas>
    </>
  );

  function draw(canvasCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, bufferLength: number) {
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    if (canvasCtx) {
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, 400, 400);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = 400 * 1.0 / bufferLength;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y = v * 400/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    }

    requestAnimationFrame(() => draw(canvasCtx, canvas, bufferLength));
  }
}
