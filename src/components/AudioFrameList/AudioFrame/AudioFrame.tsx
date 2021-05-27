import React, { MouseEventHandler, useEffect } from 'react';
import './AudioFrame.scss';
import { AudioFramePoint } from '../../../store/globalReducers/audioFramesReducer';
import selectIsFrameSelected from '../selectors/selectIsFrameSelected';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';

export default function AudioFrame(
  {frame, id, frameNdx, width, height, onClick}: AudioFrameProps
) {
  const isFrameSelected: boolean = useSelector((state: RootState) => selectIsFrameSelected(state, frameNdx));
  const selectionclass = isFrameSelected ? 'is-audio-frame-selected' : 'is-audio-frame-not-selected';

  useEffect(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    const canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!canvasCtx) {
      return;
    }

    drawGraph(frame, canvasCtx);
  }, [frame, id]);

  return (
    <div
      className={`is-audio-frame ${selectionclass}`}
      onClick={onClick}
    >
      <canvas id={id} width={width} height={height}>
      </canvas>
    </div>
  );

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
    canvasCtx.fillRect(0, 0, width, height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();
  }

  function endFrame(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.lineTo(width, height/2);
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

export interface AudioFrameProps {
  frame: AudioFramePoint [];
  id: string;
  frameNdx: number;
  width: number;
  height: number;
  onClick?: MouseEventHandler
}
