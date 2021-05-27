import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const audioSourceSlice= createSlice({
  name: 'audioSource',
  initialState: {
    source: null as AudioBufferSourceNode | null,
    isPlaying: false as boolean
  },
  reducers: {
    audioSourceLoaded: (state , action: PayloadAction<AudioBufferSourceNode>) => {
      state.source = action.payload;
    },
    audioSourcePlayed: (state) => {
      state.isPlaying = true;
    },
    audioSourceStopped: (state) => {
      state.isPlaying = false;
    }
  }
});

export const {  audioSourceLoaded, audioSourcePlayed, audioSourceStopped } = audioSourceSlice.actions;

export default audioSourceSlice.reducer;
