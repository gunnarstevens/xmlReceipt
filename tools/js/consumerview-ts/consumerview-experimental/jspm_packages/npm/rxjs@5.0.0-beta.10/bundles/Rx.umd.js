/* */ 
"format cjs";
(function(Buffer, process) {
  (function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.Rx = f();
    }
  })(function() {
    var define,
        module,
        exports;
    return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
              return a(o, !0);
            if (i)
              return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o] = {exports: {}};
          t[o][0].call(l.exports, function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          }, l, l.exports, e, t, n, r);
        }
        return n[o].exports;
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    })({
      1: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('./Subject');
        var Subscription_1 = require('./Subscription');
        var AsyncSubject = (function(_super) {
          __extends(AsyncSubject, _super);
          function AsyncSubject() {
            _super.apply(this, arguments);
            this.value = null;
            this.hasNext = false;
            this.hasCompleted = false;
          }
          AsyncSubject.prototype._subscribe = function(subscriber) {
            if (this.hasCompleted && this.hasNext) {
              subscriber.next(this.value);
              subscriber.complete();
              return Subscription_1.Subscription.EMPTY;
            } else if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription_1.Subscription.EMPTY;
            }
            return _super.prototype._subscribe.call(this, subscriber);
          };
          AsyncSubject.prototype.next = function(value) {
            this.value = value;
            this.hasNext = true;
          };
          AsyncSubject.prototype.complete = function() {
            this.hasCompleted = true;
            if (this.hasNext) {
              _super.prototype.next.call(this, this.value);
            }
            _super.prototype.complete.call(this);
          };
          return AsyncSubject;
        }(Subject_1.Subject));
        exports.AsyncSubject = AsyncSubject;
      }, {
        "./Subject": 11,
        "./Subscription": 14
      }],
      2: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('./Subject');
        var throwError_1 = require('./util/throwError');
        var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
        var BehaviorSubject = (function(_super) {
          __extends(BehaviorSubject, _super);
          function BehaviorSubject(_value) {
            _super.call(this);
            this._value = _value;
          }
          BehaviorSubject.prototype.getValue = function() {
            if (this.hasError) {
              throwError_1.throwError(this.thrownError);
            } else if (this.isUnsubscribed) {
              throwError_1.throwError(new ObjectUnsubscribedError_1.ObjectUnsubscribedError());
            } else {
              return this._value;
            }
          };
          Object.defineProperty(BehaviorSubject.prototype, "value", {
            get: function() {
              return this.getValue();
            },
            enumerable: true,
            configurable: true
          });
          BehaviorSubject.prototype._subscribe = function(subscriber) {
            var subscription = _super.prototype._subscribe.call(this, subscriber);
            if (subscription && !subscription.isUnsubscribed) {
              subscriber.next(this._value);
            }
            return subscription;
          };
          BehaviorSubject.prototype.next = function(value) {
            _super.prototype.next.call(this, this._value = value);
          };
          return BehaviorSubject;
        }(Subject_1.Subject));
        exports.BehaviorSubject = BehaviorSubject;
      }, {
        "./Subject": 11,
        "./util/ObjectUnsubscribedError": 317,
        "./util/throwError": 333
      }],
      3: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('./Subscriber');
        var InnerSubscriber = (function(_super) {
          __extends(InnerSubscriber, _super);
          function InnerSubscriber(parent, outerValue, outerIndex) {
            _super.call(this);
            this.parent = parent;
            this.outerValue = outerValue;
            this.outerIndex = outerIndex;
            this.index = 0;
          }
          InnerSubscriber.prototype._next = function(value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
          };
          InnerSubscriber.prototype._error = function(error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
          };
          InnerSubscriber.prototype._complete = function() {
            this.parent.notifyComplete(this);
            this.unsubscribe();
          };
          return InnerSubscriber;
        }(Subscriber_1.Subscriber));
        exports.InnerSubscriber = InnerSubscriber;
      }, {"./Subscriber": 13}],
      4: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('./Observable');
        var Notification = (function() {
          function Notification(kind, value, exception) {
            this.kind = kind;
            this.value = value;
            this.exception = exception;
            this.hasValue = kind === 'N';
          }
          Notification.prototype.observe = function(observer) {
            switch (this.kind) {
              case 'N':
                return observer.next && observer.next(this.value);
              case 'E':
                return observer.error && observer.error(this.exception);
              case 'C':
                return observer.complete && observer.complete();
            }
          };
          Notification.prototype.do = function(next, error, complete) {
            var kind = this.kind;
            switch (kind) {
              case 'N':
                return next && next(this.value);
              case 'E':
                return error && error(this.exception);
              case 'C':
                return complete && complete();
            }
          };
          Notification.prototype.accept = function(nextOrObserver, error, complete) {
            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
              return this.observe(nextOrObserver);
            } else {
              return this.do(nextOrObserver, error, complete);
            }
          };
          Notification.prototype.toObservable = function() {
            var kind = this.kind;
            switch (kind) {
              case 'N':
                return Observable_1.Observable.of(this.value);
              case 'E':
                return Observable_1.Observable.throw(this.exception);
              case 'C':
                return Observable_1.Observable.empty();
            }
          };
          Notification.createNext = function(value) {
            if (typeof value !== 'undefined') {
              return new Notification('N', value);
            }
            return this.undefinedValueNotification;
          };
          Notification.createError = function(err) {
            return new Notification('E', undefined, err);
          };
          Notification.createComplete = function() {
            return this.completeNotification;
          };
          Notification.completeNotification = new Notification('C');
          Notification.undefinedValueNotification = new Notification('N', undefined);
          return Notification;
        }());
        exports.Notification = Notification;
      }, {"./Observable": 5}],
      5: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./util/root');
        var toSubscriber_1 = require('./util/toSubscriber');
        var symbol_observable_1 = require('symbol-observable');
        var Observable = (function() {
          function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
              this._subscribe = subscribe;
            }
          }
          Observable.prototype.lift = function(operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
          };
          Observable.prototype.subscribe = function(observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
            if (operator) {
              operator.call(sink, this);
            } else {
              sink.add(this._subscribe(sink));
            }
            if (sink.syncErrorThrowable) {
              sink.syncErrorThrowable = false;
              if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
              }
            }
            return sink;
          };
          Observable.prototype.forEach = function(next, PromiseCtor) {
            var _this = this;
            if (!PromiseCtor) {
              if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
              } else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
              }
            }
            if (!PromiseCtor) {
              throw new Error('no Promise impl found');
            }
            return new PromiseCtor(function(resolve, reject) {
              var subscription = _this.subscribe(function(value) {
                if (subscription) {
                  try {
                    next(value);
                  } catch (err) {
                    reject(err);
                    subscription.unsubscribe();
                  }
                } else {
                  next(value);
                }
              }, reject, resolve);
            });
          };
          Observable.prototype._subscribe = function(subscriber) {
            return this.source.subscribe(subscriber);
          };
          Observable.prototype[symbol_observable_1.default] = function() {
            return this;
          };
          Observable.create = function(subscribe) {
            return new Observable(subscribe);
          };
          return Observable;
        }());
        exports.Observable = Observable;
      }, {
        "./util/root": 331,
        "./util/toSubscriber": 334,
        "symbol-observable": 336
      }],
      6: [function(require, module, exports) {
        "use strict";
        exports.empty = {
          isUnsubscribed: true,
          next: function(value) {},
          error: function(err) {
            throw err;
          },
          complete: function() {}
        };
      }, {}],
      7: [function(require, module, exports) {
        "use strict";
        var Subscriber_1 = require('./Subscriber');
        var Operator = (function() {
          function Operator() {}
          Operator.prototype.call = function(subscriber, source) {
            return source._subscribe(new Subscriber_1.Subscriber(subscriber));
          };
          return Operator;
        }());
        exports.Operator = Operator;
      }, {"./Subscriber": 13}],
      8: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('./Subscriber');
        var OuterSubscriber = (function(_super) {
          __extends(OuterSubscriber, _super);
          function OuterSubscriber() {
            _super.apply(this, arguments);
          }
          OuterSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
          };
          OuterSubscriber.prototype.notifyError = function(error, innerSub) {
            this.destination.error(error);
          };
          OuterSubscriber.prototype.notifyComplete = function(innerSub) {
            this.destination.complete();
          };
          return OuterSubscriber;
        }(Subscriber_1.Subscriber));
        exports.OuterSubscriber = OuterSubscriber;
      }, {"./Subscriber": 13}],
      9: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('./Subject');
        var queue_1 = require('./scheduler/queue');
        var observeOn_1 = require('./operator/observeOn');
        var ReplaySubject = (function(_super) {
          __extends(ReplaySubject, _super);
          function ReplaySubject(bufferSize, windowTime, scheduler) {
            if (bufferSize === void 0) {
              bufferSize = Number.POSITIVE_INFINITY;
            }
            if (windowTime === void 0) {
              windowTime = Number.POSITIVE_INFINITY;
            }
            _super.call(this);
            this.scheduler = scheduler;
            this._events = [];
            this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
            this._windowTime = windowTime < 1 ? 1 : windowTime;
          }
          ReplaySubject.prototype.next = function(value) {
            var now = this._getNow();
            this._events.push(new ReplayEvent(now, value));
            this._trimBufferThenGetEvents();
            _super.prototype.next.call(this, value);
          };
          ReplaySubject.prototype._subscribe = function(subscriber) {
            var _events = this._trimBufferThenGetEvents();
            var scheduler = this.scheduler;
            if (scheduler) {
              subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
            }
            var len = _events.length;
            for (var i = 0; i < len && !subscriber.isUnsubscribed; i++) {
              subscriber.next(_events[i].value);
            }
            return _super.prototype._subscribe.call(this, subscriber);
          };
          ReplaySubject.prototype._getNow = function() {
            return (this.scheduler || queue_1.queue).now();
          };
          ReplaySubject.prototype._trimBufferThenGetEvents = function() {
            var now = this._getNow();
            var _bufferSize = this._bufferSize;
            var _windowTime = this._windowTime;
            var _events = this._events;
            var eventsCount = _events.length;
            var spliceCount = 0;
            while (spliceCount < eventsCount) {
              if ((now - _events[spliceCount].time) < _windowTime) {
                break;
              }
              spliceCount++;
            }
            if (eventsCount > _bufferSize) {
              spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
            }
            if (spliceCount > 0) {
              _events.splice(0, spliceCount);
            }
            return _events;
          };
          return ReplaySubject;
        }(Subject_1.Subject));
        exports.ReplaySubject = ReplaySubject;
        var ReplayEvent = (function() {
          function ReplayEvent(time, value) {
            this.time = time;
            this.value = value;
          }
          return ReplayEvent;
        }());
      }, {
        "./Subject": 11,
        "./operator/observeOn": 243,
        "./scheduler/queue": 302
      }],
      10: [function(require, module, exports) {
        "use strict";
        var Subject_1 = require('./Subject');
        exports.Subject = Subject_1.Subject;
        var Observable_1 = require('./Observable');
        exports.Observable = Observable_1.Observable;
        require('./add/observable/bindCallback');
        require('./add/observable/bindNodeCallback');
        require('./add/observable/combineLatest');
        require('./add/observable/concat');
        require('./add/observable/defer');
        require('./add/observable/empty');
        require('./add/observable/forkJoin');
        require('./add/observable/from');
        require('./add/observable/fromEvent');
        require('./add/observable/fromEventPattern');
        require('./add/observable/fromPromise');
        require('./add/observable/generate');
        require('./add/observable/if');
        require('./add/observable/interval');
        require('./add/observable/merge');
        require('./add/observable/race');
        require('./add/observable/never');
        require('./add/observable/of');
        require('./add/observable/onErrorResumeNext');
        require('./add/observable/range');
        require('./add/observable/using');
        require('./add/observable/throw');
        require('./add/observable/timer');
        require('./add/observable/zip');
        require('./add/observable/dom/ajax');
        require('./add/observable/dom/webSocket');
        require('./add/operator/buffer');
        require('./add/operator/bufferCount');
        require('./add/operator/bufferTime');
        require('./add/operator/bufferToggle');
        require('./add/operator/bufferWhen');
        require('./add/operator/cache');
        require('./add/operator/catch');
        require('./add/operator/combineAll');
        require('./add/operator/combineLatest');
        require('./add/operator/concat');
        require('./add/operator/concatAll');
        require('./add/operator/concatMap');
        require('./add/operator/concatMapTo');
        require('./add/operator/count');
        require('./add/operator/dematerialize');
        require('./add/operator/debounce');
        require('./add/operator/debounceTime');
        require('./add/operator/defaultIfEmpty');
        require('./add/operator/delay');
        require('./add/operator/delayWhen');
        require('./add/operator/distinct');
        require('./add/operator/distinctKey');
        require('./add/operator/distinctUntilChanged');
        require('./add/operator/distinctUntilKeyChanged');
        require('./add/operator/do');
        require('./add/operator/exhaust');
        require('./add/operator/exhaustMap');
        require('./add/operator/expand');
        require('./add/operator/elementAt');
        require('./add/operator/filter');
        require('./add/operator/finally');
        require('./add/operator/find');
        require('./add/operator/findIndex');
        require('./add/operator/first');
        require('./add/operator/groupBy');
        require('./add/operator/ignoreElements');
        require('./add/operator/isEmpty');
        require('./add/operator/audit');
        require('./add/operator/auditTime');
        require('./add/operator/last');
        require('./add/operator/let');
        require('./add/operator/every');
        require('./add/operator/map');
        require('./add/operator/mapTo');
        require('./add/operator/materialize');
        require('./add/operator/max');
        require('./add/operator/merge');
        require('./add/operator/mergeAll');
        require('./add/operator/mergeMap');
        require('./add/operator/mergeMapTo');
        require('./add/operator/mergeScan');
        require('./add/operator/min');
        require('./add/operator/multicast');
        require('./add/operator/observeOn');
        require('./add/operator/onErrorResumeNext');
        require('./add/operator/pairwise');
        require('./add/operator/partition');
        require('./add/operator/pluck');
        require('./add/operator/publish');
        require('./add/operator/publishBehavior');
        require('./add/operator/publishReplay');
        require('./add/operator/publishLast');
        require('./add/operator/race');
        require('./add/operator/reduce');
        require('./add/operator/repeat');
        require('./add/operator/retry');
        require('./add/operator/retryWhen');
        require('./add/operator/sample');
        require('./add/operator/sampleTime');
        require('./add/operator/scan');
        require('./add/operator/share');
        require('./add/operator/single');
        require('./add/operator/skip');
        require('./add/operator/skipUntil');
        require('./add/operator/skipWhile');
        require('./add/operator/startWith');
        require('./add/operator/subscribeOn');
        require('./add/operator/switch');
        require('./add/operator/switchMap');
        require('./add/operator/switchMapTo');
        require('./add/operator/take');
        require('./add/operator/takeLast');
        require('./add/operator/takeUntil');
        require('./add/operator/takeWhile');
        require('./add/operator/throttle');
        require('./add/operator/throttleTime');
        require('./add/operator/timeInterval');
        require('./add/operator/timeout');
        require('./add/operator/timeoutWith');
        require('./add/operator/timestamp');
        require('./add/operator/toArray');
        require('./add/operator/toPromise');
        require('./add/operator/window');
        require('./add/operator/windowCount');
        require('./add/operator/windowTime');
        require('./add/operator/windowToggle');
        require('./add/operator/windowWhen');
        require('./add/operator/withLatestFrom');
        require('./add/operator/zip');
        require('./add/operator/zipAll');
        var Operator_1 = require('./Operator');
        exports.Operator = Operator_1.Operator;
        var Subscription_1 = require('./Subscription');
        exports.Subscription = Subscription_1.Subscription;
        var Subscriber_1 = require('./Subscriber');
        exports.Subscriber = Subscriber_1.Subscriber;
        var AsyncSubject_1 = require('./AsyncSubject');
        exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
        var ReplaySubject_1 = require('./ReplaySubject');
        exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
        var BehaviorSubject_1 = require('./BehaviorSubject');
        exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
        var MulticastObservable_1 = require('./observable/MulticastObservable');
        exports.MulticastObservable = MulticastObservable_1.MulticastObservable;
        var ConnectableObservable_1 = require('./observable/ConnectableObservable');
        exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
        var Notification_1 = require('./Notification');
        exports.Notification = Notification_1.Notification;
        var EmptyError_1 = require('./util/EmptyError');
        exports.EmptyError = EmptyError_1.EmptyError;
        var ArgumentOutOfRangeError_1 = require('./util/ArgumentOutOfRangeError');
        exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
        exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
        var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
        exports.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
        var timeInterval_1 = require('./operator/timeInterval');
        exports.TimeInterval = timeInterval_1.TimeInterval;
        var timestamp_1 = require('./operator/timestamp');
        exports.Timestamp = timestamp_1.Timestamp;
        var TestScheduler_1 = require('./testing/TestScheduler');
        exports.TestScheduler = TestScheduler_1.TestScheduler;
        var VirtualTimeScheduler_1 = require('./scheduler/VirtualTimeScheduler');
        exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
        var AjaxObservable_1 = require('./observable/dom/AjaxObservable');
        exports.AjaxResponse = AjaxObservable_1.AjaxResponse;
        exports.AjaxError = AjaxObservable_1.AjaxError;
        exports.AjaxTimeoutError = AjaxObservable_1.AjaxTimeoutError;
        var asap_1 = require('./scheduler/asap');
        var async_1 = require('./scheduler/async');
        var queue_1 = require('./scheduler/queue');
        var animationFrame_1 = require('./scheduler/animationFrame');
        var rxSubscriber_1 = require('./symbol/rxSubscriber');
        var iterator_1 = require('./symbol/iterator');
        var symbol_observable_1 = require('symbol-observable');
        var Scheduler = {
          asap: asap_1.asap,
          queue: queue_1.queue,
          animationFrame: animationFrame_1.animationFrame,
          async: async_1.async
        };
        exports.Scheduler = Scheduler;
        var Symbol = {
          rxSubscriber: rxSubscriber_1.$$rxSubscriber,
          observable: symbol_observable_1.default,
          iterator: iterator_1.$$iterator
        };
        exports.Symbol = Symbol;
      }, {
        "./AsyncSubject": 1,
        "./BehaviorSubject": 2,
        "./Notification": 4,
        "./Observable": 5,
        "./Operator": 7,
        "./ReplaySubject": 9,
        "./Subject": 11,
        "./Subscriber": 13,
        "./Subscription": 14,
        "./add/observable/bindCallback": 15,
        "./add/observable/bindNodeCallback": 16,
        "./add/observable/combineLatest": 17,
        "./add/observable/concat": 18,
        "./add/observable/defer": 19,
        "./add/observable/dom/ajax": 20,
        "./add/observable/dom/webSocket": 21,
        "./add/observable/empty": 22,
        "./add/observable/forkJoin": 23,
        "./add/observable/from": 24,
        "./add/observable/fromEvent": 25,
        "./add/observable/fromEventPattern": 26,
        "./add/observable/fromPromise": 27,
        "./add/observable/generate": 28,
        "./add/observable/if": 29,
        "./add/observable/interval": 30,
        "./add/observable/merge": 31,
        "./add/observable/never": 32,
        "./add/observable/of": 33,
        "./add/observable/onErrorResumeNext": 34,
        "./add/observable/race": 35,
        "./add/observable/range": 36,
        "./add/observable/throw": 37,
        "./add/observable/timer": 38,
        "./add/observable/using": 39,
        "./add/observable/zip": 40,
        "./add/operator/audit": 41,
        "./add/operator/auditTime": 42,
        "./add/operator/buffer": 43,
        "./add/operator/bufferCount": 44,
        "./add/operator/bufferTime": 45,
        "./add/operator/bufferToggle": 46,
        "./add/operator/bufferWhen": 47,
        "./add/operator/cache": 48,
        "./add/operator/catch": 49,
        "./add/operator/combineAll": 50,
        "./add/operator/combineLatest": 51,
        "./add/operator/concat": 52,
        "./add/operator/concatAll": 53,
        "./add/operator/concatMap": 54,
        "./add/operator/concatMapTo": 55,
        "./add/operator/count": 56,
        "./add/operator/debounce": 57,
        "./add/operator/debounceTime": 58,
        "./add/operator/defaultIfEmpty": 59,
        "./add/operator/delay": 60,
        "./add/operator/delayWhen": 61,
        "./add/operator/dematerialize": 62,
        "./add/operator/distinct": 63,
        "./add/operator/distinctKey": 64,
        "./add/operator/distinctUntilChanged": 65,
        "./add/operator/distinctUntilKeyChanged": 66,
        "./add/operator/do": 67,
        "./add/operator/elementAt": 68,
        "./add/operator/every": 69,
        "./add/operator/exhaust": 70,
        "./add/operator/exhaustMap": 71,
        "./add/operator/expand": 72,
        "./add/operator/filter": 73,
        "./add/operator/finally": 74,
        "./add/operator/find": 75,
        "./add/operator/findIndex": 76,
        "./add/operator/first": 77,
        "./add/operator/groupBy": 78,
        "./add/operator/ignoreElements": 79,
        "./add/operator/isEmpty": 80,
        "./add/operator/last": 81,
        "./add/operator/let": 82,
        "./add/operator/map": 83,
        "./add/operator/mapTo": 84,
        "./add/operator/materialize": 85,
        "./add/operator/max": 86,
        "./add/operator/merge": 87,
        "./add/operator/mergeAll": 88,
        "./add/operator/mergeMap": 89,
        "./add/operator/mergeMapTo": 90,
        "./add/operator/mergeScan": 91,
        "./add/operator/min": 92,
        "./add/operator/multicast": 93,
        "./add/operator/observeOn": 94,
        "./add/operator/onErrorResumeNext": 95,
        "./add/operator/pairwise": 96,
        "./add/operator/partition": 97,
        "./add/operator/pluck": 98,
        "./add/operator/publish": 99,
        "./add/operator/publishBehavior": 100,
        "./add/operator/publishLast": 101,
        "./add/operator/publishReplay": 102,
        "./add/operator/race": 103,
        "./add/operator/reduce": 104,
        "./add/operator/repeat": 105,
        "./add/operator/retry": 106,
        "./add/operator/retryWhen": 107,
        "./add/operator/sample": 108,
        "./add/operator/sampleTime": 109,
        "./add/operator/scan": 110,
        "./add/operator/share": 111,
        "./add/operator/single": 112,
        "./add/operator/skip": 113,
        "./add/operator/skipUntil": 114,
        "./add/operator/skipWhile": 115,
        "./add/operator/startWith": 116,
        "./add/operator/subscribeOn": 117,
        "./add/operator/switch": 118,
        "./add/operator/switchMap": 119,
        "./add/operator/switchMapTo": 120,
        "./add/operator/take": 121,
        "./add/operator/takeLast": 122,
        "./add/operator/takeUntil": 123,
        "./add/operator/takeWhile": 124,
        "./add/operator/throttle": 125,
        "./add/operator/throttleTime": 126,
        "./add/operator/timeInterval": 127,
        "./add/operator/timeout": 128,
        "./add/operator/timeoutWith": 129,
        "./add/operator/timestamp": 130,
        "./add/operator/toArray": 131,
        "./add/operator/toPromise": 132,
        "./add/operator/window": 133,
        "./add/operator/windowCount": 134,
        "./add/operator/windowTime": 135,
        "./add/operator/windowToggle": 136,
        "./add/operator/windowWhen": 137,
        "./add/operator/withLatestFrom": 138,
        "./add/operator/zip": 139,
        "./add/operator/zipAll": 140,
        "./observable/ConnectableObservable": 145,
        "./observable/MulticastObservable": 157,
        "./observable/dom/AjaxObservable": 170,
        "./operator/timeInterval": 276,
        "./operator/timestamp": 279,
        "./scheduler/VirtualTimeScheduler": 298,
        "./scheduler/animationFrame": 299,
        "./scheduler/asap": 300,
        "./scheduler/async": 301,
        "./scheduler/queue": 302,
        "./symbol/iterator": 303,
        "./symbol/rxSubscriber": 304,
        "./testing/TestScheduler": 309,
        "./util/ArgumentOutOfRangeError": 311,
        "./util/EmptyError": 312,
        "./util/ObjectUnsubscribedError": 317,
        "./util/UnsubscriptionError": 318,
        "symbol-observable": 336
      }],
      11: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('./Observable');
        var Subscriber_1 = require('./Subscriber');
        var Subscription_1 = require('./Subscription');
        var ObjectUnsubscribedError_1 = require('./util/ObjectUnsubscribedError');
        var SubjectSubscription_1 = require('./SubjectSubscription');
        var rxSubscriber_1 = require('./symbol/rxSubscriber');
        var SubjectSubscriber = (function(_super) {
          __extends(SubjectSubscriber, _super);
          function SubjectSubscriber(destination) {
            _super.call(this, destination);
            this.destination = destination;
          }
          return SubjectSubscriber;
        }(Subscriber_1.Subscriber));
        exports.SubjectSubscriber = SubjectSubscriber;
        var Subject = (function(_super) {
          __extends(Subject, _super);
          function Subject() {
            _super.call(this);
            this.observers = [];
            this.isUnsubscribed = false;
            this.isStopped = false;
            this.hasError = false;
            this.thrownError = null;
          }
          Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function() {
            return new SubjectSubscriber(this);
          };
          Subject.prototype.lift = function(operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
          };
          Subject.prototype.next = function(value) {
            if (this.isUnsubscribed) {
              throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
              var observers = this.observers;
              var len = observers.length;
              var copy = observers.slice();
              for (var i = 0; i < len; i++) {
                copy[i].next(value);
              }
            }
          };
          Subject.prototype.error = function(err) {
            if (this.isUnsubscribed) {
              throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
              copy[i].error(err);
            }
            this.observers.length = 0;
          };
          Subject.prototype.complete = function() {
            if (this.isUnsubscribed) {
              throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
              copy[i].complete();
            }
            this.observers.length = 0;
          };
          Subject.prototype.unsubscribe = function() {
            this.isStopped = true;
            this.isUnsubscribed = true;
            this.observers = null;
          };
          Subject.prototype._subscribe = function(subscriber) {
            if (this.isUnsubscribed) {
              throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
            } else if (this.hasError) {
              subscriber.error(this.thrownError);
              return Subscription_1.Subscription.EMPTY;
            } else if (this.isStopped) {
              subscriber.complete();
              return Subscription_1.Subscription.EMPTY;
            } else {
              this.observers.push(subscriber);
              return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
            }
          };
          Subject.prototype.asObservable = function() {
            var observable = new Observable_1.Observable();
            observable.source = this;
            return observable;
          };
          Subject.create = function(destination, source) {
            return new AnonymousSubject(destination, source);
          };
          return Subject;
        }(Observable_1.Observable));
        exports.Subject = Subject;
        var AnonymousSubject = (function(_super) {
          __extends(AnonymousSubject, _super);
          function AnonymousSubject(destination, source) {
            _super.call(this);
            this.destination = destination;
            this.source = source;
          }
          AnonymousSubject.prototype.next = function(value) {
            var destination = this.destination;
            if (destination && destination.next) {
              destination.next(value);
            }
          };
          AnonymousSubject.prototype.error = function(err) {
            var destination = this.destination;
            if (destination && destination.error) {
              this.destination.error(err);
            }
          };
          AnonymousSubject.prototype.complete = function() {
            var destination = this.destination;
            if (destination && destination.complete) {
              this.destination.complete();
            }
          };
          AnonymousSubject.prototype._subscribe = function(subscriber) {
            var source = this.source;
            if (source) {
              return this.source.subscribe(subscriber);
            } else {
              return Subscription_1.Subscription.EMPTY;
            }
          };
          return AnonymousSubject;
        }(Subject));
        exports.AnonymousSubject = AnonymousSubject;
      }, {
        "./Observable": 5,
        "./SubjectSubscription": 12,
        "./Subscriber": 13,
        "./Subscription": 14,
        "./symbol/rxSubscriber": 304,
        "./util/ObjectUnsubscribedError": 317
      }],
      12: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscription_1 = require('./Subscription');
        var SubjectSubscription = (function(_super) {
          __extends(SubjectSubscription, _super);
          function SubjectSubscription(subject, subscriber) {
            _super.call(this);
            this.subject = subject;
            this.subscriber = subscriber;
            this.isUnsubscribed = false;
          }
          SubjectSubscription.prototype.unsubscribe = function() {
            if (this.isUnsubscribed) {
              return;
            }
            this.isUnsubscribed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.isUnsubscribed) {
              return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
              observers.splice(subscriberIndex, 1);
            }
          };
          return SubjectSubscription;
        }(Subscription_1.Subscription));
        exports.SubjectSubscription = SubjectSubscription;
      }, {"./Subscription": 14}],
      13: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isFunction_1 = require('./util/isFunction');
        var Subscription_1 = require('./Subscription');
        var Observer_1 = require('./Observer');
        var rxSubscriber_1 = require('./symbol/rxSubscriber');
        var Subscriber = (function(_super) {
          __extends(Subscriber, _super);
          function Subscriber(destinationOrNext, error, complete) {
            _super.call(this);
            this.syncErrorValue = null;
            this.syncErrorThrown = false;
            this.syncErrorThrowable = false;
            this.isStopped = false;
            switch (arguments.length) {
              case 0:
                this.destination = Observer_1.empty;
                break;
              case 1:
                if (!destinationOrNext) {
                  this.destination = Observer_1.empty;
                  break;
                }
                if (typeof destinationOrNext === 'object') {
                  if (destinationOrNext instanceof Subscriber) {
                    this.destination = destinationOrNext;
                    this.destination.add(this);
                  } else {
                    this.syncErrorThrowable = true;
                    this.destination = new SafeSubscriber(this, destinationOrNext);
                  }
                  break;
                }
              default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
            }
          }
          Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function() {
            return this;
          };
          Subscriber.create = function(next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
          };
          Subscriber.prototype.next = function(value) {
            if (!this.isStopped) {
              this._next(value);
            }
          };
          Subscriber.prototype.error = function(err) {
            if (!this.isStopped) {
              this.isStopped = true;
              this._error(err);
            }
          };
          Subscriber.prototype.complete = function() {
            if (!this.isStopped) {
              this.isStopped = true;
              this._complete();
            }
          };
          Subscriber.prototype.unsubscribe = function() {
            if (this.isUnsubscribed) {
              return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
          };
          Subscriber.prototype._next = function(value) {
            this.destination.next(value);
          };
          Subscriber.prototype._error = function(err) {
            this.destination.error(err);
            this.unsubscribe();
          };
          Subscriber.prototype._complete = function() {
            this.destination.complete();
            this.unsubscribe();
          };
          return Subscriber;
        }(Subscription_1.Subscription));
        exports.Subscriber = Subscriber;
        var SafeSubscriber = (function(_super) {
          __extends(SafeSubscriber, _super);
          function SafeSubscriber(_parent, observerOrNext, error, complete) {
            _super.call(this);
            this._parent = _parent;
            var next;
            var context = this;
            if (isFunction_1.isFunction(observerOrNext)) {
              next = observerOrNext;
            } else if (observerOrNext) {
              context = observerOrNext;
              next = observerOrNext.next;
              error = observerOrNext.error;
              complete = observerOrNext.complete;
              if (isFunction_1.isFunction(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
              }
              context.unsubscribe = this.unsubscribe.bind(this);
            }
            this._context = context;
            this._next = next;
            this._error = error;
            this._complete = complete;
          }
          SafeSubscriber.prototype.next = function(value) {
            if (!this.isStopped && this._next) {
              var _parent = this._parent;
              if (!_parent.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
              } else if (this.__tryOrSetError(_parent, this._next, value)) {
                this.unsubscribe();
              }
            }
          };
          SafeSubscriber.prototype.error = function(err) {
            if (!this.isStopped) {
              var _parent = this._parent;
              if (this._error) {
                if (!_parent.syncErrorThrowable) {
                  this.__tryOrUnsub(this._error, err);
                  this.unsubscribe();
                } else {
                  this.__tryOrSetError(_parent, this._error, err);
                  this.unsubscribe();
                }
              } else if (!_parent.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
              } else {
                _parent.syncErrorValue = err;
                _parent.syncErrorThrown = true;
                this.unsubscribe();
              }
            }
          };
          SafeSubscriber.prototype.complete = function() {
            if (!this.isStopped) {
              var _parent = this._parent;
              if (this._complete) {
                if (!_parent.syncErrorThrowable) {
                  this.__tryOrUnsub(this._complete);
                  this.unsubscribe();
                } else {
                  this.__tryOrSetError(_parent, this._complete);
                  this.unsubscribe();
                }
              } else {
                this.unsubscribe();
              }
            }
          };
          SafeSubscriber.prototype.__tryOrUnsub = function(fn, value) {
            try {
              fn.call(this._context, value);
            } catch (err) {
              this.unsubscribe();
              throw err;
            }
          };
          SafeSubscriber.prototype.__tryOrSetError = function(parent, fn, value) {
            try {
              fn.call(this._context, value);
            } catch (err) {
              parent.syncErrorValue = err;
              parent.syncErrorThrown = true;
              return true;
            }
            return false;
          };
          SafeSubscriber.prototype._unsubscribe = function() {
            var _parent = this._parent;
            this._context = null;
            this._parent = null;
            _parent.unsubscribe();
          };
          return SafeSubscriber;
        }(Subscriber));
      }, {
        "./Observer": 6,
        "./Subscription": 14,
        "./symbol/rxSubscriber": 304,
        "./util/isFunction": 324
      }],
      14: [function(require, module, exports) {
        "use strict";
        var isArray_1 = require('./util/isArray');
        var isObject_1 = require('./util/isObject');
        var isFunction_1 = require('./util/isFunction');
        var tryCatch_1 = require('./util/tryCatch');
        var errorObject_1 = require('./util/errorObject');
        var UnsubscriptionError_1 = require('./util/UnsubscriptionError');
        var Subscription = (function() {
          function Subscription(unsubscribe) {
            this.isUnsubscribed = false;
            if (unsubscribe) {
              this._unsubscribe = unsubscribe;
            }
          }
          Subscription.prototype.unsubscribe = function() {
            var hasErrors = false;
            var errors;
            if (this.isUnsubscribed) {
              return;
            }
            this.isUnsubscribed = true;
            var _a = this,
                _unsubscribe = _a._unsubscribe,
                _subscriptions = _a._subscriptions;
            this._subscriptions = null;
            if (isFunction_1.isFunction(_unsubscribe)) {
              var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
              if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                (errors = errors || []).push(errorObject_1.errorObject.e);
              }
            }
            if (isArray_1.isArray(_subscriptions)) {
              var index = -1;
              var len = _subscriptions.length;
              while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                  var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                  if (trial === errorObject_1.errorObject) {
                    hasErrors = true;
                    errors = errors || [];
                    var err = errorObject_1.errorObject.e;
                    if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                      errors = errors.concat(err.errors);
                    } else {
                      errors.push(err);
                    }
                  }
                }
              }
            }
            if (hasErrors) {
              throw new UnsubscriptionError_1.UnsubscriptionError(errors);
            }
          };
          Subscription.prototype.add = function(teardown) {
            if (!teardown || (teardown === this) || (teardown === Subscription.EMPTY)) {
              return;
            }
            var sub = teardown;
            switch (typeof teardown) {
              case 'function':
                sub = new Subscription(teardown);
              case 'object':
                if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
                  break;
                } else if (this.isUnsubscribed) {
                  sub.unsubscribe();
                } else {
                  (this._subscriptions || (this._subscriptions = [])).push(sub);
                }
                break;
              default:
                throw new Error('Unrecognized teardown ' + teardown + ' added to Subscription.');
            }
            return sub;
          };
          Subscription.prototype.remove = function(subscription) {
            if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
              return;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions) {
              var subscriptionIndex = subscriptions.indexOf(subscription);
              if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
              }
            }
          };
          Subscription.EMPTY = (function(empty) {
            empty.isUnsubscribed = true;
            return empty;
          }(new Subscription()));
          return Subscription;
        }());
        exports.Subscription = Subscription;
      }, {
        "./util/UnsubscriptionError": 318,
        "./util/errorObject": 321,
        "./util/isArray": 322,
        "./util/isFunction": 324,
        "./util/isObject": 326,
        "./util/tryCatch": 335
      }],
      15: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bindCallback_1 = require('../../observable/bindCallback');
        Observable_1.Observable.bindCallback = bindCallback_1.bindCallback;
      }, {
        "../../Observable": 5,
        "../../observable/bindCallback": 165
      }],
      16: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bindNodeCallback_1 = require('../../observable/bindNodeCallback');
        Observable_1.Observable.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;
      }, {
        "../../Observable": 5,
        "../../observable/bindNodeCallback": 166
      }],
      17: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var combineLatest_1 = require('../../observable/combineLatest');
        Observable_1.Observable.combineLatest = combineLatest_1.combineLatest;
      }, {
        "../../Observable": 5,
        "../../observable/combineLatest": 167
      }],
      18: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var concat_1 = require('../../observable/concat');
        Observable_1.Observable.concat = concat_1.concat;
      }, {
        "../../Observable": 5,
        "../../observable/concat": 168
      }],
      19: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var defer_1 = require('../../observable/defer');
        Observable_1.Observable.defer = defer_1.defer;
      }, {
        "../../Observable": 5,
        "../../observable/defer": 169
      }],
      20: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../../Observable');
        var ajax_1 = require('../../../observable/dom/ajax');
        Observable_1.Observable.ajax = ajax_1.ajax;
      }, {
        "../../../Observable": 5,
        "../../../observable/dom/ajax": 172
      }],
      21: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../../Observable');
        var webSocket_1 = require('../../../observable/dom/webSocket');
        Observable_1.Observable.webSocket = webSocket_1.webSocket;
      }, {
        "../../../Observable": 5,
        "../../../observable/dom/webSocket": 173
      }],
      22: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var empty_1 = require('../../observable/empty');
        Observable_1.Observable.empty = empty_1.empty;
      }, {
        "../../Observable": 5,
        "../../observable/empty": 174
      }],
      23: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var forkJoin_1 = require('../../observable/forkJoin');
        Observable_1.Observable.forkJoin = forkJoin_1.forkJoin;
      }, {
        "../../Observable": 5,
        "../../observable/forkJoin": 175
      }],
      24: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var from_1 = require('../../observable/from');
        Observable_1.Observable.from = from_1.from;
      }, {
        "../../Observable": 5,
        "../../observable/from": 176
      }],
      25: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var fromEvent_1 = require('../../observable/fromEvent');
        Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;
      }, {
        "../../Observable": 5,
        "../../observable/fromEvent": 177
      }],
      26: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var fromEventPattern_1 = require('../../observable/fromEventPattern');
        Observable_1.Observable.fromEventPattern = fromEventPattern_1.fromEventPattern;
      }, {
        "../../Observable": 5,
        "../../observable/fromEventPattern": 178
      }],
      27: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var fromPromise_1 = require('../../observable/fromPromise');
        Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;
      }, {
        "../../Observable": 5,
        "../../observable/fromPromise": 179
      }],
      28: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var GenerateObservable_1 = require('../../observable/GenerateObservable');
        Observable_1.Observable.generate = GenerateObservable_1.GenerateObservable.create;
      }, {
        "../../Observable": 5,
        "../../observable/GenerateObservable": 153
      }],
      29: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var if_1 = require('../../observable/if');
        Observable_1.Observable.if = if_1._if;
      }, {
        "../../Observable": 5,
        "../../observable/if": 180
      }],
      30: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var interval_1 = require('../../observable/interval');
        Observable_1.Observable.interval = interval_1.interval;
      }, {
        "../../Observable": 5,
        "../../observable/interval": 181
      }],
      31: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var merge_1 = require('../../observable/merge');
        Observable_1.Observable.merge = merge_1.merge;
      }, {
        "../../Observable": 5,
        "../../observable/merge": 182
      }],
      32: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var never_1 = require('../../observable/never');
        Observable_1.Observable.never = never_1.never;
      }, {
        "../../Observable": 5,
        "../../observable/never": 183
      }],
      33: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var of_1 = require('../../observable/of');
        Observable_1.Observable.of = of_1.of;
      }, {
        "../../Observable": 5,
        "../../observable/of": 184
      }],
      34: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var onErrorResumeNext_1 = require('../../operator/onErrorResumeNext');
        Observable_1.Observable.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNextStatic;
      }, {
        "../../Observable": 5,
        "../../operator/onErrorResumeNext": 244
      }],
      35: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var race_1 = require('../../operator/race');
        Observable_1.Observable.race = race_1.raceStatic;
      }, {
        "../../Observable": 5,
        "../../operator/race": 252
      }],
      36: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var range_1 = require('../../observable/range');
        Observable_1.Observable.range = range_1.range;
      }, {
        "../../Observable": 5,
        "../../observable/range": 185
      }],
      37: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var throw_1 = require('../../observable/throw');
        Observable_1.Observable.throw = throw_1._throw;
      }, {
        "../../Observable": 5,
        "../../observable/throw": 186
      }],
      38: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var timer_1 = require('../../observable/timer');
        Observable_1.Observable.timer = timer_1.timer;
      }, {
        "../../Observable": 5,
        "../../observable/timer": 187
      }],
      39: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var using_1 = require('../../observable/using');
        Observable_1.Observable.using = using_1.using;
      }, {
        "../../Observable": 5,
        "../../observable/using": 188
      }],
      40: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var zip_1 = require('../../observable/zip');
        Observable_1.Observable.zip = zip_1.zip;
      }, {
        "../../Observable": 5,
        "../../observable/zip": 189
      }],
      41: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var audit_1 = require('../../operator/audit');
        Observable_1.Observable.prototype.audit = audit_1.audit;
      }, {
        "../../Observable": 5,
        "../../operator/audit": 190
      }],
      42: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var auditTime_1 = require('../../operator/auditTime');
        Observable_1.Observable.prototype.auditTime = auditTime_1.auditTime;
      }, {
        "../../Observable": 5,
        "../../operator/auditTime": 191
      }],
      43: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var buffer_1 = require('../../operator/buffer');
        Observable_1.Observable.prototype.buffer = buffer_1.buffer;
      }, {
        "../../Observable": 5,
        "../../operator/buffer": 192
      }],
      44: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bufferCount_1 = require('../../operator/bufferCount');
        Observable_1.Observable.prototype.bufferCount = bufferCount_1.bufferCount;
      }, {
        "../../Observable": 5,
        "../../operator/bufferCount": 193
      }],
      45: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bufferTime_1 = require('../../operator/bufferTime');
        Observable_1.Observable.prototype.bufferTime = bufferTime_1.bufferTime;
      }, {
        "../../Observable": 5,
        "../../operator/bufferTime": 194
      }],
      46: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bufferToggle_1 = require('../../operator/bufferToggle');
        Observable_1.Observable.prototype.bufferToggle = bufferToggle_1.bufferToggle;
      }, {
        "../../Observable": 5,
        "../../operator/bufferToggle": 195
      }],
      47: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var bufferWhen_1 = require('../../operator/bufferWhen');
        Observable_1.Observable.prototype.bufferWhen = bufferWhen_1.bufferWhen;
      }, {
        "../../Observable": 5,
        "../../operator/bufferWhen": 196
      }],
      48: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var cache_1 = require('../../operator/cache');
        Observable_1.Observable.prototype.cache = cache_1.cache;
      }, {
        "../../Observable": 5,
        "../../operator/cache": 197
      }],
      49: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var catch_1 = require('../../operator/catch');
        Observable_1.Observable.prototype.catch = catch_1._catch;
      }, {
        "../../Observable": 5,
        "../../operator/catch": 198
      }],
      50: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var combineAll_1 = require('../../operator/combineAll');
        Observable_1.Observable.prototype.combineAll = combineAll_1.combineAll;
      }, {
        "../../Observable": 5,
        "../../operator/combineAll": 199
      }],
      51: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var combineLatest_1 = require('../../operator/combineLatest');
        Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;
      }, {
        "../../Observable": 5,
        "../../operator/combineLatest": 200
      }],
      52: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var concat_1 = require('../../operator/concat');
        Observable_1.Observable.prototype.concat = concat_1.concat;
      }, {
        "../../Observable": 5,
        "../../operator/concat": 201
      }],
      53: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var concatAll_1 = require('../../operator/concatAll');
        Observable_1.Observable.prototype.concatAll = concatAll_1.concatAll;
      }, {
        "../../Observable": 5,
        "../../operator/concatAll": 202
      }],
      54: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var concatMap_1 = require('../../operator/concatMap');
        Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;
      }, {
        "../../Observable": 5,
        "../../operator/concatMap": 203
      }],
      55: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var concatMapTo_1 = require('../../operator/concatMapTo');
        Observable_1.Observable.prototype.concatMapTo = concatMapTo_1.concatMapTo;
      }, {
        "../../Observable": 5,
        "../../operator/concatMapTo": 204
      }],
      56: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var count_1 = require('../../operator/count');
        Observable_1.Observable.prototype.count = count_1.count;
      }, {
        "../../Observable": 5,
        "../../operator/count": 205
      }],
      57: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var debounce_1 = require('../../operator/debounce');
        Observable_1.Observable.prototype.debounce = debounce_1.debounce;
      }, {
        "../../Observable": 5,
        "../../operator/debounce": 206
      }],
      58: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var debounceTime_1 = require('../../operator/debounceTime');
        Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;
      }, {
        "../../Observable": 5,
        "../../operator/debounceTime": 207
      }],
      59: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var defaultIfEmpty_1 = require('../../operator/defaultIfEmpty');
        Observable_1.Observable.prototype.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;
      }, {
        "../../Observable": 5,
        "../../operator/defaultIfEmpty": 208
      }],
      60: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var delay_1 = require('../../operator/delay');
        Observable_1.Observable.prototype.delay = delay_1.delay;
      }, {
        "../../Observable": 5,
        "../../operator/delay": 209
      }],
      61: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var delayWhen_1 = require('../../operator/delayWhen');
        Observable_1.Observable.prototype.delayWhen = delayWhen_1.delayWhen;
      }, {
        "../../Observable": 5,
        "../../operator/delayWhen": 210
      }],
      62: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var dematerialize_1 = require('../../operator/dematerialize');
        Observable_1.Observable.prototype.dematerialize = dematerialize_1.dematerialize;
      }, {
        "../../Observable": 5,
        "../../operator/dematerialize": 211
      }],
      63: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var distinct_1 = require('../../operator/distinct');
        Observable_1.Observable.prototype.distinct = distinct_1.distinct;
      }, {
        "../../Observable": 5,
        "../../operator/distinct": 212
      }],
      64: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var distinctKey_1 = require('../../operator/distinctKey');
        Observable_1.Observable.prototype.distinctKey = distinctKey_1.distinctKey;
      }, {
        "../../Observable": 5,
        "../../operator/distinctKey": 213
      }],
      65: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var distinctUntilChanged_1 = require('../../operator/distinctUntilChanged');
        Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;
      }, {
        "../../Observable": 5,
        "../../operator/distinctUntilChanged": 214
      }],
      66: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var distinctUntilKeyChanged_1 = require('../../operator/distinctUntilKeyChanged');
        Observable_1.Observable.prototype.distinctUntilKeyChanged = distinctUntilKeyChanged_1.distinctUntilKeyChanged;
      }, {
        "../../Observable": 5,
        "../../operator/distinctUntilKeyChanged": 215
      }],
      67: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var do_1 = require('../../operator/do');
        Observable_1.Observable.prototype.do = do_1._do;
      }, {
        "../../Observable": 5,
        "../../operator/do": 216
      }],
      68: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var elementAt_1 = require('../../operator/elementAt');
        Observable_1.Observable.prototype.elementAt = elementAt_1.elementAt;
      }, {
        "../../Observable": 5,
        "../../operator/elementAt": 217
      }],
      69: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var every_1 = require('../../operator/every');
        Observable_1.Observable.prototype.every = every_1.every;
      }, {
        "../../Observable": 5,
        "../../operator/every": 218
      }],
      70: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var exhaust_1 = require('../../operator/exhaust');
        Observable_1.Observable.prototype.exhaust = exhaust_1.exhaust;
      }, {
        "../../Observable": 5,
        "../../operator/exhaust": 219
      }],
      71: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var exhaustMap_1 = require('../../operator/exhaustMap');
        Observable_1.Observable.prototype.exhaustMap = exhaustMap_1.exhaustMap;
      }, {
        "../../Observable": 5,
        "../../operator/exhaustMap": 220
      }],
      72: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var expand_1 = require('../../operator/expand');
        Observable_1.Observable.prototype.expand = expand_1.expand;
      }, {
        "../../Observable": 5,
        "../../operator/expand": 221
      }],
      73: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var filter_1 = require('../../operator/filter');
        Observable_1.Observable.prototype.filter = filter_1.filter;
      }, {
        "../../Observable": 5,
        "../../operator/filter": 222
      }],
      74: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var finally_1 = require('../../operator/finally');
        Observable_1.Observable.prototype.finally = finally_1._finally;
      }, {
        "../../Observable": 5,
        "../../operator/finally": 223
      }],
      75: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var find_1 = require('../../operator/find');
        Observable_1.Observable.prototype.find = find_1.find;
      }, {
        "../../Observable": 5,
        "../../operator/find": 224
      }],
      76: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var findIndex_1 = require('../../operator/findIndex');
        Observable_1.Observable.prototype.findIndex = findIndex_1.findIndex;
      }, {
        "../../Observable": 5,
        "../../operator/findIndex": 225
      }],
      77: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var first_1 = require('../../operator/first');
        Observable_1.Observable.prototype.first = first_1.first;
      }, {
        "../../Observable": 5,
        "../../operator/first": 226
      }],
      78: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var groupBy_1 = require('../../operator/groupBy');
        Observable_1.Observable.prototype.groupBy = groupBy_1.groupBy;
      }, {
        "../../Observable": 5,
        "../../operator/groupBy": 227
      }],
      79: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var ignoreElements_1 = require('../../operator/ignoreElements');
        Observable_1.Observable.prototype.ignoreElements = ignoreElements_1.ignoreElements;
      }, {
        "../../Observable": 5,
        "../../operator/ignoreElements": 228
      }],
      80: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var isEmpty_1 = require('../../operator/isEmpty');
        Observable_1.Observable.prototype.isEmpty = isEmpty_1.isEmpty;
      }, {
        "../../Observable": 5,
        "../../operator/isEmpty": 229
      }],
      81: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var last_1 = require('../../operator/last');
        Observable_1.Observable.prototype.last = last_1.last;
      }, {
        "../../Observable": 5,
        "../../operator/last": 230
      }],
      82: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var let_1 = require('../../operator/let');
        Observable_1.Observable.prototype.let = let_1.letProto;
        Observable_1.Observable.prototype.letBind = let_1.letProto;
      }, {
        "../../Observable": 5,
        "../../operator/let": 231
      }],
      83: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var map_1 = require('../../operator/map');
        Observable_1.Observable.prototype.map = map_1.map;
      }, {
        "../../Observable": 5,
        "../../operator/map": 232
      }],
      84: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var mapTo_1 = require('../../operator/mapTo');
        Observable_1.Observable.prototype.mapTo = mapTo_1.mapTo;
      }, {
        "../../Observable": 5,
        "../../operator/mapTo": 233
      }],
      85: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var materialize_1 = require('../../operator/materialize');
        Observable_1.Observable.prototype.materialize = materialize_1.materialize;
      }, {
        "../../Observable": 5,
        "../../operator/materialize": 234
      }],
      86: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var max_1 = require('../../operator/max');
        Observable_1.Observable.prototype.max = max_1.max;
      }, {
        "../../Observable": 5,
        "../../operator/max": 235
      }],
      87: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var merge_1 = require('../../operator/merge');
        Observable_1.Observable.prototype.merge = merge_1.merge;
      }, {
        "../../Observable": 5,
        "../../operator/merge": 236
      }],
      88: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var mergeAll_1 = require('../../operator/mergeAll');
        Observable_1.Observable.prototype.mergeAll = mergeAll_1.mergeAll;
      }, {
        "../../Observable": 5,
        "../../operator/mergeAll": 237
      }],
      89: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var mergeMap_1 = require('../../operator/mergeMap');
        Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
        Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
      }, {
        "../../Observable": 5,
        "../../operator/mergeMap": 238
      }],
      90: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var mergeMapTo_1 = require('../../operator/mergeMapTo');
        Observable_1.Observable.prototype.flatMapTo = mergeMapTo_1.mergeMapTo;
        Observable_1.Observable.prototype.mergeMapTo = mergeMapTo_1.mergeMapTo;
      }, {
        "../../Observable": 5,
        "../../operator/mergeMapTo": 239
      }],
      91: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var mergeScan_1 = require('../../operator/mergeScan');
        Observable_1.Observable.prototype.mergeScan = mergeScan_1.mergeScan;
      }, {
        "../../Observable": 5,
        "../../operator/mergeScan": 240
      }],
      92: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var min_1 = require('../../operator/min');
        Observable_1.Observable.prototype.min = min_1.min;
      }, {
        "../../Observable": 5,
        "../../operator/min": 241
      }],
      93: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var multicast_1 = require('../../operator/multicast');
        Observable_1.Observable.prototype.multicast = multicast_1.multicast;
      }, {
        "../../Observable": 5,
        "../../operator/multicast": 242
      }],
      94: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var observeOn_1 = require('../../operator/observeOn');
        Observable_1.Observable.prototype.observeOn = observeOn_1.observeOn;
      }, {
        "../../Observable": 5,
        "../../operator/observeOn": 243
      }],
      95: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var onErrorResumeNext_1 = require('../../operator/onErrorResumeNext');
        Observable_1.Observable.prototype.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
      }, {
        "../../Observable": 5,
        "../../operator/onErrorResumeNext": 244
      }],
      96: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var pairwise_1 = require('../../operator/pairwise');
        Observable_1.Observable.prototype.pairwise = pairwise_1.pairwise;
      }, {
        "../../Observable": 5,
        "../../operator/pairwise": 245
      }],
      97: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var partition_1 = require('../../operator/partition');
        Observable_1.Observable.prototype.partition = partition_1.partition;
      }, {
        "../../Observable": 5,
        "../../operator/partition": 246
      }],
      98: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var pluck_1 = require('../../operator/pluck');
        Observable_1.Observable.prototype.pluck = pluck_1.pluck;
      }, {
        "../../Observable": 5,
        "../../operator/pluck": 247
      }],
      99: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var publish_1 = require('../../operator/publish');
        Observable_1.Observable.prototype.publish = publish_1.publish;
      }, {
        "../../Observable": 5,
        "../../operator/publish": 248
      }],
      100: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var publishBehavior_1 = require('../../operator/publishBehavior');
        Observable_1.Observable.prototype.publishBehavior = publishBehavior_1.publishBehavior;
      }, {
        "../../Observable": 5,
        "../../operator/publishBehavior": 249
      }],
      101: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var publishLast_1 = require('../../operator/publishLast');
        Observable_1.Observable.prototype.publishLast = publishLast_1.publishLast;
      }, {
        "../../Observable": 5,
        "../../operator/publishLast": 250
      }],
      102: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var publishReplay_1 = require('../../operator/publishReplay');
        Observable_1.Observable.prototype.publishReplay = publishReplay_1.publishReplay;
      }, {
        "../../Observable": 5,
        "../../operator/publishReplay": 251
      }],
      103: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var race_1 = require('../../operator/race');
        Observable_1.Observable.prototype.race = race_1.race;
      }, {
        "../../Observable": 5,
        "../../operator/race": 252
      }],
      104: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var reduce_1 = require('../../operator/reduce');
        Observable_1.Observable.prototype.reduce = reduce_1.reduce;
      }, {
        "../../Observable": 5,
        "../../operator/reduce": 253
      }],
      105: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var repeat_1 = require('../../operator/repeat');
        Observable_1.Observable.prototype.repeat = repeat_1.repeat;
      }, {
        "../../Observable": 5,
        "../../operator/repeat": 254
      }],
      106: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var retry_1 = require('../../operator/retry');
        Observable_1.Observable.prototype.retry = retry_1.retry;
      }, {
        "../../Observable": 5,
        "../../operator/retry": 255
      }],
      107: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var retryWhen_1 = require('../../operator/retryWhen');
        Observable_1.Observable.prototype.retryWhen = retryWhen_1.retryWhen;
      }, {
        "../../Observable": 5,
        "../../operator/retryWhen": 256
      }],
      108: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var sample_1 = require('../../operator/sample');
        Observable_1.Observable.prototype.sample = sample_1.sample;
      }, {
        "../../Observable": 5,
        "../../operator/sample": 257
      }],
      109: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var sampleTime_1 = require('../../operator/sampleTime');
        Observable_1.Observable.prototype.sampleTime = sampleTime_1.sampleTime;
      }, {
        "../../Observable": 5,
        "../../operator/sampleTime": 258
      }],
      110: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var scan_1 = require('../../operator/scan');
        Observable_1.Observable.prototype.scan = scan_1.scan;
      }, {
        "../../Observable": 5,
        "../../operator/scan": 259
      }],
      111: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var share_1 = require('../../operator/share');
        Observable_1.Observable.prototype.share = share_1.share;
      }, {
        "../../Observable": 5,
        "../../operator/share": 260
      }],
      112: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var single_1 = require('../../operator/single');
        Observable_1.Observable.prototype.single = single_1.single;
      }, {
        "../../Observable": 5,
        "../../operator/single": 261
      }],
      113: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var skip_1 = require('../../operator/skip');
        Observable_1.Observable.prototype.skip = skip_1.skip;
      }, {
        "../../Observable": 5,
        "../../operator/skip": 262
      }],
      114: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var skipUntil_1 = require('../../operator/skipUntil');
        Observable_1.Observable.prototype.skipUntil = skipUntil_1.skipUntil;
      }, {
        "../../Observable": 5,
        "../../operator/skipUntil": 263
      }],
      115: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var skipWhile_1 = require('../../operator/skipWhile');
        Observable_1.Observable.prototype.skipWhile = skipWhile_1.skipWhile;
      }, {
        "../../Observable": 5,
        "../../operator/skipWhile": 264
      }],
      116: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var startWith_1 = require('../../operator/startWith');
        Observable_1.Observable.prototype.startWith = startWith_1.startWith;
      }, {
        "../../Observable": 5,
        "../../operator/startWith": 265
      }],
      117: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var subscribeOn_1 = require('../../operator/subscribeOn');
        Observable_1.Observable.prototype.subscribeOn = subscribeOn_1.subscribeOn;
      }, {
        "../../Observable": 5,
        "../../operator/subscribeOn": 266
      }],
      118: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var switch_1 = require('../../operator/switch');
        Observable_1.Observable.prototype.switch = switch_1._switch;
      }, {
        "../../Observable": 5,
        "../../operator/switch": 267
      }],
      119: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var switchMap_1 = require('../../operator/switchMap');
        Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;
      }, {
        "../../Observable": 5,
        "../../operator/switchMap": 268
      }],
      120: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var switchMapTo_1 = require('../../operator/switchMapTo');
        Observable_1.Observable.prototype.switchMapTo = switchMapTo_1.switchMapTo;
      }, {
        "../../Observable": 5,
        "../../operator/switchMapTo": 269
      }],
      121: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var take_1 = require('../../operator/take');
        Observable_1.Observable.prototype.take = take_1.take;
      }, {
        "../../Observable": 5,
        "../../operator/take": 270
      }],
      122: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var takeLast_1 = require('../../operator/takeLast');
        Observable_1.Observable.prototype.takeLast = takeLast_1.takeLast;
      }, {
        "../../Observable": 5,
        "../../operator/takeLast": 271
      }],
      123: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var takeUntil_1 = require('../../operator/takeUntil');
        Observable_1.Observable.prototype.takeUntil = takeUntil_1.takeUntil;
      }, {
        "../../Observable": 5,
        "../../operator/takeUntil": 272
      }],
      124: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var takeWhile_1 = require('../../operator/takeWhile');
        Observable_1.Observable.prototype.takeWhile = takeWhile_1.takeWhile;
      }, {
        "../../Observable": 5,
        "../../operator/takeWhile": 273
      }],
      125: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var throttle_1 = require('../../operator/throttle');
        Observable_1.Observable.prototype.throttle = throttle_1.throttle;
      }, {
        "../../Observable": 5,
        "../../operator/throttle": 274
      }],
      126: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var throttleTime_1 = require('../../operator/throttleTime');
        Observable_1.Observable.prototype.throttleTime = throttleTime_1.throttleTime;
      }, {
        "../../Observable": 5,
        "../../operator/throttleTime": 275
      }],
      127: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var timeInterval_1 = require('../../operator/timeInterval');
        Observable_1.Observable.prototype.timeInterval = timeInterval_1.timeInterval;
      }, {
        "../../Observable": 5,
        "../../operator/timeInterval": 276
      }],
      128: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var timeout_1 = require('../../operator/timeout');
        Observable_1.Observable.prototype.timeout = timeout_1.timeout;
      }, {
        "../../Observable": 5,
        "../../operator/timeout": 277
      }],
      129: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var timeoutWith_1 = require('../../operator/timeoutWith');
        Observable_1.Observable.prototype.timeoutWith = timeoutWith_1.timeoutWith;
      }, {
        "../../Observable": 5,
        "../../operator/timeoutWith": 278
      }],
      130: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var timestamp_1 = require('../../operator/timestamp');
        Observable_1.Observable.prototype.timestamp = timestamp_1.timestamp;
      }, {
        "../../Observable": 5,
        "../../operator/timestamp": 279
      }],
      131: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var toArray_1 = require('../../operator/toArray');
        Observable_1.Observable.prototype.toArray = toArray_1.toArray;
      }, {
        "../../Observable": 5,
        "../../operator/toArray": 280
      }],
      132: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var toPromise_1 = require('../../operator/toPromise');
        Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;
      }, {
        "../../Observable": 5,
        "../../operator/toPromise": 281
      }],
      133: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var window_1 = require('../../operator/window');
        Observable_1.Observable.prototype.window = window_1.window;
      }, {
        "../../Observable": 5,
        "../../operator/window": 282
      }],
      134: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var windowCount_1 = require('../../operator/windowCount');
        Observable_1.Observable.prototype.windowCount = windowCount_1.windowCount;
      }, {
        "../../Observable": 5,
        "../../operator/windowCount": 283
      }],
      135: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var windowTime_1 = require('../../operator/windowTime');
        Observable_1.Observable.prototype.windowTime = windowTime_1.windowTime;
      }, {
        "../../Observable": 5,
        "../../operator/windowTime": 284
      }],
      136: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var windowToggle_1 = require('../../operator/windowToggle');
        Observable_1.Observable.prototype.windowToggle = windowToggle_1.windowToggle;
      }, {
        "../../Observable": 5,
        "../../operator/windowToggle": 285
      }],
      137: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var windowWhen_1 = require('../../operator/windowWhen');
        Observable_1.Observable.prototype.windowWhen = windowWhen_1.windowWhen;
      }, {
        "../../Observable": 5,
        "../../operator/windowWhen": 286
      }],
      138: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var withLatestFrom_1 = require('../../operator/withLatestFrom');
        Observable_1.Observable.prototype.withLatestFrom = withLatestFrom_1.withLatestFrom;
      }, {
        "../../Observable": 5,
        "../../operator/withLatestFrom": 287
      }],
      139: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var zip_1 = require('../../operator/zip');
        Observable_1.Observable.prototype.zip = zip_1.zipProto;
      }, {
        "../../Observable": 5,
        "../../operator/zip": 288
      }],
      140: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../../Observable');
        var zipAll_1 = require('../../operator/zipAll');
        Observable_1.Observable.prototype.zipAll = zipAll_1.zipAll;
      }, {
        "../../Observable": 5,
        "../../operator/zipAll": 289
      }],
      141: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var ScalarObservable_1 = require('./ScalarObservable');
        var EmptyObservable_1 = require('./EmptyObservable');
        var ArrayLikeObservable = (function(_super) {
          __extends(ArrayLikeObservable, _super);
          function ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler) {
            _super.call(this);
            this.arrayLike = arrayLike;
            this.scheduler = scheduler;
            if (!mapFn && !scheduler && arrayLike.length === 1) {
              this._isScalar = true;
              this.value = arrayLike[0];
            }
            if (mapFn) {
              this.mapFn = mapFn.bind(thisArg);
            }
          }
          ArrayLikeObservable.create = function(arrayLike, mapFn, thisArg, scheduler) {
            var length = arrayLike.length;
            if (length === 0) {
              return new EmptyObservable_1.EmptyObservable();
            } else if (length === 1 && !mapFn) {
              return new ScalarObservable_1.ScalarObservable(arrayLike[0], scheduler);
            } else {
              return new ArrayLikeObservable(arrayLike, mapFn, thisArg, scheduler);
            }
          };
          ArrayLikeObservable.dispatch = function(state) {
            var arrayLike = state.arrayLike,
                index = state.index,
                length = state.length,
                mapFn = state.mapFn,
                subscriber = state.subscriber;
            if (subscriber.isUnsubscribed) {
              return;
            }
            if (index >= length) {
              subscriber.complete();
              return;
            }
            var result = mapFn ? mapFn(arrayLike[index], index) : arrayLike[index];
            subscriber.next(result);
            state.index = index + 1;
            this.schedule(state);
          };
          ArrayLikeObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var _a = this,
                arrayLike = _a.arrayLike,
                mapFn = _a.mapFn,
                scheduler = _a.scheduler;
            var length = arrayLike.length;
            if (scheduler) {
              return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
                arrayLike: arrayLike,
                index: index,
                length: length,
                mapFn: mapFn,
                subscriber: subscriber
              });
            } else {
              for (var i = 0; i < length && !subscriber.isUnsubscribed; i++) {
                var result = mapFn ? mapFn(arrayLike[i], i) : arrayLike[i];
                subscriber.next(result);
              }
              subscriber.complete();
            }
          };
          return ArrayLikeObservable;
        }(Observable_1.Observable));
        exports.ArrayLikeObservable = ArrayLikeObservable;
      }, {
        "../Observable": 5,
        "./EmptyObservable": 147,
        "./ScalarObservable": 161
      }],
      142: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var ScalarObservable_1 = require('./ScalarObservable');
        var EmptyObservable_1 = require('./EmptyObservable');
        var isScheduler_1 = require('../util/isScheduler');
        var ArrayObservable = (function(_super) {
          __extends(ArrayObservable, _super);
          function ArrayObservable(array, scheduler) {
            _super.call(this);
            this.array = array;
            this.scheduler = scheduler;
            if (!scheduler && array.length === 1) {
              this._isScalar = true;
              this.value = array[0];
            }
          }
          ArrayObservable.create = function(array, scheduler) {
            return new ArrayObservable(array, scheduler);
          };
          ArrayObservable.of = function() {
            var array = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              array[_i - 0] = arguments[_i];
            }
            var scheduler = array[array.length - 1];
            if (isScheduler_1.isScheduler(scheduler)) {
              array.pop();
            } else {
              scheduler = null;
            }
            var len = array.length;
            if (len > 1) {
              return new ArrayObservable(array, scheduler);
            } else if (len === 1) {
              return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
            } else {
              return new EmptyObservable_1.EmptyObservable(scheduler);
            }
          };
          ArrayObservable.dispatch = function(state) {
            var array = state.array,
                index = state.index,
                count = state.count,
                subscriber = state.subscriber;
            if (index >= count) {
              subscriber.complete();
              return;
            }
            subscriber.next(array[index]);
            if (subscriber.isUnsubscribed) {
              return;
            }
            state.index = index + 1;
            this.schedule(state);
          };
          ArrayObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var array = this.array;
            var count = array.length;
            var scheduler = this.scheduler;
            if (scheduler) {
              return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array,
                index: index,
                count: count,
                subscriber: subscriber
              });
            } else {
              for (var i = 0; i < count && !subscriber.isUnsubscribed; i++) {
                subscriber.next(array[i]);
              }
              subscriber.complete();
            }
          };
          return ArrayObservable;
        }(Observable_1.Observable));
        exports.ArrayObservable = ArrayObservable;
      }, {
        "../Observable": 5,
        "../util/isScheduler": 328,
        "./EmptyObservable": 147,
        "./ScalarObservable": 161
      }],
      143: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var AsyncSubject_1 = require('../AsyncSubject');
        var BoundCallbackObservable = (function(_super) {
          __extends(BoundCallbackObservable, _super);
          function BoundCallbackObservable(callbackFunc, selector, args, scheduler) {
            _super.call(this);
            this.callbackFunc = callbackFunc;
            this.selector = selector;
            this.args = args;
            this.scheduler = scheduler;
          }
          BoundCallbackObservable.create = function(func, selector, scheduler) {
            if (selector === void 0) {
              selector = undefined;
            }
            return function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
              }
              return new BoundCallbackObservable(func, selector, args, scheduler);
            };
          };
          BoundCallbackObservable.prototype._subscribe = function(subscriber) {
            var callbackFunc = this.callbackFunc;
            var args = this.args;
            var scheduler = this.scheduler;
            var subject = this.subject;
            if (!scheduler) {
              if (!subject) {
                subject = this.subject = new AsyncSubject_1.AsyncSubject();
                var handler = function handlerFn() {
                  var innerArgs = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    innerArgs[_i - 0] = arguments[_i];
                  }
                  var source = handlerFn.source;
                  var selector = source.selector,
                      subject = source.subject;
                  if (selector) {
                    var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                    if (result_1 === errorObject_1.errorObject) {
                      subject.error(errorObject_1.errorObject.e);
                    } else {
                      subject.next(result_1);
                      subject.complete();
                    }
                  } else {
                    subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                    subject.complete();
                  }
                };
                handler.source = this;
                var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
                if (result === errorObject_1.errorObject) {
                  subject.error(errorObject_1.errorObject.e);
                }
              }
              return subject.subscribe(subscriber);
            } else {
              return scheduler.schedule(BoundCallbackObservable.dispatch, 0, {
                source: this,
                subscriber: subscriber
              });
            }
          };
          BoundCallbackObservable.dispatch = function(state) {
            var self = this;
            var source = state.source,
                subscriber = state.subscriber;
            var callbackFunc = source.callbackFunc,
                args = source.args,
                scheduler = source.scheduler;
            var subject = source.subject;
            if (!subject) {
              subject = source.subject = new AsyncSubject_1.AsyncSubject();
              var handler = function handlerFn() {
                var innerArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  innerArgs[_i - 0] = arguments[_i];
                }
                var source = handlerFn.source;
                var selector = source.selector,
                    subject = source.subject;
                if (selector) {
                  var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                  if (result_2 === errorObject_1.errorObject) {
                    self.add(scheduler.schedule(dispatchError, 0, {
                      err: errorObject_1.errorObject.e,
                      subject: subject
                    }));
                  } else {
                    self.add(scheduler.schedule(dispatchNext, 0, {
                      value: result_2,
                      subject: subject
                    }));
                  }
                } else {
                  var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                  self.add(scheduler.schedule(dispatchNext, 0, {
                    value: value,
                    subject: subject
                  }));
                }
              };
              handler.source = source;
              var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
              if (result === errorObject_1.errorObject) {
                subject.error(errorObject_1.errorObject.e);
              }
            }
            self.add(subject.subscribe(subscriber));
          };
          return BoundCallbackObservable;
        }(Observable_1.Observable));
        exports.BoundCallbackObservable = BoundCallbackObservable;
        function dispatchNext(arg) {
          var value = arg.value,
              subject = arg.subject;
          subject.next(value);
          subject.complete();
        }
        function dispatchError(arg) {
          var err = arg.err,
              subject = arg.subject;
          subject.error(err);
        }
      }, {
        "../AsyncSubject": 1,
        "../Observable": 5,
        "../util/errorObject": 321,
        "../util/tryCatch": 335
      }],
      144: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var AsyncSubject_1 = require('../AsyncSubject');
        var BoundNodeCallbackObservable = (function(_super) {
          __extends(BoundNodeCallbackObservable, _super);
          function BoundNodeCallbackObservable(callbackFunc, selector, args, scheduler) {
            _super.call(this);
            this.callbackFunc = callbackFunc;
            this.selector = selector;
            this.args = args;
            this.scheduler = scheduler;
          }
          BoundNodeCallbackObservable.create = function(func, selector, scheduler) {
            if (selector === void 0) {
              selector = undefined;
            }
            return function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
              }
              return new BoundNodeCallbackObservable(func, selector, args, scheduler);
            };
          };
          BoundNodeCallbackObservable.prototype._subscribe = function(subscriber) {
            var callbackFunc = this.callbackFunc;
            var args = this.args;
            var scheduler = this.scheduler;
            var subject = this.subject;
            if (!scheduler) {
              if (!subject) {
                subject = this.subject = new AsyncSubject_1.AsyncSubject();
                var handler = function handlerFn() {
                  var innerArgs = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    innerArgs[_i - 0] = arguments[_i];
                  }
                  var source = handlerFn.source;
                  var selector = source.selector,
                      subject = source.subject;
                  var err = innerArgs.shift();
                  if (err) {
                    subject.error(err);
                  } else if (selector) {
                    var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                    if (result_1 === errorObject_1.errorObject) {
                      subject.error(errorObject_1.errorObject.e);
                    } else {
                      subject.next(result_1);
                      subject.complete();
                    }
                  } else {
                    subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                    subject.complete();
                  }
                };
                handler.source = this;
                var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
                if (result === errorObject_1.errorObject) {
                  subject.error(errorObject_1.errorObject.e);
                }
              }
              return subject.subscribe(subscriber);
            } else {
              return scheduler.schedule(dispatch, 0, {
                source: this,
                subscriber: subscriber
              });
            }
          };
          return BoundNodeCallbackObservable;
        }(Observable_1.Observable));
        exports.BoundNodeCallbackObservable = BoundNodeCallbackObservable;
        function dispatch(state) {
          var self = this;
          var source = state.source,
              subscriber = state.subscriber;
          var callbackFunc = source.callbackFunc,
              args = source.args,
              scheduler = source.scheduler;
          var subject = source.subject;
          if (!subject) {
            subject = source.subject = new AsyncSubject_1.AsyncSubject();
            var handler = function handlerFn() {
              var innerArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i - 0] = arguments[_i];
              }
              var source = handlerFn.source;
              var selector = source.selector,
                  subject = source.subject;
              var err = innerArgs.shift();
              if (err) {
                subject.error(err);
              } else if (selector) {
                var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                if (result_2 === errorObject_1.errorObject) {
                  self.add(scheduler.schedule(dispatchError, 0, {
                    err: errorObject_1.errorObject.e,
                    subject: subject
                  }));
                } else {
                  self.add(scheduler.schedule(dispatchNext, 0, {
                    value: result_2,
                    subject: subject
                  }));
                }
              } else {
                var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                self.add(scheduler.schedule(dispatchNext, 0, {
                  value: value,
                  subject: subject
                }));
              }
            };
            handler.source = source;
            var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
            if (result === errorObject_1.errorObject) {
              subject.error(errorObject_1.errorObject.e);
            }
          }
          self.add(subject.subscribe(subscriber));
        }
        function dispatchNext(arg) {
          var value = arg.value,
              subject = arg.subject;
          subject.next(value);
          subject.complete();
        }
        function dispatchError(arg) {
          var err = arg.err,
              subject = arg.subject;
          subject.error(err);
        }
      }, {
        "../AsyncSubject": 1,
        "../Observable": 5,
        "../util/errorObject": 321,
        "../util/tryCatch": 335
      }],
      145: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var Observable_1 = require('../Observable');
        var Subscriber_1 = require('../Subscriber');
        var Subscription_1 = require('../Subscription');
        var ConnectableObservable = (function(_super) {
          __extends(ConnectableObservable, _super);
          function ConnectableObservable(source, subjectFactory) {
            _super.call(this);
            this.source = source;
            this.subjectFactory = subjectFactory;
            this._refCount = 0;
          }
          ConnectableObservable.prototype._subscribe = function(subscriber) {
            return this.getSubject().subscribe(subscriber);
          };
          ConnectableObservable.prototype.getSubject = function() {
            var subject = this._subject;
            if (!subject || subject.isStopped) {
              this._subject = this.subjectFactory();
            }
            return this._subject;
          };
          ConnectableObservable.prototype.connect = function() {
            var connection = this._connection;
            if (!connection) {
              connection = this._connection = new Subscription_1.Subscription();
              connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
              if (connection.isUnsubscribed) {
                this._connection = null;
                connection = Subscription_1.Subscription.EMPTY;
              } else {
                this._connection = connection;
              }
            }
            return connection;
          };
          ConnectableObservable.prototype.refCount = function() {
            return this.lift(new RefCountOperator(this));
          };
          return ConnectableObservable;
        }(Observable_1.Observable));
        exports.ConnectableObservable = ConnectableObservable;
        var ConnectableSubscriber = (function(_super) {
          __extends(ConnectableSubscriber, _super);
          function ConnectableSubscriber(destination, connectable) {
            _super.call(this, destination);
            this.connectable = connectable;
          }
          ConnectableSubscriber.prototype._error = function(err) {
            this._unsubscribe();
            _super.prototype._error.call(this, err);
          };
          ConnectableSubscriber.prototype._complete = function() {
            this._unsubscribe();
            _super.prototype._complete.call(this);
          };
          ConnectableSubscriber.prototype._unsubscribe = function() {
            var connectable = this.connectable;
            if (connectable) {
              this.connectable = null;
              var connection = connectable._connection;
              connectable._refCount = 0;
              connectable._subject = null;
              connectable._connection = null;
              if (connection) {
                connection.unsubscribe();
              }
            }
          };
          return ConnectableSubscriber;
        }(Subject_1.SubjectSubscriber));
        var RefCountOperator = (function() {
          function RefCountOperator(connectable) {
            this.connectable = connectable;
          }
          RefCountOperator.prototype.call = function(subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source._subscribe(refCounter);
            if (!refCounter.isUnsubscribed) {
              refCounter.connection = connectable.connect();
            }
            return subscription;
          };
          return RefCountOperator;
        }());
        var RefCountSubscriber = (function(_super) {
          __extends(RefCountSubscriber, _super);
          function RefCountSubscriber(destination, connectable) {
            _super.call(this, destination);
            this.connectable = connectable;
          }
          RefCountSubscriber.prototype._unsubscribe = function() {
            var connectable = this.connectable;
            if (!connectable) {
              this.connection = null;
              return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
              this.connection = null;
              return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
              this.connection = null;
              return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
              sharedConnection.unsubscribe();
            }
          };
          return RefCountSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Observable": 5,
        "../Subject": 11,
        "../Subscriber": 13,
        "../Subscription": 14
      }],
      146: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var DeferObservable = (function(_super) {
          __extends(DeferObservable, _super);
          function DeferObservable(observableFactory) {
            _super.call(this);
            this.observableFactory = observableFactory;
          }
          DeferObservable.create = function(observableFactory) {
            return new DeferObservable(observableFactory);
          };
          DeferObservable.prototype._subscribe = function(subscriber) {
            return new DeferSubscriber(subscriber, this.observableFactory);
          };
          return DeferObservable;
        }(Observable_1.Observable));
        exports.DeferObservable = DeferObservable;
        var DeferSubscriber = (function(_super) {
          __extends(DeferSubscriber, _super);
          function DeferSubscriber(destination, factory) {
            _super.call(this, destination);
            this.factory = factory;
            this.tryDefer();
          }
          DeferSubscriber.prototype.tryDefer = function() {
            try {
              this._callFactory();
            } catch (err) {
              this._error(err);
            }
          };
          DeferSubscriber.prototype._callFactory = function() {
            var result = this.factory();
            if (result) {
              this.add(subscribeToResult_1.subscribeToResult(this, result));
            }
          };
          return DeferSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../Observable": 5,
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      147: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var EmptyObservable = (function(_super) {
          __extends(EmptyObservable, _super);
          function EmptyObservable(scheduler) {
            _super.call(this);
            this.scheduler = scheduler;
          }
          EmptyObservable.create = function(scheduler) {
            return new EmptyObservable(scheduler);
          };
          EmptyObservable.dispatch = function(arg) {
            var subscriber = arg.subscriber;
            subscriber.complete();
          };
          EmptyObservable.prototype._subscribe = function(subscriber) {
            var scheduler = this.scheduler;
            if (scheduler) {
              return scheduler.schedule(EmptyObservable.dispatch, 0, {subscriber: subscriber});
            } else {
              subscriber.complete();
            }
          };
          return EmptyObservable;
        }(Observable_1.Observable));
        exports.EmptyObservable = EmptyObservable;
      }, {"../Observable": 5}],
      148: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var ErrorObservable = (function(_super) {
          __extends(ErrorObservable, _super);
          function ErrorObservable(error, scheduler) {
            _super.call(this);
            this.error = error;
            this.scheduler = scheduler;
          }
          ErrorObservable.create = function(error, scheduler) {
            return new ErrorObservable(error, scheduler);
          };
          ErrorObservable.dispatch = function(arg) {
            var error = arg.error,
                subscriber = arg.subscriber;
            subscriber.error(error);
          };
          ErrorObservable.prototype._subscribe = function(subscriber) {
            var error = this.error;
            var scheduler = this.scheduler;
            if (scheduler) {
              return scheduler.schedule(ErrorObservable.dispatch, 0, {
                error: error,
                subscriber: subscriber
              });
            } else {
              subscriber.error(error);
            }
          };
          return ErrorObservable;
        }(Observable_1.Observable));
        exports.ErrorObservable = ErrorObservable;
      }, {"../Observable": 5}],
      149: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var EmptyObservable_1 = require('./EmptyObservable');
        var isArray_1 = require('../util/isArray');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var ForkJoinObservable = (function(_super) {
          __extends(ForkJoinObservable, _super);
          function ForkJoinObservable(sources, resultSelector) {
            _super.call(this);
            this.sources = sources;
            this.resultSelector = resultSelector;
          }
          ForkJoinObservable.create = function() {
            var sources = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              sources[_i - 0] = arguments[_i];
            }
            if (sources === null || arguments.length === 0) {
              return new EmptyObservable_1.EmptyObservable();
            }
            var resultSelector = null;
            if (typeof sources[sources.length - 1] === 'function') {
              resultSelector = sources.pop();
            }
            if (sources.length === 1 && isArray_1.isArray(sources[0])) {
              sources = sources[0];
            }
            if (sources.length === 0) {
              return new EmptyObservable_1.EmptyObservable();
            }
            return new ForkJoinObservable(sources, resultSelector);
          };
          ForkJoinObservable.prototype._subscribe = function(subscriber) {
            return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
          };
          return ForkJoinObservable;
        }(Observable_1.Observable));
        exports.ForkJoinObservable = ForkJoinObservable;
        var ForkJoinSubscriber = (function(_super) {
          __extends(ForkJoinSubscriber, _super);
          function ForkJoinSubscriber(destination, sources, resultSelector) {
            _super.call(this, destination);
            this.sources = sources;
            this.resultSelector = resultSelector;
            this.completed = 0;
            this.haveValues = 0;
            var len = sources.length;
            this.total = len;
            this.values = new Array(len);
            for (var i = 0; i < len; i++) {
              var source = sources[i];
              var innerSubscription = subscribeToResult_1.subscribeToResult(this, source, null, i);
              if (innerSubscription) {
                innerSubscription.outerIndex = i;
                this.add(innerSubscription);
              }
            }
          }
          ForkJoinSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.values[outerIndex] = innerValue;
            if (!innerSub._hasValue) {
              innerSub._hasValue = true;
              this.haveValues++;
            }
          };
          ForkJoinSubscriber.prototype.notifyComplete = function(innerSub) {
            var destination = this.destination;
            var _a = this,
                haveValues = _a.haveValues,
                resultSelector = _a.resultSelector,
                values = _a.values;
            var len = values.length;
            if (!innerSub._hasValue) {
              destination.complete();
              return;
            }
            this.completed++;
            if (this.completed !== len) {
              return;
            }
            if (haveValues === len) {
              var value = resultSelector ? resultSelector.apply(this, values) : values;
              destination.next(value);
            }
            destination.complete();
          };
          return ForkJoinSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../Observable": 5,
        "../OuterSubscriber": 8,
        "../util/isArray": 322,
        "../util/subscribeToResult": 332,
        "./EmptyObservable": 147
      }],
      150: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var Subscription_1 = require('../Subscription');
        function isNodeStyleEventEmmitter(sourceObj) {
          return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
        }
        function isJQueryStyleEventEmitter(sourceObj) {
          return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
        }
        function isNodeList(sourceObj) {
          return !!sourceObj && sourceObj.toString() === '[object NodeList]';
        }
        function isHTMLCollection(sourceObj) {
          return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
        }
        function isEventTarget(sourceObj) {
          return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
        }
        var FromEventObservable = (function(_super) {
          __extends(FromEventObservable, _super);
          function FromEventObservable(sourceObj, eventName, selector) {
            _super.call(this);
            this.sourceObj = sourceObj;
            this.eventName = eventName;
            this.selector = selector;
          }
          FromEventObservable.create = function(target, eventName, selector) {
            return new FromEventObservable(target, eventName, selector);
          };
          FromEventObservable.setupSubscription = function(sourceObj, eventName, handler, subscriber) {
            var unsubscribe;
            if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
              for (var i = 0,
                  len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber);
              }
            } else if (isEventTarget(sourceObj)) {
              var source_1 = sourceObj;
              sourceObj.addEventListener(eventName, handler);
              unsubscribe = function() {
                return source_1.removeEventListener(eventName, handler);
              };
            } else if (isJQueryStyleEventEmitter(sourceObj)) {
              var source_2 = sourceObj;
              sourceObj.on(eventName, handler);
              unsubscribe = function() {
                return source_2.off(eventName, handler);
              };
            } else if (isNodeStyleEventEmmitter(sourceObj)) {
              var source_3 = sourceObj;
              sourceObj.addListener(eventName, handler);
              unsubscribe = function() {
                return source_3.removeListener(eventName, handler);
              };
            }
            subscriber.add(new Subscription_1.Subscription(unsubscribe));
          };
          FromEventObservable.prototype._subscribe = function(subscriber) {
            var sourceObj = this.sourceObj;
            var eventName = this.eventName;
            var selector = this.selector;
            var handler = selector ? function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
              }
              var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
              if (result === errorObject_1.errorObject) {
                subscriber.error(errorObject_1.errorObject.e);
              } else {
                subscriber.next(result);
              }
            } : function(e) {
              return subscriber.next(e);
            };
            FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber);
          };
          return FromEventObservable;
        }(Observable_1.Observable));
        exports.FromEventObservable = FromEventObservable;
      }, {
        "../Observable": 5,
        "../Subscription": 14,
        "../util/errorObject": 321,
        "../util/tryCatch": 335
      }],
      151: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var Subscription_1 = require('../Subscription');
        var FromEventPatternObservable = (function(_super) {
          __extends(FromEventPatternObservable, _super);
          function FromEventPatternObservable(addHandler, removeHandler, selector) {
            _super.call(this);
            this.addHandler = addHandler;
            this.removeHandler = removeHandler;
            this.selector = selector;
          }
          FromEventPatternObservable.create = function(addHandler, removeHandler, selector) {
            return new FromEventPatternObservable(addHandler, removeHandler, selector);
          };
          FromEventPatternObservable.prototype._subscribe = function(subscriber) {
            var _this = this;
            var removeHandler = this.removeHandler;
            var handler = !!this.selector ? function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
              }
              _this._callSelector(subscriber, args);
            } : function(e) {
              subscriber.next(e);
            };
            this._callAddHandler(handler, subscriber);
            subscriber.add(new Subscription_1.Subscription(function() {
              removeHandler(handler);
            }));
          };
          FromEventPatternObservable.prototype._callSelector = function(subscriber, args) {
            try {
              var result = this.selector.apply(this, args);
              subscriber.next(result);
            } catch (e) {
              subscriber.error(e);
            }
          };
          FromEventPatternObservable.prototype._callAddHandler = function(handler, errorSubscriber) {
            try {
              this.addHandler(handler);
            } catch (e) {
              errorSubscriber.error(e);
            }
          };
          return FromEventPatternObservable;
        }(Observable_1.Observable));
        exports.FromEventPatternObservable = FromEventPatternObservable;
      }, {
        "../Observable": 5,
        "../Subscription": 14
      }],
      152: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isArray_1 = require('../util/isArray');
        var isFunction_1 = require('../util/isFunction');
        var isPromise_1 = require('../util/isPromise');
        var isScheduler_1 = require('../util/isScheduler');
        var PromiseObservable_1 = require('./PromiseObservable');
        var IteratorObservable_1 = require('./IteratorObservable');
        var ArrayObservable_1 = require('./ArrayObservable');
        var ArrayLikeObservable_1 = require('./ArrayLikeObservable');
        var iterator_1 = require('../symbol/iterator');
        var Observable_1 = require('../Observable');
        var observeOn_1 = require('../operator/observeOn');
        var symbol_observable_1 = require('symbol-observable');
        var isArrayLike = (function(x) {
          return x && typeof x.length === 'number';
        });
        var FromObservable = (function(_super) {
          __extends(FromObservable, _super);
          function FromObservable(ish, scheduler) {
            _super.call(this, null);
            this.ish = ish;
            this.scheduler = scheduler;
          }
          FromObservable.create = function(ish, mapFnOrScheduler, thisArg, lastScheduler) {
            var scheduler = null;
            var mapFn = null;
            if (isFunction_1.isFunction(mapFnOrScheduler)) {
              scheduler = lastScheduler || null;
              mapFn = mapFnOrScheduler;
            } else if (isScheduler_1.isScheduler(scheduler)) {
              scheduler = mapFnOrScheduler;
            }
            if (ish != null) {
              if (typeof ish[symbol_observable_1.default] === 'function') {
                if (ish instanceof Observable_1.Observable && !scheduler) {
                  return ish;
                }
                return new FromObservable(ish, scheduler);
              } else if (isArray_1.isArray(ish)) {
                return new ArrayObservable_1.ArrayObservable(ish, scheduler);
              } else if (isPromise_1.isPromise(ish)) {
                return new PromiseObservable_1.PromiseObservable(ish, scheduler);
              } else if (typeof ish[iterator_1.$$iterator] === 'function' || typeof ish === 'string') {
                return new IteratorObservable_1.IteratorObservable(ish, null, null, scheduler);
              } else if (isArrayLike(ish)) {
                return new ArrayLikeObservable_1.ArrayLikeObservable(ish, mapFn, thisArg, scheduler);
              }
            }
            throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
          };
          FromObservable.prototype._subscribe = function(subscriber) {
            var ish = this.ish;
            var scheduler = this.scheduler;
            if (scheduler == null) {
              return ish[symbol_observable_1.default]().subscribe(subscriber);
            } else {
              return ish[symbol_observable_1.default]().subscribe(new observeOn_1.ObserveOnSubscriber(subscriber, scheduler, 0));
            }
          };
          return FromObservable;
        }(Observable_1.Observable));
        exports.FromObservable = FromObservable;
      }, {
        "../Observable": 5,
        "../operator/observeOn": 243,
        "../symbol/iterator": 303,
        "../util/isArray": 322,
        "../util/isFunction": 324,
        "../util/isPromise": 327,
        "../util/isScheduler": 328,
        "./ArrayLikeObservable": 141,
        "./ArrayObservable": 142,
        "./IteratorObservable": 156,
        "./PromiseObservable": 159,
        "symbol-observable": 336
      }],
      153: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var isScheduler_1 = require('../util/isScheduler');
        var selfSelector = function(value) {
          return value;
        };
        var GenerateObservable = (function(_super) {
          __extends(GenerateObservable, _super);
          function GenerateObservable(initialState, condition, iterate, resultSelector, scheduler) {
            _super.call(this);
            this.initialState = initialState;
            this.condition = condition;
            this.iterate = iterate;
            this.resultSelector = resultSelector;
            this.scheduler = scheduler;
          }
          GenerateObservable.create = function(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
            if (arguments.length == 1) {
              return new GenerateObservable(initialStateOrOptions.initialState, initialStateOrOptions.condition, initialStateOrOptions.iterate, initialStateOrOptions.resultSelector || selfSelector, initialStateOrOptions.scheduler);
            }
            if (resultSelectorOrObservable === undefined || isScheduler_1.isScheduler(resultSelectorOrObservable)) {
              return new GenerateObservable(initialStateOrOptions, condition, iterate, selfSelector, resultSelectorOrObservable);
            }
            return new GenerateObservable(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler);
          };
          GenerateObservable.prototype._subscribe = function(subscriber) {
            var state = this.initialState;
            if (this.scheduler) {
              return this.scheduler.schedule(GenerateObservable.dispatch, 0, {
                subscriber: subscriber,
                iterate: this.iterate,
                condition: this.condition,
                resultSelector: this.resultSelector,
                state: state
              });
            }
            var _a = this,
                condition = _a.condition,
                resultSelector = _a.resultSelector,
                iterate = _a.iterate;
            do {
              if (condition) {
                var conditionResult = void 0;
                try {
                  conditionResult = condition(state);
                } catch (err) {
                  subscriber.error(err);
                  return;
                }
                if (!conditionResult) {
                  subscriber.complete();
                  break;
                }
              }
              var value = void 0;
              try {
                value = resultSelector(state);
              } catch (err) {
                subscriber.error(err);
                return;
              }
              subscriber.next(value);
              if (subscriber.isUnsubscribed) {
                break;
              }
              try {
                state = iterate(state);
              } catch (err) {
                subscriber.error(err);
                return;
              }
            } while (true);
          };
          GenerateObservable.dispatch = function(state) {
            var subscriber = state.subscriber,
                condition = state.condition;
            if (subscriber.isUnsubscribed) {
              return;
            }
            if (state.needIterate) {
              try {
                state.state = state.iterate(state.state);
              } catch (err) {
                subscriber.error(err);
                return;
              }
            } else {
              state.needIterate = true;
            }
            if (condition) {
              var conditionResult = void 0;
              try {
                conditionResult = condition(state.state);
              } catch (err) {
                subscriber.error(err);
                return;
              }
              if (!conditionResult) {
                subscriber.complete();
                return;
              }
              if (subscriber.isUnsubscribed) {
                return;
              }
            }
            var value;
            try {
              value = state.resultSelector(state.state);
            } catch (err) {
              subscriber.error(err);
              return;
            }
            if (subscriber.isUnsubscribed) {
              return;
            }
            subscriber.next(value);
            if (subscriber.isUnsubscribed) {
              return;
            }
            return this.schedule(state);
          };
          return GenerateObservable;
        }(Observable_1.Observable));
        exports.GenerateObservable = GenerateObservable;
      }, {
        "../Observable": 5,
        "../util/isScheduler": 328
      }],
      154: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var IfObservable = (function(_super) {
          __extends(IfObservable, _super);
          function IfObservable(condition, thenSource, elseSource) {
            _super.call(this);
            this.condition = condition;
            this.thenSource = thenSource;
            this.elseSource = elseSource;
          }
          IfObservable.create = function(condition, thenSource, elseSource) {
            return new IfObservable(condition, thenSource, elseSource);
          };
          IfObservable.prototype._subscribe = function(subscriber) {
            var _a = this,
                condition = _a.condition,
                thenSource = _a.thenSource,
                elseSource = _a.elseSource;
            return new IfSubscriber(subscriber, condition, thenSource, elseSource);
          };
          return IfObservable;
        }(Observable_1.Observable));
        exports.IfObservable = IfObservable;
        var IfSubscriber = (function(_super) {
          __extends(IfSubscriber, _super);
          function IfSubscriber(destination, condition, thenSource, elseSource) {
            _super.call(this, destination);
            this.condition = condition;
            this.thenSource = thenSource;
            this.elseSource = elseSource;
            this.tryIf();
          }
          IfSubscriber.prototype.tryIf = function() {
            var _a = this,
                condition = _a.condition,
                thenSource = _a.thenSource,
                elseSource = _a.elseSource;
            var result;
            try {
              result = condition();
              var source = result ? thenSource : elseSource;
              if (source) {
                this.add(subscribeToResult_1.subscribeToResult(this, source));
              } else {
                this._complete();
              }
            } catch (err) {
              this._error(err);
            }
          };
          return IfSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../Observable": 5,
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      155: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isNumeric_1 = require('../util/isNumeric');
        var Observable_1 = require('../Observable');
        var async_1 = require('../scheduler/async');
        var IntervalObservable = (function(_super) {
          __extends(IntervalObservable, _super);
          function IntervalObservable(period, scheduler) {
            if (period === void 0) {
              period = 0;
            }
            if (scheduler === void 0) {
              scheduler = async_1.async;
            }
            _super.call(this);
            this.period = period;
            this.scheduler = scheduler;
            if (!isNumeric_1.isNumeric(period) || period < 0) {
              this.period = 0;
            }
            if (!scheduler || typeof scheduler.schedule !== 'function') {
              this.scheduler = async_1.async;
            }
          }
          IntervalObservable.create = function(period, scheduler) {
            if (period === void 0) {
              period = 0;
            }
            if (scheduler === void 0) {
              scheduler = async_1.async;
            }
            return new IntervalObservable(period, scheduler);
          };
          IntervalObservable.dispatch = function(state) {
            var index = state.index,
                subscriber = state.subscriber,
                period = state.period;
            subscriber.next(index);
            if (subscriber.isUnsubscribed) {
              return;
            }
            state.index += 1;
            this.schedule(state, period);
          };
          IntervalObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var period = this.period;
            var scheduler = this.scheduler;
            subscriber.add(scheduler.schedule(IntervalObservable.dispatch, period, {
              index: index,
              subscriber: subscriber,
              period: period
            }));
          };
          return IntervalObservable;
        }(Observable_1.Observable));
        exports.IntervalObservable = IntervalObservable;
      }, {
        "../Observable": 5,
        "../scheduler/async": 301,
        "../util/isNumeric": 325
      }],
      156: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var root_1 = require('../util/root');
        var isObject_1 = require('../util/isObject');
        var tryCatch_1 = require('../util/tryCatch');
        var Observable_1 = require('../Observable');
        var isFunction_1 = require('../util/isFunction');
        var iterator_1 = require('../symbol/iterator');
        var errorObject_1 = require('../util/errorObject');
        var IteratorObservable = (function(_super) {
          __extends(IteratorObservable, _super);
          function IteratorObservable(iterator, project, thisArg, scheduler) {
            _super.call(this);
            if (iterator == null) {
              throw new Error('iterator cannot be null.');
            }
            if (isObject_1.isObject(project)) {
              this.thisArg = project;
              this.scheduler = thisArg;
            } else if (isFunction_1.isFunction(project)) {
              this.project = project;
              this.thisArg = thisArg;
              this.scheduler = scheduler;
            } else if (project != null) {
              throw new Error('When provided, `project` must be a function.');
            }
            this.iterator = getIterator(iterator);
          }
          IteratorObservable.create = function(iterator, project, thisArg, scheduler) {
            return new IteratorObservable(iterator, project, thisArg, scheduler);
          };
          IteratorObservable.dispatch = function(state) {
            var index = state.index,
                hasError = state.hasError,
                thisArg = state.thisArg,
                project = state.project,
                iterator = state.iterator,
                subscriber = state.subscriber;
            if (hasError) {
              subscriber.error(state.error);
              return;
            }
            var result = iterator.next();
            if (result.done) {
              subscriber.complete();
              return;
            }
            if (project) {
              result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index);
              if (result === errorObject_1.errorObject) {
                state.error = errorObject_1.errorObject.e;
                state.hasError = true;
              } else {
                subscriber.next(result);
                state.index = index + 1;
              }
            } else {
              subscriber.next(result.value);
              state.index = index + 1;
            }
            if (subscriber.isUnsubscribed) {
              return;
            }
            this.schedule(state);
          };
          IteratorObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var _a = this,
                iterator = _a.iterator,
                project = _a.project,
                thisArg = _a.thisArg,
                scheduler = _a.scheduler;
            if (scheduler) {
              return scheduler.schedule(IteratorObservable.dispatch, 0, {
                index: index,
                thisArg: thisArg,
                project: project,
                iterator: iterator,
                subscriber: subscriber
              });
            } else {
              do {
                var result = iterator.next();
                if (result.done) {
                  subscriber.complete();
                  break;
                } else if (project) {
                  result = tryCatch_1.tryCatch(project).call(thisArg, result.value, index++);
                  if (result === errorObject_1.errorObject) {
                    subscriber.error(errorObject_1.errorObject.e);
                    break;
                  }
                  subscriber.next(result);
                } else {
                  subscriber.next(result.value);
                }
                if (subscriber.isUnsubscribed) {
                  break;
                }
              } while (true);
            }
          };
          return IteratorObservable;
        }(Observable_1.Observable));
        exports.IteratorObservable = IteratorObservable;
        var StringIterator = (function() {
          function StringIterator(str, idx, len) {
            if (idx === void 0) {
              idx = 0;
            }
            if (len === void 0) {
              len = str.length;
            }
            this.str = str;
            this.idx = idx;
            this.len = len;
          }
          StringIterator.prototype[iterator_1.$$iterator] = function() {
            return (this);
          };
          StringIterator.prototype.next = function() {
            return this.idx < this.len ? {
              done: false,
              value: this.str.charAt(this.idx++)
            } : {
              done: true,
              value: undefined
            };
          };
          return StringIterator;
        }());
        var ArrayIterator = (function() {
          function ArrayIterator(arr, idx, len) {
            if (idx === void 0) {
              idx = 0;
            }
            if (len === void 0) {
              len = toLength(arr);
            }
            this.arr = arr;
            this.idx = idx;
            this.len = len;
          }
          ArrayIterator.prototype[iterator_1.$$iterator] = function() {
            return this;
          };
          ArrayIterator.prototype.next = function() {
            return this.idx < this.len ? {
              done: false,
              value: this.arr[this.idx++]
            } : {
              done: true,
              value: undefined
            };
          };
          return ArrayIterator;
        }());
        function getIterator(obj) {
          var i = obj[iterator_1.$$iterator];
          if (!i && typeof obj === 'string') {
            return new StringIterator(obj);
          }
          if (!i && obj.length !== undefined) {
            return new ArrayIterator(obj);
          }
          if (!i) {
            throw new TypeError('Object is not iterable');
          }
          return obj[iterator_1.$$iterator]();
        }
        var maxSafeInteger = Math.pow(2, 53) - 1;
        function toLength(o) {
          var len = +o.length;
          if (isNaN(len)) {
            return 0;
          }
          if (len === 0 || !numberIsFinite(len)) {
            return len;
          }
          len = sign(len) * Math.floor(Math.abs(len));
          if (len <= 0) {
            return 0;
          }
          if (len > maxSafeInteger) {
            return maxSafeInteger;
          }
          return len;
        }
        function numberIsFinite(value) {
          return typeof value === 'number' && root_1.root.isFinite(value);
        }
        function sign(value) {
          var valueAsNumber = +value;
          if (valueAsNumber === 0) {
            return valueAsNumber;
          }
          if (isNaN(valueAsNumber)) {
            return valueAsNumber;
          }
          return valueAsNumber < 0 ? -1 : 1;
        }
      }, {
        "../Observable": 5,
        "../symbol/iterator": 303,
        "../util/errorObject": 321,
        "../util/isFunction": 324,
        "../util/isObject": 326,
        "../util/root": 331,
        "../util/tryCatch": 335
      }],
      157: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var ConnectableObservable_1 = require('../observable/ConnectableObservable');
        var MulticastObservable = (function(_super) {
          __extends(MulticastObservable, _super);
          function MulticastObservable(source, subjectFactory, selector) {
            _super.call(this);
            this.source = source;
            this.subjectFactory = subjectFactory;
            this.selector = selector;
          }
          MulticastObservable.prototype._subscribe = function(subscriber) {
            var _a = this,
                selector = _a.selector,
                source = _a.source;
            var connectable = new ConnectableObservable_1.ConnectableObservable(source, this.subjectFactory);
            var subscription = selector(connectable).subscribe(subscriber);
            subscription.add(connectable.connect());
            return subscription;
          };
          return MulticastObservable;
        }(Observable_1.Observable));
        exports.MulticastObservable = MulticastObservable;
      }, {
        "../Observable": 5,
        "../observable/ConnectableObservable": 145
      }],
      158: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var noop_1 = require('../util/noop');
        var NeverObservable = (function(_super) {
          __extends(NeverObservable, _super);
          function NeverObservable() {
            _super.call(this);
          }
          NeverObservable.create = function() {
            return new NeverObservable();
          };
          NeverObservable.prototype._subscribe = function(subscriber) {
            noop_1.noop();
          };
          return NeverObservable;
        }(Observable_1.Observable));
        exports.NeverObservable = NeverObservable;
      }, {
        "../Observable": 5,
        "../util/noop": 329
      }],
      159: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var root_1 = require('../util/root');
        var Observable_1 = require('../Observable');
        var PromiseObservable = (function(_super) {
          __extends(PromiseObservable, _super);
          function PromiseObservable(promise, scheduler) {
            if (scheduler === void 0) {
              scheduler = null;
            }
            _super.call(this);
            this.promise = promise;
            this.scheduler = scheduler;
          }
          PromiseObservable.create = function(promise, scheduler) {
            if (scheduler === void 0) {
              scheduler = null;
            }
            return new PromiseObservable(promise, scheduler);
          };
          PromiseObservable.prototype._subscribe = function(subscriber) {
            var _this = this;
            var promise = this.promise;
            var scheduler = this.scheduler;
            if (scheduler == null) {
              if (this._isScalar) {
                if (!subscriber.isUnsubscribed) {
                  subscriber.next(this.value);
                  subscriber.complete();
                }
              } else {
                promise.then(function(value) {
                  _this.value = value;
                  _this._isScalar = true;
                  if (!subscriber.isUnsubscribed) {
                    subscriber.next(value);
                    subscriber.complete();
                  }
                }, function(err) {
                  if (!subscriber.isUnsubscribed) {
                    subscriber.error(err);
                  }
                }).then(null, function(err) {
                  root_1.root.setTimeout(function() {
                    throw err;
                  });
                });
              }
            } else {
              if (this._isScalar) {
                if (!subscriber.isUnsubscribed) {
                  return scheduler.schedule(dispatchNext, 0, {
                    value: this.value,
                    subscriber: subscriber
                  });
                }
              } else {
                promise.then(function(value) {
                  _this.value = value;
                  _this._isScalar = true;
                  if (!subscriber.isUnsubscribed) {
                    subscriber.add(scheduler.schedule(dispatchNext, 0, {
                      value: value,
                      subscriber: subscriber
                    }));
                  }
                }, function(err) {
                  if (!subscriber.isUnsubscribed) {
                    subscriber.add(scheduler.schedule(dispatchError, 0, {
                      err: err,
                      subscriber: subscriber
                    }));
                  }
                }).then(null, function(err) {
                  root_1.root.setTimeout(function() {
                    throw err;
                  });
                });
              }
            }
          };
          return PromiseObservable;
        }(Observable_1.Observable));
        exports.PromiseObservable = PromiseObservable;
        function dispatchNext(arg) {
          var value = arg.value,
              subscriber = arg.subscriber;
          if (!subscriber.isUnsubscribed) {
            subscriber.next(value);
            subscriber.complete();
          }
        }
        function dispatchError(arg) {
          var err = arg.err,
              subscriber = arg.subscriber;
          if (!subscriber.isUnsubscribed) {
            subscriber.error(err);
          }
        }
      }, {
        "../Observable": 5,
        "../util/root": 331
      }],
      160: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var RangeObservable = (function(_super) {
          __extends(RangeObservable, _super);
          function RangeObservable(start, count, scheduler) {
            _super.call(this);
            this.start = start;
            this._count = count;
            this.scheduler = scheduler;
          }
          RangeObservable.create = function(start, count, scheduler) {
            if (start === void 0) {
              start = 0;
            }
            if (count === void 0) {
              count = 0;
            }
            return new RangeObservable(start, count, scheduler);
          };
          RangeObservable.dispatch = function(state) {
            var start = state.start,
                index = state.index,
                count = state.count,
                subscriber = state.subscriber;
            if (index >= count) {
              subscriber.complete();
              return;
            }
            subscriber.next(start);
            if (subscriber.isUnsubscribed) {
              return;
            }
            state.index = index + 1;
            state.start = start + 1;
            this.schedule(state);
          };
          RangeObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var start = this.start;
            var count = this._count;
            var scheduler = this.scheduler;
            if (scheduler) {
              return scheduler.schedule(RangeObservable.dispatch, 0, {
                index: index,
                count: count,
                start: start,
                subscriber: subscriber
              });
            } else {
              do {
                if (index++ >= count) {
                  subscriber.complete();
                  break;
                }
                subscriber.next(start++);
                if (subscriber.isUnsubscribed) {
                  break;
                }
              } while (true);
            }
          };
          return RangeObservable;
        }(Observable_1.Observable));
        exports.RangeObservable = RangeObservable;
      }, {"../Observable": 5}],
      161: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var ScalarObservable = (function(_super) {
          __extends(ScalarObservable, _super);
          function ScalarObservable(value, scheduler) {
            _super.call(this);
            this.value = value;
            this.scheduler = scheduler;
            this._isScalar = true;
            if (scheduler) {
              this._isScalar = false;
            }
          }
          ScalarObservable.create = function(value, scheduler) {
            return new ScalarObservable(value, scheduler);
          };
          ScalarObservable.dispatch = function(state) {
            var done = state.done,
                value = state.value,
                subscriber = state.subscriber;
            if (done) {
              subscriber.complete();
              return;
            }
            subscriber.next(value);
            if (subscriber.isUnsubscribed) {
              return;
            }
            state.done = true;
            this.schedule(state);
          };
          ScalarObservable.prototype._subscribe = function(subscriber) {
            var value = this.value;
            var scheduler = this.scheduler;
            if (scheduler) {
              return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false,
                value: value,
                subscriber: subscriber
              });
            } else {
              subscriber.next(value);
              if (!subscriber.isUnsubscribed) {
                subscriber.complete();
              }
            }
          };
          return ScalarObservable;
        }(Observable_1.Observable));
        exports.ScalarObservable = ScalarObservable;
      }, {"../Observable": 5}],
      162: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var asap_1 = require('../scheduler/asap');
        var isNumeric_1 = require('../util/isNumeric');
        var SubscribeOnObservable = (function(_super) {
          __extends(SubscribeOnObservable, _super);
          function SubscribeOnObservable(source, delayTime, scheduler) {
            if (delayTime === void 0) {
              delayTime = 0;
            }
            if (scheduler === void 0) {
              scheduler = asap_1.asap;
            }
            _super.call(this);
            this.source = source;
            this.delayTime = delayTime;
            this.scheduler = scheduler;
            if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
              this.delayTime = 0;
            }
            if (!scheduler || typeof scheduler.schedule !== 'function') {
              this.scheduler = asap_1.asap;
            }
          }
          SubscribeOnObservable.create = function(source, delay, scheduler) {
            if (delay === void 0) {
              delay = 0;
            }
            if (scheduler === void 0) {
              scheduler = asap_1.asap;
            }
            return new SubscribeOnObservable(source, delay, scheduler);
          };
          SubscribeOnObservable.dispatch = function(arg) {
            var source = arg.source,
                subscriber = arg.subscriber;
            return source.subscribe(subscriber);
          };
          SubscribeOnObservable.prototype._subscribe = function(subscriber) {
            var delay = this.delayTime;
            var source = this.source;
            var scheduler = this.scheduler;
            return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
              source: source,
              subscriber: subscriber
            });
          };
          return SubscribeOnObservable;
        }(Observable_1.Observable));
        exports.SubscribeOnObservable = SubscribeOnObservable;
      }, {
        "../Observable": 5,
        "../scheduler/asap": 300,
        "../util/isNumeric": 325
      }],
      163: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isNumeric_1 = require('../util/isNumeric');
        var Observable_1 = require('../Observable');
        var async_1 = require('../scheduler/async');
        var isScheduler_1 = require('../util/isScheduler');
        var isDate_1 = require('../util/isDate');
        var TimerObservable = (function(_super) {
          __extends(TimerObservable, _super);
          function TimerObservable(dueTime, period, scheduler) {
            if (dueTime === void 0) {
              dueTime = 0;
            }
            _super.call(this);
            this.period = -1;
            this.dueTime = 0;
            if (isNumeric_1.isNumeric(period)) {
              this.period = Number(period) < 1 && 1 || Number(period);
            } else if (isScheduler_1.isScheduler(period)) {
              scheduler = period;
            }
            if (!isScheduler_1.isScheduler(scheduler)) {
              scheduler = async_1.async;
            }
            this.scheduler = scheduler;
            this.dueTime = isDate_1.isDate(dueTime) ? (+dueTime - this.scheduler.now()) : dueTime;
          }
          TimerObservable.create = function(initialDelay, period, scheduler) {
            if (initialDelay === void 0) {
              initialDelay = 0;
            }
            return new TimerObservable(initialDelay, period, scheduler);
          };
          TimerObservable.dispatch = function(state) {
            var index = state.index,
                period = state.period,
                subscriber = state.subscriber;
            var action = this;
            subscriber.next(index);
            if (subscriber.isUnsubscribed) {
              return;
            } else if (period === -1) {
              return subscriber.complete();
            }
            state.index = index + 1;
            action.schedule(state, period);
          };
          TimerObservable.prototype._subscribe = function(subscriber) {
            var index = 0;
            var _a = this,
                period = _a.period,
                dueTime = _a.dueTime,
                scheduler = _a.scheduler;
            return scheduler.schedule(TimerObservable.dispatch, dueTime, {
              index: index,
              period: period,
              subscriber: subscriber
            });
          };
          return TimerObservable;
        }(Observable_1.Observable));
        exports.TimerObservable = TimerObservable;
      }, {
        "../Observable": 5,
        "../scheduler/async": 301,
        "../util/isDate": 323,
        "../util/isNumeric": 325,
        "../util/isScheduler": 328
      }],
      164: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var UsingObservable = (function(_super) {
          __extends(UsingObservable, _super);
          function UsingObservable(resourceFactory, observableFactory) {
            _super.call(this);
            this.resourceFactory = resourceFactory;
            this.observableFactory = observableFactory;
          }
          UsingObservable.create = function(resourceFactory, observableFactory) {
            return new UsingObservable(resourceFactory, observableFactory);
          };
          UsingObservable.prototype._subscribe = function(subscriber) {
            var _a = this,
                resourceFactory = _a.resourceFactory,
                observableFactory = _a.observableFactory;
            var resource;
            try {
              resource = resourceFactory();
              return new UsingSubscriber(subscriber, resource, observableFactory);
            } catch (err) {
              subscriber.error(err);
            }
          };
          return UsingObservable;
        }(Observable_1.Observable));
        exports.UsingObservable = UsingObservable;
        var UsingSubscriber = (function(_super) {
          __extends(UsingSubscriber, _super);
          function UsingSubscriber(destination, resource, observableFactory) {
            _super.call(this, destination);
            this.resource = resource;
            this.observableFactory = observableFactory;
            destination.add(resource);
            this.tryUse();
          }
          UsingSubscriber.prototype.tryUse = function() {
            try {
              var source = this.observableFactory.call(this, this.resource);
              if (source) {
                this.add(subscribeToResult_1.subscribeToResult(this, source));
              }
            } catch (err) {
              this._error(err);
            }
          };
          return UsingSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../Observable": 5,
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      165: [function(require, module, exports) {
        "use strict";
        var BoundCallbackObservable_1 = require('./BoundCallbackObservable');
        exports.bindCallback = BoundCallbackObservable_1.BoundCallbackObservable.create;
      }, {"./BoundCallbackObservable": 143}],
      166: [function(require, module, exports) {
        "use strict";
        var BoundNodeCallbackObservable_1 = require('./BoundNodeCallbackObservable');
        exports.bindNodeCallback = BoundNodeCallbackObservable_1.BoundNodeCallbackObservable.create;
      }, {"./BoundNodeCallbackObservable": 144}],
      167: [function(require, module, exports) {
        "use strict";
        var isScheduler_1 = require('../util/isScheduler');
        var isArray_1 = require('../util/isArray');
        var ArrayObservable_1 = require('./ArrayObservable');
        var combineLatest_1 = require('../operator/combineLatest');
        function combineLatest() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          var project = null;
          var scheduler = null;
          if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
            scheduler = observables.pop();
          }
          if (typeof observables[observables.length - 1] === 'function') {
            project = observables.pop();
          }
          if (observables.length === 1 && isArray_1.isArray(observables[0])) {
            observables = observables[0];
          }
          return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new combineLatest_1.CombineLatestOperator(project));
        }
        exports.combineLatest = combineLatest;
      }, {
        "../operator/combineLatest": 200,
        "../util/isArray": 322,
        "../util/isScheduler": 328,
        "./ArrayObservable": 142
      }],
      168: [function(require, module, exports) {
        "use strict";
        var concat_1 = require('../operator/concat');
        exports.concat = concat_1.concatStatic;
      }, {"../operator/concat": 201}],
      169: [function(require, module, exports) {
        "use strict";
        var DeferObservable_1 = require('./DeferObservable');
        exports.defer = DeferObservable_1.DeferObservable.create;
      }, {"./DeferObservable": 146}],
      170: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var root_1 = require('../../util/root');
        var tryCatch_1 = require('../../util/tryCatch');
        var errorObject_1 = require('../../util/errorObject');
        var Observable_1 = require('../../Observable');
        var Subscriber_1 = require('../../Subscriber');
        function getCORSRequest() {
          if (root_1.root.XMLHttpRequest) {
            var xhr = new root_1.root.XMLHttpRequest();
            if ('withCredentials' in xhr) {
              xhr.withCredentials = !!this.withCredentials;
            }
            return xhr;
          } else if (!!root_1.root.XDomainRequest) {
            return new root_1.root.XDomainRequest();
          } else {
            throw new Error('CORS is not supported by your browser');
          }
        }
        function getXMLHttpRequest() {
          if (root_1.root.XMLHttpRequest) {
            return new root_1.root.XMLHttpRequest();
          } else {
            var progId = void 0;
            try {
              var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
              for (var i = 0; i < 3; i++) {
                try {
                  progId = progIds[i];
                  if (new root_1.root.ActiveXObject(progId)) {
                    break;
                  }
                } catch (e) {}
              }
              return new root_1.root.ActiveXObject(progId);
            } catch (e) {
              throw new Error('XMLHttpRequest is not supported by your browser');
            }
          }
        }
        function defaultGetResultSelector(response) {
          return response.response;
        }
        function ajaxGet(url, resultSelector, headers) {
          if (resultSelector === void 0) {
            resultSelector = defaultGetResultSelector;
          }
          if (headers === void 0) {
            headers = null;
          }
          return new AjaxObservable({
            method: 'GET',
            url: url,
            resultSelector: resultSelector,
            headers: headers
          });
        }
        exports.ajaxGet = ajaxGet;
        ;
        function ajaxPost(url, body, headers) {
          return new AjaxObservable({
            method: 'POST',
            url: url,
            body: body,
            headers: headers
          });
        }
        exports.ajaxPost = ajaxPost;
        ;
        function ajaxDelete(url, headers) {
          return new AjaxObservable({
            method: 'DELETE',
            url: url,
            headers: headers
          });
        }
        exports.ajaxDelete = ajaxDelete;
        ;
        function ajaxPut(url, body, headers) {
          return new AjaxObservable({
            method: 'PUT',
            url: url,
            body: body,
            headers: headers
          });
        }
        exports.ajaxPut = ajaxPut;
        ;
        function ajaxGetJSON(url, resultSelector, headers) {
          var finalResultSelector = resultSelector ? function(res) {
            return resultSelector(res.response);
          } : function(res) {
            return res.response;
          };
          return new AjaxObservable({
            method: 'GET',
            url: url,
            responseType: 'json',
            resultSelector: finalResultSelector,
            headers: headers
          });
        }
        exports.ajaxGetJSON = ajaxGetJSON;
        ;
        var AjaxObservable = (function(_super) {
          __extends(AjaxObservable, _super);
          function AjaxObservable(urlOrRequest) {
            _super.call(this);
            var request = {
              async: true,
              createXHR: function() {
                return this.crossDomain ? getCORSRequest.call(this) : getXMLHttpRequest();
              },
              crossDomain: false,
              withCredentials: false,
              headers: {},
              method: 'GET',
              responseType: 'json',
              timeout: 0
            };
            if (typeof urlOrRequest === 'string') {
              request.url = urlOrRequest;
            } else {
              for (var prop in urlOrRequest) {
                if (urlOrRequest.hasOwnProperty(prop)) {
                  request[prop] = urlOrRequest[prop];
                }
              }
            }
            this.request = request;
          }
          AjaxObservable.prototype._subscribe = function(subscriber) {
            return new AjaxSubscriber(subscriber, this.request);
          };
          AjaxObservable.create = (function() {
            var create = function(urlOrRequest) {
              return new AjaxObservable(urlOrRequest);
            };
            create.get = ajaxGet;
            create.post = ajaxPost;
            create.delete = ajaxDelete;
            create.put = ajaxPut;
            create.getJSON = ajaxGetJSON;
            return create;
          })();
          return AjaxObservable;
        }(Observable_1.Observable));
        exports.AjaxObservable = AjaxObservable;
        var AjaxSubscriber = (function(_super) {
          __extends(AjaxSubscriber, _super);
          function AjaxSubscriber(destination, request) {
            _super.call(this, destination);
            this.request = request;
            this.done = false;
            var headers = request.headers = request.headers || {};
            if (!request.crossDomain && !headers['X-Requested-With']) {
              headers['X-Requested-With'] = 'XMLHttpRequest';
            }
            if (!('Content-Type' in headers) && !(root_1.root.FormData && request.body instanceof root_1.root.FormData)) {
              headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
            request.body = this.serializeBody(request.body, request.headers['Content-Type']);
            this.resultSelector = request.resultSelector;
            this.send();
          }
          AjaxSubscriber.prototype.next = function(e) {
            this.done = true;
            var _a = this,
                resultSelector = _a.resultSelector,
                xhr = _a.xhr,
                request = _a.request,
                destination = _a.destination;
            var response = new AjaxResponse(e, xhr, request);
            if (resultSelector) {
              var result = tryCatch_1.tryCatch(resultSelector)(response);
              if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
              } else {
                destination.next(result);
              }
            } else {
              destination.next(response);
            }
          };
          AjaxSubscriber.prototype.send = function() {
            var _a = this,
                request = _a.request,
                _b = _a.request,
                user = _b.user,
                method = _b.method,
                url = _b.url,
                async = _b.async,
                password = _b.password,
                headers = _b.headers,
                body = _b.body;
            var createXHR = request.createXHR;
            var xhr = tryCatch_1.tryCatch(createXHR).call(request);
            if (xhr === errorObject_1.errorObject) {
              this.error(errorObject_1.errorObject.e);
            } else {
              this.xhr = xhr;
              var result = void 0;
              if (user) {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async, user, password);
              } else {
                result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async);
              }
              if (result === errorObject_1.errorObject) {
                this.error(errorObject_1.errorObject.e);
                return;
              }
              xhr.timeout = request.timeout;
              xhr.responseType = request.responseType;
              this.setHeaders(xhr, headers);
              this.setupEvents(xhr, request);
              if (body) {
                xhr.send(body);
              } else {
                xhr.send();
              }
            }
          };
          AjaxSubscriber.prototype.serializeBody = function(body, contentType) {
            if (!body || typeof body === 'string') {
              return body;
            } else if (root_1.root.FormData && body instanceof root_1.root.FormData) {
              return body;
            }
            if (contentType) {
              var splitIndex = contentType.indexOf(';');
              if (splitIndex !== -1) {
                contentType = contentType.substring(0, splitIndex);
              }
            }
            switch (contentType) {
              case 'application/x-www-form-urlencoded':
                return Object.keys(body).map(function(key) {
                  return (encodeURI(key) + "=" + encodeURI(body[key]));
                }).join('&');
              case 'application/json':
                return JSON.stringify(body);
              default:
                return body;
            }
          };
          AjaxSubscriber.prototype.setHeaders = function(xhr, headers) {
            for (var key in headers) {
              if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
              }
            }
          };
          AjaxSubscriber.prototype.setupEvents = function(xhr, request) {
            var progressSubscriber = request.progressSubscriber;
            xhr.ontimeout = function xhrTimeout(e) {
              var _a = xhrTimeout,
                  subscriber = _a.subscriber,
                  progressSubscriber = _a.progressSubscriber,
                  request = _a.request;
              if (progressSubscriber) {
                progressSubscriber.error(e);
              }
              subscriber.error(new AjaxTimeoutError(this, request));
            };
            xhr.ontimeout.request = request;
            xhr.ontimeout.subscriber = this;
            xhr.ontimeout.progressSubscriber = progressSubscriber;
            if (xhr.upload && 'withCredentials' in xhr && root_1.root.XDomainRequest) {
              if (progressSubscriber) {
                xhr.onprogress = function xhrProgress(e) {
                  var progressSubscriber = xhrProgress.progressSubscriber;
                  progressSubscriber.next(e);
                };
                xhr.onprogress.progressSubscriber = progressSubscriber;
              }
              xhr.onerror = function xhrError(e) {
                var _a = xhrError,
                    progressSubscriber = _a.progressSubscriber,
                    subscriber = _a.subscriber,
                    request = _a.request;
                if (progressSubscriber) {
                  progressSubscriber.error(e);
                }
                subscriber.error(new AjaxError('ajax error', this, request));
              };
              xhr.onerror.request = request;
              xhr.onerror.subscriber = this;
              xhr.onerror.progressSubscriber = progressSubscriber;
            }
            xhr.onreadystatechange = function xhrReadyStateChange(e) {
              var _a = xhrReadyStateChange,
                  subscriber = _a.subscriber,
                  progressSubscriber = _a.progressSubscriber,
                  request = _a.request;
              if (this.readyState === 4) {
                var status_1 = this.status === 1223 ? 204 : this.status;
                var response = (this.responseType === 'text' ? (this.response || this.responseText) : this.response);
                if (status_1 === 0) {
                  status_1 = response ? 200 : 0;
                }
                if (200 <= status_1 && status_1 < 300) {
                  if (progressSubscriber) {
                    progressSubscriber.complete();
                  }
                  subscriber.next(e);
                  subscriber.complete();
                } else {
                  if (progressSubscriber) {
                    progressSubscriber.error(e);
                  }
                  subscriber.error(new AjaxError('ajax error ' + status_1, this, request));
                }
              }
            };
            xhr.onreadystatechange.subscriber = this;
            xhr.onreadystatechange.progressSubscriber = progressSubscriber;
            xhr.onreadystatechange.request = request;
          };
          AjaxSubscriber.prototype.unsubscribe = function() {
            var _a = this,
                done = _a.done,
                xhr = _a.xhr;
            if (!done && xhr && xhr.readyState !== 4) {
              xhr.abort();
            }
            _super.prototype.unsubscribe.call(this);
          };
          return AjaxSubscriber;
        }(Subscriber_1.Subscriber));
        exports.AjaxSubscriber = AjaxSubscriber;
        var AjaxResponse = (function() {
          function AjaxResponse(originalEvent, xhr, request) {
            this.originalEvent = originalEvent;
            this.xhr = xhr;
            this.request = request;
            this.status = xhr.status;
            this.responseType = xhr.responseType || request.responseType;
            switch (this.responseType) {
              case 'json':
                if ('response' in xhr) {
                  this.response = xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || '');
                } else {
                  this.response = JSON.parse(xhr.responseText || '');
                }
                break;
              case 'xml':
                this.response = xhr.responseXML;
                break;
              case 'text':
              default:
                this.response = ('response' in xhr) ? xhr.response : xhr.responseText;
                break;
            }
          }
          return AjaxResponse;
        }());
        exports.AjaxResponse = AjaxResponse;
        var AjaxError = (function(_super) {
          __extends(AjaxError, _super);
          function AjaxError(message, xhr, request) {
            _super.call(this, message);
            this.message = message;
            this.xhr = xhr;
            this.request = request;
            this.status = xhr.status;
          }
          return AjaxError;
        }(Error));
        exports.AjaxError = AjaxError;
        var AjaxTimeoutError = (function(_super) {
          __extends(AjaxTimeoutError, _super);
          function AjaxTimeoutError(xhr, request) {
            _super.call(this, 'ajax timeout', xhr, request);
          }
          return AjaxTimeoutError;
        }(AjaxError));
        exports.AjaxTimeoutError = AjaxTimeoutError;
      }, {
        "../../Observable": 5,
        "../../Subscriber": 13,
        "../../util/errorObject": 321,
        "../../util/root": 331,
        "../../util/tryCatch": 335
      }],
      171: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../../Subject');
        var Subscriber_1 = require('../../Subscriber');
        var Observable_1 = require('../../Observable');
        var Subscription_1 = require('../../Subscription');
        var root_1 = require('../../util/root');
        var ReplaySubject_1 = require('../../ReplaySubject');
        var tryCatch_1 = require('../../util/tryCatch');
        var errorObject_1 = require('../../util/errorObject');
        var assign_1 = require('../../util/assign');
        var WebSocketSubject = (function(_super) {
          __extends(WebSocketSubject, _super);
          function WebSocketSubject(urlConfigOrSource, destination) {
            if (urlConfigOrSource instanceof Observable_1.Observable) {
              _super.call(this, destination, urlConfigOrSource);
            } else {
              _super.call(this);
              this.WebSocketCtor = root_1.root.WebSocket;
              this._output = new Subject_1.Subject();
              if (typeof urlConfigOrSource === 'string') {
                this.url = urlConfigOrSource;
              } else {
                assign_1.assign(this, urlConfigOrSource);
              }
              if (!this.WebSocketCtor) {
                throw new Error('no WebSocket constructor can be found');
              }
              this.destination = new ReplaySubject_1.ReplaySubject();
            }
          }
          WebSocketSubject.prototype.resultSelector = function(e) {
            return JSON.parse(e.data);
          };
          WebSocketSubject.create = function(urlConfigOrSource) {
            return new WebSocketSubject(urlConfigOrSource);
          };
          WebSocketSubject.prototype.lift = function(operator) {
            var sock = new WebSocketSubject(this, this.destination);
            sock.operator = operator;
            return sock;
          };
          WebSocketSubject.prototype.multiplex = function(subMsg, unsubMsg, messageFilter) {
            var self = this;
            return new Observable_1.Observable(function(observer) {
              var result = tryCatch_1.tryCatch(subMsg)();
              if (result === errorObject_1.errorObject) {
                observer.error(errorObject_1.errorObject.e);
              } else {
                self.next(result);
              }
              var subscription = self.subscribe(function(x) {
                var result = tryCatch_1.tryCatch(messageFilter)(x);
                if (result === errorObject_1.errorObject) {
                  observer.error(errorObject_1.errorObject.e);
                } else if (result) {
                  observer.next(x);
                }
              }, function(err) {
                return observer.error(err);
              }, function() {
                return observer.complete();
              });
              return function() {
                var result = tryCatch_1.tryCatch(unsubMsg)();
                if (result === errorObject_1.errorObject) {
                  observer.error(errorObject_1.errorObject.e);
                } else {
                  self.next(result);
                }
                subscription.unsubscribe();
              };
            });
          };
          WebSocketSubject.prototype._connectSocket = function() {
            var _this = this;
            var WebSocketCtor = this.WebSocketCtor;
            var socket = this.protocol ? new WebSocketCtor(this.url, this.protocol) : new WebSocketCtor(this.url);
            this.socket = socket;
            var subscription = new Subscription_1.Subscription(function() {
              _this.socket = null;
              if (socket && socket.readyState === 1) {
                socket.close();
              }
            });
            var observer = this._output;
            socket.onopen = function(e) {
              var openObserver = _this.openObserver;
              if (openObserver) {
                openObserver.next(e);
              }
              var queue = _this.destination;
              _this.destination = Subscriber_1.Subscriber.create(function(x) {
                return socket.readyState === 1 && socket.send(x);
              }, function(e) {
                var closingObserver = _this.closingObserver;
                if (closingObserver) {
                  closingObserver.next(undefined);
                }
                if (e && e.code) {
                  socket.close(e.code, e.reason);
                } else {
                  observer.error(new TypeError('WebSocketSubject.error must be called with an object with an error code, ' + 'and an optional reason: { code: number, reason: string }'));
                }
                _this.destination = new ReplaySubject_1.ReplaySubject();
                _this.socket = null;
              }, function() {
                var closingObserver = _this.closingObserver;
                if (closingObserver) {
                  closingObserver.next(undefined);
                }
                socket.close();
                _this.destination = new ReplaySubject_1.ReplaySubject();
                _this.socket = null;
              });
              if (queue && queue instanceof ReplaySubject_1.ReplaySubject) {
                subscription.add(queue.subscribe(_this.destination));
              }
            };
            socket.onerror = function(e) {
              return observer.error(e);
            };
            socket.onclose = function(e) {
              var closeObserver = _this.closeObserver;
              if (closeObserver) {
                closeObserver.next(e);
              }
              if (e.wasClean) {
                observer.complete();
              } else {
                observer.error(e);
              }
            };
            socket.onmessage = function(e) {
              var result = tryCatch_1.tryCatch(_this.resultSelector)(e);
              if (result === errorObject_1.errorObject) {
                observer.error(errorObject_1.errorObject.e);
              } else {
                observer.next(result);
              }
            };
          };
          WebSocketSubject.prototype._subscribe = function(subscriber) {
            var _this = this;
            var source = this.source;
            if (source) {
              return source.subscribe(subscriber);
            }
            if (!this.socket) {
              this._connectSocket();
            }
            var subscription = new Subscription_1.Subscription();
            subscription.add(this._output.subscribe(subscriber));
            subscription.add(function() {
              var socket = _this.socket;
              if (socket && socket.readyState === 1) {
                socket.close();
                _this.socket = null;
              }
            });
            return subscription;
          };
          WebSocketSubject.prototype.unsubscribe = function() {
            var _a = this,
                source = _a.source,
                socket = _a.socket;
            if (socket && socket.readyState === 1) {
              socket.close();
              this.socket = null;
            }
            _super.prototype.unsubscribe.call(this);
            if (!source) {
              this.destination = new ReplaySubject_1.ReplaySubject();
            }
          };
          return WebSocketSubject;
        }(Subject_1.AnonymousSubject));
        exports.WebSocketSubject = WebSocketSubject;
      }, {
        "../../Observable": 5,
        "../../ReplaySubject": 9,
        "../../Subject": 11,
        "../../Subscriber": 13,
        "../../Subscription": 14,
        "../../util/assign": 320,
        "../../util/errorObject": 321,
        "../../util/root": 331,
        "../../util/tryCatch": 335
      }],
      172: [function(require, module, exports) {
        "use strict";
        var AjaxObservable_1 = require('./AjaxObservable');
        exports.ajax = AjaxObservable_1.AjaxObservable.create;
      }, {"./AjaxObservable": 170}],
      173: [function(require, module, exports) {
        "use strict";
        var WebSocketSubject_1 = require('./WebSocketSubject');
        exports.webSocket = WebSocketSubject_1.WebSocketSubject.create;
      }, {"./WebSocketSubject": 171}],
      174: [function(require, module, exports) {
        "use strict";
        var EmptyObservable_1 = require('./EmptyObservable');
        exports.empty = EmptyObservable_1.EmptyObservable.create;
      }, {"./EmptyObservable": 147}],
      175: [function(require, module, exports) {
        "use strict";
        var ForkJoinObservable_1 = require('./ForkJoinObservable');
        exports.forkJoin = ForkJoinObservable_1.ForkJoinObservable.create;
      }, {"./ForkJoinObservable": 149}],
      176: [function(require, module, exports) {
        "use strict";
        var FromObservable_1 = require('./FromObservable');
        exports.from = FromObservable_1.FromObservable.create;
      }, {"./FromObservable": 152}],
      177: [function(require, module, exports) {
        "use strict";
        var FromEventObservable_1 = require('./FromEventObservable');
        exports.fromEvent = FromEventObservable_1.FromEventObservable.create;
      }, {"./FromEventObservable": 150}],
      178: [function(require, module, exports) {
        "use strict";
        var FromEventPatternObservable_1 = require('./FromEventPatternObservable');
        exports.fromEventPattern = FromEventPatternObservable_1.FromEventPatternObservable.create;
      }, {"./FromEventPatternObservable": 151}],
      179: [function(require, module, exports) {
        "use strict";
        var PromiseObservable_1 = require('./PromiseObservable');
        exports.fromPromise = PromiseObservable_1.PromiseObservable.create;
      }, {"./PromiseObservable": 159}],
      180: [function(require, module, exports) {
        "use strict";
        var IfObservable_1 = require('./IfObservable');
        exports._if = IfObservable_1.IfObservable.create;
      }, {"./IfObservable": 154}],
      181: [function(require, module, exports) {
        "use strict";
        var IntervalObservable_1 = require('./IntervalObservable');
        exports.interval = IntervalObservable_1.IntervalObservable.create;
      }, {"./IntervalObservable": 155}],
      182: [function(require, module, exports) {
        "use strict";
        var merge_1 = require('../operator/merge');
        exports.merge = merge_1.mergeStatic;
      }, {"../operator/merge": 236}],
      183: [function(require, module, exports) {
        "use strict";
        var NeverObservable_1 = require('./NeverObservable');
        exports.never = NeverObservable_1.NeverObservable.create;
      }, {"./NeverObservable": 158}],
      184: [function(require, module, exports) {
        "use strict";
        var ArrayObservable_1 = require('./ArrayObservable');
        exports.of = ArrayObservable_1.ArrayObservable.of;
      }, {"./ArrayObservable": 142}],
      185: [function(require, module, exports) {
        "use strict";
        var RangeObservable_1 = require('./RangeObservable');
        exports.range = RangeObservable_1.RangeObservable.create;
      }, {"./RangeObservable": 160}],
      186: [function(require, module, exports) {
        "use strict";
        var ErrorObservable_1 = require('./ErrorObservable');
        exports._throw = ErrorObservable_1.ErrorObservable.create;
      }, {"./ErrorObservable": 148}],
      187: [function(require, module, exports) {
        "use strict";
        var TimerObservable_1 = require('./TimerObservable');
        exports.timer = TimerObservable_1.TimerObservable.create;
      }, {"./TimerObservable": 163}],
      188: [function(require, module, exports) {
        "use strict";
        var UsingObservable_1 = require('./UsingObservable');
        exports.using = UsingObservable_1.UsingObservable.create;
      }, {"./UsingObservable": 164}],
      189: [function(require, module, exports) {
        "use strict";
        var zip_1 = require('../operator/zip');
        exports.zip = zip_1.zipStatic;
      }, {"../operator/zip": 288}],
      190: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function audit(durationSelector) {
          return this.lift(new AuditOperator(durationSelector));
        }
        exports.audit = audit;
        var AuditOperator = (function() {
          function AuditOperator(durationSelector) {
            this.durationSelector = durationSelector;
          }
          AuditOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new AuditSubscriber(subscriber, this.durationSelector));
          };
          return AuditOperator;
        }());
        var AuditSubscriber = (function(_super) {
          __extends(AuditSubscriber, _super);
          function AuditSubscriber(destination, durationSelector) {
            _super.call(this, destination);
            this.durationSelector = durationSelector;
            this.hasValue = false;
          }
          AuditSubscriber.prototype._next = function(value) {
            this.value = value;
            this.hasValue = true;
            if (!this.throttled) {
              var duration = tryCatch_1.tryCatch(this.durationSelector)(value);
              if (duration === errorObject_1.errorObject) {
                this.destination.error(errorObject_1.errorObject.e);
              } else {
                this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
              }
            }
          };
          AuditSubscriber.prototype.clearThrottle = function() {
            var _a = this,
                value = _a.value,
                hasValue = _a.hasValue,
                throttled = _a.throttled;
            if (throttled) {
              this.remove(throttled);
              this.throttled = null;
              throttled.unsubscribe();
            }
            if (hasValue) {
              this.value = null;
              this.hasValue = false;
              this.destination.next(value);
            }
          };
          AuditSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex) {
            this.clearThrottle();
          };
          AuditSubscriber.prototype.notifyComplete = function() {
            this.clearThrottle();
          };
          return AuditSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      191: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var async_1 = require('../scheduler/async');
        var Subscriber_1 = require('../Subscriber');
        function auditTime(duration, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new AuditTimeOperator(duration, scheduler));
        }
        exports.auditTime = auditTime;
        var AuditTimeOperator = (function() {
          function AuditTimeOperator(duration, scheduler) {
            this.duration = duration;
            this.scheduler = scheduler;
          }
          AuditTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new AuditTimeSubscriber(subscriber, this.duration, this.scheduler));
          };
          return AuditTimeOperator;
        }());
        var AuditTimeSubscriber = (function(_super) {
          __extends(AuditTimeSubscriber, _super);
          function AuditTimeSubscriber(destination, duration, scheduler) {
            _super.call(this, destination);
            this.duration = duration;
            this.scheduler = scheduler;
            this.hasValue = false;
          }
          AuditTimeSubscriber.prototype._next = function(value) {
            this.value = value;
            this.hasValue = true;
            if (!this.throttled) {
              this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, this));
            }
          };
          AuditTimeSubscriber.prototype.clearThrottle = function() {
            var _a = this,
                value = _a.value,
                hasValue = _a.hasValue,
                throttled = _a.throttled;
            if (throttled) {
              this.remove(throttled);
              this.throttled = null;
              throttled.unsubscribe();
            }
            if (hasValue) {
              this.value = null;
              this.hasValue = false;
              this.destination.next(value);
            }
          };
          return AuditTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchNext(subscriber) {
          subscriber.clearThrottle();
        }
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      192: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function buffer(closingNotifier) {
          return this.lift(new BufferOperator(closingNotifier));
        }
        exports.buffer = buffer;
        var BufferOperator = (function() {
          function BufferOperator(closingNotifier) {
            this.closingNotifier = closingNotifier;
          }
          BufferOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
          };
          return BufferOperator;
        }());
        var BufferSubscriber = (function(_super) {
          __extends(BufferSubscriber, _super);
          function BufferSubscriber(destination, closingNotifier) {
            _super.call(this, destination);
            this.buffer = [];
            this.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
          }
          BufferSubscriber.prototype._next = function(value) {
            this.buffer.push(value);
          };
          BufferSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var buffer = this.buffer;
            this.buffer = [];
            this.destination.next(buffer);
          };
          return BufferSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      193: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function bufferCount(bufferSize, startBufferEvery) {
          if (startBufferEvery === void 0) {
            startBufferEvery = null;
          }
          return this.lift(new BufferCountOperator(bufferSize, startBufferEvery));
        }
        exports.bufferCount = bufferCount;
        var BufferCountOperator = (function() {
          function BufferCountOperator(bufferSize, startBufferEvery) {
            this.bufferSize = bufferSize;
            this.startBufferEvery = startBufferEvery;
          }
          BufferCountOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery));
          };
          return BufferCountOperator;
        }());
        var BufferCountSubscriber = (function(_super) {
          __extends(BufferCountSubscriber, _super);
          function BufferCountSubscriber(destination, bufferSize, startBufferEvery) {
            _super.call(this, destination);
            this.bufferSize = bufferSize;
            this.startBufferEvery = startBufferEvery;
            this.buffers = [[]];
            this.count = 0;
          }
          BufferCountSubscriber.prototype._next = function(value) {
            var count = (this.count += 1);
            var destination = this.destination;
            var bufferSize = this.bufferSize;
            var startBufferEvery = (this.startBufferEvery == null) ? bufferSize : this.startBufferEvery;
            var buffers = this.buffers;
            var len = buffers.length;
            var remove = -1;
            if (count % startBufferEvery === 0) {
              buffers.push([]);
            }
            for (var i = 0; i < len; i++) {
              var buffer = buffers[i];
              buffer.push(value);
              if (buffer.length === bufferSize) {
                remove = i;
                destination.next(buffer);
              }
            }
            if (remove !== -1) {
              buffers.splice(remove, 1);
            }
          };
          BufferCountSubscriber.prototype._complete = function() {
            var destination = this.destination;
            var buffers = this.buffers;
            while (buffers.length > 0) {
              var buffer = buffers.shift();
              if (buffer.length > 0) {
                destination.next(buffer);
              }
            }
            _super.prototype._complete.call(this);
          };
          return BufferCountSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      194: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        var isScheduler_1 = require('../util/isScheduler');
        function bufferTime(bufferTimeSpan) {
          var length = arguments.length;
          var scheduler = async_1.async;
          if (isScheduler_1.isScheduler(arguments[arguments.length - 1])) {
            scheduler = arguments[arguments.length - 1];
            length--;
          }
          var bufferCreationInterval = null;
          if (length >= 2) {
            bufferCreationInterval = arguments[1];
          }
          var maxBufferSize = Number.POSITIVE_INFINITY;
          if (length >= 3) {
            maxBufferSize = arguments[2];
          }
          return this.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
        }
        exports.bufferTime = bufferTime;
        var BufferTimeOperator = (function() {
          function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
            this.bufferTimeSpan = bufferTimeSpan;
            this.bufferCreationInterval = bufferCreationInterval;
            this.maxBufferSize = maxBufferSize;
            this.scheduler = scheduler;
          }
          BufferTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
          };
          return BufferTimeOperator;
        }());
        var Context = (function() {
          function Context() {
            this.buffer = [];
          }
          return Context;
        }());
        var BufferTimeSubscriber = (function(_super) {
          __extends(BufferTimeSubscriber, _super);
          function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
            _super.call(this, destination);
            this.bufferTimeSpan = bufferTimeSpan;
            this.bufferCreationInterval = bufferCreationInterval;
            this.maxBufferSize = maxBufferSize;
            this.scheduler = scheduler;
            this.contexts = [];
            var context = this.openContext();
            this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
            if (this.timespanOnly) {
              var timeSpanOnlyState = {
                subscriber: this,
                context: context,
                bufferTimeSpan: bufferTimeSpan
              };
              this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
            } else {
              var closeState = {
                subscriber: this,
                context: context
              };
              var creationState = {
                bufferTimeSpan: bufferTimeSpan,
                bufferCreationInterval: bufferCreationInterval,
                subscriber: this,
                scheduler: scheduler
              };
              this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
              this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
            }
          }
          BufferTimeSubscriber.prototype._next = function(value) {
            var contexts = this.contexts;
            var len = contexts.length;
            var filledBufferContext;
            for (var i = 0; i < len; i++) {
              var context = contexts[i];
              var buffer = context.buffer;
              buffer.push(value);
              if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context;
              }
            }
            if (filledBufferContext) {
              this.onBufferFull(filledBufferContext);
            }
          };
          BufferTimeSubscriber.prototype._error = function(err) {
            this.contexts.length = 0;
            _super.prototype._error.call(this, err);
          };
          BufferTimeSubscriber.prototype._complete = function() {
            var _a = this,
                contexts = _a.contexts,
                destination = _a.destination;
            while (contexts.length > 0) {
              var context = contexts.shift();
              destination.next(context.buffer);
            }
            _super.prototype._complete.call(this);
          };
          BufferTimeSubscriber.prototype._unsubscribe = function() {
            this.contexts = null;
          };
          BufferTimeSubscriber.prototype.onBufferFull = function(context) {
            this.closeContext(context);
            var closeAction = context.closeAction;
            closeAction.unsubscribe();
            this.remove(closeAction);
            if (this.timespanOnly) {
              context = this.openContext();
              var bufferTimeSpan = this.bufferTimeSpan;
              var timeSpanOnlyState = {
                subscriber: this,
                context: context,
                bufferTimeSpan: bufferTimeSpan
              };
              this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
            }
          };
          BufferTimeSubscriber.prototype.openContext = function() {
            var context = new Context();
            this.contexts.push(context);
            return context;
          };
          BufferTimeSubscriber.prototype.closeContext = function(context) {
            this.destination.next(context.buffer);
            var contexts = this.contexts;
            var spliceIndex = contexts ? contexts.indexOf(context) : -1;
            if (spliceIndex >= 0) {
              contexts.splice(contexts.indexOf(context), 1);
            }
          };
          return BufferTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchBufferTimeSpanOnly(state) {
          var subscriber = state.subscriber;
          var prevContext = state.context;
          if (prevContext) {
            subscriber.closeContext(prevContext);
          }
          if (!subscriber.isUnsubscribed) {
            state.context = subscriber.openContext();
            state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
          }
        }
        function dispatchBufferCreation(state) {
          var bufferCreationInterval = state.bufferCreationInterval,
              bufferTimeSpan = state.bufferTimeSpan,
              subscriber = state.subscriber,
              scheduler = state.scheduler;
          var context = subscriber.openContext();
          var action = this;
          if (!subscriber.isUnsubscribed) {
            subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, {
              subscriber: subscriber,
              context: context
            }));
            action.schedule(state, bufferCreationInterval);
          }
        }
        function dispatchBufferClose(arg) {
          var subscriber = arg.subscriber,
              context = arg.context;
          subscriber.closeContext(context);
        }
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301,
        "../util/isScheduler": 328
      }],
      195: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscription_1 = require('../Subscription');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        function bufferToggle(openings, closingSelector) {
          return this.lift(new BufferToggleOperator(openings, closingSelector));
        }
        exports.bufferToggle = bufferToggle;
        var BufferToggleOperator = (function() {
          function BufferToggleOperator(openings, closingSelector) {
            this.openings = openings;
            this.closingSelector = closingSelector;
          }
          BufferToggleOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
          };
          return BufferToggleOperator;
        }());
        var BufferToggleSubscriber = (function(_super) {
          __extends(BufferToggleSubscriber, _super);
          function BufferToggleSubscriber(destination, openings, closingSelector) {
            _super.call(this, destination);
            this.openings = openings;
            this.closingSelector = closingSelector;
            this.contexts = [];
            this.add(subscribeToResult_1.subscribeToResult(this, openings));
          }
          BufferToggleSubscriber.prototype._next = function(value) {
            var contexts = this.contexts;
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
              contexts[i].buffer.push(value);
            }
          };
          BufferToggleSubscriber.prototype._error = function(err) {
            var contexts = this.contexts;
            while (contexts.length > 0) {
              var context = contexts.shift();
              context.subscription.unsubscribe();
              context.buffer = null;
              context.subscription = null;
            }
            this.contexts = null;
            _super.prototype._error.call(this, err);
          };
          BufferToggleSubscriber.prototype._complete = function() {
            var contexts = this.contexts;
            while (contexts.length > 0) {
              var context = contexts.shift();
              this.destination.next(context.buffer);
              context.subscription.unsubscribe();
              context.buffer = null;
              context.subscription = null;
            }
            this.contexts = null;
            _super.prototype._complete.call(this);
          };
          BufferToggleSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
          };
          BufferToggleSubscriber.prototype.notifyComplete = function(innerSub) {
            this.closeBuffer(innerSub.context);
          };
          BufferToggleSubscriber.prototype.openBuffer = function(value) {
            try {
              var closingSelector = this.closingSelector;
              var closingNotifier = closingSelector.call(this, value);
              if (closingNotifier) {
                this.trySubscribe(closingNotifier);
              }
            } catch (err) {
              this._error(err);
            }
          };
          BufferToggleSubscriber.prototype.closeBuffer = function(context) {
            var contexts = this.contexts;
            if (contexts && context) {
              var buffer = context.buffer,
                  subscription = context.subscription;
              this.destination.next(buffer);
              contexts.splice(contexts.indexOf(context), 1);
              this.remove(subscription);
              subscription.unsubscribe();
            }
          };
          BufferToggleSubscriber.prototype.trySubscribe = function(closingNotifier) {
            var contexts = this.contexts;
            var buffer = [];
            var subscription = new Subscription_1.Subscription();
            var context = {
              buffer: buffer,
              subscription: subscription
            };
            contexts.push(context);
            var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
            if (!innerSubscription || innerSubscription.isUnsubscribed) {
              this.closeBuffer(context);
            } else {
              innerSubscription.context = context;
              this.add(innerSubscription);
              subscription.add(innerSubscription);
            }
          };
          return BufferToggleSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subscription": 14,
        "../util/subscribeToResult": 332
      }],
      196: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscription_1 = require('../Subscription');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function bufferWhen(closingSelector) {
          return this.lift(new BufferWhenOperator(closingSelector));
        }
        exports.bufferWhen = bufferWhen;
        var BufferWhenOperator = (function() {
          function BufferWhenOperator(closingSelector) {
            this.closingSelector = closingSelector;
          }
          BufferWhenOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
          };
          return BufferWhenOperator;
        }());
        var BufferWhenSubscriber = (function(_super) {
          __extends(BufferWhenSubscriber, _super);
          function BufferWhenSubscriber(destination, closingSelector) {
            _super.call(this, destination);
            this.closingSelector = closingSelector;
            this.subscribing = false;
            this.openBuffer();
          }
          BufferWhenSubscriber.prototype._next = function(value) {
            this.buffer.push(value);
          };
          BufferWhenSubscriber.prototype._complete = function() {
            var buffer = this.buffer;
            if (buffer) {
              this.destination.next(buffer);
            }
            _super.prototype._complete.call(this);
          };
          BufferWhenSubscriber.prototype._unsubscribe = function() {
            this.buffer = null;
            this.subscribing = false;
          };
          BufferWhenSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.openBuffer();
          };
          BufferWhenSubscriber.prototype.notifyComplete = function() {
            if (this.subscribing) {
              this.complete();
            } else {
              this.openBuffer();
            }
          };
          BufferWhenSubscriber.prototype.openBuffer = function() {
            var closingSubscription = this.closingSubscription;
            if (closingSubscription) {
              this.remove(closingSubscription);
              closingSubscription.unsubscribe();
            }
            var buffer = this.buffer;
            if (this.buffer) {
              this.destination.next(buffer);
            }
            this.buffer = [];
            var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
            if (closingNotifier === errorObject_1.errorObject) {
              this.error(errorObject_1.errorObject.e);
            } else {
              closingSubscription = new Subscription_1.Subscription();
              this.closingSubscription = closingSubscription;
              this.add(closingSubscription);
              this.subscribing = true;
              closingSubscription.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
              this.subscribing = false;
            }
          };
          return BufferWhenSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subscription": 14,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      197: [function(require, module, exports) {
        "use strict";
        var Observable_1 = require('../Observable');
        var ReplaySubject_1 = require('../ReplaySubject');
        function cache(bufferSize, windowTime, scheduler) {
          if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
          }
          if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
          }
          var subject;
          var source = this;
          var refs = 0;
          var outerSub;
          var getSubject = function() {
            subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
            return subject;
          };
          return new Observable_1.Observable(function(observer) {
            if (!subject) {
              subject = getSubject();
              outerSub = source.subscribe(function(value) {
                return subject.next(value);
              }, function(err) {
                var s = subject;
                subject = null;
                s.error(err);
              }, function() {
                return subject.complete();
              });
            }
            refs++;
            if (!subject) {
              subject = getSubject();
            }
            var innerSub = subject.subscribe(observer);
            return function() {
              refs--;
              if (innerSub) {
                innerSub.unsubscribe();
              }
              if (refs === 0) {
                outerSub.unsubscribe();
              }
            };
          });
        }
        exports.cache = cache;
      }, {
        "../Observable": 5,
        "../ReplaySubject": 9
      }],
      198: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function _catch(selector) {
          var operator = new CatchOperator(selector);
          var caught = this.lift(operator);
          return (operator.caught = caught);
        }
        exports._catch = _catch;
        var CatchOperator = (function() {
          function CatchOperator(selector) {
            this.selector = selector;
          }
          CatchOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
          };
          return CatchOperator;
        }());
        var CatchSubscriber = (function(_super) {
          __extends(CatchSubscriber, _super);
          function CatchSubscriber(destination, selector, caught) {
            _super.call(this, destination);
            this.selector = selector;
            this.caught = caught;
          }
          CatchSubscriber.prototype.error = function(err) {
            if (!this.isStopped) {
              var result = void 0;
              try {
                result = this.selector(err, this.caught);
              } catch (err) {
                this.destination.error(err);
                return;
              }
              this._innerSub(result);
            }
          };
          CatchSubscriber.prototype._innerSub = function(result) {
            this.unsubscribe();
            this.destination.remove(this);
            result.subscribe(this.destination);
          };
          return CatchSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      199: [function(require, module, exports) {
        "use strict";
        var combineLatest_1 = require('./combineLatest');
        function combineAll(project) {
          return this.lift(new combineLatest_1.CombineLatestOperator(project));
        }
        exports.combineAll = combineAll;
      }, {"./combineLatest": 200}],
      200: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var isArray_1 = require('../util/isArray');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var none = {};
        function combineLatest() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          var project = null;
          if (typeof observables[observables.length - 1] === 'function') {
            project = observables.pop();
          }
          if (observables.length === 1 && isArray_1.isArray(observables[0])) {
            observables = observables[0];
          }
          observables.unshift(this);
          return new ArrayObservable_1.ArrayObservable(observables).lift(new CombineLatestOperator(project));
        }
        exports.combineLatest = combineLatest;
        var CombineLatestOperator = (function() {
          function CombineLatestOperator(project) {
            this.project = project;
          }
          CombineLatestOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
          };
          return CombineLatestOperator;
        }());
        exports.CombineLatestOperator = CombineLatestOperator;
        var CombineLatestSubscriber = (function(_super) {
          __extends(CombineLatestSubscriber, _super);
          function CombineLatestSubscriber(destination, project) {
            _super.call(this, destination);
            this.project = project;
            this.active = 0;
            this.values = [];
            this.observables = [];
          }
          CombineLatestSubscriber.prototype._next = function(observable) {
            this.values.push(none);
            this.observables.push(observable);
          };
          CombineLatestSubscriber.prototype._complete = function() {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
              this.destination.complete();
            } else {
              this.active = len;
              this.toRespond = len;
              for (var i = 0; i < len; i++) {
                var observable = observables[i];
                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
              }
            }
          };
          CombineLatestSubscriber.prototype.notifyComplete = function(unused) {
            if ((this.active -= 1) === 0) {
              this.destination.complete();
            }
          };
          CombineLatestSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var values = this.values;
            var oldVal = values[outerIndex];
            var toRespond = !this.toRespond ? 0 : oldVal === none ? --this.toRespond : this.toRespond;
            values[outerIndex] = innerValue;
            if (toRespond === 0) {
              if (this.project) {
                this._tryProject(values);
              } else {
                this.destination.next(values);
              }
            }
          };
          CombineLatestSubscriber.prototype._tryProject = function(values) {
            var result;
            try {
              result = this.project.apply(this, values);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          return CombineLatestSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.CombineLatestSubscriber = CombineLatestSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../observable/ArrayObservable": 142,
        "../util/isArray": 322,
        "../util/subscribeToResult": 332
      }],
      201: [function(require, module, exports) {
        "use strict";
        var isScheduler_1 = require('../util/isScheduler');
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var mergeAll_1 = require('./mergeAll');
        function concat() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          return concatStatic.apply(void 0, [this].concat(observables));
        }
        exports.concat = concat;
        function concatStatic() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          var scheduler = null;
          var args = observables;
          if (isScheduler_1.isScheduler(args[observables.length - 1])) {
            scheduler = args.pop();
          }
          return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
        }
        exports.concatStatic = concatStatic;
      }, {
        "../observable/ArrayObservable": 142,
        "../util/isScheduler": 328,
        "./mergeAll": 237
      }],
      202: [function(require, module, exports) {
        "use strict";
        var mergeAll_1 = require('./mergeAll');
        function concatAll() {
          return this.lift(new mergeAll_1.MergeAllOperator(1));
        }
        exports.concatAll = concatAll;
      }, {"./mergeAll": 237}],
      203: [function(require, module, exports) {
        "use strict";
        var mergeMap_1 = require('./mergeMap');
        function concatMap(project, resultSelector) {
          return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
        }
        exports.concatMap = concatMap;
      }, {"./mergeMap": 238}],
      204: [function(require, module, exports) {
        "use strict";
        var mergeMapTo_1 = require('./mergeMapTo');
        function concatMapTo(innerObservable, resultSelector) {
          return this.lift(new mergeMapTo_1.MergeMapToOperator(innerObservable, resultSelector, 1));
        }
        exports.concatMapTo = concatMapTo;
      }, {"./mergeMapTo": 239}],
      205: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function count(predicate) {
          return this.lift(new CountOperator(predicate, this));
        }
        exports.count = count;
        var CountOperator = (function() {
          function CountOperator(predicate, source) {
            this.predicate = predicate;
            this.source = source;
          }
          CountOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
          };
          return CountOperator;
        }());
        var CountSubscriber = (function(_super) {
          __extends(CountSubscriber, _super);
          function CountSubscriber(destination, predicate, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.source = source;
            this.count = 0;
            this.index = 0;
          }
          CountSubscriber.prototype._next = function(value) {
            if (this.predicate) {
              this._tryPredicate(value);
            } else {
              this.count++;
            }
          };
          CountSubscriber.prototype._tryPredicate = function(value) {
            var result;
            try {
              result = this.predicate(value, this.index++, this.source);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            if (result) {
              this.count++;
            }
          };
          CountSubscriber.prototype._complete = function() {
            this.destination.next(this.count);
            this.destination.complete();
          };
          return CountSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      206: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function debounce(durationSelector) {
          return this.lift(new DebounceOperator(durationSelector));
        }
        exports.debounce = debounce;
        var DebounceOperator = (function() {
          function DebounceOperator(durationSelector) {
            this.durationSelector = durationSelector;
          }
          DebounceOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
          };
          return DebounceOperator;
        }());
        var DebounceSubscriber = (function(_super) {
          __extends(DebounceSubscriber, _super);
          function DebounceSubscriber(destination, durationSelector) {
            _super.call(this, destination);
            this.durationSelector = durationSelector;
            this.hasValue = false;
            this.durationSubscription = null;
          }
          DebounceSubscriber.prototype._next = function(value) {
            try {
              var result = this.durationSelector.call(this, value);
              if (result) {
                this._tryNext(value, result);
              }
            } catch (err) {
              this.destination.error(err);
            }
          };
          DebounceSubscriber.prototype._complete = function() {
            this.emitValue();
            this.destination.complete();
          };
          DebounceSubscriber.prototype._tryNext = function(value, duration) {
            var subscription = this.durationSubscription;
            this.value = value;
            this.hasValue = true;
            if (subscription) {
              subscription.unsubscribe();
              this.remove(subscription);
            }
            subscription = subscribeToResult_1.subscribeToResult(this, duration);
            if (!subscription.isUnsubscribed) {
              this.add(this.durationSubscription = subscription);
            }
          };
          DebounceSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.emitValue();
          };
          DebounceSubscriber.prototype.notifyComplete = function() {
            this.emitValue();
          };
          DebounceSubscriber.prototype.emitValue = function() {
            if (this.hasValue) {
              var value = this.value;
              var subscription = this.durationSubscription;
              if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
              }
              this.value = null;
              this.hasValue = false;
              _super.prototype._next.call(this, value);
            }
          };
          return DebounceSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      207: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        function debounceTime(dueTime, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new DebounceTimeOperator(dueTime, scheduler));
        }
        exports.debounceTime = debounceTime;
        var DebounceTimeOperator = (function() {
          function DebounceTimeOperator(dueTime, scheduler) {
            this.dueTime = dueTime;
            this.scheduler = scheduler;
          }
          DebounceTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
          };
          return DebounceTimeOperator;
        }());
        var DebounceTimeSubscriber = (function(_super) {
          __extends(DebounceTimeSubscriber, _super);
          function DebounceTimeSubscriber(destination, dueTime, scheduler) {
            _super.call(this, destination);
            this.dueTime = dueTime;
            this.scheduler = scheduler;
            this.debouncedSubscription = null;
            this.lastValue = null;
            this.hasValue = false;
          }
          DebounceTimeSubscriber.prototype._next = function(value) {
            this.clearDebounce();
            this.lastValue = value;
            this.hasValue = true;
            this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
          };
          DebounceTimeSubscriber.prototype._complete = function() {
            this.debouncedNext();
            this.destination.complete();
          };
          DebounceTimeSubscriber.prototype.debouncedNext = function() {
            this.clearDebounce();
            if (this.hasValue) {
              this.destination.next(this.lastValue);
              this.lastValue = null;
              this.hasValue = false;
            }
          };
          DebounceTimeSubscriber.prototype.clearDebounce = function() {
            var debouncedSubscription = this.debouncedSubscription;
            if (debouncedSubscription !== null) {
              this.remove(debouncedSubscription);
              debouncedSubscription.unsubscribe();
              this.debouncedSubscription = null;
            }
          };
          return DebounceTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchNext(subscriber) {
          subscriber.debouncedNext();
        }
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      208: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function defaultIfEmpty(defaultValue) {
          if (defaultValue === void 0) {
            defaultValue = null;
          }
          return this.lift(new DefaultIfEmptyOperator(defaultValue));
        }
        exports.defaultIfEmpty = defaultIfEmpty;
        var DefaultIfEmptyOperator = (function() {
          function DefaultIfEmptyOperator(defaultValue) {
            this.defaultValue = defaultValue;
          }
          DefaultIfEmptyOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
          };
          return DefaultIfEmptyOperator;
        }());
        var DefaultIfEmptySubscriber = (function(_super) {
          __extends(DefaultIfEmptySubscriber, _super);
          function DefaultIfEmptySubscriber(destination, defaultValue) {
            _super.call(this, destination);
            this.defaultValue = defaultValue;
            this.isEmpty = true;
          }
          DefaultIfEmptySubscriber.prototype._next = function(value) {
            this.isEmpty = false;
            this.destination.next(value);
          };
          DefaultIfEmptySubscriber.prototype._complete = function() {
            if (this.isEmpty) {
              this.destination.next(this.defaultValue);
            }
            this.destination.complete();
          };
          return DefaultIfEmptySubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      209: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var async_1 = require('../scheduler/async');
        var isDate_1 = require('../util/isDate');
        var Subscriber_1 = require('../Subscriber');
        var Notification_1 = require('../Notification');
        function delay(delay, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          var absoluteDelay = isDate_1.isDate(delay);
          var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
          return this.lift(new DelayOperator(delayFor, scheduler));
        }
        exports.delay = delay;
        var DelayOperator = (function() {
          function DelayOperator(delay, scheduler) {
            this.delay = delay;
            this.scheduler = scheduler;
          }
          DelayOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
          };
          return DelayOperator;
        }());
        var DelaySubscriber = (function(_super) {
          __extends(DelaySubscriber, _super);
          function DelaySubscriber(destination, delay, scheduler) {
            _super.call(this, destination);
            this.delay = delay;
            this.scheduler = scheduler;
            this.queue = [];
            this.active = false;
            this.errored = false;
          }
          DelaySubscriber.dispatch = function(state) {
            var source = state.source;
            var queue = source.queue;
            var scheduler = state.scheduler;
            var destination = state.destination;
            while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
              queue.shift().notification.observe(destination);
            }
            if (queue.length > 0) {
              var delay_1 = Math.max(0, queue[0].time - scheduler.now());
              this.schedule(state, delay_1);
            } else {
              source.active = false;
            }
          };
          DelaySubscriber.prototype._schedule = function(scheduler) {
            this.active = true;
            this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
              source: this,
              destination: this.destination,
              scheduler: scheduler
            }));
          };
          DelaySubscriber.prototype.scheduleNotification = function(notification) {
            if (this.errored === true) {
              return;
            }
            var scheduler = this.scheduler;
            var message = new DelayMessage(scheduler.now() + this.delay, notification);
            this.queue.push(message);
            if (this.active === false) {
              this._schedule(scheduler);
            }
          };
          DelaySubscriber.prototype._next = function(value) {
            this.scheduleNotification(Notification_1.Notification.createNext(value));
          };
          DelaySubscriber.prototype._error = function(err) {
            this.errored = true;
            this.queue = [];
            this.destination.error(err);
          };
          DelaySubscriber.prototype._complete = function() {
            this.scheduleNotification(Notification_1.Notification.createComplete());
          };
          return DelaySubscriber;
        }(Subscriber_1.Subscriber));
        var DelayMessage = (function() {
          function DelayMessage(time, notification) {
            this.time = time;
            this.notification = notification;
          }
          return DelayMessage;
        }());
      }, {
        "../Notification": 4,
        "../Subscriber": 13,
        "../scheduler/async": 301,
        "../util/isDate": 323
      }],
      210: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Observable_1 = require('../Observable');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function delayWhen(delayDurationSelector, subscriptionDelay) {
          if (subscriptionDelay) {
            return new SubscriptionDelayObservable(this, subscriptionDelay).lift(new DelayWhenOperator(delayDurationSelector));
          }
          return this.lift(new DelayWhenOperator(delayDurationSelector));
        }
        exports.delayWhen = delayWhen;
        var DelayWhenOperator = (function() {
          function DelayWhenOperator(delayDurationSelector) {
            this.delayDurationSelector = delayDurationSelector;
          }
          DelayWhenOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
          };
          return DelayWhenOperator;
        }());
        var DelayWhenSubscriber = (function(_super) {
          __extends(DelayWhenSubscriber, _super);
          function DelayWhenSubscriber(destination, delayDurationSelector) {
            _super.call(this, destination);
            this.delayDurationSelector = delayDurationSelector;
            this.completed = false;
            this.delayNotifierSubscriptions = [];
            this.values = [];
          }
          DelayWhenSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(outerValue);
            this.removeSubscription(innerSub);
            this.tryComplete();
          };
          DelayWhenSubscriber.prototype.notifyError = function(error, innerSub) {
            this._error(error);
          };
          DelayWhenSubscriber.prototype.notifyComplete = function(innerSub) {
            var value = this.removeSubscription(innerSub);
            if (value) {
              this.destination.next(value);
            }
            this.tryComplete();
          };
          DelayWhenSubscriber.prototype._next = function(value) {
            try {
              var delayNotifier = this.delayDurationSelector(value);
              if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
              }
            } catch (err) {
              this.destination.error(err);
            }
          };
          DelayWhenSubscriber.prototype._complete = function() {
            this.completed = true;
            this.tryComplete();
          };
          DelayWhenSubscriber.prototype.removeSubscription = function(subscription) {
            subscription.unsubscribe();
            var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
            var value = null;
            if (subscriptionIdx !== -1) {
              value = this.values[subscriptionIdx];
              this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
              this.values.splice(subscriptionIdx, 1);
            }
            return value;
          };
          DelayWhenSubscriber.prototype.tryDelay = function(delayNotifier, value) {
            var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
            this.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
            this.values.push(value);
          };
          DelayWhenSubscriber.prototype.tryComplete = function() {
            if (this.completed && this.delayNotifierSubscriptions.length === 0) {
              this.destination.complete();
            }
          };
          return DelayWhenSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        var SubscriptionDelayObservable = (function(_super) {
          __extends(SubscriptionDelayObservable, _super);
          function SubscriptionDelayObservable(source, subscriptionDelay) {
            _super.call(this);
            this.source = source;
            this.subscriptionDelay = subscriptionDelay;
          }
          SubscriptionDelayObservable.prototype._subscribe = function(subscriber) {
            this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
          };
          return SubscriptionDelayObservable;
        }(Observable_1.Observable));
        var SubscriptionDelaySubscriber = (function(_super) {
          __extends(SubscriptionDelaySubscriber, _super);
          function SubscriptionDelaySubscriber(parent, source) {
            _super.call(this);
            this.parent = parent;
            this.source = source;
            this.sourceSubscribed = false;
          }
          SubscriptionDelaySubscriber.prototype._next = function(unused) {
            this.subscribeToSource();
          };
          SubscriptionDelaySubscriber.prototype._error = function(err) {
            this.unsubscribe();
            this.parent.error(err);
          };
          SubscriptionDelaySubscriber.prototype._complete = function() {
            this.subscribeToSource();
          };
          SubscriptionDelaySubscriber.prototype.subscribeToSource = function() {
            if (!this.sourceSubscribed) {
              this.sourceSubscribed = true;
              this.unsubscribe();
              this.source.subscribe(this.parent);
            }
          };
          return SubscriptionDelaySubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Observable": 5,
        "../OuterSubscriber": 8,
        "../Subscriber": 13,
        "../util/subscribeToResult": 332
      }],
      211: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function dematerialize() {
          return this.lift(new DeMaterializeOperator());
        }
        exports.dematerialize = dematerialize;
        var DeMaterializeOperator = (function() {
          function DeMaterializeOperator() {}
          DeMaterializeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DeMaterializeSubscriber(subscriber));
          };
          return DeMaterializeOperator;
        }());
        var DeMaterializeSubscriber = (function(_super) {
          __extends(DeMaterializeSubscriber, _super);
          function DeMaterializeSubscriber(destination) {
            _super.call(this, destination);
          }
          DeMaterializeSubscriber.prototype._next = function(value) {
            value.observe(this.destination);
          };
          return DeMaterializeSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      212: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function distinct(compare, flushes) {
          return this.lift(new DistinctOperator(compare, flushes));
        }
        exports.distinct = distinct;
        var DistinctOperator = (function() {
          function DistinctOperator(compare, flushes) {
            this.compare = compare;
            this.flushes = flushes;
          }
          DistinctOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DistinctSubscriber(subscriber, this.compare, this.flushes));
          };
          return DistinctOperator;
        }());
        var DistinctSubscriber = (function(_super) {
          __extends(DistinctSubscriber, _super);
          function DistinctSubscriber(destination, compare, flushes) {
            _super.call(this, destination);
            this.values = [];
            if (typeof compare === 'function') {
              this.compare = compare;
            }
            if (flushes) {
              this.add(subscribeToResult_1.subscribeToResult(this, flushes));
            }
          }
          DistinctSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.values.length = 0;
          };
          DistinctSubscriber.prototype.notifyError = function(error, innerSub) {
            this._error(error);
          };
          DistinctSubscriber.prototype._next = function(value) {
            var found = false;
            var values = this.values;
            var len = values.length;
            try {
              for (var i = 0; i < len; i++) {
                if (this.compare(values[i], value)) {
                  found = true;
                  return;
                }
              }
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.values.push(value);
            this.destination.next(value);
          };
          DistinctSubscriber.prototype.compare = function(x, y) {
            return x === y;
          };
          return DistinctSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.DistinctSubscriber = DistinctSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      213: [function(require, module, exports) {
        "use strict";
        var distinct_1 = require('./distinct');
        function distinctKey(key, compare, flushes) {
          return distinct_1.distinct.call(this, function(x, y) {
            if (compare) {
              return compare(x[key], y[key]);
            }
            return x[key] === y[key];
          }, flushes);
        }
        exports.distinctKey = distinctKey;
      }, {"./distinct": 212}],
      214: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        function distinctUntilChanged(compare, keySelector) {
          return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
        }
        exports.distinctUntilChanged = distinctUntilChanged;
        var DistinctUntilChangedOperator = (function() {
          function DistinctUntilChangedOperator(compare, keySelector) {
            this.compare = compare;
            this.keySelector = keySelector;
          }
          DistinctUntilChangedOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
          };
          return DistinctUntilChangedOperator;
        }());
        var DistinctUntilChangedSubscriber = (function(_super) {
          __extends(DistinctUntilChangedSubscriber, _super);
          function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
            _super.call(this, destination);
            this.keySelector = keySelector;
            this.hasKey = false;
            if (typeof compare === 'function') {
              this.compare = compare;
            }
          }
          DistinctUntilChangedSubscriber.prototype.compare = function(x, y) {
            return x === y;
          };
          DistinctUntilChangedSubscriber.prototype._next = function(value) {
            var keySelector = this.keySelector;
            var key = value;
            if (keySelector) {
              key = tryCatch_1.tryCatch(this.keySelector)(value);
              if (key === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
              }
            }
            var result = false;
            if (this.hasKey) {
              result = tryCatch_1.tryCatch(this.compare)(this.key, key);
              if (result === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
              }
            } else {
              this.hasKey = true;
            }
            if (Boolean(result) === false) {
              this.key = key;
              this.destination.next(value);
            }
          };
          return DistinctUntilChangedSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/errorObject": 321,
        "../util/tryCatch": 335
      }],
      215: [function(require, module, exports) {
        "use strict";
        var distinctUntilChanged_1 = require('./distinctUntilChanged');
        function distinctUntilKeyChanged(key, compare) {
          return distinctUntilChanged_1.distinctUntilChanged.call(this, function(x, y) {
            if (compare) {
              return compare(x[key], y[key]);
            }
            return x[key] === y[key];
          });
        }
        exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
      }, {"./distinctUntilChanged": 214}],
      216: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function _do(nextOrObserver, error, complete) {
          return this.lift(new DoOperator(nextOrObserver, error, complete));
        }
        exports._do = _do;
        var DoOperator = (function() {
          function DoOperator(nextOrObserver, error, complete) {
            this.nextOrObserver = nextOrObserver;
            this.error = error;
            this.complete = complete;
          }
          DoOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
          };
          return DoOperator;
        }());
        var DoSubscriber = (function(_super) {
          __extends(DoSubscriber, _super);
          function DoSubscriber(destination, nextOrObserver, error, complete) {
            _super.call(this, destination);
            var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
            safeSubscriber.syncErrorThrowable = true;
            this.add(safeSubscriber);
            this.safeSubscriber = safeSubscriber;
          }
          DoSubscriber.prototype._next = function(value) {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.next(value);
            if (safeSubscriber.syncErrorThrown) {
              this.destination.error(safeSubscriber.syncErrorValue);
            } else {
              this.destination.next(value);
            }
          };
          DoSubscriber.prototype._error = function(err) {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.error(err);
            if (safeSubscriber.syncErrorThrown) {
              this.destination.error(safeSubscriber.syncErrorValue);
            } else {
              this.destination.error(err);
            }
          };
          DoSubscriber.prototype._complete = function() {
            var safeSubscriber = this.safeSubscriber;
            safeSubscriber.complete();
            if (safeSubscriber.syncErrorThrown) {
              this.destination.error(safeSubscriber.syncErrorValue);
            } else {
              this.destination.complete();
            }
          };
          return DoSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      217: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
        function elementAt(index, defaultValue) {
          return this.lift(new ElementAtOperator(index, defaultValue));
        }
        exports.elementAt = elementAt;
        var ElementAtOperator = (function() {
          function ElementAtOperator(index, defaultValue) {
            this.index = index;
            this.defaultValue = defaultValue;
            if (index < 0) {
              throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
            }
          }
          ElementAtOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ElementAtSubscriber(subscriber, this.index, this.defaultValue));
          };
          return ElementAtOperator;
        }());
        var ElementAtSubscriber = (function(_super) {
          __extends(ElementAtSubscriber, _super);
          function ElementAtSubscriber(destination, index, defaultValue) {
            _super.call(this, destination);
            this.index = index;
            this.defaultValue = defaultValue;
          }
          ElementAtSubscriber.prototype._next = function(x) {
            if (this.index-- === 0) {
              this.destination.next(x);
              this.destination.complete();
            }
          };
          ElementAtSubscriber.prototype._complete = function() {
            var destination = this.destination;
            if (this.index >= 0) {
              if (typeof this.defaultValue !== 'undefined') {
                destination.next(this.defaultValue);
              } else {
                destination.error(new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError);
              }
            }
            destination.complete();
          };
          return ElementAtSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/ArgumentOutOfRangeError": 311
      }],
      218: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function every(predicate, thisArg) {
          return this.lift(new EveryOperator(predicate, thisArg, this));
        }
        exports.every = every;
        var EveryOperator = (function() {
          function EveryOperator(predicate, thisArg, source) {
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.source = source;
          }
          EveryOperator.prototype.call = function(observer, source) {
            return source._subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
          };
          return EveryOperator;
        }());
        var EverySubscriber = (function(_super) {
          __extends(EverySubscriber, _super);
          function EverySubscriber(destination, predicate, thisArg, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.source = source;
            this.index = 0;
            this.thisArg = thisArg || this;
          }
          EverySubscriber.prototype.notifyComplete = function(everyValueMatch) {
            this.destination.next(everyValueMatch);
            this.destination.complete();
          };
          EverySubscriber.prototype._next = function(value) {
            var result = false;
            try {
              result = this.predicate.call(this.thisArg, value, this.index++, this.source);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            if (!result) {
              this.notifyComplete(false);
            }
          };
          EverySubscriber.prototype._complete = function() {
            this.notifyComplete(true);
          };
          return EverySubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      219: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function exhaust() {
          return this.lift(new SwitchFirstOperator());
        }
        exports.exhaust = exhaust;
        var SwitchFirstOperator = (function() {
          function SwitchFirstOperator() {}
          SwitchFirstOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SwitchFirstSubscriber(subscriber));
          };
          return SwitchFirstOperator;
        }());
        var SwitchFirstSubscriber = (function(_super) {
          __extends(SwitchFirstSubscriber, _super);
          function SwitchFirstSubscriber(destination) {
            _super.call(this, destination);
            this.hasCompleted = false;
            this.hasSubscription = false;
          }
          SwitchFirstSubscriber.prototype._next = function(value) {
            if (!this.hasSubscription) {
              this.hasSubscription = true;
              this.add(subscribeToResult_1.subscribeToResult(this, value));
            }
          };
          SwitchFirstSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (!this.hasSubscription) {
              this.destination.complete();
            }
          };
          SwitchFirstSubscriber.prototype.notifyComplete = function(innerSub) {
            this.remove(innerSub);
            this.hasSubscription = false;
            if (this.hasCompleted) {
              this.destination.complete();
            }
          };
          return SwitchFirstSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      220: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function exhaustMap(project, resultSelector) {
          return this.lift(new SwitchFirstMapOperator(project, resultSelector));
        }
        exports.exhaustMap = exhaustMap;
        var SwitchFirstMapOperator = (function() {
          function SwitchFirstMapOperator(project, resultSelector) {
            this.project = project;
            this.resultSelector = resultSelector;
          }
          SwitchFirstMapOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SwitchFirstMapSubscriber(subscriber, this.project, this.resultSelector));
          };
          return SwitchFirstMapOperator;
        }());
        var SwitchFirstMapSubscriber = (function(_super) {
          __extends(SwitchFirstMapSubscriber, _super);
          function SwitchFirstMapSubscriber(destination, project, resultSelector) {
            _super.call(this, destination);
            this.project = project;
            this.resultSelector = resultSelector;
            this.hasSubscription = false;
            this.hasCompleted = false;
            this.index = 0;
          }
          SwitchFirstMapSubscriber.prototype._next = function(value) {
            if (!this.hasSubscription) {
              this.tryNext(value);
            }
          };
          SwitchFirstMapSubscriber.prototype.tryNext = function(value) {
            var index = this.index++;
            var destination = this.destination;
            try {
              var result = this.project(value, index);
              this.hasSubscription = true;
              this.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
            } catch (err) {
              destination.error(err);
            }
          };
          SwitchFirstMapSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (!this.hasSubscription) {
              this.destination.complete();
            }
          };
          SwitchFirstMapSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            if (resultSelector) {
              this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
            } else {
              destination.next(innerValue);
            }
          };
          SwitchFirstMapSubscriber.prototype.trySelectResult = function(outerValue, innerValue, outerIndex, innerIndex) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            try {
              var result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
              destination.next(result);
            } catch (err) {
              destination.error(err);
            }
          };
          SwitchFirstMapSubscriber.prototype.notifyError = function(err) {
            this.destination.error(err);
          };
          SwitchFirstMapSubscriber.prototype.notifyComplete = function(innerSub) {
            this.remove(innerSub);
            this.hasSubscription = false;
            if (this.hasCompleted) {
              this.destination.complete();
            }
          };
          return SwitchFirstMapSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      221: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function expand(project, concurrent, scheduler) {
          if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
          }
          if (scheduler === void 0) {
            scheduler = undefined;
          }
          concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
          return this.lift(new ExpandOperator(project, concurrent, scheduler));
        }
        exports.expand = expand;
        var ExpandOperator = (function() {
          function ExpandOperator(project, concurrent, scheduler) {
            this.project = project;
            this.concurrent = concurrent;
            this.scheduler = scheduler;
          }
          ExpandOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
          };
          return ExpandOperator;
        }());
        exports.ExpandOperator = ExpandOperator;
        var ExpandSubscriber = (function(_super) {
          __extends(ExpandSubscriber, _super);
          function ExpandSubscriber(destination, project, concurrent, scheduler) {
            _super.call(this, destination);
            this.project = project;
            this.concurrent = concurrent;
            this.scheduler = scheduler;
            this.index = 0;
            this.active = 0;
            this.hasCompleted = false;
            if (concurrent < Number.POSITIVE_INFINITY) {
              this.buffer = [];
            }
          }
          ExpandSubscriber.dispatch = function(arg) {
            var subscriber = arg.subscriber,
                result = arg.result,
                value = arg.value,
                index = arg.index;
            subscriber.subscribeToProjection(result, value, index);
          };
          ExpandSubscriber.prototype._next = function(value) {
            var destination = this.destination;
            if (destination.isUnsubscribed) {
              this._complete();
              return;
            }
            var index = this.index++;
            if (this.active < this.concurrent) {
              destination.next(value);
              var result = tryCatch_1.tryCatch(this.project)(value, index);
              if (result === errorObject_1.errorObject) {
                destination.error(errorObject_1.errorObject.e);
              } else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
              } else {
                var state = {
                  subscriber: this,
                  result: result,
                  value: value,
                  index: index
                };
                this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
              }
            } else {
              this.buffer.push(value);
            }
          };
          ExpandSubscriber.prototype.subscribeToProjection = function(result, value, index) {
            this.active++;
            this.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
          };
          ExpandSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
            }
          };
          ExpandSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this._next(innerValue);
          };
          ExpandSubscriber.prototype.notifyComplete = function(innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer && buffer.length > 0) {
              this._next(buffer.shift());
            }
            if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
            }
          };
          return ExpandSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.ExpandSubscriber = ExpandSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      222: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function filter(predicate, thisArg) {
          return this.lift(new FilterOperator(predicate, thisArg));
        }
        exports.filter = filter;
        var FilterOperator = (function() {
          function FilterOperator(predicate, thisArg) {
            this.predicate = predicate;
            this.thisArg = thisArg;
          }
          FilterOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
          };
          return FilterOperator;
        }());
        var FilterSubscriber = (function(_super) {
          __extends(FilterSubscriber, _super);
          function FilterSubscriber(destination, predicate, thisArg) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.thisArg = thisArg;
            this.count = 0;
            this.predicate = predicate;
          }
          FilterSubscriber.prototype._next = function(value) {
            var result;
            try {
              result = this.predicate.call(this.thisArg, value, this.count++);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            if (result) {
              this.destination.next(value);
            }
          };
          return FilterSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      223: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Subscription_1 = require('../Subscription');
        function _finally(callback) {
          return this.lift(new FinallyOperator(callback));
        }
        exports._finally = _finally;
        var FinallyOperator = (function() {
          function FinallyOperator(callback) {
            this.callback = callback;
          }
          FinallyOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new FinallySubscriber(subscriber, this.callback));
          };
          return FinallyOperator;
        }());
        var FinallySubscriber = (function(_super) {
          __extends(FinallySubscriber, _super);
          function FinallySubscriber(destination, callback) {
            _super.call(this, destination);
            this.add(new Subscription_1.Subscription(callback));
          }
          return FinallySubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../Subscription": 14
      }],
      224: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function find(predicate, thisArg) {
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate is not a function');
          }
          return this.lift(new FindValueOperator(predicate, this, false, thisArg));
        }
        exports.find = find;
        var FindValueOperator = (function() {
          function FindValueOperator(predicate, source, yieldIndex, thisArg) {
            this.predicate = predicate;
            this.source = source;
            this.yieldIndex = yieldIndex;
            this.thisArg = thisArg;
          }
          FindValueOperator.prototype.call = function(observer, source) {
            return source._subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
          };
          return FindValueOperator;
        }());
        exports.FindValueOperator = FindValueOperator;
        var FindValueSubscriber = (function(_super) {
          __extends(FindValueSubscriber, _super);
          function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.source = source;
            this.yieldIndex = yieldIndex;
            this.thisArg = thisArg;
            this.index = 0;
          }
          FindValueSubscriber.prototype.notifyComplete = function(value) {
            var destination = this.destination;
            destination.next(value);
            destination.complete();
          };
          FindValueSubscriber.prototype._next = function(value) {
            var _a = this,
                predicate = _a.predicate,
                thisArg = _a.thisArg;
            var index = this.index++;
            try {
              var result = predicate.call(thisArg || this, value, index, this.source);
              if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
              }
            } catch (err) {
              this.destination.error(err);
            }
          };
          FindValueSubscriber.prototype._complete = function() {
            this.notifyComplete(this.yieldIndex ? -1 : undefined);
          };
          return FindValueSubscriber;
        }(Subscriber_1.Subscriber));
        exports.FindValueSubscriber = FindValueSubscriber;
      }, {"../Subscriber": 13}],
      225: [function(require, module, exports) {
        "use strict";
        var find_1 = require('./find');
        function findIndex(predicate, thisArg) {
          return this.lift(new find_1.FindValueOperator(predicate, this, true, thisArg));
        }
        exports.findIndex = findIndex;
      }, {"./find": 224}],
      226: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var EmptyError_1 = require('../util/EmptyError');
        function first(predicate, resultSelector, defaultValue) {
          return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
        }
        exports.first = first;
        var FirstOperator = (function() {
          function FirstOperator(predicate, resultSelector, defaultValue, source) {
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
          }
          FirstOperator.prototype.call = function(observer, source) {
            return source._subscribe(new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
          };
          return FirstOperator;
        }());
        var FirstSubscriber = (function(_super) {
          __extends(FirstSubscriber, _super);
          function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
            this.index = 0;
            this.hasCompleted = false;
          }
          FirstSubscriber.prototype._next = function(value) {
            var index = this.index++;
            if (this.predicate) {
              this._tryPredicate(value, index);
            } else {
              this._emit(value, index);
            }
          };
          FirstSubscriber.prototype._tryPredicate = function(value, index) {
            var result;
            try {
              result = this.predicate(value, index, this.source);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            if (result) {
              this._emit(value, index);
            }
          };
          FirstSubscriber.prototype._emit = function(value, index) {
            if (this.resultSelector) {
              this._tryResultSelector(value, index);
              return;
            }
            this._emitFinal(value);
          };
          FirstSubscriber.prototype._tryResultSelector = function(value, index) {
            var result;
            try {
              result = this.resultSelector(value, index);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this._emitFinal(result);
          };
          FirstSubscriber.prototype._emitFinal = function(value) {
            var destination = this.destination;
            destination.next(value);
            destination.complete();
            this.hasCompleted = true;
          };
          FirstSubscriber.prototype._complete = function() {
            var destination = this.destination;
            if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
              destination.next(this.defaultValue);
              destination.complete();
            } else if (!this.hasCompleted) {
              destination.error(new EmptyError_1.EmptyError);
            }
          };
          return FirstSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/EmptyError": 312
      }],
      227: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Subscription_1 = require('../Subscription');
        var Observable_1 = require('../Observable');
        var Subject_1 = require('../Subject');
        var Map_1 = require('../util/Map');
        var FastMap_1 = require('../util/FastMap');
        function groupBy(keySelector, elementSelector, durationSelector) {
          return this.lift(new GroupByOperator(this, keySelector, elementSelector, durationSelector));
        }
        exports.groupBy = groupBy;
        var GroupByOperator = (function() {
          function GroupByOperator(source, keySelector, elementSelector, durationSelector) {
            this.source = source;
            this.keySelector = keySelector;
            this.elementSelector = elementSelector;
            this.durationSelector = durationSelector;
          }
          GroupByOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector));
          };
          return GroupByOperator;
        }());
        var GroupBySubscriber = (function(_super) {
          __extends(GroupBySubscriber, _super);
          function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector) {
            _super.call(this, destination);
            this.keySelector = keySelector;
            this.elementSelector = elementSelector;
            this.durationSelector = durationSelector;
            this.groups = null;
            this.attemptedToUnsubscribe = false;
            this.count = 0;
          }
          GroupBySubscriber.prototype._next = function(value) {
            var key;
            try {
              key = this.keySelector(value);
            } catch (err) {
              this.error(err);
              return;
            }
            this._group(value, key);
          };
          GroupBySubscriber.prototype._group = function(value, key) {
            var groups = this.groups;
            if (!groups) {
              groups = this.groups = typeof key === 'string' ? new FastMap_1.FastMap() : new Map_1.Map();
            }
            var group = groups.get(key);
            var element;
            if (this.elementSelector) {
              try {
                element = this.elementSelector(value);
              } catch (err) {
                this.error(err);
              }
            } else {
              element = value;
            }
            if (!group) {
              groups.set(key, group = new Subject_1.Subject());
              var groupedObservable = new GroupedObservable(key, group, this);
              this.destination.next(groupedObservable);
              if (this.durationSelector) {
                var duration = void 0;
                try {
                  duration = this.durationSelector(new GroupedObservable(key, group));
                } catch (err) {
                  this.error(err);
                  return;
                }
                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
              }
            }
            if (!group.isUnsubscribed) {
              group.next(element);
            }
          };
          GroupBySubscriber.prototype._error = function(err) {
            var groups = this.groups;
            if (groups) {
              groups.forEach(function(group, key) {
                group.error(err);
              });
              groups.clear();
            }
            this.destination.error(err);
          };
          GroupBySubscriber.prototype._complete = function() {
            var groups = this.groups;
            if (groups) {
              groups.forEach(function(group, key) {
                group.complete();
              });
              groups.clear();
            }
            this.destination.complete();
          };
          GroupBySubscriber.prototype.removeGroup = function(key) {
            this.groups.delete(key);
          };
          GroupBySubscriber.prototype.unsubscribe = function() {
            if (!this.isUnsubscribed && !this.attemptedToUnsubscribe) {
              this.attemptedToUnsubscribe = true;
              if (this.count === 0) {
                _super.prototype.unsubscribe.call(this);
              }
            }
          };
          return GroupBySubscriber;
        }(Subscriber_1.Subscriber));
        var GroupDurationSubscriber = (function(_super) {
          __extends(GroupDurationSubscriber, _super);
          function GroupDurationSubscriber(key, group, parent) {
            _super.call(this);
            this.key = key;
            this.group = group;
            this.parent = parent;
          }
          GroupDurationSubscriber.prototype._next = function(value) {
            this._complete();
          };
          GroupDurationSubscriber.prototype._error = function(err) {
            var group = this.group;
            if (!group.isUnsubscribed) {
              group.error(err);
            }
            this.parent.removeGroup(this.key);
          };
          GroupDurationSubscriber.prototype._complete = function() {
            var group = this.group;
            if (!group.isUnsubscribed) {
              group.complete();
            }
            this.parent.removeGroup(this.key);
          };
          return GroupDurationSubscriber;
        }(Subscriber_1.Subscriber));
        var GroupedObservable = (function(_super) {
          __extends(GroupedObservable, _super);
          function GroupedObservable(key, groupSubject, refCountSubscription) {
            _super.call(this);
            this.key = key;
            this.groupSubject = groupSubject;
            this.refCountSubscription = refCountSubscription;
          }
          GroupedObservable.prototype._subscribe = function(subscriber) {
            var subscription = new Subscription_1.Subscription();
            var _a = this,
                refCountSubscription = _a.refCountSubscription,
                groupSubject = _a.groupSubject;
            if (refCountSubscription && !refCountSubscription.isUnsubscribed) {
              subscription.add(new InnerRefCountSubscription(refCountSubscription));
            }
            subscription.add(groupSubject.subscribe(subscriber));
            return subscription;
          };
          return GroupedObservable;
        }(Observable_1.Observable));
        exports.GroupedObservable = GroupedObservable;
        var InnerRefCountSubscription = (function(_super) {
          __extends(InnerRefCountSubscription, _super);
          function InnerRefCountSubscription(parent) {
            _super.call(this);
            this.parent = parent;
            parent.count++;
          }
          InnerRefCountSubscription.prototype.unsubscribe = function() {
            var parent = this.parent;
            if (!parent.isUnsubscribed && !this.isUnsubscribed) {
              _super.prototype.unsubscribe.call(this);
              parent.count -= 1;
              if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                parent.unsubscribe();
              }
            }
          };
          return InnerRefCountSubscription;
        }(Subscription_1.Subscription));
      }, {
        "../Observable": 5,
        "../Subject": 11,
        "../Subscriber": 13,
        "../Subscription": 14,
        "../util/FastMap": 313,
        "../util/Map": 315
      }],
      228: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var noop_1 = require('../util/noop');
        function ignoreElements() {
          return this.lift(new IgnoreElementsOperator());
        }
        exports.ignoreElements = ignoreElements;
        ;
        var IgnoreElementsOperator = (function() {
          function IgnoreElementsOperator() {}
          IgnoreElementsOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new IgnoreElementsSubscriber(subscriber));
          };
          return IgnoreElementsOperator;
        }());
        var IgnoreElementsSubscriber = (function(_super) {
          __extends(IgnoreElementsSubscriber, _super);
          function IgnoreElementsSubscriber() {
            _super.apply(this, arguments);
          }
          IgnoreElementsSubscriber.prototype._next = function(unused) {
            noop_1.noop();
          };
          return IgnoreElementsSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/noop": 329
      }],
      229: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function isEmpty() {
          return this.lift(new IsEmptyOperator());
        }
        exports.isEmpty = isEmpty;
        var IsEmptyOperator = (function() {
          function IsEmptyOperator() {}
          IsEmptyOperator.prototype.call = function(observer, source) {
            return source._subscribe(new IsEmptySubscriber(observer));
          };
          return IsEmptyOperator;
        }());
        var IsEmptySubscriber = (function(_super) {
          __extends(IsEmptySubscriber, _super);
          function IsEmptySubscriber(destination) {
            _super.call(this, destination);
          }
          IsEmptySubscriber.prototype.notifyComplete = function(isEmpty) {
            var destination = this.destination;
            destination.next(isEmpty);
            destination.complete();
          };
          IsEmptySubscriber.prototype._next = function(value) {
            this.notifyComplete(false);
          };
          IsEmptySubscriber.prototype._complete = function() {
            this.notifyComplete(true);
          };
          return IsEmptySubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      230: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var EmptyError_1 = require('../util/EmptyError');
        function last(predicate, resultSelector, defaultValue) {
          return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
        }
        exports.last = last;
        var LastOperator = (function() {
          function LastOperator(predicate, resultSelector, defaultValue, source) {
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
          }
          LastOperator.prototype.call = function(observer, source) {
            return source._subscribe(new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
          };
          return LastOperator;
        }());
        var LastSubscriber = (function(_super) {
          __extends(LastSubscriber, _super);
          function LastSubscriber(destination, predicate, resultSelector, defaultValue, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.resultSelector = resultSelector;
            this.defaultValue = defaultValue;
            this.source = source;
            this.hasValue = false;
            this.index = 0;
            if (typeof defaultValue !== 'undefined') {
              this.lastValue = defaultValue;
              this.hasValue = true;
            }
          }
          LastSubscriber.prototype._next = function(value) {
            var index = this.index++;
            if (this.predicate) {
              this._tryPredicate(value, index);
            } else {
              if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
              }
              this.lastValue = value;
              this.hasValue = true;
            }
          };
          LastSubscriber.prototype._tryPredicate = function(value, index) {
            var result;
            try {
              result = this.predicate(value, index, this.source);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            if (result) {
              if (this.resultSelector) {
                this._tryResultSelector(value, index);
                return;
              }
              this.lastValue = value;
              this.hasValue = true;
            }
          };
          LastSubscriber.prototype._tryResultSelector = function(value, index) {
            var result;
            try {
              result = this.resultSelector(value, index);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.lastValue = result;
            this.hasValue = true;
          };
          LastSubscriber.prototype._complete = function() {
            var destination = this.destination;
            if (this.hasValue) {
              destination.next(this.lastValue);
              destination.complete();
            } else {
              destination.error(new EmptyError_1.EmptyError);
            }
          };
          return LastSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/EmptyError": 312
      }],
      231: [function(require, module, exports) {
        "use strict";
        function letProto(func) {
          return func(this);
        }
        exports.letProto = letProto;
      }, {}],
      232: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function map(project, thisArg) {
          if (typeof project !== 'function') {
            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
          }
          return this.lift(new MapOperator(project, thisArg));
        }
        exports.map = map;
        var MapOperator = (function() {
          function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
          }
          MapOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
          };
          return MapOperator;
        }());
        var MapSubscriber = (function(_super) {
          __extends(MapSubscriber, _super);
          function MapSubscriber(destination, project, thisArg) {
            _super.call(this, destination);
            this.project = project;
            this.count = 0;
            this.thisArg = thisArg || this;
          }
          MapSubscriber.prototype._next = function(value) {
            var result;
            try {
              result = this.project.call(this.thisArg, value, this.count++);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          return MapSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      233: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function mapTo(value) {
          return this.lift(new MapToOperator(value));
        }
        exports.mapTo = mapTo;
        var MapToOperator = (function() {
          function MapToOperator(value) {
            this.value = value;
          }
          MapToOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new MapToSubscriber(subscriber, this.value));
          };
          return MapToOperator;
        }());
        var MapToSubscriber = (function(_super) {
          __extends(MapToSubscriber, _super);
          function MapToSubscriber(destination, value) {
            _super.call(this, destination);
            this.value = value;
          }
          MapToSubscriber.prototype._next = function(x) {
            this.destination.next(this.value);
          };
          return MapToSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      234: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Notification_1 = require('../Notification');
        function materialize() {
          return this.lift(new MaterializeOperator());
        }
        exports.materialize = materialize;
        var MaterializeOperator = (function() {
          function MaterializeOperator() {}
          MaterializeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new MaterializeSubscriber(subscriber));
          };
          return MaterializeOperator;
        }());
        var MaterializeSubscriber = (function(_super) {
          __extends(MaterializeSubscriber, _super);
          function MaterializeSubscriber(destination) {
            _super.call(this, destination);
          }
          MaterializeSubscriber.prototype._next = function(value) {
            this.destination.next(Notification_1.Notification.createNext(value));
          };
          MaterializeSubscriber.prototype._error = function(err) {
            var destination = this.destination;
            destination.next(Notification_1.Notification.createError(err));
            destination.complete();
          };
          MaterializeSubscriber.prototype._complete = function() {
            var destination = this.destination;
            destination.next(Notification_1.Notification.createComplete());
            destination.complete();
          };
          return MaterializeSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Notification": 4,
        "../Subscriber": 13
      }],
      235: [function(require, module, exports) {
        "use strict";
        var reduce_1 = require('./reduce');
        function max(comparer) {
          var max = (typeof comparer === 'function') ? comparer : function(x, y) {
            return x > y ? x : y;
          };
          return this.lift(new reduce_1.ReduceOperator(max));
        }
        exports.max = max;
      }, {"./reduce": 253}],
      236: [function(require, module, exports) {
        "use strict";
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var mergeAll_1 = require('./mergeAll');
        var isScheduler_1 = require('../util/isScheduler');
        function merge() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          observables.unshift(this);
          return mergeStatic.apply(this, observables);
        }
        exports.merge = merge;
        function mergeStatic() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          var concurrent = Number.POSITIVE_INFINITY;
          var scheduler = null;
          var last = observables[observables.length - 1];
          if (isScheduler_1.isScheduler(last)) {
            scheduler = observables.pop();
            if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
              concurrent = observables.pop();
            }
          } else if (typeof last === 'number') {
            concurrent = observables.pop();
          }
          if (observables.length === 1) {
            return observables[0];
          }
          return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
        }
        exports.mergeStatic = mergeStatic;
      }, {
        "../observable/ArrayObservable": 142,
        "../util/isScheduler": 328,
        "./mergeAll": 237
      }],
      237: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function mergeAll(concurrent) {
          if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
          }
          return this.lift(new MergeAllOperator(concurrent));
        }
        exports.mergeAll = mergeAll;
        var MergeAllOperator = (function() {
          function MergeAllOperator(concurrent) {
            this.concurrent = concurrent;
          }
          MergeAllOperator.prototype.call = function(observer, source) {
            return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
          };
          return MergeAllOperator;
        }());
        exports.MergeAllOperator = MergeAllOperator;
        var MergeAllSubscriber = (function(_super) {
          __extends(MergeAllSubscriber, _super);
          function MergeAllSubscriber(destination, concurrent) {
            _super.call(this, destination);
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
          }
          MergeAllSubscriber.prototype._next = function(observable) {
            if (this.active < this.concurrent) {
              this.active++;
              this.add(subscribeToResult_1.subscribeToResult(this, observable));
            } else {
              this.buffer.push(observable);
            }
          };
          MergeAllSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
            }
          };
          MergeAllSubscriber.prototype.notifyComplete = function(innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
              this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
            }
          };
          return MergeAllSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.MergeAllSubscriber = MergeAllSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      238: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        function mergeMap(project, resultSelector, concurrent) {
          if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
          }
          if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
          }
          return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
        }
        exports.mergeMap = mergeMap;
        var MergeMapOperator = (function() {
          function MergeMapOperator(project, resultSelector, concurrent) {
            if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
            }
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
          }
          MergeMapOperator.prototype.call = function(observer, source) {
            return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
          };
          return MergeMapOperator;
        }());
        exports.MergeMapOperator = MergeMapOperator;
        var MergeMapSubscriber = (function(_super) {
          __extends(MergeMapSubscriber, _super);
          function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
            if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
            }
            _super.call(this, destination);
            this.project = project;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
            this.index = 0;
          }
          MergeMapSubscriber.prototype._next = function(value) {
            if (this.active < this.concurrent) {
              this._tryNext(value);
            } else {
              this.buffer.push(value);
            }
          };
          MergeMapSubscriber.prototype._tryNext = function(value) {
            var result;
            var index = this.index++;
            try {
              result = this.project(value, index);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.active++;
            this._innerSub(result, value, index);
          };
          MergeMapSubscriber.prototype._innerSub = function(ish, value, index) {
            this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
          };
          MergeMapSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
            }
          };
          MergeMapSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (this.resultSelector) {
              this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } else {
              this.destination.next(innerValue);
            }
          };
          MergeMapSubscriber.prototype._notifyResultSelector = function(outerValue, innerValue, outerIndex, innerIndex) {
            var result;
            try {
              result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          MergeMapSubscriber.prototype.notifyComplete = function(innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
              this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
            }
          };
          return MergeMapSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.MergeMapSubscriber = MergeMapSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      239: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function mergeMapTo(innerObservable, resultSelector, concurrent) {
          if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
          }
          if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
          }
          return this.lift(new MergeMapToOperator(innerObservable, resultSelector, concurrent));
        }
        exports.mergeMapTo = mergeMapTo;
        var MergeMapToOperator = (function() {
          function MergeMapToOperator(ish, resultSelector, concurrent) {
            if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
            }
            this.ish = ish;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
          }
          MergeMapToOperator.prototype.call = function(observer, source) {
            return source._subscribe(new MergeMapToSubscriber(observer, this.ish, this.resultSelector, this.concurrent));
          };
          return MergeMapToOperator;
        }());
        exports.MergeMapToOperator = MergeMapToOperator;
        var MergeMapToSubscriber = (function(_super) {
          __extends(MergeMapToSubscriber, _super);
          function MergeMapToSubscriber(destination, ish, resultSelector, concurrent) {
            if (concurrent === void 0) {
              concurrent = Number.POSITIVE_INFINITY;
            }
            _super.call(this, destination);
            this.ish = ish;
            this.resultSelector = resultSelector;
            this.concurrent = concurrent;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
            this.index = 0;
          }
          MergeMapToSubscriber.prototype._next = function(value) {
            if (this.active < this.concurrent) {
              var resultSelector = this.resultSelector;
              var index = this.index++;
              var ish = this.ish;
              var destination = this.destination;
              this.active++;
              this._innerSub(ish, destination, resultSelector, value, index);
            } else {
              this.buffer.push(value);
            }
          };
          MergeMapToSubscriber.prototype._innerSub = function(ish, destination, resultSelector, value, index) {
            this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
          };
          MergeMapToSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
              this.destination.complete();
            }
          };
          MergeMapToSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            if (resultSelector) {
              this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
            } else {
              destination.next(innerValue);
            }
          };
          MergeMapToSubscriber.prototype.trySelectResult = function(outerValue, innerValue, outerIndex, innerIndex) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            var result;
            try {
              result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } catch (err) {
              destination.error(err);
              return;
            }
            destination.next(result);
          };
          MergeMapToSubscriber.prototype.notifyError = function(err) {
            this.destination.error(err);
          };
          MergeMapToSubscriber.prototype.notifyComplete = function(innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
              this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
              this.destination.complete();
            }
          };
          return MergeMapToSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.MergeMapToSubscriber = MergeMapToSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      240: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        function mergeScan(project, seed, concurrent) {
          if (concurrent === void 0) {
            concurrent = Number.POSITIVE_INFINITY;
          }
          return this.lift(new MergeScanOperator(project, seed, concurrent));
        }
        exports.mergeScan = mergeScan;
        var MergeScanOperator = (function() {
          function MergeScanOperator(project, seed, concurrent) {
            this.project = project;
            this.seed = seed;
            this.concurrent = concurrent;
          }
          MergeScanOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new MergeScanSubscriber(subscriber, this.project, this.seed, this.concurrent));
          };
          return MergeScanOperator;
        }());
        exports.MergeScanOperator = MergeScanOperator;
        var MergeScanSubscriber = (function(_super) {
          __extends(MergeScanSubscriber, _super);
          function MergeScanSubscriber(destination, project, acc, concurrent) {
            _super.call(this, destination);
            this.project = project;
            this.acc = acc;
            this.concurrent = concurrent;
            this.hasValue = false;
            this.hasCompleted = false;
            this.buffer = [];
            this.active = 0;
            this.index = 0;
          }
          MergeScanSubscriber.prototype._next = function(value) {
            if (this.active < this.concurrent) {
              var index = this.index++;
              var ish = tryCatch_1.tryCatch(this.project)(this.acc, value);
              var destination = this.destination;
              if (ish === errorObject_1.errorObject) {
                destination.error(errorObject_1.errorObject.e);
              } else {
                this.active++;
                this._innerSub(ish, value, index);
              }
            } else {
              this.buffer.push(value);
            }
          };
          MergeScanSubscriber.prototype._innerSub = function(ish, value, index) {
            this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
          };
          MergeScanSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
              if (this.hasValue === false) {
                this.destination.next(this.acc);
              }
              this.destination.complete();
            }
          };
          MergeScanSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var destination = this.destination;
            this.acc = innerValue;
            this.hasValue = true;
            destination.next(innerValue);
          };
          MergeScanSubscriber.prototype.notifyComplete = function(innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
              this._next(buffer.shift());
            } else if (this.active === 0 && this.hasCompleted) {
              if (this.hasValue === false) {
                this.destination.next(this.acc);
              }
              this.destination.complete();
            }
          };
          return MergeScanSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.MergeScanSubscriber = MergeScanSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      241: [function(require, module, exports) {
        "use strict";
        var reduce_1 = require('./reduce');
        function min(comparer) {
          var min = (typeof comparer === 'function') ? comparer : function(x, y) {
            return x < y ? x : y;
          };
          return this.lift(new reduce_1.ReduceOperator(min));
        }
        exports.min = min;
      }, {"./reduce": 253}],
      242: [function(require, module, exports) {
        "use strict";
        var MulticastObservable_1 = require('../observable/MulticastObservable');
        var ConnectableObservable_1 = require('../observable/ConnectableObservable');
        function multicast(subjectOrSubjectFactory, selector) {
          var subjectFactory;
          if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
          } else {
            subjectFactory = function subjectFactory() {
              return subjectOrSubjectFactory;
            };
          }
          return !selector ? new ConnectableObservable_1.ConnectableObservable(this, subjectFactory) : new MulticastObservable_1.MulticastObservable(this, subjectFactory, selector);
        }
        exports.multicast = multicast;
      }, {
        "../observable/ConnectableObservable": 145,
        "../observable/MulticastObservable": 157
      }],
      243: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Notification_1 = require('../Notification');
        function observeOn(scheduler, delay) {
          if (delay === void 0) {
            delay = 0;
          }
          return this.lift(new ObserveOnOperator(scheduler, delay));
        }
        exports.observeOn = observeOn;
        var ObserveOnOperator = (function() {
          function ObserveOnOperator(scheduler, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            this.scheduler = scheduler;
            this.delay = delay;
          }
          ObserveOnOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
          };
          return ObserveOnOperator;
        }());
        exports.ObserveOnOperator = ObserveOnOperator;
        var ObserveOnSubscriber = (function(_super) {
          __extends(ObserveOnSubscriber, _super);
          function ObserveOnSubscriber(destination, scheduler, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            _super.call(this, destination);
            this.scheduler = scheduler;
            this.delay = delay;
          }
          ObserveOnSubscriber.dispatch = function(arg) {
            var notification = arg.notification,
                destination = arg.destination;
            notification.observe(destination);
          };
          ObserveOnSubscriber.prototype.scheduleMessage = function(notification) {
            this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
          };
          ObserveOnSubscriber.prototype._next = function(value) {
            this.scheduleMessage(Notification_1.Notification.createNext(value));
          };
          ObserveOnSubscriber.prototype._error = function(err) {
            this.scheduleMessage(Notification_1.Notification.createError(err));
          };
          ObserveOnSubscriber.prototype._complete = function() {
            this.scheduleMessage(Notification_1.Notification.createComplete());
          };
          return ObserveOnSubscriber;
        }(Subscriber_1.Subscriber));
        exports.ObserveOnSubscriber = ObserveOnSubscriber;
        var ObserveOnMessage = (function() {
          function ObserveOnMessage(notification, destination) {
            this.notification = notification;
            this.destination = destination;
          }
          return ObserveOnMessage;
        }());
        exports.ObserveOnMessage = ObserveOnMessage;
      }, {
        "../Notification": 4,
        "../Subscriber": 13
      }],
      244: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var FromObservable_1 = require('../observable/FromObservable');
        var isArray_1 = require('../util/isArray');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function onErrorResumeNext() {
          var nextSources = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            nextSources[_i - 0] = arguments[_i];
          }
          if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
            nextSources = nextSources[0];
          }
          return this.lift(new OnErrorResumeNextOperator(nextSources));
        }
        exports.onErrorResumeNext = onErrorResumeNext;
        function onErrorResumeNextStatic() {
          var nextSources = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            nextSources[_i - 0] = arguments[_i];
          }
          var source = null;
          if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
            nextSources = nextSources[0];
          }
          source = nextSources.shift();
          return new FromObservable_1.FromObservable(source, null).lift(new OnErrorResumeNextOperator(nextSources));
        }
        exports.onErrorResumeNextStatic = onErrorResumeNextStatic;
        var OnErrorResumeNextOperator = (function() {
          function OnErrorResumeNextOperator(nextSources) {
            this.nextSources = nextSources;
          }
          OnErrorResumeNextOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
          };
          return OnErrorResumeNextOperator;
        }());
        var OnErrorResumeNextSubscriber = (function(_super) {
          __extends(OnErrorResumeNextSubscriber, _super);
          function OnErrorResumeNextSubscriber(destination, nextSources) {
            _super.call(this, destination);
            this.destination = destination;
            this.nextSources = nextSources;
          }
          OnErrorResumeNextSubscriber.prototype.notifyError = function(error, innerSub) {
            this.subscribeToNextSource();
          };
          OnErrorResumeNextSubscriber.prototype.notifyComplete = function(innerSub) {
            this.subscribeToNextSource();
          };
          OnErrorResumeNextSubscriber.prototype._error = function(err) {
            this.subscribeToNextSource();
          };
          OnErrorResumeNextSubscriber.prototype._complete = function() {
            this.subscribeToNextSource();
          };
          OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function() {
            var next = this.nextSources.shift();
            if (next) {
              this.add(subscribeToResult_1.subscribeToResult(this, next));
            } else {
              this.destination.complete();
            }
          };
          return OnErrorResumeNextSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../observable/FromObservable": 152,
        "../util/isArray": 322,
        "../util/subscribeToResult": 332
      }],
      245: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function pairwise() {
          return this.lift(new PairwiseOperator());
        }
        exports.pairwise = pairwise;
        var PairwiseOperator = (function() {
          function PairwiseOperator() {}
          PairwiseOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new PairwiseSubscriber(subscriber));
          };
          return PairwiseOperator;
        }());
        var PairwiseSubscriber = (function(_super) {
          __extends(PairwiseSubscriber, _super);
          function PairwiseSubscriber(destination) {
            _super.call(this, destination);
            this.hasPrev = false;
          }
          PairwiseSubscriber.prototype._next = function(value) {
            if (this.hasPrev) {
              this.destination.next([this.prev, value]);
            } else {
              this.hasPrev = true;
            }
            this.prev = value;
          };
          return PairwiseSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      246: [function(require, module, exports) {
        "use strict";
        var not_1 = require('../util/not');
        var filter_1 = require('./filter');
        function partition(predicate, thisArg) {
          return [filter_1.filter.call(this, predicate), filter_1.filter.call(this, not_1.not(predicate, thisArg))];
        }
        exports.partition = partition;
      }, {
        "../util/not": 330,
        "./filter": 222
      }],
      247: [function(require, module, exports) {
        "use strict";
        var map_1 = require('./map');
        function pluck() {
          var properties = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i - 0] = arguments[_i];
          }
          var length = properties.length;
          if (length === 0) {
            throw new Error('List of properties cannot be empty.');
          }
          return map_1.map.call(this, plucker(properties, length));
        }
        exports.pluck = pluck;
        function plucker(props, length) {
          var mapper = function(x) {
            var currentProp = x;
            for (var i = 0; i < length; i++) {
              var p = currentProp[props[i]];
              if (typeof p !== 'undefined') {
                currentProp = p;
              } else {
                return undefined;
              }
            }
            return currentProp;
          };
          return mapper;
        }
      }, {"./map": 232}],
      248: [function(require, module, exports) {
        "use strict";
        var Subject_1 = require('../Subject');
        var multicast_1 = require('./multicast');
        function publish(selector) {
          return selector ? multicast_1.multicast.call(this, function() {
            return new Subject_1.Subject();
          }, selector) : multicast_1.multicast.call(this, new Subject_1.Subject());
        }
        exports.publish = publish;
      }, {
        "../Subject": 11,
        "./multicast": 242
      }],
      249: [function(require, module, exports) {
        "use strict";
        var BehaviorSubject_1 = require('../BehaviorSubject');
        var multicast_1 = require('./multicast');
        function publishBehavior(value) {
          return multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value));
        }
        exports.publishBehavior = publishBehavior;
      }, {
        "../BehaviorSubject": 2,
        "./multicast": 242
      }],
      250: [function(require, module, exports) {
        "use strict";
        var AsyncSubject_1 = require('../AsyncSubject');
        var multicast_1 = require('./multicast');
        function publishLast() {
          return multicast_1.multicast.call(this, new AsyncSubject_1.AsyncSubject());
        }
        exports.publishLast = publishLast;
      }, {
        "../AsyncSubject": 1,
        "./multicast": 242
      }],
      251: [function(require, module, exports) {
        "use strict";
        var ReplaySubject_1 = require('../ReplaySubject');
        var multicast_1 = require('./multicast');
        function publishReplay(bufferSize, windowTime, scheduler) {
          if (bufferSize === void 0) {
            bufferSize = Number.POSITIVE_INFINITY;
          }
          if (windowTime === void 0) {
            windowTime = Number.POSITIVE_INFINITY;
          }
          return multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
        }
        exports.publishReplay = publishReplay;
      }, {
        "../ReplaySubject": 9,
        "./multicast": 242
      }],
      252: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isArray_1 = require('../util/isArray');
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function race() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          if (observables.length === 1 && isArray_1.isArray(observables[0])) {
            observables = observables[0];
          }
          observables.unshift(this);
          return raceStatic.apply(this, observables);
        }
        exports.race = race;
        function raceStatic() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          if (observables.length === 1) {
            if (isArray_1.isArray(observables[0])) {
              observables = observables[0];
            } else {
              return observables[0];
            }
          }
          return new ArrayObservable_1.ArrayObservable(observables).lift(new RaceOperator());
        }
        exports.raceStatic = raceStatic;
        var RaceOperator = (function() {
          function RaceOperator() {}
          RaceOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new RaceSubscriber(subscriber));
          };
          return RaceOperator;
        }());
        exports.RaceOperator = RaceOperator;
        var RaceSubscriber = (function(_super) {
          __extends(RaceSubscriber, _super);
          function RaceSubscriber(destination) {
            _super.call(this, destination);
            this.hasFirst = false;
            this.observables = [];
            this.subscriptions = [];
          }
          RaceSubscriber.prototype._next = function(observable) {
            this.observables.push(observable);
          };
          RaceSubscriber.prototype._complete = function() {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
              this.destination.complete();
            } else {
              for (var i = 0; i < len; i++) {
                var observable = observables[i];
                var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
                if (this.subscriptions) {
                  this.subscriptions.push(subscription);
                  this.add(subscription);
                }
              }
              this.observables = null;
            }
          };
          RaceSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (!this.hasFirst) {
              this.hasFirst = true;
              for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                  var subscription = this.subscriptions[i];
                  subscription.unsubscribe();
                  this.remove(subscription);
                }
              }
              this.subscriptions = null;
            }
            this.destination.next(innerValue);
          };
          return RaceSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
        exports.RaceSubscriber = RaceSubscriber;
      }, {
        "../OuterSubscriber": 8,
        "../observable/ArrayObservable": 142,
        "../util/isArray": 322,
        "../util/subscribeToResult": 332
      }],
      253: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function reduce(accumulator, seed) {
          return this.lift(new ReduceOperator(accumulator, seed));
        }
        exports.reduce = reduce;
        var ReduceOperator = (function() {
          function ReduceOperator(accumulator, seed) {
            this.accumulator = accumulator;
            this.seed = seed;
          }
          ReduceOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ReduceSubscriber(subscriber, this.accumulator, this.seed));
          };
          return ReduceOperator;
        }());
        exports.ReduceOperator = ReduceOperator;
        var ReduceSubscriber = (function(_super) {
          __extends(ReduceSubscriber, _super);
          function ReduceSubscriber(destination, accumulator, seed) {
            _super.call(this, destination);
            this.accumulator = accumulator;
            this.hasValue = false;
            this.acc = seed;
            this.accumulator = accumulator;
            this.hasSeed = typeof seed !== 'undefined';
          }
          ReduceSubscriber.prototype._next = function(value) {
            if (this.hasValue || (this.hasValue = this.hasSeed)) {
              this._tryReduce(value);
            } else {
              this.acc = value;
              this.hasValue = true;
            }
          };
          ReduceSubscriber.prototype._tryReduce = function(value) {
            var result;
            try {
              result = this.accumulator(this.acc, value);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.acc = result;
          };
          ReduceSubscriber.prototype._complete = function() {
            if (this.hasValue || this.hasSeed) {
              this.destination.next(this.acc);
            }
            this.destination.complete();
          };
          return ReduceSubscriber;
        }(Subscriber_1.Subscriber));
        exports.ReduceSubscriber = ReduceSubscriber;
      }, {"../Subscriber": 13}],
      254: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var EmptyObservable_1 = require('../observable/EmptyObservable');
        function repeat(count) {
          if (count === void 0) {
            count = -1;
          }
          if (count === 0) {
            return new EmptyObservable_1.EmptyObservable();
          } else if (count < 0) {
            return this.lift(new RepeatOperator(-1, this));
          } else {
            return this.lift(new RepeatOperator(count - 1, this));
          }
        }
        exports.repeat = repeat;
        var RepeatOperator = (function() {
          function RepeatOperator(count, source) {
            this.count = count;
            this.source = source;
          }
          RepeatOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
          };
          return RepeatOperator;
        }());
        var RepeatSubscriber = (function(_super) {
          __extends(RepeatSubscriber, _super);
          function RepeatSubscriber(destination, count, source) {
            _super.call(this, destination);
            this.count = count;
            this.source = source;
          }
          RepeatSubscriber.prototype.complete = function() {
            if (!this.isStopped) {
              var _a = this,
                  source = _a.source,
                  count = _a.count;
              if (count === 0) {
                return _super.prototype.complete.call(this);
              } else if (count > -1) {
                this.count = count - 1;
              }
              this.unsubscribe();
              this.isStopped = false;
              this.isUnsubscribed = false;
              source.subscribe(this);
            }
          };
          return RepeatSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../observable/EmptyObservable": 147
      }],
      255: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function retry(count) {
          if (count === void 0) {
            count = -1;
          }
          return this.lift(new RetryOperator(count, this));
        }
        exports.retry = retry;
        var RetryOperator = (function() {
          function RetryOperator(count, source) {
            this.count = count;
            this.source = source;
          }
          RetryOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new RetrySubscriber(subscriber, this.count, this.source));
          };
          return RetryOperator;
        }());
        var RetrySubscriber = (function(_super) {
          __extends(RetrySubscriber, _super);
          function RetrySubscriber(destination, count, source) {
            _super.call(this, destination);
            this.count = count;
            this.source = source;
          }
          RetrySubscriber.prototype.error = function(err) {
            if (!this.isStopped) {
              var _a = this,
                  source = _a.source,
                  count = _a.count;
              if (count === 0) {
                return _super.prototype.error.call(this, err);
              } else if (count > -1) {
                this.count = count - 1;
              }
              this.unsubscribe();
              this.isStopped = false;
              this.isUnsubscribed = false;
              source.subscribe(this);
            }
          };
          return RetrySubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      256: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function retryWhen(notifier) {
          return this.lift(new RetryWhenOperator(notifier, this));
        }
        exports.retryWhen = retryWhen;
        var RetryWhenOperator = (function() {
          function RetryWhenOperator(notifier, source) {
            this.notifier = notifier;
            this.source = source;
          }
          RetryWhenOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
          };
          return RetryWhenOperator;
        }());
        var RetryWhenSubscriber = (function(_super) {
          __extends(RetryWhenSubscriber, _super);
          function RetryWhenSubscriber(destination, notifier, source) {
            _super.call(this, destination);
            this.notifier = notifier;
            this.source = source;
          }
          RetryWhenSubscriber.prototype.error = function(err) {
            if (!this.isStopped) {
              var errors = this.errors;
              var retries = this.retries;
              var retriesSubscription = this.retriesSubscription;
              if (!retries) {
                errors = new Subject_1.Subject();
                retries = tryCatch_1.tryCatch(this.notifier)(errors);
                if (retries === errorObject_1.errorObject) {
                  return _super.prototype.error.call(this, errorObject_1.errorObject.e);
                }
                retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
              } else {
                this.errors = null;
                this.retriesSubscription = null;
              }
              this.unsubscribe();
              this.isUnsubscribed = false;
              this.errors = errors;
              this.retries = retries;
              this.retriesSubscription = retriesSubscription;
              errors.next(err);
            }
          };
          RetryWhenSubscriber.prototype._unsubscribe = function() {
            var _a = this,
                errors = _a.errors,
                retriesSubscription = _a.retriesSubscription;
            if (errors) {
              errors.unsubscribe();
              this.errors = null;
            }
            if (retriesSubscription) {
              retriesSubscription.unsubscribe();
              this.retriesSubscription = null;
            }
            this.retries = null;
          };
          RetryWhenSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var _a = this,
                errors = _a.errors,
                retries = _a.retries,
                retriesSubscription = _a.retriesSubscription;
            this.errors = null;
            this.retries = null;
            this.retriesSubscription = null;
            this.unsubscribe();
            this.isStopped = false;
            this.isUnsubscribed = false;
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            this.source.subscribe(this);
          };
          return RetryWhenSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subject": 11,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      257: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function sample(notifier) {
          return this.lift(new SampleOperator(notifier));
        }
        exports.sample = sample;
        var SampleOperator = (function() {
          function SampleOperator(notifier) {
            this.notifier = notifier;
          }
          SampleOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SampleSubscriber(subscriber, this.notifier));
          };
          return SampleOperator;
        }());
        var SampleSubscriber = (function(_super) {
          __extends(SampleSubscriber, _super);
          function SampleSubscriber(destination, notifier) {
            _super.call(this, destination);
            this.hasValue = false;
            this.add(subscribeToResult_1.subscribeToResult(this, notifier));
          }
          SampleSubscriber.prototype._next = function(value) {
            this.value = value;
            this.hasValue = true;
          };
          SampleSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.emitValue();
          };
          SampleSubscriber.prototype.notifyComplete = function() {
            this.emitValue();
          };
          SampleSubscriber.prototype.emitValue = function() {
            if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.value);
            }
          };
          return SampleSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      258: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        function sampleTime(period, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new SampleTimeOperator(period, scheduler));
        }
        exports.sampleTime = sampleTime;
        var SampleTimeOperator = (function() {
          function SampleTimeOperator(period, scheduler) {
            this.period = period;
            this.scheduler = scheduler;
          }
          SampleTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
          };
          return SampleTimeOperator;
        }());
        var SampleTimeSubscriber = (function(_super) {
          __extends(SampleTimeSubscriber, _super);
          function SampleTimeSubscriber(destination, period, scheduler) {
            _super.call(this, destination);
            this.period = period;
            this.scheduler = scheduler;
            this.hasValue = false;
            this.add(scheduler.schedule(dispatchNotification, period, {
              subscriber: this,
              period: period
            }));
          }
          SampleTimeSubscriber.prototype._next = function(value) {
            this.lastValue = value;
            this.hasValue = true;
          };
          SampleTimeSubscriber.prototype.notifyNext = function() {
            if (this.hasValue) {
              this.hasValue = false;
              this.destination.next(this.lastValue);
            }
          };
          return SampleTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchNotification(state) {
          var subscriber = state.subscriber,
              period = state.period;
          subscriber.notifyNext();
          this.schedule(state, period);
        }
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      259: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function scan(accumulator, seed) {
          return this.lift(new ScanOperator(accumulator, seed));
        }
        exports.scan = scan;
        var ScanOperator = (function() {
          function ScanOperator(accumulator, seed) {
            this.accumulator = accumulator;
            this.seed = seed;
          }
          ScanOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed));
          };
          return ScanOperator;
        }());
        var ScanSubscriber = (function(_super) {
          __extends(ScanSubscriber, _super);
          function ScanSubscriber(destination, accumulator, seed) {
            _super.call(this, destination);
            this.accumulator = accumulator;
            this.index = 0;
            this.accumulatorSet = false;
            this.seed = seed;
            this.accumulatorSet = typeof seed !== 'undefined';
          }
          Object.defineProperty(ScanSubscriber.prototype, "seed", {
            get: function() {
              return this._seed;
            },
            set: function(value) {
              this.accumulatorSet = true;
              this._seed = value;
            },
            enumerable: true,
            configurable: true
          });
          ScanSubscriber.prototype._next = function(value) {
            if (!this.accumulatorSet) {
              this.seed = value;
              this.destination.next(value);
            } else {
              return this._tryNext(value);
            }
          };
          ScanSubscriber.prototype._tryNext = function(value) {
            var index = this.index++;
            var result;
            try {
              result = this.accumulator(this.seed, value, index);
            } catch (err) {
              this.destination.error(err);
            }
            this.seed = result;
            this.destination.next(result);
          };
          return ScanSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      260: [function(require, module, exports) {
        "use strict";
        var multicast_1 = require('./multicast');
        var Subject_1 = require('../Subject');
        function shareSubjectFactory() {
          return new Subject_1.Subject();
        }
        function share() {
          return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
        }
        exports.share = share;
        ;
      }, {
        "../Subject": 11,
        "./multicast": 242
      }],
      261: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var EmptyError_1 = require('../util/EmptyError');
        function single(predicate) {
          return this.lift(new SingleOperator(predicate, this));
        }
        exports.single = single;
        var SingleOperator = (function() {
          function SingleOperator(predicate, source) {
            this.predicate = predicate;
            this.source = source;
          }
          SingleOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
          };
          return SingleOperator;
        }());
        var SingleSubscriber = (function(_super) {
          __extends(SingleSubscriber, _super);
          function SingleSubscriber(destination, predicate, source) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.source = source;
            this.seenValue = false;
            this.index = 0;
          }
          SingleSubscriber.prototype.applySingleValue = function(value) {
            if (this.seenValue) {
              this.destination.error('Sequence contains more than one element');
            } else {
              this.seenValue = true;
              this.singleValue = value;
            }
          };
          SingleSubscriber.prototype._next = function(value) {
            var predicate = this.predicate;
            this.index++;
            if (predicate) {
              this.tryNext(value);
            } else {
              this.applySingleValue(value);
            }
          };
          SingleSubscriber.prototype.tryNext = function(value) {
            try {
              var result = this.predicate(value, this.index, this.source);
              if (result) {
                this.applySingleValue(value);
              }
            } catch (err) {
              this.destination.error(err);
            }
          };
          SingleSubscriber.prototype._complete = function() {
            var destination = this.destination;
            if (this.index > 0) {
              destination.next(this.seenValue ? this.singleValue : undefined);
              destination.complete();
            } else {
              destination.error(new EmptyError_1.EmptyError);
            }
          };
          return SingleSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../util/EmptyError": 312
      }],
      262: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function skip(total) {
          return this.lift(new SkipOperator(total));
        }
        exports.skip = skip;
        var SkipOperator = (function() {
          function SkipOperator(total) {
            this.total = total;
          }
          SkipOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SkipSubscriber(subscriber, this.total));
          };
          return SkipOperator;
        }());
        var SkipSubscriber = (function(_super) {
          __extends(SkipSubscriber, _super);
          function SkipSubscriber(destination, total) {
            _super.call(this, destination);
            this.total = total;
            this.count = 0;
          }
          SkipSubscriber.prototype._next = function(x) {
            if (++this.count > this.total) {
              this.destination.next(x);
            }
          };
          return SkipSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      263: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function skipUntil(notifier) {
          return this.lift(new SkipUntilOperator(notifier));
        }
        exports.skipUntil = skipUntil;
        var SkipUntilOperator = (function() {
          function SkipUntilOperator(notifier) {
            this.notifier = notifier;
          }
          SkipUntilOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SkipUntilSubscriber(subscriber, this.notifier));
          };
          return SkipUntilOperator;
        }());
        var SkipUntilSubscriber = (function(_super) {
          __extends(SkipUntilSubscriber, _super);
          function SkipUntilSubscriber(destination, notifier) {
            _super.call(this, destination);
            this.hasValue = false;
            this.isInnerStopped = false;
            this.add(subscribeToResult_1.subscribeToResult(this, notifier));
          }
          SkipUntilSubscriber.prototype._next = function(value) {
            if (this.hasValue) {
              _super.prototype._next.call(this, value);
            }
          };
          SkipUntilSubscriber.prototype._complete = function() {
            if (this.isInnerStopped) {
              _super.prototype._complete.call(this);
            } else {
              this.unsubscribe();
            }
          };
          SkipUntilSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.hasValue = true;
          };
          SkipUntilSubscriber.prototype.notifyComplete = function() {
            this.isInnerStopped = true;
            if (this.isStopped) {
              _super.prototype._complete.call(this);
            }
          };
          return SkipUntilSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      264: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function skipWhile(predicate) {
          return this.lift(new SkipWhileOperator(predicate));
        }
        exports.skipWhile = skipWhile;
        var SkipWhileOperator = (function() {
          function SkipWhileOperator(predicate) {
            this.predicate = predicate;
          }
          SkipWhileOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
          };
          return SkipWhileOperator;
        }());
        var SkipWhileSubscriber = (function(_super) {
          __extends(SkipWhileSubscriber, _super);
          function SkipWhileSubscriber(destination, predicate) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.skipping = true;
            this.index = 0;
          }
          SkipWhileSubscriber.prototype._next = function(value) {
            var destination = this.destination;
            if (this.skipping) {
              this.tryCallPredicate(value);
            }
            if (!this.skipping) {
              destination.next(value);
            }
          };
          SkipWhileSubscriber.prototype.tryCallPredicate = function(value) {
            try {
              var result = this.predicate(value, this.index++);
              this.skipping = Boolean(result);
            } catch (err) {
              this.destination.error(err);
            }
          };
          return SkipWhileSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      265: [function(require, module, exports) {
        "use strict";
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var ScalarObservable_1 = require('../observable/ScalarObservable');
        var EmptyObservable_1 = require('../observable/EmptyObservable');
        var concat_1 = require('./concat');
        var isScheduler_1 = require('../util/isScheduler');
        function startWith() {
          var array = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
          }
          var scheduler = array[array.length - 1];
          if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
          } else {
            scheduler = null;
          }
          var len = array.length;
          if (len === 1) {
            return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
          } else if (len > 1) {
            return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
          } else {
            return concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this);
          }
        }
        exports.startWith = startWith;
      }, {
        "../observable/ArrayObservable": 142,
        "../observable/EmptyObservable": 147,
        "../observable/ScalarObservable": 161,
        "../util/isScheduler": 328,
        "./concat": 201
      }],
      266: [function(require, module, exports) {
        "use strict";
        var SubscribeOnObservable_1 = require('../observable/SubscribeOnObservable');
        function subscribeOn(scheduler, delay) {
          if (delay === void 0) {
            delay = 0;
          }
          return new SubscribeOnObservable_1.SubscribeOnObservable(this, delay, scheduler);
        }
        exports.subscribeOn = subscribeOn;
      }, {"../observable/SubscribeOnObservable": 162}],
      267: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function _switch() {
          return this.lift(new SwitchOperator());
        }
        exports._switch = _switch;
        var SwitchOperator = (function() {
          function SwitchOperator() {}
          SwitchOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SwitchSubscriber(subscriber));
          };
          return SwitchOperator;
        }());
        var SwitchSubscriber = (function(_super) {
          __extends(SwitchSubscriber, _super);
          function SwitchSubscriber(destination) {
            _super.call(this, destination);
            this.active = 0;
            this.hasCompleted = false;
          }
          SwitchSubscriber.prototype._next = function(value) {
            this.unsubscribeInner();
            this.active++;
            this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, value));
          };
          SwitchSubscriber.prototype._complete = function() {
            this.hasCompleted = true;
            if (this.active === 0) {
              this.destination.complete();
            }
          };
          SwitchSubscriber.prototype.unsubscribeInner = function() {
            this.active = this.active > 0 ? this.active - 1 : 0;
            var innerSubscription = this.innerSubscription;
            if (innerSubscription) {
              innerSubscription.unsubscribe();
              this.remove(innerSubscription);
            }
          };
          SwitchSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
          };
          SwitchSubscriber.prototype.notifyError = function(err) {
            this.destination.error(err);
          };
          SwitchSubscriber.prototype.notifyComplete = function() {
            this.unsubscribeInner();
            if (this.hasCompleted && this.active === 0) {
              this.destination.complete();
            }
          };
          return SwitchSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      268: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function switchMap(project, resultSelector) {
          return this.lift(new SwitchMapOperator(project, resultSelector));
        }
        exports.switchMap = switchMap;
        var SwitchMapOperator = (function() {
          function SwitchMapOperator(project, resultSelector) {
            this.project = project;
            this.resultSelector = resultSelector;
          }
          SwitchMapOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
          };
          return SwitchMapOperator;
        }());
        var SwitchMapSubscriber = (function(_super) {
          __extends(SwitchMapSubscriber, _super);
          function SwitchMapSubscriber(destination, project, resultSelector) {
            _super.call(this, destination);
            this.project = project;
            this.resultSelector = resultSelector;
            this.index = 0;
          }
          SwitchMapSubscriber.prototype._next = function(value) {
            var result;
            var index = this.index++;
            try {
              result = this.project(value, index);
            } catch (error) {
              this.destination.error(error);
              return;
            }
            this._innerSub(result, value, index);
          };
          SwitchMapSubscriber.prototype._innerSub = function(result, value, index) {
            var innerSubscription = this.innerSubscription;
            if (innerSubscription) {
              innerSubscription.unsubscribe();
            }
            this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index));
          };
          SwitchMapSubscriber.prototype._complete = function() {
            var innerSubscription = this.innerSubscription;
            if (!innerSubscription || innerSubscription.isUnsubscribed) {
              _super.prototype._complete.call(this);
            }
          };
          SwitchMapSubscriber.prototype._unsubscribe = function() {
            this.innerSubscription = null;
          };
          SwitchMapSubscriber.prototype.notifyComplete = function(innerSub) {
            this.remove(innerSub);
            this.innerSubscription = null;
            if (this.isStopped) {
              _super.prototype._complete.call(this);
            }
          };
          SwitchMapSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (this.resultSelector) {
              this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
            } else {
              this.destination.next(innerValue);
            }
          };
          SwitchMapSubscriber.prototype._tryNotifyNext = function(outerValue, innerValue, outerIndex, innerIndex) {
            var result;
            try {
              result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          return SwitchMapSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      269: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function switchMapTo(innerObservable, resultSelector) {
          return this.lift(new SwitchMapToOperator(innerObservable, resultSelector));
        }
        exports.switchMapTo = switchMapTo;
        var SwitchMapToOperator = (function() {
          function SwitchMapToOperator(observable, resultSelector) {
            this.observable = observable;
            this.resultSelector = resultSelector;
          }
          SwitchMapToOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector));
          };
          return SwitchMapToOperator;
        }());
        var SwitchMapToSubscriber = (function(_super) {
          __extends(SwitchMapToSubscriber, _super);
          function SwitchMapToSubscriber(destination, inner, resultSelector) {
            _super.call(this, destination);
            this.inner = inner;
            this.resultSelector = resultSelector;
            this.index = 0;
          }
          SwitchMapToSubscriber.prototype._next = function(value) {
            var innerSubscription = this.innerSubscription;
            if (innerSubscription) {
              innerSubscription.unsubscribe();
            }
            this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, this.inner, value, this.index++));
          };
          SwitchMapToSubscriber.prototype._complete = function() {
            var innerSubscription = this.innerSubscription;
            if (!innerSubscription || innerSubscription.isUnsubscribed) {
              _super.prototype._complete.call(this);
            }
          };
          SwitchMapToSubscriber.prototype._unsubscribe = function() {
            this.innerSubscription = null;
          };
          SwitchMapToSubscriber.prototype.notifyComplete = function(innerSub) {
            this.remove(innerSub);
            this.innerSubscription = null;
            if (this.isStopped) {
              _super.prototype._complete.call(this);
            }
          };
          SwitchMapToSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            if (resultSelector) {
              this.tryResultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } else {
              destination.next(innerValue);
            }
          };
          SwitchMapToSubscriber.prototype.tryResultSelector = function(outerValue, innerValue, outerIndex, innerIndex) {
            var _a = this,
                resultSelector = _a.resultSelector,
                destination = _a.destination;
            var result;
            try {
              result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
            } catch (err) {
              destination.error(err);
              return;
            }
            destination.next(result);
          };
          return SwitchMapToSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      270: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
        var EmptyObservable_1 = require('../observable/EmptyObservable');
        function take(count) {
          if (count === 0) {
            return new EmptyObservable_1.EmptyObservable();
          } else {
            return this.lift(new TakeOperator(count));
          }
        }
        exports.take = take;
        var TakeOperator = (function() {
          function TakeOperator(total) {
            this.total = total;
            if (this.total < 0) {
              throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
            }
          }
          TakeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TakeSubscriber(subscriber, this.total));
          };
          return TakeOperator;
        }());
        var TakeSubscriber = (function(_super) {
          __extends(TakeSubscriber, _super);
          function TakeSubscriber(destination, total) {
            _super.call(this, destination);
            this.total = total;
            this.count = 0;
          }
          TakeSubscriber.prototype._next = function(value) {
            var total = this.total;
            if (++this.count <= total) {
              this.destination.next(value);
              if (this.count === total) {
                this.destination.complete();
                this.unsubscribe();
              }
            }
          };
          return TakeSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../observable/EmptyObservable": 147,
        "../util/ArgumentOutOfRangeError": 311
      }],
      271: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var ArgumentOutOfRangeError_1 = require('../util/ArgumentOutOfRangeError');
        var EmptyObservable_1 = require('../observable/EmptyObservable');
        function takeLast(count) {
          if (count === 0) {
            return new EmptyObservable_1.EmptyObservable();
          } else {
            return this.lift(new TakeLastOperator(count));
          }
        }
        exports.takeLast = takeLast;
        var TakeLastOperator = (function() {
          function TakeLastOperator(total) {
            this.total = total;
            if (this.total < 0) {
              throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
            }
          }
          TakeLastOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TakeLastSubscriber(subscriber, this.total));
          };
          return TakeLastOperator;
        }());
        var TakeLastSubscriber = (function(_super) {
          __extends(TakeLastSubscriber, _super);
          function TakeLastSubscriber(destination, total) {
            _super.call(this, destination);
            this.total = total;
            this.ring = new Array();
            this.count = 0;
          }
          TakeLastSubscriber.prototype._next = function(value) {
            var ring = this.ring;
            var total = this.total;
            var count = this.count++;
            if (ring.length < total) {
              ring.push(value);
            } else {
              var index = count % total;
              ring[index] = value;
            }
          };
          TakeLastSubscriber.prototype._complete = function() {
            var destination = this.destination;
            var count = this.count;
            if (count > 0) {
              var total = this.count >= this.total ? this.total : this.count;
              var ring = this.ring;
              for (var i = 0; i < total; i++) {
                var idx = (count++) % total;
                destination.next(ring[idx]);
              }
            }
            destination.complete();
          };
          return TakeLastSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../observable/EmptyObservable": 147,
        "../util/ArgumentOutOfRangeError": 311
      }],
      272: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function takeUntil(notifier) {
          return this.lift(new TakeUntilOperator(notifier));
        }
        exports.takeUntil = takeUntil;
        var TakeUntilOperator = (function() {
          function TakeUntilOperator(notifier) {
            this.notifier = notifier;
          }
          TakeUntilOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
          };
          return TakeUntilOperator;
        }());
        var TakeUntilSubscriber = (function(_super) {
          __extends(TakeUntilSubscriber, _super);
          function TakeUntilSubscriber(destination, notifier) {
            _super.call(this, destination);
            this.notifier = notifier;
            this.add(subscribeToResult_1.subscribeToResult(this, notifier));
          }
          TakeUntilSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.complete();
          };
          TakeUntilSubscriber.prototype.notifyComplete = function() {};
          return TakeUntilSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      273: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function takeWhile(predicate) {
          return this.lift(new TakeWhileOperator(predicate));
        }
        exports.takeWhile = takeWhile;
        var TakeWhileOperator = (function() {
          function TakeWhileOperator(predicate) {
            this.predicate = predicate;
          }
          TakeWhileOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
          };
          return TakeWhileOperator;
        }());
        var TakeWhileSubscriber = (function(_super) {
          __extends(TakeWhileSubscriber, _super);
          function TakeWhileSubscriber(destination, predicate) {
            _super.call(this, destination);
            this.predicate = predicate;
            this.index = 0;
          }
          TakeWhileSubscriber.prototype._next = function(value) {
            var destination = this.destination;
            var result;
            try {
              result = this.predicate(value, this.index++);
            } catch (err) {
              destination.error(err);
              return;
            }
            this.nextOrComplete(value, result);
          };
          TakeWhileSubscriber.prototype.nextOrComplete = function(value, predicateResult) {
            var destination = this.destination;
            if (Boolean(predicateResult)) {
              destination.next(value);
            } else {
              destination.complete();
            }
          };
          return TakeWhileSubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      274: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function throttle(durationSelector) {
          return this.lift(new ThrottleOperator(durationSelector));
        }
        exports.throttle = throttle;
        var ThrottleOperator = (function() {
          function ThrottleOperator(durationSelector) {
            this.durationSelector = durationSelector;
          }
          ThrottleOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ThrottleSubscriber(subscriber, this.durationSelector));
          };
          return ThrottleOperator;
        }());
        var ThrottleSubscriber = (function(_super) {
          __extends(ThrottleSubscriber, _super);
          function ThrottleSubscriber(destination, durationSelector) {
            _super.call(this, destination);
            this.destination = destination;
            this.durationSelector = durationSelector;
          }
          ThrottleSubscriber.prototype._next = function(value) {
            if (!this.throttled) {
              this.tryDurationSelector(value);
            }
          };
          ThrottleSubscriber.prototype.tryDurationSelector = function(value) {
            var duration = null;
            try {
              duration = this.durationSelector(value);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.emitAndThrottle(value, duration);
          };
          ThrottleSubscriber.prototype.emitAndThrottle = function(value, duration) {
            this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
            this.destination.next(value);
          };
          ThrottleSubscriber.prototype._unsubscribe = function() {
            var throttled = this.throttled;
            if (throttled) {
              this.remove(throttled);
              this.throttled = null;
              throttled.unsubscribe();
            }
          };
          ThrottleSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this._unsubscribe();
          };
          ThrottleSubscriber.prototype.notifyComplete = function() {
            this._unsubscribe();
          };
          return ThrottleSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      275: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        function throttleTime(duration, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new ThrottleTimeOperator(duration, scheduler));
        }
        exports.throttleTime = throttleTime;
        var ThrottleTimeOperator = (function() {
          function ThrottleTimeOperator(duration, scheduler) {
            this.duration = duration;
            this.scheduler = scheduler;
          }
          ThrottleTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler));
          };
          return ThrottleTimeOperator;
        }());
        var ThrottleTimeSubscriber = (function(_super) {
          __extends(ThrottleTimeSubscriber, _super);
          function ThrottleTimeSubscriber(destination, duration, scheduler) {
            _super.call(this, destination);
            this.duration = duration;
            this.scheduler = scheduler;
          }
          ThrottleTimeSubscriber.prototype._next = function(value) {
            if (!this.throttled) {
              this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, {subscriber: this}));
              this.destination.next(value);
            }
          };
          ThrottleTimeSubscriber.prototype.clearThrottle = function() {
            var throttled = this.throttled;
            if (throttled) {
              throttled.unsubscribe();
              this.remove(throttled);
              this.throttled = null;
            }
          };
          return ThrottleTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchNext(arg) {
          var subscriber = arg.subscriber;
          subscriber.clearThrottle();
        }
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      276: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        function timeInterval(scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new TimeIntervalOperator(scheduler));
        }
        exports.timeInterval = timeInterval;
        var TimeInterval = (function() {
          function TimeInterval(value, interval) {
            this.value = value;
            this.interval = interval;
          }
          return TimeInterval;
        }());
        exports.TimeInterval = TimeInterval;
        ;
        var TimeIntervalOperator = (function() {
          function TimeIntervalOperator(scheduler) {
            this.scheduler = scheduler;
          }
          TimeIntervalOperator.prototype.call = function(observer, source) {
            return source._subscribe(new TimeIntervalSubscriber(observer, this.scheduler));
          };
          return TimeIntervalOperator;
        }());
        var TimeIntervalSubscriber = (function(_super) {
          __extends(TimeIntervalSubscriber, _super);
          function TimeIntervalSubscriber(destination, scheduler) {
            _super.call(this, destination);
            this.scheduler = scheduler;
            this.lastTime = 0;
            this.lastTime = scheduler.now();
          }
          TimeIntervalSubscriber.prototype._next = function(value) {
            var now = this.scheduler.now();
            var span = now - this.lastTime;
            this.lastTime = now;
            this.destination.next(new TimeInterval(value, span));
          };
          return TimeIntervalSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      277: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var async_1 = require('../scheduler/async');
        var isDate_1 = require('../util/isDate');
        var Subscriber_1 = require('../Subscriber');
        function timeout(due, errorToSend, scheduler) {
          if (errorToSend === void 0) {
            errorToSend = null;
          }
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          var absoluteTimeout = isDate_1.isDate(due);
          var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
          return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler));
        }
        exports.timeout = timeout;
        var TimeoutOperator = (function() {
          function TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler) {
            this.waitFor = waitFor;
            this.absoluteTimeout = absoluteTimeout;
            this.errorToSend = errorToSend;
            this.scheduler = scheduler;
          }
          TimeoutOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorToSend, this.scheduler));
          };
          return TimeoutOperator;
        }());
        var TimeoutSubscriber = (function(_super) {
          __extends(TimeoutSubscriber, _super);
          function TimeoutSubscriber(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
            _super.call(this, destination);
            this.absoluteTimeout = absoluteTimeout;
            this.waitFor = waitFor;
            this.errorToSend = errorToSend;
            this.scheduler = scheduler;
            this.index = 0;
            this._previousIndex = 0;
            this._hasCompleted = false;
            this.scheduleTimeout();
          }
          Object.defineProperty(TimeoutSubscriber.prototype, "previousIndex", {
            get: function() {
              return this._previousIndex;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(TimeoutSubscriber.prototype, "hasCompleted", {
            get: function() {
              return this._hasCompleted;
            },
            enumerable: true,
            configurable: true
          });
          TimeoutSubscriber.dispatchTimeout = function(state) {
            var source = state.subscriber;
            var currentIndex = state.index;
            if (!source.hasCompleted && source.previousIndex === currentIndex) {
              source.notifyTimeout();
            }
          };
          TimeoutSubscriber.prototype.scheduleTimeout = function() {
            var currentIndex = this.index;
            this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, {
              subscriber: this,
              index: currentIndex
            });
            this.index++;
            this._previousIndex = currentIndex;
          };
          TimeoutSubscriber.prototype._next = function(value) {
            this.destination.next(value);
            if (!this.absoluteTimeout) {
              this.scheduleTimeout();
            }
          };
          TimeoutSubscriber.prototype._error = function(err) {
            this.destination.error(err);
            this._hasCompleted = true;
          };
          TimeoutSubscriber.prototype._complete = function() {
            this.destination.complete();
            this._hasCompleted = true;
          };
          TimeoutSubscriber.prototype.notifyTimeout = function() {
            this.error(this.errorToSend || new Error('timeout'));
          };
          return TimeoutSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301,
        "../util/isDate": 323
      }],
      278: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var async_1 = require('../scheduler/async');
        var isDate_1 = require('../util/isDate');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function timeoutWith(due, withObservable, scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          var absoluteTimeout = isDate_1.isDate(due);
          var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
          return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
        }
        exports.timeoutWith = timeoutWith;
        var TimeoutWithOperator = (function() {
          function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
            this.waitFor = waitFor;
            this.absoluteTimeout = absoluteTimeout;
            this.withObservable = withObservable;
            this.scheduler = scheduler;
          }
          TimeoutWithOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
          };
          return TimeoutWithOperator;
        }());
        var TimeoutWithSubscriber = (function(_super) {
          __extends(TimeoutWithSubscriber, _super);
          function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
            _super.call(this);
            this.destination = destination;
            this.absoluteTimeout = absoluteTimeout;
            this.waitFor = waitFor;
            this.withObservable = withObservable;
            this.scheduler = scheduler;
            this.timeoutSubscription = undefined;
            this.index = 0;
            this._previousIndex = 0;
            this._hasCompleted = false;
            destination.add(this);
            this.scheduleTimeout();
          }
          Object.defineProperty(TimeoutWithSubscriber.prototype, "previousIndex", {
            get: function() {
              return this._previousIndex;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(TimeoutWithSubscriber.prototype, "hasCompleted", {
            get: function() {
              return this._hasCompleted;
            },
            enumerable: true,
            configurable: true
          });
          TimeoutWithSubscriber.dispatchTimeout = function(state) {
            var source = state.subscriber;
            var currentIndex = state.index;
            if (!source.hasCompleted && source.previousIndex === currentIndex) {
              source.handleTimeout();
            }
          };
          TimeoutWithSubscriber.prototype.scheduleTimeout = function() {
            var currentIndex = this.index;
            var timeoutState = {
              subscriber: this,
              index: currentIndex
            };
            this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
            this.index++;
            this._previousIndex = currentIndex;
          };
          TimeoutWithSubscriber.prototype._next = function(value) {
            this.destination.next(value);
            if (!this.absoluteTimeout) {
              this.scheduleTimeout();
            }
          };
          TimeoutWithSubscriber.prototype._error = function(err) {
            this.destination.error(err);
            this._hasCompleted = true;
          };
          TimeoutWithSubscriber.prototype._complete = function() {
            this.destination.complete();
            this._hasCompleted = true;
          };
          TimeoutWithSubscriber.prototype.handleTimeout = function() {
            if (!this.isUnsubscribed) {
              var withObservable = this.withObservable;
              this.unsubscribe();
              this.destination.add(this.timeoutSubscription = subscribeToResult_1.subscribeToResult(this, withObservable));
            }
          };
          return TimeoutWithSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../scheduler/async": 301,
        "../util/isDate": 323,
        "../util/subscribeToResult": 332
      }],
      279: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var async_1 = require('../scheduler/async');
        function timestamp(scheduler) {
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new TimestampOperator(scheduler));
        }
        exports.timestamp = timestamp;
        var Timestamp = (function() {
          function Timestamp(value, timestamp) {
            this.value = value;
            this.timestamp = timestamp;
          }
          return Timestamp;
        }());
        exports.Timestamp = Timestamp;
        ;
        var TimestampOperator = (function() {
          function TimestampOperator(scheduler) {
            this.scheduler = scheduler;
          }
          TimestampOperator.prototype.call = function(observer, source) {
            return source._subscribe(new TimestampSubscriber(observer, this.scheduler));
          };
          return TimestampOperator;
        }());
        var TimestampSubscriber = (function(_super) {
          __extends(TimestampSubscriber, _super);
          function TimestampSubscriber(destination, scheduler) {
            _super.call(this, destination);
            this.scheduler = scheduler;
          }
          TimestampSubscriber.prototype._next = function(value) {
            var now = this.scheduler.now();
            this.destination.next(new Timestamp(value, now));
          };
          return TimestampSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      280: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        function toArray() {
          return this.lift(new ToArrayOperator());
        }
        exports.toArray = toArray;
        var ToArrayOperator = (function() {
          function ToArrayOperator() {}
          ToArrayOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ToArraySubscriber(subscriber));
          };
          return ToArrayOperator;
        }());
        var ToArraySubscriber = (function(_super) {
          __extends(ToArraySubscriber, _super);
          function ToArraySubscriber(destination) {
            _super.call(this, destination);
            this.array = [];
          }
          ToArraySubscriber.prototype._next = function(x) {
            this.array.push(x);
          };
          ToArraySubscriber.prototype._complete = function() {
            this.destination.next(this.array);
            this.destination.complete();
          };
          return ToArraySubscriber;
        }(Subscriber_1.Subscriber));
      }, {"../Subscriber": 13}],
      281: [function(require, module, exports) {
        "use strict";
        var root_1 = require('../util/root');
        function toPromise(PromiseCtor) {
          var _this = this;
          if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
              PromiseCtor = root_1.root.Rx.config.Promise;
            } else if (root_1.root.Promise) {
              PromiseCtor = root_1.root.Promise;
            }
          }
          if (!PromiseCtor) {
            throw new Error('no Promise impl found');
          }
          return new PromiseCtor(function(resolve, reject) {
            var value;
            _this.subscribe(function(x) {
              return value = x;
            }, function(err) {
              return reject(err);
            }, function() {
              return resolve(value);
            });
          });
        }
        exports.toPromise = toPromise;
      }, {"../util/root": 331}],
      282: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function window(windowBoundaries) {
          return this.lift(new WindowOperator(windowBoundaries));
        }
        exports.window = window;
        var WindowOperator = (function() {
          function WindowOperator(windowBoundaries) {
            this.windowBoundaries = windowBoundaries;
          }
          WindowOperator.prototype.call = function(subscriber, source) {
            var windowSubscriber = new WindowSubscriber(subscriber);
            var sourceSubscription = source._subscribe(windowSubscriber);
            if (!sourceSubscription.isUnsubscribed) {
              windowSubscriber.add(subscribeToResult_1.subscribeToResult(windowSubscriber, this.windowBoundaries));
            }
            return sourceSubscription;
          };
          return WindowOperator;
        }());
        var WindowSubscriber = (function(_super) {
          __extends(WindowSubscriber, _super);
          function WindowSubscriber(destination) {
            _super.call(this, destination);
            this.window = new Subject_1.Subject();
            destination.next(this.window);
          }
          WindowSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.openWindow();
          };
          WindowSubscriber.prototype.notifyError = function(error, innerSub) {
            this._error(error);
          };
          WindowSubscriber.prototype.notifyComplete = function(innerSub) {
            this._complete();
          };
          WindowSubscriber.prototype._next = function(value) {
            this.window.next(value);
          };
          WindowSubscriber.prototype._error = function(err) {
            this.window.error(err);
            this.destination.error(err);
          };
          WindowSubscriber.prototype._complete = function() {
            this.window.complete();
            this.destination.complete();
          };
          WindowSubscriber.prototype._unsubscribe = function() {
            this.window = null;
          };
          WindowSubscriber.prototype.openWindow = function() {
            var prevWindow = this.window;
            if (prevWindow) {
              prevWindow.complete();
            }
            var destination = this.destination;
            var newWindow = this.window = new Subject_1.Subject();
            destination.next(newWindow);
          };
          return WindowSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subject": 11,
        "../util/subscribeToResult": 332
      }],
      283: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Subject_1 = require('../Subject');
        function windowCount(windowSize, startWindowEvery) {
          if (startWindowEvery === void 0) {
            startWindowEvery = 0;
          }
          return this.lift(new WindowCountOperator(windowSize, startWindowEvery));
        }
        exports.windowCount = windowCount;
        var WindowCountOperator = (function() {
          function WindowCountOperator(windowSize, startWindowEvery) {
            this.windowSize = windowSize;
            this.startWindowEvery = startWindowEvery;
          }
          WindowCountOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
          };
          return WindowCountOperator;
        }());
        var WindowCountSubscriber = (function(_super) {
          __extends(WindowCountSubscriber, _super);
          function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
            _super.call(this, destination);
            this.destination = destination;
            this.windowSize = windowSize;
            this.startWindowEvery = startWindowEvery;
            this.windows = [new Subject_1.Subject()];
            this.count = 0;
            destination.next(this.windows[0]);
          }
          WindowCountSubscriber.prototype._next = function(value) {
            var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
            var destination = this.destination;
            var windowSize = this.windowSize;
            var windows = this.windows;
            var len = windows.length;
            for (var i = 0; i < len && !this.isUnsubscribed; i++) {
              windows[i].next(value);
            }
            var c = this.count - windowSize + 1;
            if (c >= 0 && c % startWindowEvery === 0 && !this.isUnsubscribed) {
              windows.shift().complete();
            }
            if (++this.count % startWindowEvery === 0 && !this.isUnsubscribed) {
              var window_1 = new Subject_1.Subject();
              windows.push(window_1);
              destination.next(window_1);
            }
          };
          WindowCountSubscriber.prototype._error = function(err) {
            var windows = this.windows;
            if (windows) {
              while (windows.length > 0 && !this.isUnsubscribed) {
                windows.shift().error(err);
              }
            }
            this.destination.error(err);
          };
          WindowCountSubscriber.prototype._complete = function() {
            var windows = this.windows;
            if (windows) {
              while (windows.length > 0 && !this.isUnsubscribed) {
                windows.shift().complete();
              }
            }
            this.destination.complete();
          };
          WindowCountSubscriber.prototype._unsubscribe = function() {
            this.count = 0;
            this.windows = null;
          };
          return WindowCountSubscriber;
        }(Subscriber_1.Subscriber));
      }, {
        "../Subject": 11,
        "../Subscriber": 13
      }],
      284: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscriber_1 = require('../Subscriber');
        var Subject_1 = require('../Subject');
        var async_1 = require('../scheduler/async');
        function windowTime(windowTimeSpan, windowCreationInterval, scheduler) {
          if (windowCreationInterval === void 0) {
            windowCreationInterval = null;
          }
          if (scheduler === void 0) {
            scheduler = async_1.async;
          }
          return this.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler));
        }
        exports.windowTime = windowTime;
        var WindowTimeOperator = (function() {
          function WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler) {
            this.windowTimeSpan = windowTimeSpan;
            this.windowCreationInterval = windowCreationInterval;
            this.scheduler = scheduler;
          }
          WindowTimeOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.scheduler));
          };
          return WindowTimeOperator;
        }());
        var WindowTimeSubscriber = (function(_super) {
          __extends(WindowTimeSubscriber, _super);
          function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, scheduler) {
            _super.call(this, destination);
            this.destination = destination;
            this.windowTimeSpan = windowTimeSpan;
            this.windowCreationInterval = windowCreationInterval;
            this.scheduler = scheduler;
            this.windows = [];
            if (windowCreationInterval !== null && windowCreationInterval >= 0) {
              var window_1 = this.openWindow();
              var closeState = {
                subscriber: this,
                window: window_1,
                context: null
              };
              var creationState = {
                windowTimeSpan: windowTimeSpan,
                windowCreationInterval: windowCreationInterval,
                subscriber: this,
                scheduler: scheduler
              };
              this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
              this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
            } else {
              var window_2 = this.openWindow();
              var timeSpanOnlyState = {
                subscriber: this,
                window: window_2,
                windowTimeSpan: windowTimeSpan
              };
              this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
            }
          }
          WindowTimeSubscriber.prototype._next = function(value) {
            var windows = this.windows;
            var len = windows.length;
            for (var i = 0; i < len; i++) {
              var window_3 = windows[i];
              if (!window_3.isUnsubscribed) {
                window_3.next(value);
              }
            }
          };
          WindowTimeSubscriber.prototype._error = function(err) {
            var windows = this.windows;
            while (windows.length > 0) {
              windows.shift().error(err);
            }
            this.destination.error(err);
          };
          WindowTimeSubscriber.prototype._complete = function() {
            var windows = this.windows;
            while (windows.length > 0) {
              var window_4 = windows.shift();
              if (!window_4.isUnsubscribed) {
                window_4.complete();
              }
            }
            this.destination.complete();
          };
          WindowTimeSubscriber.prototype.openWindow = function() {
            var window = new Subject_1.Subject();
            this.windows.push(window);
            var destination = this.destination;
            destination.next(window);
            return window;
          };
          WindowTimeSubscriber.prototype.closeWindow = function(window) {
            window.complete();
            var windows = this.windows;
            windows.splice(windows.indexOf(window), 1);
          };
          return WindowTimeSubscriber;
        }(Subscriber_1.Subscriber));
        function dispatchWindowTimeSpanOnly(state) {
          var subscriber = state.subscriber,
              windowTimeSpan = state.windowTimeSpan,
              window = state.window;
          if (window) {
            window.complete();
          }
          state.window = subscriber.openWindow();
          this.schedule(state, windowTimeSpan);
        }
        function dispatchWindowCreation(state) {
          var windowTimeSpan = state.windowTimeSpan,
              subscriber = state.subscriber,
              scheduler = state.scheduler,
              windowCreationInterval = state.windowCreationInterval;
          var window = subscriber.openWindow();
          var action = this;
          var context = {
            action: action,
            subscription: null
          };
          var timeSpanState = {
            subscriber: subscriber,
            window: window,
            context: context
          };
          context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
          action.add(context.subscription);
          action.schedule(state, windowCreationInterval);
        }
        function dispatchWindowClose(arg) {
          var subscriber = arg.subscriber,
              window = arg.window,
              context = arg.context;
          if (context && context.action && context.subscription) {
            context.action.remove(context.subscription);
          }
          subscriber.closeWindow(window);
        }
      }, {
        "../Subject": 11,
        "../Subscriber": 13,
        "../scheduler/async": 301
      }],
      285: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var Subscription_1 = require('../Subscription');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function windowToggle(openings, closingSelector) {
          return this.lift(new WindowToggleOperator(openings, closingSelector));
        }
        exports.windowToggle = windowToggle;
        var WindowToggleOperator = (function() {
          function WindowToggleOperator(openings, closingSelector) {
            this.openings = openings;
            this.closingSelector = closingSelector;
          }
          WindowToggleOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
          };
          return WindowToggleOperator;
        }());
        var WindowToggleSubscriber = (function(_super) {
          __extends(WindowToggleSubscriber, _super);
          function WindowToggleSubscriber(destination, openings, closingSelector) {
            _super.call(this, destination);
            this.openings = openings;
            this.closingSelector = closingSelector;
            this.contexts = [];
            this.add(this.openSubscription = subscribeToResult_1.subscribeToResult(this, openings, openings));
          }
          WindowToggleSubscriber.prototype._next = function(value) {
            var contexts = this.contexts;
            if (contexts) {
              var len = contexts.length;
              for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
              }
            }
          };
          WindowToggleSubscriber.prototype._error = function(err) {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                var context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
              }
            }
            _super.prototype._error.call(this, err);
          };
          WindowToggleSubscriber.prototype._complete = function() {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                var context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
              }
            }
            _super.prototype._complete.call(this);
          };
          WindowToggleSubscriber.prototype._unsubscribe = function() {
            var contexts = this.contexts;
            this.contexts = null;
            if (contexts) {
              var len = contexts.length;
              var index = -1;
              while (++index < len) {
                var context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
              }
            }
          };
          WindowToggleSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (outerValue === this.openings) {
              var closingSelector = this.closingSelector;
              var closingNotifier = tryCatch_1.tryCatch(closingSelector)(innerValue);
              if (closingNotifier === errorObject_1.errorObject) {
                return this.error(errorObject_1.errorObject.e);
              } else {
                var window_1 = new Subject_1.Subject();
                var subscription = new Subscription_1.Subscription();
                var context = {
                  window: window_1,
                  subscription: subscription
                };
                this.contexts.push(context);
                var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
                if (innerSubscription.isUnsubscribed) {
                  this.closeWindow(this.contexts.length - 1);
                } else {
                  innerSubscription.context = context;
                  subscription.add(innerSubscription);
                }
                this.destination.next(window_1);
              }
            } else {
              this.closeWindow(this.contexts.indexOf(outerValue));
            }
          };
          WindowToggleSubscriber.prototype.notifyError = function(err) {
            this.error(err);
          };
          WindowToggleSubscriber.prototype.notifyComplete = function(inner) {
            if (inner !== this.openSubscription) {
              this.closeWindow(this.contexts.indexOf(inner.context));
            }
          };
          WindowToggleSubscriber.prototype.closeWindow = function(index) {
            if (index === -1) {
              return;
            }
            var contexts = this.contexts;
            var context = contexts[index];
            var window = context.window,
                subscription = context.subscription;
            contexts.splice(index, 1);
            window.complete();
            subscription.unsubscribe();
          };
          return WindowToggleSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subject": 11,
        "../Subscription": 14,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      286: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var tryCatch_1 = require('../util/tryCatch');
        var errorObject_1 = require('../util/errorObject');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function windowWhen(closingSelector) {
          return this.lift(new WindowOperator(closingSelector));
        }
        exports.windowWhen = windowWhen;
        var WindowOperator = (function() {
          function WindowOperator(closingSelector) {
            this.closingSelector = closingSelector;
          }
          WindowOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new WindowSubscriber(subscriber, this.closingSelector));
          };
          return WindowOperator;
        }());
        var WindowSubscriber = (function(_super) {
          __extends(WindowSubscriber, _super);
          function WindowSubscriber(destination, closingSelector) {
            _super.call(this, destination);
            this.destination = destination;
            this.closingSelector = closingSelector;
            this.openWindow();
          }
          WindowSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.openWindow(innerSub);
          };
          WindowSubscriber.prototype.notifyError = function(error, innerSub) {
            this._error(error);
          };
          WindowSubscriber.prototype.notifyComplete = function(innerSub) {
            this.openWindow(innerSub);
          };
          WindowSubscriber.prototype._next = function(value) {
            this.window.next(value);
          };
          WindowSubscriber.prototype._error = function(err) {
            this.window.error(err);
            this.destination.error(err);
            this.unsubscribeClosingNotification();
          };
          WindowSubscriber.prototype._complete = function() {
            this.window.complete();
            this.destination.complete();
            this.unsubscribeClosingNotification();
          };
          WindowSubscriber.prototype.unsubscribeClosingNotification = function() {
            if (this.closingNotification) {
              this.closingNotification.unsubscribe();
            }
          };
          WindowSubscriber.prototype.openWindow = function(innerSub) {
            if (innerSub === void 0) {
              innerSub = null;
            }
            if (innerSub) {
              this.remove(innerSub);
              innerSub.unsubscribe();
            }
            var prevWindow = this.window;
            if (prevWindow) {
              prevWindow.complete();
            }
            var window = this.window = new Subject_1.Subject();
            this.destination.next(window);
            var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
            if (closingNotifier === errorObject_1.errorObject) {
              var err = errorObject_1.errorObject.e;
              this.destination.error(err);
              this.window.error(err);
            } else {
              this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
            }
          };
          return WindowSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subject": 11,
        "../util/errorObject": 321,
        "../util/subscribeToResult": 332,
        "../util/tryCatch": 335
      }],
      287: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        function withLatestFrom() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
          }
          var project;
          if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
          }
          var observables = args;
          return this.lift(new WithLatestFromOperator(observables, project));
        }
        exports.withLatestFrom = withLatestFrom;
        var WithLatestFromOperator = (function() {
          function WithLatestFromOperator(observables, project) {
            this.observables = observables;
            this.project = project;
          }
          WithLatestFromOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
          };
          return WithLatestFromOperator;
        }());
        var WithLatestFromSubscriber = (function(_super) {
          __extends(WithLatestFromSubscriber, _super);
          function WithLatestFromSubscriber(destination, observables, project) {
            _super.call(this, destination);
            this.observables = observables;
            this.project = project;
            this.toRespond = [];
            var len = observables.length;
            this.values = new Array(len);
            for (var i = 0; i < len; i++) {
              this.toRespond.push(i);
            }
            for (var i = 0; i < len; i++) {
              var observable = observables[i];
              this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
            }
          }
          WithLatestFromSubscriber.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.values[outerIndex] = innerValue;
            var toRespond = this.toRespond;
            if (toRespond.length > 0) {
              var found = toRespond.indexOf(outerIndex);
              if (found !== -1) {
                toRespond.splice(found, 1);
              }
            }
          };
          WithLatestFromSubscriber.prototype.notifyComplete = function() {};
          WithLatestFromSubscriber.prototype._next = function(value) {
            if (this.toRespond.length === 0) {
              var args = [value].concat(this.values);
              if (this.project) {
                this._tryProject(args);
              } else {
                this.destination.next(args);
              }
            }
          };
          WithLatestFromSubscriber.prototype._tryProject = function(args) {
            var result;
            try {
              result = this.project.apply(this, args);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          return WithLatestFromSubscriber;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../util/subscribeToResult": 332
      }],
      288: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ArrayObservable_1 = require('../observable/ArrayObservable');
        var isArray_1 = require('../util/isArray');
        var Subscriber_1 = require('../Subscriber');
        var OuterSubscriber_1 = require('../OuterSubscriber');
        var subscribeToResult_1 = require('../util/subscribeToResult');
        var iterator_1 = require('../symbol/iterator');
        function zipProto() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          observables.unshift(this);
          return zipStatic.apply(this, observables);
        }
        exports.zipProto = zipProto;
        function zipStatic() {
          var observables = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            observables[_i - 0] = arguments[_i];
          }
          var project = observables[observables.length - 1];
          if (typeof project === 'function') {
            observables.pop();
          }
          return new ArrayObservable_1.ArrayObservable(observables).lift(new ZipOperator(project));
        }
        exports.zipStatic = zipStatic;
        var ZipOperator = (function() {
          function ZipOperator(project) {
            this.project = project;
          }
          ZipOperator.prototype.call = function(subscriber, source) {
            return source._subscribe(new ZipSubscriber(subscriber, this.project));
          };
          return ZipOperator;
        }());
        exports.ZipOperator = ZipOperator;
        var ZipSubscriber = (function(_super) {
          __extends(ZipSubscriber, _super);
          function ZipSubscriber(destination, project, values) {
            if (values === void 0) {
              values = Object.create(null);
            }
            _super.call(this, destination);
            this.index = 0;
            this.iterators = [];
            this.active = 0;
            this.project = (typeof project === 'function') ? project : null;
            this.values = values;
          }
          ZipSubscriber.prototype._next = function(value) {
            var iterators = this.iterators;
            var index = this.index++;
            if (isArray_1.isArray(value)) {
              iterators.push(new StaticArrayIterator(value));
            } else if (typeof value[iterator_1.$$iterator] === 'function') {
              iterators.push(new StaticIterator(value[iterator_1.$$iterator]()));
            } else {
              iterators.push(new ZipBufferIterator(this.destination, this, value, index));
            }
          };
          ZipSubscriber.prototype._complete = function() {
            var iterators = this.iterators;
            var len = iterators.length;
            this.active = len;
            for (var i = 0; i < len; i++) {
              var iterator = iterators[i];
              if (iterator.stillUnsubscribed) {
                this.add(iterator.subscribe(iterator, i));
              } else {
                this.active--;
              }
            }
          };
          ZipSubscriber.prototype.notifyInactive = function() {
            this.active--;
            if (this.active === 0) {
              this.destination.complete();
            }
          };
          ZipSubscriber.prototype.checkIterators = function() {
            var iterators = this.iterators;
            var len = iterators.length;
            var destination = this.destination;
            for (var i = 0; i < len; i++) {
              var iterator = iterators[i];
              if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
              }
            }
            var shouldComplete = false;
            var args = [];
            for (var i = 0; i < len; i++) {
              var iterator = iterators[i];
              var result = iterator.next();
              if (iterator.hasCompleted()) {
                shouldComplete = true;
              }
              if (result.done) {
                destination.complete();
                return;
              }
              args.push(result.value);
            }
            if (this.project) {
              this._tryProject(args);
            } else {
              destination.next(args);
            }
            if (shouldComplete) {
              destination.complete();
            }
          };
          ZipSubscriber.prototype._tryProject = function(args) {
            var result;
            try {
              result = this.project.apply(this, args);
            } catch (err) {
              this.destination.error(err);
              return;
            }
            this.destination.next(result);
          };
          return ZipSubscriber;
        }(Subscriber_1.Subscriber));
        exports.ZipSubscriber = ZipSubscriber;
        var StaticIterator = (function() {
          function StaticIterator(iterator) {
            this.iterator = iterator;
            this.nextResult = iterator.next();
          }
          StaticIterator.prototype.hasValue = function() {
            return true;
          };
          StaticIterator.prototype.next = function() {
            var result = this.nextResult;
            this.nextResult = this.iterator.next();
            return result;
          };
          StaticIterator.prototype.hasCompleted = function() {
            var nextResult = this.nextResult;
            return nextResult && nextResult.done;
          };
          return StaticIterator;
        }());
        var StaticArrayIterator = (function() {
          function StaticArrayIterator(array) {
            this.array = array;
            this.index = 0;
            this.length = 0;
            this.length = array.length;
          }
          StaticArrayIterator.prototype[iterator_1.$$iterator] = function() {
            return this;
          };
          StaticArrayIterator.prototype.next = function(value) {
            var i = this.index++;
            var array = this.array;
            return i < this.length ? {
              value: array[i],
              done: false
            } : {
              value: null,
              done: true
            };
          };
          StaticArrayIterator.prototype.hasValue = function() {
            return this.array.length > this.index;
          };
          StaticArrayIterator.prototype.hasCompleted = function() {
            return this.array.length === this.index;
          };
          return StaticArrayIterator;
        }());
        var ZipBufferIterator = (function(_super) {
          __extends(ZipBufferIterator, _super);
          function ZipBufferIterator(destination, parent, observable, index) {
            _super.call(this, destination);
            this.parent = parent;
            this.observable = observable;
            this.index = index;
            this.stillUnsubscribed = true;
            this.buffer = [];
            this.isComplete = false;
          }
          ZipBufferIterator.prototype[iterator_1.$$iterator] = function() {
            return this;
          };
          ZipBufferIterator.prototype.next = function() {
            var buffer = this.buffer;
            if (buffer.length === 0 && this.isComplete) {
              return {
                value: null,
                done: true
              };
            } else {
              return {
                value: buffer.shift(),
                done: false
              };
            }
          };
          ZipBufferIterator.prototype.hasValue = function() {
            return this.buffer.length > 0;
          };
          ZipBufferIterator.prototype.hasCompleted = function() {
            return this.buffer.length === 0 && this.isComplete;
          };
          ZipBufferIterator.prototype.notifyComplete = function() {
            if (this.buffer.length > 0) {
              this.isComplete = true;
              this.parent.notifyInactive();
            } else {
              this.destination.complete();
            }
          };
          ZipBufferIterator.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.buffer.push(innerValue);
            this.parent.checkIterators();
          };
          ZipBufferIterator.prototype.subscribe = function(value, index) {
            return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
          };
          return ZipBufferIterator;
        }(OuterSubscriber_1.OuterSubscriber));
      }, {
        "../OuterSubscriber": 8,
        "../Subscriber": 13,
        "../observable/ArrayObservable": 142,
        "../symbol/iterator": 303,
        "../util/isArray": 322,
        "../util/subscribeToResult": 332
      }],
      289: [function(require, module, exports) {
        "use strict";
        var zip_1 = require('./zip');
        function zipAll(project) {
          return this.lift(new zip_1.ZipOperator(project));
        }
        exports.zipAll = zipAll;
      }, {"./zip": 288}],
      290: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var FutureAction_1 = require('./FutureAction');
        var AnimationFrame_1 = require('../util/AnimationFrame');
        var AnimationFrameAction = (function(_super) {
          __extends(AnimationFrameAction, _super);
          function AnimationFrameAction() {
            _super.apply(this, arguments);
          }
          AnimationFrameAction.prototype._schedule = function(state, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            if (delay > 0) {
              return _super.prototype._schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            var scheduler = this.scheduler;
            scheduler.actions.push(this);
            if (!scheduler.scheduledId) {
              scheduler.scheduledId = AnimationFrame_1.AnimationFrame.requestAnimationFrame(function() {
                scheduler.scheduledId = null;
                scheduler.flush();
              });
            }
            return this;
          };
          AnimationFrameAction.prototype._unsubscribe = function() {
            var scheduler = this.scheduler;
            var scheduledId = scheduler.scheduledId,
                actions = scheduler.actions;
            _super.prototype._unsubscribe.call(this);
            if (actions.length === 0) {
              scheduler.active = false;
              if (scheduledId != null) {
                scheduler.scheduledId = null;
                AnimationFrame_1.AnimationFrame.cancelAnimationFrame(scheduledId);
              }
            }
          };
          return AnimationFrameAction;
        }(FutureAction_1.FutureAction));
        exports.AnimationFrameAction = AnimationFrameAction;
      }, {
        "../util/AnimationFrame": 310,
        "./FutureAction": 295
      }],
      291: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var QueueScheduler_1 = require('./QueueScheduler');
        var AnimationFrameAction_1 = require('./AnimationFrameAction');
        var AnimationFrameScheduler = (function(_super) {
          __extends(AnimationFrameScheduler, _super);
          function AnimationFrameScheduler() {
            _super.apply(this, arguments);
          }
          AnimationFrameScheduler.prototype.scheduleNow = function(work, state) {
            return new AnimationFrameAction_1.AnimationFrameAction(this, work).schedule(state);
          };
          return AnimationFrameScheduler;
        }(QueueScheduler_1.QueueScheduler));
        exports.AnimationFrameScheduler = AnimationFrameScheduler;
      }, {
        "./AnimationFrameAction": 290,
        "./QueueScheduler": 297
      }],
      292: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Immediate_1 = require('../util/Immediate');
        var FutureAction_1 = require('./FutureAction');
        var AsapAction = (function(_super) {
          __extends(AsapAction, _super);
          function AsapAction() {
            _super.apply(this, arguments);
          }
          AsapAction.prototype._schedule = function(state, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            if (delay > 0) {
              return _super.prototype._schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            var scheduler = this.scheduler;
            scheduler.actions.push(this);
            if (!scheduler.scheduledId) {
              scheduler.scheduledId = Immediate_1.Immediate.setImmediate(function() {
                scheduler.scheduledId = null;
                scheduler.flush();
              });
            }
            return this;
          };
          AsapAction.prototype._unsubscribe = function() {
            var scheduler = this.scheduler;
            var scheduledId = scheduler.scheduledId,
                actions = scheduler.actions;
            _super.prototype._unsubscribe.call(this);
            if (actions.length === 0) {
              scheduler.active = false;
              if (scheduledId != null) {
                scheduler.scheduledId = null;
                Immediate_1.Immediate.clearImmediate(scheduledId);
              }
            }
          };
          return AsapAction;
        }(FutureAction_1.FutureAction));
        exports.AsapAction = AsapAction;
      }, {
        "../util/Immediate": 314,
        "./FutureAction": 295
      }],
      293: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var AsapAction_1 = require('./AsapAction');
        var QueueScheduler_1 = require('./QueueScheduler');
        var AsapScheduler = (function(_super) {
          __extends(AsapScheduler, _super);
          function AsapScheduler() {
            _super.apply(this, arguments);
          }
          AsapScheduler.prototype.scheduleNow = function(work, state) {
            return new AsapAction_1.AsapAction(this, work).schedule(state);
          };
          return AsapScheduler;
        }(QueueScheduler_1.QueueScheduler));
        exports.AsapScheduler = AsapScheduler;
      }, {
        "./AsapAction": 292,
        "./QueueScheduler": 297
      }],
      294: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var FutureAction_1 = require('./FutureAction');
        var QueueScheduler_1 = require('./QueueScheduler');
        var AsyncScheduler = (function(_super) {
          __extends(AsyncScheduler, _super);
          function AsyncScheduler() {
            _super.apply(this, arguments);
          }
          AsyncScheduler.prototype.scheduleNow = function(work, state) {
            return new FutureAction_1.FutureAction(this, work).schedule(state, 0);
          };
          return AsyncScheduler;
        }(QueueScheduler_1.QueueScheduler));
        exports.AsyncScheduler = AsyncScheduler;
      }, {
        "./FutureAction": 295,
        "./QueueScheduler": 297
      }],
      295: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var root_1 = require('../util/root');
        var Subscription_1 = require('../Subscription');
        var FutureAction = (function(_super) {
          __extends(FutureAction, _super);
          function FutureAction(scheduler, work) {
            _super.call(this);
            this.scheduler = scheduler;
            this.work = work;
            this.pending = false;
          }
          FutureAction.prototype.execute = function() {
            if (this.isUnsubscribed) {
              this.error = new Error('executing a cancelled action');
            } else {
              try {
                this.work(this.state);
              } catch (e) {
                this.unsubscribe();
                this.error = e;
              }
            }
          };
          FutureAction.prototype.schedule = function(state, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            if (this.isUnsubscribed) {
              return this;
            }
            return this._schedule(state, delay);
          };
          FutureAction.prototype._schedule = function(state, delay) {
            var _this = this;
            if (delay === void 0) {
              delay = 0;
            }
            this.state = state;
            this.pending = true;
            var id = this.id;
            if (id != null && this.delay === delay) {
              return this;
            }
            this.delay = delay;
            if (id != null) {
              this.id = null;
              root_1.root.clearInterval(id);
            }
            this.id = root_1.root.setInterval(function() {
              _this.pending = false;
              var _a = _this,
                  id = _a.id,
                  scheduler = _a.scheduler;
              scheduler.actions.push(_this);
              scheduler.flush();
              if (_this.pending === false && id != null) {
                _this.id = null;
                root_1.root.clearInterval(id);
              }
            }, delay);
            return this;
          };
          FutureAction.prototype._unsubscribe = function() {
            this.pending = false;
            var _a = this,
                id = _a.id,
                scheduler = _a.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            if (id != null) {
              this.id = null;
              root_1.root.clearInterval(id);
            }
            if (index !== -1) {
              actions.splice(index, 1);
            }
            this.work = null;
            this.state = null;
            this.scheduler = null;
          };
          return FutureAction;
        }(Subscription_1.Subscription));
        exports.FutureAction = FutureAction;
      }, {
        "../Subscription": 14,
        "../util/root": 331
      }],
      296: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var FutureAction_1 = require('./FutureAction');
        var QueueAction = (function(_super) {
          __extends(QueueAction, _super);
          function QueueAction() {
            _super.apply(this, arguments);
          }
          QueueAction.prototype._schedule = function(state, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            if (delay > 0) {
              return _super.prototype._schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            var scheduler = this.scheduler;
            scheduler.actions.push(this);
            scheduler.flush();
            return this;
          };
          return QueueAction;
        }(FutureAction_1.FutureAction));
        exports.QueueAction = QueueAction;
      }, {"./FutureAction": 295}],
      297: [function(require, module, exports) {
        "use strict";
        var QueueAction_1 = require('./QueueAction');
        var FutureAction_1 = require('./FutureAction');
        var QueueScheduler = (function() {
          function QueueScheduler() {
            this.active = false;
            this.actions = [];
            this.scheduledId = null;
          }
          QueueScheduler.prototype.now = function() {
            return Date.now();
          };
          QueueScheduler.prototype.flush = function() {
            if (this.active || this.scheduledId) {
              return;
            }
            this.active = true;
            var actions = this.actions;
            for (var action = null; action = actions.shift(); ) {
              action.execute();
              if (action.error) {
                this.active = false;
                throw action.error;
              }
            }
            this.active = false;
          };
          QueueScheduler.prototype.schedule = function(work, delay, state) {
            if (delay === void 0) {
              delay = 0;
            }
            return (delay <= 0) ? this.scheduleNow(work, state) : this.scheduleLater(work, delay, state);
          };
          QueueScheduler.prototype.scheduleNow = function(work, state) {
            return new QueueAction_1.QueueAction(this, work).schedule(state);
          };
          QueueScheduler.prototype.scheduleLater = function(work, delay, state) {
            return new FutureAction_1.FutureAction(this, work).schedule(state, delay);
          };
          return QueueScheduler;
        }());
        exports.QueueScheduler = QueueScheduler;
      }, {
        "./FutureAction": 295,
        "./QueueAction": 296
      }],
      298: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscription_1 = require('../Subscription');
        var VirtualTimeScheduler = (function() {
          function VirtualTimeScheduler() {
            this.actions = [];
            this.active = false;
            this.scheduledId = null;
            this.index = 0;
            this.sorted = false;
            this.frame = 0;
            this.maxFrames = 750;
          }
          VirtualTimeScheduler.prototype.now = function() {
            return this.frame;
          };
          VirtualTimeScheduler.prototype.flush = function() {
            var actions = this.actions;
            var maxFrames = this.maxFrames;
            while (actions.length > 0) {
              var action = actions.shift();
              this.frame = action.delay;
              if (this.frame <= maxFrames) {
                action.execute();
                if (action.error) {
                  actions.length = 0;
                  this.frame = 0;
                  throw action.error;
                }
              } else {
                break;
              }
            }
            actions.length = 0;
            this.frame = 0;
          };
          VirtualTimeScheduler.prototype.addAction = function(action) {
            var actions = this.actions;
            actions.push(action);
            actions.sort(function(a, b) {
              if (a.delay === b.delay) {
                if (a.index === b.index) {
                  return 0;
                } else if (a.index > b.index) {
                  return 1;
                } else {
                  return -1;
                }
              } else if (a.delay > b.delay) {
                return 1;
              } else {
                return -1;
              }
            });
          };
          VirtualTimeScheduler.prototype.schedule = function(work, delay, state) {
            if (delay === void 0) {
              delay = 0;
            }
            this.sorted = false;
            return new VirtualAction(this, work, this.index++).schedule(state, delay);
          };
          VirtualTimeScheduler.frameTimeFactor = 10;
          return VirtualTimeScheduler;
        }());
        exports.VirtualTimeScheduler = VirtualTimeScheduler;
        var VirtualAction = (function(_super) {
          __extends(VirtualAction, _super);
          function VirtualAction(scheduler, work, index) {
            _super.call(this);
            this.scheduler = scheduler;
            this.work = work;
            this.index = index;
            this.calls = 0;
          }
          VirtualAction.prototype.schedule = function(state, delay) {
            if (delay === void 0) {
              delay = 0;
            }
            if (this.isUnsubscribed) {
              return this;
            }
            var scheduler = this.scheduler;
            var action = null;
            if (this.calls++ === 0) {
              action = this;
            } else {
              action = new VirtualAction(scheduler, this.work, scheduler.index += 1);
              this.add(action);
            }
            action.state = state;
            action.delay = scheduler.frame + delay;
            scheduler.addAction(action);
            return this;
          };
          VirtualAction.prototype.execute = function() {
            if (this.isUnsubscribed) {
              throw new Error('How did did we execute a canceled Action?');
            }
            this.work(this.state);
          };
          VirtualAction.prototype.unsubscribe = function() {
            var actions = this.scheduler.actions;
            var index = actions.indexOf(this);
            this.work = void 0;
            this.state = void 0;
            this.scheduler = void 0;
            if (index !== -1) {
              actions.splice(index, 1);
            }
            _super.prototype.unsubscribe.call(this);
          };
          return VirtualAction;
        }(Subscription_1.Subscription));
      }, {"../Subscription": 14}],
      299: [function(require, module, exports) {
        "use strict";
        var AnimationFrameScheduler_1 = require('./AnimationFrameScheduler');
        exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler();
      }, {"./AnimationFrameScheduler": 291}],
      300: [function(require, module, exports) {
        "use strict";
        var AsapScheduler_1 = require('./AsapScheduler');
        exports.asap = new AsapScheduler_1.AsapScheduler();
      }, {"./AsapScheduler": 293}],
      301: [function(require, module, exports) {
        "use strict";
        var AsyncScheduler_1 = require('./AsyncScheduler');
        exports.async = new AsyncScheduler_1.AsyncScheduler();
      }, {"./AsyncScheduler": 294}],
      302: [function(require, module, exports) {
        "use strict";
        var QueueScheduler_1 = require('./QueueScheduler');
        exports.queue = new QueueScheduler_1.QueueScheduler();
      }, {"./QueueScheduler": 297}],
      303: [function(require, module, exports) {
        "use strict";
        var root_1 = require('../util/root');
        var Symbol = root_1.root.Symbol;
        if (typeof Symbol === 'function') {
          if (Symbol.iterator) {
            exports.$$iterator = Symbol.iterator;
          } else if (typeof Symbol.for === 'function') {
            exports.$$iterator = Symbol.for('iterator');
          }
        } else {
          if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
            exports.$$iterator = '@@iterator';
          } else if (root_1.root.Map) {
            var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
            for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
                exports.$$iterator = key;
                break;
              }
            }
          } else {
            exports.$$iterator = '@@iterator';
          }
        }
      }, {"../util/root": 331}],
      304: [function(require, module, exports) {
        "use strict";
        var root_1 = require('../util/root');
        var Symbol = root_1.root.Symbol;
        exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ? Symbol.for('rxSubscriber') : '@@rxSubscriber';
      }, {"../util/root": 331}],
      305: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var Subscription_1 = require('../Subscription');
        var SubscriptionLoggable_1 = require('./SubscriptionLoggable');
        var applyMixins_1 = require('../util/applyMixins');
        var ColdObservable = (function(_super) {
          __extends(ColdObservable, _super);
          function ColdObservable(messages, scheduler) {
            _super.call(this, function(subscriber) {
              var observable = this;
              var index = observable.logSubscribedFrame();
              subscriber.add(new Subscription_1.Subscription(function() {
                observable.logUnsubscribedFrame(index);
              }));
              observable.scheduleMessages(subscriber);
              return subscriber;
            });
            this.messages = messages;
            this.subscriptions = [];
            this.scheduler = scheduler;
          }
          ColdObservable.prototype.scheduleMessages = function(subscriber) {
            var messagesLength = this.messages.length;
            for (var i = 0; i < messagesLength; i++) {
              var message = this.messages[i];
              subscriber.add(this.scheduler.schedule(function(_a) {
                var message = _a.message,
                    subscriber = _a.subscriber;
                message.notification.observe(subscriber);
              }, message.frame, {
                message: message,
                subscriber: subscriber
              }));
            }
          };
          return ColdObservable;
        }(Observable_1.Observable));
        exports.ColdObservable = ColdObservable;
        applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
      }, {
        "../Observable": 5,
        "../Subscription": 14,
        "../util/applyMixins": 319,
        "./SubscriptionLoggable": 308
      }],
      306: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subject_1 = require('../Subject');
        var Subscription_1 = require('../Subscription');
        var SubscriptionLoggable_1 = require('./SubscriptionLoggable');
        var applyMixins_1 = require('../util/applyMixins');
        var HotObservable = (function(_super) {
          __extends(HotObservable, _super);
          function HotObservable(messages, scheduler) {
            _super.call(this);
            this.messages = messages;
            this.subscriptions = [];
            this.scheduler = scheduler;
          }
          HotObservable.prototype._subscribe = function(subscriber) {
            var subject = this;
            var index = subject.logSubscribedFrame();
            subscriber.add(new Subscription_1.Subscription(function() {
              subject.logUnsubscribedFrame(index);
            }));
            return _super.prototype._subscribe.call(this, subscriber);
          };
          HotObservable.prototype.setup = function() {
            var subject = this;
            var messagesLength = subject.messages.length;
            for (var i = 0; i < messagesLength; i++) {
              (function() {
                var message = subject.messages[i];
                subject.scheduler.schedule(function() {
                  message.notification.observe(subject);
                }, message.frame);
              })();
            }
          };
          return HotObservable;
        }(Subject_1.Subject));
        exports.HotObservable = HotObservable;
        applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
      }, {
        "../Subject": 11,
        "../Subscription": 14,
        "../util/applyMixins": 319,
        "./SubscriptionLoggable": 308
      }],
      307: [function(require, module, exports) {
        "use strict";
        var SubscriptionLog = (function() {
          function SubscriptionLog(subscribedFrame, unsubscribedFrame) {
            if (unsubscribedFrame === void 0) {
              unsubscribedFrame = Number.POSITIVE_INFINITY;
            }
            this.subscribedFrame = subscribedFrame;
            this.unsubscribedFrame = unsubscribedFrame;
          }
          return SubscriptionLog;
        }());
        exports.SubscriptionLog = SubscriptionLog;
      }, {}],
      308: [function(require, module, exports) {
        "use strict";
        var SubscriptionLog_1 = require('./SubscriptionLog');
        var SubscriptionLoggable = (function() {
          function SubscriptionLoggable() {
            this.subscriptions = [];
          }
          SubscriptionLoggable.prototype.logSubscribedFrame = function() {
            this.subscriptions.push(new SubscriptionLog_1.SubscriptionLog(this.scheduler.now()));
            return this.subscriptions.length - 1;
          };
          SubscriptionLoggable.prototype.logUnsubscribedFrame = function(index) {
            var subscriptionLogs = this.subscriptions;
            var oldSubscriptionLog = subscriptionLogs[index];
            subscriptionLogs[index] = new SubscriptionLog_1.SubscriptionLog(oldSubscriptionLog.subscribedFrame, this.scheduler.now());
          };
          return SubscriptionLoggable;
        }());
        exports.SubscriptionLoggable = SubscriptionLoggable;
      }, {"./SubscriptionLog": 307}],
      309: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = require('../Observable');
        var VirtualTimeScheduler_1 = require('../scheduler/VirtualTimeScheduler');
        var Notification_1 = require('../Notification');
        var ColdObservable_1 = require('./ColdObservable');
        var HotObservable_1 = require('./HotObservable');
        var SubscriptionLog_1 = require('./SubscriptionLog');
        var TestScheduler = (function(_super) {
          __extends(TestScheduler, _super);
          function TestScheduler(assertDeepEqual) {
            _super.call(this);
            this.assertDeepEqual = assertDeepEqual;
            this.hotObservables = [];
            this.coldObservables = [];
            this.flushTests = [];
          }
          TestScheduler.prototype.createTime = function(marbles) {
            var indexOf = marbles.indexOf('|');
            if (indexOf === -1) {
              throw new Error('Marble diagram for time should have a completion marker "|"');
            }
            return indexOf * TestScheduler.frameTimeFactor;
          };
          TestScheduler.prototype.createColdObservable = function(marbles, values, error) {
            if (marbles.indexOf('^') !== -1) {
              throw new Error('Cold observable cannot have subscription offset "^"');
            }
            if (marbles.indexOf('!') !== -1) {
              throw new Error('Cold observable cannot have unsubscription marker "!"');
            }
            var messages = TestScheduler.parseMarbles(marbles, values, error);
            var cold = new ColdObservable_1.ColdObservable(messages, this);
            this.coldObservables.push(cold);
            return cold;
          };
          TestScheduler.prototype.createHotObservable = function(marbles, values, error) {
            if (marbles.indexOf('!') !== -1) {
              throw new Error('Hot observable cannot have unsubscription marker "!"');
            }
            var messages = TestScheduler.parseMarbles(marbles, values, error);
            var subject = new HotObservable_1.HotObservable(messages, this);
            this.hotObservables.push(subject);
            return subject;
          };
          TestScheduler.prototype.materializeInnerObservable = function(observable, outerFrame) {
            var _this = this;
            var messages = [];
            observable.subscribe(function(value) {
              messages.push({
                frame: _this.frame - outerFrame,
                notification: Notification_1.Notification.createNext(value)
              });
            }, function(err) {
              messages.push({
                frame: _this.frame - outerFrame,
                notification: Notification_1.Notification.createError(err)
              });
            }, function() {
              messages.push({
                frame: _this.frame - outerFrame,
                notification: Notification_1.Notification.createComplete()
              });
            });
            return messages;
          };
          TestScheduler.prototype.expectObservable = function(observable, unsubscriptionMarbles) {
            var _this = this;
            if (unsubscriptionMarbles === void 0) {
              unsubscriptionMarbles = null;
            }
            var actual = [];
            var flushTest = {
              actual: actual,
              ready: false
            };
            var unsubscriptionFrame = TestScheduler.parseMarblesAsSubscriptions(unsubscriptionMarbles).unsubscribedFrame;
            var subscription;
            this.schedule(function() {
              subscription = observable.subscribe(function(x) {
                var value = x;
                if (x instanceof Observable_1.Observable) {
                  value = _this.materializeInnerObservable(value, _this.frame);
                }
                actual.push({
                  frame: _this.frame,
                  notification: Notification_1.Notification.createNext(value)
                });
              }, function(err) {
                actual.push({
                  frame: _this.frame,
                  notification: Notification_1.Notification.createError(err)
                });
              }, function() {
                actual.push({
                  frame: _this.frame,
                  notification: Notification_1.Notification.createComplete()
                });
              });
            }, 0);
            if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
              this.schedule(function() {
                return subscription.unsubscribe();
              }, unsubscriptionFrame);
            }
            this.flushTests.push(flushTest);
            return {toBe: function(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true);
              }};
          };
          TestScheduler.prototype.expectSubscriptions = function(actualSubscriptionLogs) {
            var flushTest = {
              actual: actualSubscriptionLogs,
              ready: false
            };
            this.flushTests.push(flushTest);
            return {toBe: function(marbles) {
                var marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(function(marbles) {
                  return TestScheduler.parseMarblesAsSubscriptions(marbles);
                });
              }};
          };
          TestScheduler.prototype.flush = function() {
            var hotObservables = this.hotObservables;
            while (hotObservables.length > 0) {
              hotObservables.shift().setup();
            }
            _super.prototype.flush.call(this);
            var readyFlushTests = this.flushTests.filter(function(test) {
              return test.ready;
            });
            while (readyFlushTests.length > 0) {
              var test = readyFlushTests.shift();
              this.assertDeepEqual(test.actual, test.expected);
            }
          };
          TestScheduler.parseMarblesAsSubscriptions = function(marbles) {
            if (typeof marbles !== 'string') {
              return new SubscriptionLog_1.SubscriptionLog(Number.POSITIVE_INFINITY);
            }
            var len = marbles.length;
            var groupStart = -1;
            var subscriptionFrame = Number.POSITIVE_INFINITY;
            var unsubscriptionFrame = Number.POSITIVE_INFINITY;
            for (var i = 0; i < len; i++) {
              var frame = i * this.frameTimeFactor;
              var c = marbles[i];
              switch (c) {
                case '-':
                case ' ':
                  break;
                case '(':
                  groupStart = frame;
                  break;
                case ')':
                  groupStart = -1;
                  break;
                case '^':
                  if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                    throw new Error('Found a second subscription point \'^\' in a ' + 'subscription marble diagram. There can only be one.');
                  }
                  subscriptionFrame = groupStart > -1 ? groupStart : frame;
                  break;
                case '!':
                  if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                    throw new Error('Found a second subscription point \'^\' in a ' + 'subscription marble diagram. There can only be one.');
                  }
                  unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                  break;
                default:
                  throw new Error('There can only be \'^\' and \'!\' markers in a ' + 'subscription marble diagram. Found instead \'' + c + '\'.');
              }
            }
            if (unsubscriptionFrame < 0) {
              return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
            } else {
              return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
            }
          };
          TestScheduler.parseMarbles = function(marbles, values, errorValue, materializeInnerObservables) {
            if (materializeInnerObservables === void 0) {
              materializeInnerObservables = false;
            }
            if (marbles.indexOf('!') !== -1) {
              throw new Error('Conventional marble diagrams cannot have the ' + 'unsubscription marker "!"');
            }
            var len = marbles.length;
            var testMessages = [];
            var subIndex = marbles.indexOf('^');
            var frameOffset = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
            var getValue = typeof values !== 'object' ? function(x) {
              return x;
            } : function(x) {
              if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
                return values[x].messages;
              }
              return values[x];
            };
            var groupStart = -1;
            for (var i = 0; i < len; i++) {
              var frame = i * this.frameTimeFactor + frameOffset;
              var notification = void 0;
              var c = marbles[i];
              switch (c) {
                case '-':
                case ' ':
                  break;
                case '(':
                  groupStart = frame;
                  break;
                case ')':
                  groupStart = -1;
                  break;
                case '|':
                  notification = Notification_1.Notification.createComplete();
                  break;
                case '^':
                  break;
                case '#':
                  notification = Notification_1.Notification.createError(errorValue || 'error');
                  break;
                default:
                  notification = Notification_1.Notification.createNext(getValue(c));
                  break;
              }
              if (notification) {
                testMessages.push({
                  frame: groupStart > -1 ? groupStart : frame,
                  notification: notification
                });
              }
            }
            return testMessages;
          };
          return TestScheduler;
        }(VirtualTimeScheduler_1.VirtualTimeScheduler));
        exports.TestScheduler = TestScheduler;
      }, {
        "../Notification": 4,
        "../Observable": 5,
        "../scheduler/VirtualTimeScheduler": 298,
        "./ColdObservable": 305,
        "./HotObservable": 306,
        "./SubscriptionLog": 307
      }],
      310: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./root');
        var RequestAnimationFrameDefinition = (function() {
          function RequestAnimationFrameDefinition(root) {
            if (root.requestAnimationFrame) {
              this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
              this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
            } else if (root.mozRequestAnimationFrame) {
              this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
              this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
            } else if (root.webkitRequestAnimationFrame) {
              this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
              this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
            } else if (root.msRequestAnimationFrame) {
              this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
              this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
            } else if (root.oRequestAnimationFrame) {
              this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
              this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
            } else {
              this.cancelAnimationFrame = root.clearTimeout.bind(root);
              this.requestAnimationFrame = function(cb) {
                return root.setTimeout(cb, 1000 / 60);
              };
            }
          }
          return RequestAnimationFrameDefinition;
        }());
        exports.RequestAnimationFrameDefinition = RequestAnimationFrameDefinition;
        exports.AnimationFrame = new RequestAnimationFrameDefinition(root_1.root);
      }, {"./root": 331}],
      311: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ArgumentOutOfRangeError = (function(_super) {
          __extends(ArgumentOutOfRangeError, _super);
          function ArgumentOutOfRangeError() {
            var err = _super.call(this, 'argument out of range');
            this.name = err.name = 'ArgumentOutOfRangeError';
            this.stack = err.stack;
            this.message = err.message;
          }
          return ArgumentOutOfRangeError;
        }(Error));
        exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
      }, {}],
      312: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var EmptyError = (function(_super) {
          __extends(EmptyError, _super);
          function EmptyError() {
            var err = _super.call(this, 'no elements in sequence');
            this.name = err.name = 'EmptyError';
            this.stack = err.stack;
            this.message = err.message;
          }
          return EmptyError;
        }(Error));
        exports.EmptyError = EmptyError;
      }, {}],
      313: [function(require, module, exports) {
        "use strict";
        var FastMap = (function() {
          function FastMap() {
            this.values = {};
          }
          FastMap.prototype.delete = function(key) {
            this.values[key] = null;
            return true;
          };
          FastMap.prototype.set = function(key, value) {
            this.values[key] = value;
            return this;
          };
          FastMap.prototype.get = function(key) {
            return this.values[key];
          };
          FastMap.prototype.forEach = function(cb, thisArg) {
            var values = this.values;
            for (var key in values) {
              if (values.hasOwnProperty(key) && values[key] !== null) {
                cb.call(thisArg, values[key], key);
              }
            }
          };
          FastMap.prototype.clear = function() {
            this.values = {};
          };
          return FastMap;
        }());
        exports.FastMap = FastMap;
      }, {}],
      314: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./root');
        var ImmediateDefinition = (function() {
          function ImmediateDefinition(root) {
            this.root = root;
            if (root.setImmediate && typeof root.setImmediate === 'function') {
              this.setImmediate = root.setImmediate.bind(root);
              this.clearImmediate = root.clearImmediate.bind(root);
            } else {
              this.nextHandle = 1;
              this.tasksByHandle = {};
              this.currentlyRunningATask = false;
              if (this.canUseProcessNextTick()) {
                this.setImmediate = this.createProcessNextTickSetImmediate();
              } else if (this.canUsePostMessage()) {
                this.setImmediate = this.createPostMessageSetImmediate();
              } else if (this.canUseMessageChannel()) {
                this.setImmediate = this.createMessageChannelSetImmediate();
              } else if (this.canUseReadyStateChange()) {
                this.setImmediate = this.createReadyStateChangeSetImmediate();
              } else {
                this.setImmediate = this.createSetTimeoutSetImmediate();
              }
              var ci = function clearImmediate(handle) {
                delete clearImmediate.instance.tasksByHandle[handle];
              };
              ci.instance = this;
              this.clearImmediate = ci;
            }
          }
          ImmediateDefinition.prototype.identify = function(o) {
            return this.root.Object.prototype.toString.call(o);
          };
          ImmediateDefinition.prototype.canUseProcessNextTick = function() {
            return this.identify(this.root.process) === '[object process]';
          };
          ImmediateDefinition.prototype.canUseMessageChannel = function() {
            return Boolean(this.root.MessageChannel);
          };
          ImmediateDefinition.prototype.canUseReadyStateChange = function() {
            var document = this.root.document;
            return Boolean(document && 'onreadystatechange' in document.createElement('script'));
          };
          ImmediateDefinition.prototype.canUsePostMessage = function() {
            var root = this.root;
            if (root.postMessage && !root.importScripts) {
              var postMessageIsAsynchronous_1 = true;
              var oldOnMessage = root.onmessage;
              root.onmessage = function() {
                postMessageIsAsynchronous_1 = false;
              };
              root.postMessage('', '*');
              root.onmessage = oldOnMessage;
              return postMessageIsAsynchronous_1;
            }
            return false;
          };
          ImmediateDefinition.prototype.partiallyApplied = function(handler) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
            }
            var fn = function result() {
              var _a = result,
                  handler = _a.handler,
                  args = _a.args;
              if (typeof handler === 'function') {
                handler.apply(undefined, args);
              } else {
                (new Function('' + handler))();
              }
            };
            fn.handler = handler;
            fn.args = args;
            return fn;
          };
          ImmediateDefinition.prototype.addFromSetImmediateArguments = function(args) {
            this.tasksByHandle[this.nextHandle] = this.partiallyApplied.apply(undefined, args);
            return this.nextHandle++;
          };
          ImmediateDefinition.prototype.createProcessNextTickSetImmediate = function() {
            var fn = function setImmediate() {
              var instance = setImmediate.instance;
              var handle = instance.addFromSetImmediateArguments(arguments);
              instance.root.process.nextTick(instance.partiallyApplied(instance.runIfPresent, handle));
              return handle;
            };
            fn.instance = this;
            return fn;
          };
          ImmediateDefinition.prototype.createPostMessageSetImmediate = function() {
            var root = this.root;
            var messagePrefix = 'setImmediate$' + root.Math.random() + '$';
            var onGlobalMessage = function globalMessageHandler(event) {
              var instance = globalMessageHandler.instance;
              if (event.source === root && typeof event.data === 'string' && event.data.indexOf(messagePrefix) === 0) {
                instance.runIfPresent(+event.data.slice(messagePrefix.length));
              }
            };
            onGlobalMessage.instance = this;
            root.addEventListener('message', onGlobalMessage, false);
            var fn = function setImmediate() {
              var _a = setImmediate,
                  messagePrefix = _a.messagePrefix,
                  instance = _a.instance;
              var handle = instance.addFromSetImmediateArguments(arguments);
              instance.root.postMessage(messagePrefix + handle, '*');
              return handle;
            };
            fn.instance = this;
            fn.messagePrefix = messagePrefix;
            return fn;
          };
          ImmediateDefinition.prototype.runIfPresent = function(handle) {
            if (this.currentlyRunningATask) {
              this.root.setTimeout(this.partiallyApplied(this.runIfPresent, handle), 0);
            } else {
              var task = this.tasksByHandle[handle];
              if (task) {
                this.currentlyRunningATask = true;
                try {
                  task();
                } finally {
                  this.clearImmediate(handle);
                  this.currentlyRunningATask = false;
                }
              }
            }
          };
          ImmediateDefinition.prototype.createMessageChannelSetImmediate = function() {
            var _this = this;
            var channel = new this.root.MessageChannel();
            channel.port1.onmessage = function(event) {
              var handle = event.data;
              _this.runIfPresent(handle);
            };
            var fn = function setImmediate() {
              var _a = setImmediate,
                  channel = _a.channel,
                  instance = _a.instance;
              var handle = instance.addFromSetImmediateArguments(arguments);
              channel.port2.postMessage(handle);
              return handle;
            };
            fn.channel = channel;
            fn.instance = this;
            return fn;
          };
          ImmediateDefinition.prototype.createReadyStateChangeSetImmediate = function() {
            var fn = function setImmediate() {
              var instance = setImmediate.instance;
              var root = instance.root;
              var doc = root.document;
              var html = doc.documentElement;
              var handle = instance.addFromSetImmediateArguments(arguments);
              var script = doc.createElement('script');
              script.onreadystatechange = function() {
                instance.runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
              };
              html.appendChild(script);
              return handle;
            };
            fn.instance = this;
            return fn;
          };
          ImmediateDefinition.prototype.createSetTimeoutSetImmediate = function() {
            var fn = function setImmediate() {
              var instance = setImmediate.instance;
              var handle = instance.addFromSetImmediateArguments(arguments);
              instance.root.setTimeout(instance.partiallyApplied(instance.runIfPresent, handle), 0);
              return handle;
            };
            fn.instance = this;
            return fn;
          };
          return ImmediateDefinition;
        }());
        exports.ImmediateDefinition = ImmediateDefinition;
        exports.Immediate = new ImmediateDefinition(root_1.root);
      }, {"./root": 331}],
      315: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./root');
        var MapPolyfill_1 = require('./MapPolyfill');
        exports.Map = root_1.root.Map || (function() {
          return MapPolyfill_1.MapPolyfill;
        })();
      }, {
        "./MapPolyfill": 316,
        "./root": 331
      }],
      316: [function(require, module, exports) {
        "use strict";
        var MapPolyfill = (function() {
          function MapPolyfill() {
            this.size = 0;
            this._values = [];
            this._keys = [];
          }
          MapPolyfill.prototype.get = function(key) {
            var i = this._keys.indexOf(key);
            return i === -1 ? undefined : this._values[i];
          };
          MapPolyfill.prototype.set = function(key, value) {
            var i = this._keys.indexOf(key);
            if (i === -1) {
              this._keys.push(key);
              this._values.push(value);
              this.size++;
            } else {
              this._values[i] = value;
            }
            return this;
          };
          MapPolyfill.prototype.delete = function(key) {
            var i = this._keys.indexOf(key);
            if (i === -1) {
              return false;
            }
            this._values.splice(i, 1);
            this._keys.splice(i, 1);
            this.size--;
            return true;
          };
          MapPolyfill.prototype.clear = function() {
            this._keys.length = 0;
            this._values.length = 0;
            this.size = 0;
          };
          MapPolyfill.prototype.forEach = function(cb, thisArg) {
            for (var i = 0; i < this.size; i++) {
              cb.call(thisArg, this._values[i], this._keys[i]);
            }
          };
          return MapPolyfill;
        }());
        exports.MapPolyfill = MapPolyfill;
      }, {}],
      317: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ObjectUnsubscribedError = (function(_super) {
          __extends(ObjectUnsubscribedError, _super);
          function ObjectUnsubscribedError() {
            var err = _super.call(this, 'object unsubscribed');
            this.name = err.name = 'ObjectUnsubscribedError';
            this.stack = err.stack;
            this.message = err.message;
          }
          return ObjectUnsubscribedError;
        }(Error));
        exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
      }, {}],
      318: [function(require, module, exports) {
        "use strict";
        var __extends = (this && this.__extends) || function(d, b) {
          for (var p in b)
            if (b.hasOwnProperty(p))
              d[p] = b[p];
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var UnsubscriptionError = (function(_super) {
          __extends(UnsubscriptionError, _super);
          function UnsubscriptionError(errors) {
            _super.call(this);
            this.errors = errors;
            var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function(err, i) {
              return ((i + 1) + ") " + err.toString());
            }).join('\n  ') : '');
            this.name = err.name = 'UnsubscriptionError';
            this.stack = err.stack;
            this.message = err.message;
          }
          return UnsubscriptionError;
        }(Error));
        exports.UnsubscriptionError = UnsubscriptionError;
      }, {}],
      319: [function(require, module, exports) {
        "use strict";
        function applyMixins(derivedCtor, baseCtors) {
          for (var i = 0,
              len = baseCtors.length; i < len; i++) {
            var baseCtor = baseCtors[i];
            var propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
            for (var j = 0,
                len2 = propertyKeys.length; j < len2; j++) {
              var name_1 = propertyKeys[j];
              derivedCtor.prototype[name_1] = baseCtor.prototype[name_1];
            }
          }
        }
        exports.applyMixins = applyMixins;
      }, {}],
      320: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./root');
        var Object = root_1.root.Object;
        if (typeof Object.assign != 'function') {
          (function() {
            Object.assign = function assignPolyfill(target) {
              var sources = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
              }
              if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
              }
              var output = Object(target);
              var len = sources.length;
              for (var index = 0; index < len; index++) {
                var source = sources[index];
                if (source !== undefined && source !== null) {
                  for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                      output[key] = source[key];
                    }
                  }
                }
              }
              return output;
            };
          })();
        }
        exports.assign = Object.assign;
      }, {"./root": 331}],
      321: [function(require, module, exports) {
        "use strict";
        exports.errorObject = {e: {}};
      }, {}],
      322: [function(require, module, exports) {
        "use strict";
        exports.isArray = Array.isArray || (function(x) {
          return x && typeof x.length === 'number';
        });
      }, {}],
      323: [function(require, module, exports) {
        "use strict";
        function isDate(value) {
          return value instanceof Date && !isNaN(+value);
        }
        exports.isDate = isDate;
      }, {}],
      324: [function(require, module, exports) {
        "use strict";
        function isFunction(x) {
          return typeof x === 'function';
        }
        exports.isFunction = isFunction;
      }, {}],
      325: [function(require, module, exports) {
        "use strict";
        var isArray_1 = require('../util/isArray');
        function isNumeric(val) {
          return !isArray_1.isArray(val) && (val - parseFloat(val) + 1) >= 0;
        }
        exports.isNumeric = isNumeric;
        ;
      }, {"../util/isArray": 322}],
      326: [function(require, module, exports) {
        "use strict";
        function isObject(x) {
          return x != null && typeof x === 'object';
        }
        exports.isObject = isObject;
      }, {}],
      327: [function(require, module, exports) {
        "use strict";
        function isPromise(value) {
          return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
        }
        exports.isPromise = isPromise;
      }, {}],
      328: [function(require, module, exports) {
        "use strict";
        function isScheduler(value) {
          return value && typeof value.schedule === 'function';
        }
        exports.isScheduler = isScheduler;
      }, {}],
      329: [function(require, module, exports) {
        "use strict";
        function noop() {}
        exports.noop = noop;
      }, {}],
      330: [function(require, module, exports) {
        "use strict";
        function not(pred, thisArg) {
          function notPred() {
            return !(notPred.pred.apply(notPred.thisArg, arguments));
          }
          notPred.pred = pred;
          notPred.thisArg = thisArg;
          return notPred;
        }
        exports.not = not;
      }, {}],
      331: [function(require, module, exports) {
        (function(global) {
          "use strict";
          var objectTypes = {
            'boolean': false,
            'function': true,
            'object': true,
            'number': false,
            'string': false,
            'undefined': false
          };
          exports.root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
          var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
          var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
          var freeGlobal = objectTypes[typeof global] && global;
          if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
            exports.root = freeGlobal;
          }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}],
      332: [function(require, module, exports) {
        "use strict";
        var root_1 = require('./root');
        var isArray_1 = require('./isArray');
        var isPromise_1 = require('./isPromise');
        var Observable_1 = require('../Observable');
        var iterator_1 = require('../symbol/iterator');
        var InnerSubscriber_1 = require('../InnerSubscriber');
        var symbol_observable_1 = require('symbol-observable');
        function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
          var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
          if (destination.isUnsubscribed) {
            return;
          }
          if (result instanceof Observable_1.Observable) {
            if (result._isScalar) {
              destination.next(result.value);
              destination.complete();
              return;
            } else {
              return result.subscribe(destination);
            }
          }
          if (isArray_1.isArray(result)) {
            for (var i = 0,
                len = result.length; i < len && !destination.isUnsubscribed; i++) {
              destination.next(result[i]);
            }
            if (!destination.isUnsubscribed) {
              destination.complete();
            }
          } else if (isPromise_1.isPromise(result)) {
            result.then(function(value) {
              if (!destination.isUnsubscribed) {
                destination.next(value);
                destination.complete();
              }
            }, function(err) {
              return destination.error(err);
            }).then(null, function(err) {
              root_1.root.setTimeout(function() {
                throw err;
              });
            });
            return destination;
          } else if (typeof result[iterator_1.$$iterator] === 'function') {
            for (var _i = 0,
                _a = result; _i < _a.length; _i++) {
              var item = _a[_i];
              destination.next(item);
              if (destination.isUnsubscribed) {
                break;
              }
            }
            if (!destination.isUnsubscribed) {
              destination.complete();
            }
          } else if (typeof result[symbol_observable_1.default] === 'function') {
            var obs = result[symbol_observable_1.default]();
            if (typeof obs.subscribe !== 'function') {
              destination.error('invalid observable');
            } else {
              return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
            }
          } else {
            destination.error(new TypeError('unknown type returned'));
          }
        }
        exports.subscribeToResult = subscribeToResult;
      }, {
        "../InnerSubscriber": 3,
        "../Observable": 5,
        "../symbol/iterator": 303,
        "./isArray": 322,
        "./isPromise": 327,
        "./root": 331,
        "symbol-observable": 336
      }],
      333: [function(require, module, exports) {
        "use strict";
        function throwError(e) {
          throw e;
        }
        exports.throwError = throwError;
      }, {}],
      334: [function(require, module, exports) {
        "use strict";
        var Subscriber_1 = require('../Subscriber');
        var rxSubscriber_1 = require('../symbol/rxSubscriber');
        function toSubscriber(nextOrObserver, error, complete) {
          if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber_1.Subscriber) {
              return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
              return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
            }
          }
          if (!nextOrObserver && !error && !complete) {
            return new Subscriber_1.Subscriber();
          }
          return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
        }
        exports.toSubscriber = toSubscriber;
      }, {
        "../Subscriber": 13,
        "../symbol/rxSubscriber": 304
      }],
      335: [function(require, module, exports) {
        "use strict";
        var errorObject_1 = require('./errorObject');
        var tryCatchTarget;
        function tryCatcher() {
          try {
            return tryCatchTarget.apply(this, arguments);
          } catch (e) {
            errorObject_1.errorObject.e = e;
            return errorObject_1.errorObject;
          }
        }
        function tryCatch(fn) {
          tryCatchTarget = fn;
          return tryCatcher;
        }
        exports.tryCatch = tryCatch;
        ;
      }, {"./errorObject": 321}],
      336: [function(require, module, exports) {
        module.exports = require('./lib/index');
      }, {"./lib/index": 337}],
      337: [function(require, module, exports) {
        (function(global) {
          'use strict';
          Object.defineProperty(exports, "__esModule", {value: true});
          var _ponyfill = require('./ponyfill');
          var _ponyfill2 = _interopRequireDefault(_ponyfill);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {default: obj};
          }
          var root = undefined;
          if (typeof global !== 'undefined') {
            root = global;
          } else if (typeof window !== 'undefined') {
            root = window;
          }
          var result = (0, _ponyfill2.default)(root);
          exports.default = result;
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {"./ponyfill": 338}],
      338: [function(require, module, exports) {
        'use strict';
        Object.defineProperty(exports, "__esModule", {value: true});
        exports.default = symbolObservablePonyfill;
        function symbolObservablePonyfill(root) {
          var result;
          var _Symbol = root.Symbol;
          if (typeof _Symbol === 'function') {
            if (_Symbol.observable) {
              result = _Symbol.observable;
            } else {
              result = _Symbol('observable');
              _Symbol.observable = result;
            }
          } else {
            result = '@@observable';
          }
          return result;
        }
        ;
      }, {}]
    }, {}, [10])(10);
  });
})(require('buffer').Buffer, require('process'));
