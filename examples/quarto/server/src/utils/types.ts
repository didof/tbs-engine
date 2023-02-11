export type Go<T, E = Error> = [err: E, res: null] | [err: null, res: T]
