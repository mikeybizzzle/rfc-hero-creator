import Image from "next/image";
import chiHippie from "@/public/images/chi-hippie.png";
import styles from "./page.module.css";

export default function ChiHippiePage() {
  return (
    <main className={styles.main}>
      <div className={styles.videoCol}>
        <video src="/videos/chi-hippie.mp4" controls playsInline className={styles.video} />
      </div>
      <div className={styles.imageCol}>
        <Image src={chiHippie} alt="" sizes="(min-width: 768px) 33vw, 100vw" className={styles.image} />
      </div>
    </main>
  );
}
