import Link from 'next/link';

export default function Navigation() {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #ddd'
    }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '2rem',
        margin: 0,
        padding: 0
      }}>
        <li>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#0066cc' }}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/jobs" style={{ textDecoration: 'none', color: '#0066cc' }}>
            Jobs
          </Link>
        </li>
        <li>
          <Link href="/candidates" style={{ textDecoration: 'none', color: '#0066cc' }}>
            Candidates
          </Link>
        </li>
        <li>
          <Link href="/reports" style={{ textDecoration: 'none', color: '#0066cc' }}>
            Reports
          </Link>
        </li>
        <li>
          <Link href="/settings" style={{ textDecoration: 'none', color: '#0066cc' }}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
