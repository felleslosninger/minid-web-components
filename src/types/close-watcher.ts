interface CloseWatcher extends EventTarget {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (options?: CloseWatcherOptions): CloseWatcher;
  requestClose(): void;
  close(): void;
  destroy(): void;

  oncancel: (event: Event) => void | null;
  onclose: (event: Event) => void | null;
}

declare const CloseWatcher: CloseWatcher;

interface CloseWatcherOptions {
  signal: AbortSignal;
}

declare interface Window {
  CloseWatcher?: CloseWatcher;
}
