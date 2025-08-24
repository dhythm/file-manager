import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button コンポーネント', () => {
  it('デフォルトのボタンをレンダリングする', () => {
    render(<Button>クリック</Button>)
    const button = screen.getByRole('button', { name: 'クリック' })
    expect(button).toBeInTheDocument()
  })

  it('異なるバリアントを適用する', () => {
    const { rerender } = render(<Button variant="destructive">削除</Button>)
    let button = screen.getByRole('button', { name: '削除' })
    expect(button).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">アウトライン</Button>)
    button = screen.getByRole('button', { name: 'アウトライン' })
    expect(button).toHaveClass('border')
  })

  it('異なるサイズを適用する', () => {
    const { rerender } = render(<Button size="sm">小</Button>)
    let button = screen.getByRole('button', { name: '小' })
    expect(button).toHaveClass('h-8')

    rerender(<Button size="lg">大</Button>)
    button = screen.getByRole('button', { name: '大' })
    expect(button).toHaveClass('h-10')
  })

  it('無効状態を処理する', () => {
    render(<Button disabled>無効なボタン</Button>)
    const button = screen.getByRole('button', { name: '無効なボタン' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('disabled')
  })

  it('クリックイベントを処理する', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>クリックテスト</Button>)
    
    const button = screen.getByRole('button', { name: 'クリックテスト' })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('asChild プロパティでカスタム要素をレンダリングする', () => {
    render(
      <Button asChild>
        <a href="/test">リンクボタン</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'リンクボタン' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('追加のクラス名を適用する', () => {
    render(<Button className="custom-class">カスタム</Button>)
    const button = screen.getByRole('button', { name: 'カスタム' })
    expect(button).toHaveClass('custom-class')
  })
})