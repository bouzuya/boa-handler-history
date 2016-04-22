import test from 'ava';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';
import { A, O } from 'boa-core';
import { Route } from 'boa-router';
import { init as initType } from '../src/';
import { History as HistoryType } from '../src/history';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';

test.beforeEach(t => {
  const sandbox = sinon.sandbox.create();
  const go = sandbox.stub();
  const start = sandbox.stub();
  const History = sandbox.stub();
  History.prototype.go = go;
  History.prototype.start = start;
  t.context.go = go;
  t.context.start = start;
  t.context.History = History;
  t.context.init = proxyquire('../src/', {
    './history': { History }
  }).init;
});

test(t => {
  t.plan(3);
  const init: typeof initType = t.context.init;
  const History: sinon.SinonStub = t.context.History;
  const go: sinon.SinonStub = t.context.go;
  const start: sinon.SinonStub = t.context.start;
  const routes: Route[] = [];
  const action$ = O.empty<A<any>>();
  const options = { re: (): any => null };
  init({ routes }).handler(action$, options);
  t.truthy(History.callCount === 1);
  t.truthy(start.callCount === 0);
  t.truthy(go.callCount === 0);
});

test(t => {
  t.plan(3);
  const init: typeof initType = t.context.init;
  const History: sinon.SinonStub = t.context.History;
  const go: sinon.SinonStub = t.context.go;
  const start: sinon.SinonStub = t.context.start;
  const routes: Route[] = [];
  const action$ = O.of({ type: 'foo' }); // ignore
  const options = { re: (): any => null };
  init({ routes }).handler(action$, options).subscribe();
  t.truthy(History.callCount === 1);
  t.truthy(start.callCount === 1);
  t.truthy(go.callCount === 0);
});

test(t => {
  t.plan(4);
  const init: typeof initType = t.context.init;
  const History: sinon.SinonStub = t.context.History;
  const go: sinon.SinonStub = t.context.go;
  const start: sinon.SinonStub = t.context.start;
  const routes: Route[] = [];
  const action$ = O.of<A<any>>({ type: 'go-to', data: '/' });
  const options = { re: (): any => null };
  init({ routes }).handler(action$, options).subscribe();
  t.truthy(History.callCount === 1);
  t.truthy(start.callCount === 1);
  t.truthy(go.callCount === 1);
  t.deepEqual(go.getCall(0).args, ['/']);
});
