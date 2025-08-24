import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (classname utility)', () => {
  it('結合された複数のクラス名を返す', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('条件付きクラス名を処理する', () => {
    const result = cn('base', {
      'active': true,
      'disabled': false,
    })
    expect(result).toBe('base active')
  })

  it('undefined と null を無視する', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toBe('base end')
  })

  it('Tailwind CSS の競合するクラスをマージする', () => {
    const result = cn('px-4', 'px-8')
    expect(result).toBe('px-8')
  })

  it('複雑なクラス名の組み合わせを処理する', () => {
    const result = cn(
      'text-base',
      'font-medium',
      {
        'text-red-500': true,
        'bg-blue-500': false,
      },
      'hover:bg-gray-100'
    )
    expect(result).toBe('text-base font-medium text-red-500 hover:bg-gray-100')
  })
})