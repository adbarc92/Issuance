import { useState, useEffect } from 'react';
import { socket } from 'io';
import { ClientNotification } from 'types/notification';
import { ClientSubscription } from 'types/subscription';

export interface SocketEvent<T> {
  eventName: string;
  callback: (payload: T) => void;
}

function removeSocketEvents<T>(socketEvents: SocketEvent<T>[]) {
  socketEvents.forEach(socketEvent => {
    const { eventName } = socketEvent;
    socket.off(eventName);
  });
}

export function useSocketEvents<T>(socketEvents: SocketEvent<T>[]): void {
  useEffect(() => {
    socketEvents.forEach(socketEvent => {
      const { eventName, callback } = socketEvent;
      socket.on(eventName, callback);
    });

    return () => {
      removeSocketEvents(socketEvents);
    };
  }, [socketEvents]);
}
