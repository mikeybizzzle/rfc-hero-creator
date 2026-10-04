import Image from "next/image";
import chiHippie from "@/public/images/chi-hippie.png";
import styles from "./page.module.css";

export default function ChiHippiePage() {
  return (
    <main className={styles.main}>
      <div className={styles.stage}>
        <Image src={chiHippie} alt="" sizes="(min-width: 1000px) 640px, 64vw" priority className={styles.image} />
        <video src="/videos/chi-hippie.mp4" controls playsInline className={styles.video} />
      </div>
    </main>
  );
}
