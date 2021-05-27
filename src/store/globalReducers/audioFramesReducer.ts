import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AudioFramePoint = [number, number, number];

export const audioFramesReducer = createSlice({
  name: 'audioFrames',
  initialState: {
    currentFrame: null as AudioFramePoint[] | null,
    frames: [] as AudioFramePoint[][]
  },
  reducers: {
    frameAcquired: (state , action: PayloadAction<AudioFramePoint[]>) => {
      state.currentFrame = action.payload;
      state.frames.push(action.payload);
    }
  }
});

export const { frameAcquired } = audioFramesReducer.actions;

export default audioFramesReducer.reducer;
