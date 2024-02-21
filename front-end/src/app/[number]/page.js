import styles from '../styles/page.module.css';

import { redirect } from "next/navigation";

export default function Page({ params }) {

  if (isNaN(params.number) || params.number <= 0) {
    redirect("/")
  }

  

  return (
    <div className={`${styles.centerContent} ${styles.fullSize}`}>
      <div className={`${styles.centerContent} ${styles.box}`}>
        <p>Number: {params.number}</p>
      </div>
    </div>
  )
}