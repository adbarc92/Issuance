import { useState, useEffect } from 'react';
import { socket } from 'io';
import { ClientNotification } from 'types/notification';
import { ClientSubscription } from 'types/subscription';

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

export interface SocketEvent<T> {
  eventName: string;
  callback: (payload: T) => void;
}

function removeSocketEvents<T>(socketEvents: SocketEvent<T>[]) {
  socketEvents.forEach(socketEvent => {
    const { eventName } = socketEvent;
    console.log('Disabling socket:', eventName);
    socket.off(eventName);
  });
}

export function useSocketEvents<T>(socketEvents: SocketEvent<T>[]): void {
  useEffect(() => {
    socketEvents.forEach(socketEvent => {
      const { eventName, callback } = socketEvent;
      console.log('Enabling socket:', eventName);
      socket.on(eventName, callback);
    });

    return () => {
      removeSocketEvents(socketEvents);
    };
  }, [socketEvents]);
}
