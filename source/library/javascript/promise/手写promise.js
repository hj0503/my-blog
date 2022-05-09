class TestPromise {
  constructor(executor) {
    // 初始化状态为pedding
    this.state = 'pending'; // pending || fullfilled || rejected
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    let resolve = value => {
      // 只有当前状态为pending时调用resolve才会变成fulfilled
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
      }
    };
    let reject = reason => {
      // 只有当前状态为pending时调用reject才会变成rejected
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
      }
    };
    // executor执行失败直接调用reject
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }

  // then 方法 有两个参数onFulfilled onRejected
  then(onFulfilled, onRejected) {
    // 状态为fulffilled执行onFulfilled，并传入成功的值
    if (this.state === 'fulfilled') {
      typeof onFulfilled === 'function' && onFulfilled(this.value)
    }
    // 状态为rejected执行onRejected，并传入失败的原因
    if (this.state === 'rejected') {
      typeof onRejected === 'function' && onRejected(this.reason)
    }
  }
}
