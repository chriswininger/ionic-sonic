import { configureStore } from '@reduxjs/toolkit';
import audioFramesReducer from './globalReducers/audioFramesReducer';

const store = configureStore({
  reducer: {
    audioFramesSlice: audioFramesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
