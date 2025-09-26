// src/services/queue.ts
type Task<T> = () => Promise<T>;

class RequestQueue {
  private queue: Task<any>[] = [];
  private isProcessing = false;

  add<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve).catch(reject));
      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    this.isProcessing = true;

    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } catch (error) {
        console.error('Task failed in queue:', error);
      } finally {
        const delay = 300 + Math.random() * 700; // Random delay between 300ms and 1000ms
        setTimeout(() => {
          this.isProcessing = false;
          this.process();
        }, delay);
      }
    }
  }
}

export const apiQueue = new RequestQueue();