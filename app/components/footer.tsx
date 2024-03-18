import styles from '../modulestyles/footer.module.css'

export default function Footer() {
    return <footer>
        <a href="https://www.framer.com/motion/" target="_blank" rel="noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="2 8 16 24"
            width="16"
            height="24"
          >
            <path
              d="M 10 32 L 10 24 L 18 24 L 2 8 L 18 8 L 18 16 L 2 16 L 2 24 L 10 32 L 10 24 L 2 24"
              fill="var(--accent)"
            ></path>
          </svg>
        </a>
        <a href="williamqm.com" target="_blank" rel="noreferrer">
        <code>Quiz-Gen</code>
        </a>
  </footer>
}