import * as url from 'url';
import { HistoryInterface } from './history-interface';

const parse = (urlString: string): string => {
  const hash = url.parse(urlString).hash;
  const path = hash && hash.length > 1 ? hash.substring(1) : '/';
  return path;
};

class HashHistory implements HistoryInterface {
  private callback: (path: string) => void;
  private window: any;

  constructor(callback: (path: string) => void) {
    this.callback = callback;
    this.window = Function('return this')();
  }

  back(): void {
    this.window.history.back();
  }

  go(path: string): void {
    this.window.location.hash = '#' + path;
  }

  start(): void {
    (<any>window).addEventListener('hashchange', (event: HashChangeEvent) => {
      const path = parse(event.newURL);
      this.callback(path);
    }, false);
  }
}

export { HashHistory };
