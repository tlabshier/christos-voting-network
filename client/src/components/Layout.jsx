import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Issues' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div className={`layout-header-inner ${styles.headerInner}`}>
          <Link to="/" className={`layout-logo ${styles.logo}`}>
            Christos <span className={styles.logoAccent}>Voting Network</span>
          </Link>
          <nav className={`layout-nav ${styles.nav}`}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink}${location.pathname === item.path ? ` ${styles.navLinkActive}` : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <div className="container">
          {children}
        </div>
      </main>
      <footer className={styles.footer}>
        Christos Voting Network
      </footer>
    </>
  );
}
