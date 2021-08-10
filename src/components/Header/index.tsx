import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div>
        <img src="/Logo.svg" alt="Logo" />
      </div>
    </header>
  );
}
