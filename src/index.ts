// History API Action (pushState / onpopstate event) -> RouteAction
// GoToAction -> History API Action

// TODO: GoBackAction

import { A, O, Handler } from 'b-o-a';
import { init as makeRouter, Route } from 'boajs-router';
import { History } from './history';

type HistoryOptions = {
  goToActionType?: string;
  routes: Route[];
  routeActionType?: string;
};

export interface HistoryResponse {
  handler: Handler;
}

const init = (historyOptions: HistoryOptions): HistoryResponse => {
  const { routes, goToActionType, routeActionType } = historyOptions;
  const goToType = goToActionType ? goToActionType : 'go-to';
  const routeType = routeActionType ? routeActionType : 'route';
  const router = makeRouter(routes);

  return {
    handler: (action$: O<A<any>>, options: any) => {
      const { re }: { re: (action: A<any>) => void; } = options;
      const history = new History(path => {
        const data = router(path);
        re({ type: routeType, data });
      });
      let isStarted = false;
      return action$
        .do(() => {
          if (!isStarted) {
            isStarted = true;
            history.start();
          }
        })
        .map(action => {
          if (action.type !== goToType) return action;
          const path: string = action.data;
          history.go(path);
          return; // return undefined
        })
        .filter(a => !!a) // remove undefined
        .share();
    }
  };
};

export { init };
