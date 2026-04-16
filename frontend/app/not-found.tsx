// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '200px' }}>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрашиваемая страница не существует.</p>
      <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Вернуться на главную
      </Link>
    </div>
  )
}
