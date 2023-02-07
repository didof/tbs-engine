export type Nullable<T> = T | null | undefined

export type Immutable<T> = {
    readonly [K in keyof T]: Immutable<T[K]>
}

export type Merge<T, V> = Omit<T, Extract<keyof T, keyof V>> & V;