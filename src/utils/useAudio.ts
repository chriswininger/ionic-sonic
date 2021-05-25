const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

export default function useAudio(): { audioCtx: AudioContext, analyser: AnalyserNode } {
  return {
    audioCtx,
    analyser
  }
}
