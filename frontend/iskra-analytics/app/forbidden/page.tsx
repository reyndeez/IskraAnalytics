export default function ForbiddenPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Недостаточно прав</h1>
            <p>У вас нет доступа к этой странице.</p>
            <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>На главную</a>
        </div>
  );
}
