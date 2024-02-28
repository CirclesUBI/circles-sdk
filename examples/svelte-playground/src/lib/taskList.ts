import { get, readable, type Readable } from 'svelte/store';

export type TaskListState = 'idle' | 'working';
export type TaskState = 'pending' | 'completed' | 'failed';
export type Task<TResult> = {
  id: number;
  state: TaskState;
  title: string;
  href?: string;
  result: TResult | Error | undefined;
};

export class TaskList {
  private nextId: number = 1;

  public readonly actions: Readable<ReadonlyArray<Task<unknown>>>;
  private updateActions?: (actions: ReadonlyArray<Task<unknown>>) => void;
  private actionsArray: Task<unknown>[] = [];

  public readonly state: Readable<TaskListState>;
  private updateState?: (state: TaskListState) => void;

  private readonly subscribers: Record<number, ((task: Task<unknown>) => void)[]> = {};

  constructor() {
    this.actions = readable(<ReadonlyArray<Task<unknown>>>[], set => {
      this.updateActions = set;
    });
    this.state = readable(<TaskListState>'idle', set => {
      this.updateState = set;
    });
  }

  /**
   * Executes a new task and adds it to the list of tasks.
   * @param action The action to execute.
   * @param title The title of the task.
   * @param href The URL from which the task was triggered (allows to take the user back to the place where the action was triggered, e.g. to retry).
   */
  execute<TResult>(
    action: () => Promise<TResult>
    , title: string
    , href?: string): number {
    const actionId = this.nextId++;

    if (!this.updateActions || !this.updateState) {
      throw new Error('TaskList not initialized');
    }

    this.actionsArray = [...this.actionsArray, <Task<TResult>>{
      id: actionId,
      title: title,
      href: href,
      state: 'pending'
    }];
    this.updateActions(this.actionsArray);
    this.updateState('working');

    action()
      .then(result => {
        this.actionsArray = this.actionsArray.map(a =>
          a.id === actionId
            ? { ...a, state: 'completed', result: result }
            : a);

        this.notifySubscribers(actionId);
      })
      .catch(error => {
        this.actionsArray = this.actionsArray.map(a =>
          a.id === actionId
            ? {
              ...a,
              state: 'failed',
              result: error
            }
            : a);

        this.notifySubscribers(actionId);
      })
      .finally(() => {
        const allCompletedOrFailed = this.actionsArray.every(a => a.state === 'completed' || a.state === 'failed');
        const newState = allCompletedOrFailed ? 'idle' : 'working';
        if (get(this.state) !== newState && this.updateState) {
          this.updateState(newState);
        }
      });

    return actionId;
  }

  removeCompletedOrFailedTasks() {
    this.actionsArray = this.actionsArray.filter(a => a.state === 'pending');
    if (!this.updateActions) {
      throw new Error('TaskList not initialized');
    }
    this.updateActions(this.actionsArray);
  }

  /**
   * Subscribes to a task.
   * @param taskId The ID of the task to subscribe to.
   * @param callback The callback to call when the task finished or failed.
   */
  subscribeToTask(taskId: number, callback: (task: Task<unknown>) => void) {
    if (!this.subscribers[taskId]) {
      this.subscribers[taskId] = [];
    }
    this.subscribers[taskId].push(callback);
  }

  private notifySubscribers(taskId: number) {
    const task = this.actionsArray.find(a => a.id === taskId);
    if (task && this.subscribers[taskId]) {
      this.subscribers[taskId].forEach(callback => callback(task));
      delete this.subscribers[taskId];
    }
  }
}