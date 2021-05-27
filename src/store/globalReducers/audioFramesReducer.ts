import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AudioFramePoint = [number, number, number];

export const audioFramesReducer = createSlice({
  name: 'audioFrames',
  initialState: {
    currentFrame: null as AudioFramePoint[] | null,
    frames: [] as AudioFramePoint[][],
    selectedFrames: [] as number []
  },
  reducers: {
    frameAcquired: (state, action: PayloadAction<AudioFramePoint[]>) => {
      state.currentFrame = action.payload;
      state.frames.push(action.payload);
    },
    frameSelected: (state, action: PayloadAction<number>) => {
      state.selectedFrames.push(action.payload);
    },
    frameDeselected: (state, action: PayloadAction<number>) => {
      state.selectedFrames = state.selectedFrames.filter(ndx => {
        return ndx !== action.payload;
      });
    },
    toggleFrameSelected: (state, action: PayloadAction<number>) => {
      const ndx = action.payload;
      const isSelected = typeof state.selectedFrames.find((curr) => curr === ndx) === 'number';

      if (isSelected) {
        state.selectedFrames = state.selectedFrames.filter(ndx => {
          return ndx !== action.payload;
        });
      } else {
        state.selectedFrames.push(action.payload);
      }
    }
  }
});

export const { frameAcquired, frameSelected, frameDeselected, toggleFrameSelected } = audioFramesReducer.actions;

export default audioFramesReducer.reducer;
