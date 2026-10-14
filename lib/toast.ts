"use client";

import { useSyncExternalStore } from "react";

export type Toast = { id: number; message: string };

const DURATION = 3200;
const listeners = new Set<() => void>();
let toasts: Toast[] = [];
let nextId = 1;

function emit(next: Toast[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const EMPTY: Toast[] = [];

export function useToasts() {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY,
  );
}

/** Show a short confirmation at the bottom of the screen. */
export function toast(message: string) {
  const id = nextId++;
  emit([...toasts.slice(-2), { id, message }]);
  window.setTimeout(() => emit(toasts.filter((t) => t.id !== id)), DURATION);
}
