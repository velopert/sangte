import { shallowEqual } from '../shallowEqual'

describe('shallowEqual', () => {
  it('returns true if comparing same object', () => {
    const obj = { a: 1, b: 2 }
    expect(shallowEqual(obj, obj)).toBe(true)
  })
  it('returns true if they are shallowly equal', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }
    expect(shallowEqual(obj1, obj2)).toBe(true)
  })
  it('returns false if they are shallowly different', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }
    expect(shallowEqual(obj1, obj2)).toBe(false)
  })
  it('returns true when arrays are shallowly equal', () => {
    const arr1 = [1, 2]
    const arr2 = [1, 2]
    expect(shallowEqual(arr1, arr2)).toBe(true)
  })
  it('returns false when arrays are shallowly different', () => {
    const arr1 = [1, 2]
    const arr2 = [1, 5]
    expect(shallowEqual(arr1, arr2)).toBe(false)
  })
})
