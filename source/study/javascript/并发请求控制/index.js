class Scheduler {
  constructor(max = 2) {
    this.max = max;
    this.queue = [];
    this.count = 0;
  }
  addTask(time, func) {
    const task = () => new Promise(resolve => setTimeout(func, time));
    this.queue.push(task);
  }
  start() {
    for (let i = 0; i < this.max; i++) {
      this.task();
    }
  }

  task() {
    if (!this.queue || !this.queue.length || this.count >= this.max) return;
    this.count++;
    const currentTask = this.queue.shift();
    currentTask().then(() => {
      this.count--;
      this.task();
    });
  }
}