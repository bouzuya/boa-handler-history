// History API Action (pushState / onpopstate event) -> RouteAction
// GoToAction -> History API Action

// TODO: GoBackAction

import { A, O, Handler } from 'boa-core';
import { init as makeRouter, Route } from 'boa-router';
import { HashHistory } from './hash-history';
import { History } from './history';
import { HistoryInterface } from './history-interface';

type HistoryOptions = {
  goToActionType?: string;
  historyType?: string;
  routes: Route[];
  routeActionType?: string;
};

export interface HistoryResponse {
  handler: Handler;
}

const makeHistory = (
  type: string, callback: (path: string) => void
): HistoryInterface => {
  if (type === 'hash') {
    return new HashHistory(callback);
  } else {
    // TODO: fallback
    return new History(callback);
  }
};

const init = (historyOptions: HistoryOptions): HistoryResponse => {
  const {
    routes, goToActionType, routeActionType, historyType
  } = historyOptions;
  const goToType = goToActionType ? goToActionType : 'go-to';
  const historyImpl = historyType ? historyType : 'auto';
  const routeType = routeActionType ? routeActionType : 'route';
  const router = makeRouter(routes);

  return {
    handler: (action$: O<A<any>>, options: any) => {
      const { re }: { re: (action: A<any>) => void; } = options;
      const history = makeHistory(historyImpl, (path => {
        const data = router(path);
        re({ type: routeType, data });
      }));
      let isStarted = false;
      return action$
        .do(() => {
          if (!isStarted) {
            isStarted = true;
            history.start();
          }
        })
        .filter(action => action.type === goToType)
        .map(({ data }) => data)
        .do((path: string) => history.go(path))
        .filter(() => false) // remove all
        .share();
    }
  };
};

export { init };
