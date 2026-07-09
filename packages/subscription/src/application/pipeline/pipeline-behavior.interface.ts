export interface IPipelineBehavior<TRequest, TResult> {
  handle(request: TRequest, next: () => Promise<TResult>): Promise<TResult>;
}
