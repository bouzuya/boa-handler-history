import test from 'ava';
import { A, O } from 'b-o-a';
import { init as initType } from '../src/';
import { History as HistoryType } from '../src/history';
import * as sinon from 'sinon';
import * as proxyquire from 'proxyquire';

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
  const routes = [];
  const action$ = O.empty();
  const options = { re: () => null };
  init({ routes }).handler(action$, options);
  t.ok(History.callCount === 1);
  t.ok(start.callCount === 0);
  t.ok(go.callCount === 0);
});

test(t => {
  t.plan(3);
  const init: typeof initType = t.context.init;
  const History: sinon.SinonStub = t.context.History;
  const go: sinon.SinonStub = t.context.go;
  const start: sinon.SinonStub = t.context.start;
  const routes = [];
  const action$ = O.of({ type: 'foo' });
  const options = { re: () => null };
  return init({ routes }).handler(action$, options).do(() => {
    t.ok(History.callCount === 1);
    t.ok(start.callCount === 1);
    t.ok(go.callCount === 0);
  });
});

test(t => {
  t.plan(4);
  const init: typeof initType = t.context.init;
  const History: sinon.SinonStub = t.context.History;
  const go: sinon.SinonStub = t.context.go;
  const start: sinon.SinonStub = t.context.start;
  const routes = [];
  const action$ = O.fromArray([
    { type: 'go-to', data: '/' },
    { type: 'foo' } // to run the .do operator
  ]);
  const options = { re: () => null };
  return init({ routes }).handler(action$, options).do(() => {
    t.ok(History.callCount === 1);
    t.ok(start.callCount === 1);
    t.ok(go.callCount === 1);
    t.same(go.getCall(0).args, ['/']);
  });
});
