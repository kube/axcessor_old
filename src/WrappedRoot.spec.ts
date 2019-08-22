
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { Assert, IsType, IsExactType } from 'typebolt'
import {
  Wrapped,
  Unwrap,
  HasSafeAccess,
  GetAccessorChain,
  SafeAccessorFunction,
  GetAccessorTarget
} from './WrappedRoot'

describe('sets object optional properties as required', () => {
  test('on first level', () => {
    type Root = { a?: 42 }
    type R = Wrapped<Root>

    Assert<IsType<Root['a'], 42 | undefined>>()
    Assert<IsType<42, R['a']>>()
  })

  test('on nested levels', () => {
    type Root = {
      a?: { b?: { c?: { d?: 42 } } }
    }
    type R = Wrapped<Root>

    Assert<IsType<42, R['a']['b']['c']['d']>>()
  })
})

test('exposes SafeAccess flag', () => {
  type Root = {
    a1: { b: { c?: { d: 42 } } }
    a2?: { b?: { c: { d: 42 } } }
  }
  type R = Wrapped<Root>

  Assert.True<HasSafeAccess<R['a1']['b']>>()
  // R.a1.b.c can be safely accessed as only target can be undefined
  Assert.True<HasSafeAccess<R['a1']['b']['c']>>()
  // R.a2 can be safely accessed as only target can be undefined
  Assert.True<HasSafeAccess<R['a2']>>()

  Assert.False<HasSafeAccess<R['a1']['b']['c']['d']>>()
  Assert.False<HasSafeAccess<R['a2']['b']['c']['d']>>()
})

test('exposes AccessorChain', () => {
  type Root = {
    a1: { b: { c?: { d: 42 } } }
  }
  type R = Wrapped<Root>

  {
    type Accessor = GetAccessorChain<R['a1']>
    Assert<IsExactType<Accessor, ['a1']>>()
  }
  {
    type Accessor = GetAccessorChain<R['a1']['b']>
    Assert<IsExactType<Accessor, ['a1', 'b']>>()
  }
  {
    type Accessor = GetAccessorChain<R['a1']['b']['c']>
    Assert<IsExactType<Accessor, ['a1', 'b', 'c']>>()
  }
  {
    type Accessor = GetAccessorChain<R['a1']['b']['c']['d']>
    Assert<IsExactType<Accessor, ['a1', 'b', 'c', 'd']>>()
  }
})

//
//
// TODO STARTS HERE
//
//

declare function get<R, A extends SafeAccessorFunction<R>>(
  root: R,
  accessor: A
): GetAccessorTarget<A>

type Root = {
  a1: { b: { c?: { d: 42 } } }
}

declare const root: Root

test('runtime', () => {
  const target = get(root, _ => _.a1.b)
  target
})
