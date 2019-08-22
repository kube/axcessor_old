
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import {
  Nor,
  IsTrue,
  IsFalse,
  IsNullable,
  Prepend,
  Reverse
} from 'typebolt'

// Private
// Should never be accessed at runtime
// Only used statically
const ACCESSOR_ROOT = Symbol()
const ORIGINAL_TYPE = Symbol()
const SAFE_ACCESS = Symbol()
const ACCESSOR_CHAIN = Symbol()

export type AccessorChain = (string | number | symbol)[]
export type AccessorFunction<
  Root = any,
  Target extends Wrapped<any> = Wrapped<any>
> = (root: Wrapped<Root>) => Target
export type SafeAccessorFunction<
  Root = any,
  Target extends Wrapped<any, Root, true> = Wrapped<any, Root, true>
> = (root: Wrapped<Root>) => Target

export type Wrapped<
  T,
  Root = T,
  SafeAccess extends boolean = true,
  ParentNullable extends boolean = false,
  CurrentAccessorChain extends AccessorChain = []
> = (T extends object
  ? {
      [K in keyof T]-?: Wrapped<
        T[K],
        Root,
        Nor<IsFalse<SafeAccess>, IsTrue<ParentNullable>>,
        IsNullable<T[K]>,
        Prepend<K, CurrentAccessorChain>
      >
    }
  : T) & {
    [ORIGINAL_TYPE]: T
    [ACCESSOR_ROOT]: Root,
  [SAFE_ACCESS]: SafeAccess
  [ACCESSOR_CHAIN]: CurrentAccessorChain
}

export type Unwrap<W extends Wrapped<any>> = W[typeof ORIGINAL_TYPE]

export type HasSafeAccess<
  N extends Wrapped<any>
> = N[typeof SAFE_ACCESS] extends true ? true : false

export type GetAccessorChain<N extends Wrapped<any>> = Reverse<
  N[typeof ACCESSOR_CHAIN]
>

export type GetAccessorTarget<
  A extends AccessorFunction
> = A extends AccessorFunction<any, infer Target>
  ? Target
  : never

// export type Get
