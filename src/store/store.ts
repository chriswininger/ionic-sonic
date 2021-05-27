import { configureStore } from '@reduxjs/toolkit';
import audioFramesReducer from './globalReducers/audioFramesReducer';
import audioSourceReducer from './globalReducers/audioSourceReducer';

const store = configureStore({
  reducer: {
    audioFramesSlice: audioFramesReducer,
    audioSource: audioSourceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
