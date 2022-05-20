class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    this.state = MyPromise.PENDING; // 初始化状态为pedding pending || fullfilled || rejected
    this.value = undefined; // 成功的值
    this.reason = undefined; // 失败的原因
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调

    let resolve = value => {
      // 只有当前状态为pending时调用resolve才会变成fulfilled
      if (this.state === MyPromise.PENDING) {
        // resolve的值要在resolve后面的代码后执行，例如
        // setTimeout(() => {
        //   resolve(1)
        //   console.log(2)
        // })
        setTimeout(() => {
          this.state = MyPromise.FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach(onFulfilled => {
            onFulfilled(value);
          });
        });
      }
    };

    let reject = reason => {
      // 只有当前状态为pending时调用reject才会变成rejected
      if (this.state === MyPromise.PENDING) {
        setTimeout(() => {
          this.state = MyPromise.REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.forEach(onRejected => {
            onRejected(reason);
          });
        });
      }
    };
    // executor执行失败直接调用reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 如果不是函数就返回value
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // 如果不是函数就返回reason
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };
    // then方法必须返回一个新的promise
    const newPromise = new MyPromise((resolve, reject) => {
      // 当为pending状态时先保存两个执行的函数
      if (this.state === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      // 状态为fulffilled执行onFulfilled，并传入成功的值
      if (this.state === MyPromise.FULFILLED) {
        setTimeout(() => {
          try {
            // 如果onFulfilled返回一个值x时 调用resolvePromise方法
            const x = onFulfilled(this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            // 捕获前面onFulfilled中抛出的异常
            reject(error);
          }
        });
      }

      // 状态为rejected执行onRejected，并传入失败的原因
      if (this.state === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
    return newPromise;
  }

  static resolve(value) {
    // 如果这个值是一个 promise ，那么将返回这个 promise
    if (value instanceof MyPromise) {
      return value;
    }
    // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
    if (value instanceof Object && 'then' in value) {
      return new MyPromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    }
    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new MyPromise(resolve => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // 无论promise是成功还是失败都执行callback
  finally(callback) {
    return this.then(callback, callback);
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        const result = [];
        let count = 0;
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((promise, index) => {
          MyPromise.resolve(promise).then(
            value => {
              count++;
              result[index] = value;
              count === promises.length && resolve(result);
            },
            reason => {
              reject(reason);
            }
          );
        });
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        const result = [];
        let count = 0;
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((promise, index) => {
          MyPromise.resolve(promise).then(
            value => {
              count++;
              result[index] = { value, status: promise.state };
              count === promises.length && resolve(result);
            },
            reason => {
              count++;
              result[index] = { reason, status: promise.state };
              count === promises.length && resolve(result);
            }
          );
        });
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (Array.isArray(promises)) {
        // 如果传入的promises是空的，则返回的promise永远是等待状态
        if (promises.length > 0) {
          promises.forEach(promise => {
            MyPromise.resolve(promise).then(resolve, reject);
          });
        }
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    });
  }
}

/**
+ * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
+ * @param  {promise} newPromise promise1.then方法返回的新的promise对象
+ * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
+ * @param  {[type]} resolve   newPromise的resolve方法
+ * @param  {[type]} reject    newPromise的reject方法
+ */
function resolvePromise(newPromise, x, resolve, reject) {
  // 如果从onFulfilled或onRejected中返回的 x 就是newPromise，会导致循环引用报错
  if (x === newPromise) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // 2.3.2 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
  if (x instanceof MyPromise) {
    if (x.state === MyPromise.PENDING) {
      /**
       * 2.3.2.1 如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
       *         注意"直至 x 被执行或拒绝"这句话，
       *         这句话的意思是：x 被执行x，如果执行的时候拿到一个y，还要继续解析y
       */
      x.then(y => {
        resolvePromise(newPromise, y, resolve, reject);
      }, reject);
    } else if (x.state === MyPromise.FULFILLED) {
      // 2.3.2.2 如果 x 处于执行态，用相同的值执行 promise
      resolve(x.state);
    } else if (x.state === MyPromise.REJECTED) {
      // 2.3.2.3 如果 x 处于拒绝态，用相同的据因拒绝 promise
      reject(x.reason);
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // 2.3.3 如果 x 为对象或函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      var then = x.then;
    } catch (error) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      reject(error);
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === 'function') {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called = false; // 避免多次调用
      try {
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            if (called) return;
            called = true;
            resolvePromise(newPromise, y, resolve, reject);
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return;
        called = true;

        /**
         * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
         */
        reject(error);
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}
