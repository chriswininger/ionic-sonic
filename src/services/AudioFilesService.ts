import useAudio from '../utils/useAudio';

const BASE_PATH = 'assets/audio-files/';

export default class AudioFilesService {
  static async get(fileName: string): Promise<AudioBufferSourceNode> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { audioCtx } = useAudio();

    const path = `${BASE_PATH}/${fileName}`;

    const resp = await fetch(path);
    const dataBuffer = await resp.arrayBuffer();

    return new Promise((resolve) => {
      audioCtx.decodeAudioData(dataBuffer, (buffer: AudioBuffer) => {
        const bufferSrc = audioCtx.createBufferSource();
        bufferSrc.buffer = buffer;

        resolve(bufferSrc);
      });
    });
  }
}
