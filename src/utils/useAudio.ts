const FFT_SIZE = 2048;

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

analyser.fftSize = FFT_SIZE;

export default function useAudio(): { audioCtx: AudioContext, analyser: AnalyserNode } {
  return {
    audioCtx,
    analyser
  }
}
