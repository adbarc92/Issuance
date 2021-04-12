import { useState, useEffect } from 'react';
import { socket } from 'io';
import { ClientNotification } from 'types/notification';

export interface SocketEvent {
  event: any;
  callback: () => void;
  notifications: ClientNotification;
}

// * useSocketEvents will replace this
// useEffect(() => {
// 	socket.on(SocketMessages.TASKS, (taskPayload: UpdateTaskResponse) => {
// 		console.log('updating task');
// 		if (taskPayload.userId !== getUserToken()) {
// 			handleUpdateTask(taskPayload);
// 			reRenderApp();
// 		}
// 	});
// 	return () => {
// 		clearCacheWithoutRender(CacheKey.TASKS);
// 		socket.off(SocketMessages.TASKS);
// 	};
// });

export function useSocketEvents(socketEvents: SocketEvent[]): void {
  useEffect(() => {
    socketEvents.forEach(socketEvent => {
      console.log('socketEvent:', socketEvent);
      const { event, callback } = socketEvent;
      socket.on(event, (notification: ClientNotification) => callback);
      return socket.off(event);
    });
  });
}
