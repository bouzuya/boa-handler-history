interface HistoryInterface {
  back(): void;
  go(path: string, replace?: boolean): void;
  start(): void;
}

export { HistoryInterface };
