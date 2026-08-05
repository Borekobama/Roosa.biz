import { Check, Heart } from "lucide-react";
import styles from "./Homepage.module.css";

const proofs = [
  { title: "Three-ply softness", status: "verification required pending approval", icon: Check },
  { title: "Dermatologically tested", status: "test document required pending approval", icon: Check },
  { title: "FSC-certified", status: "certificate url required pending approval", icon: Check },
  { title: "Supports child protection", status: "contribution proof required pending approval", icon: Heart },
];

export function ProductProofStrip() {
  return (
    <section className={styles.proofStrip} aria-label="Product and impact proof status">
      <div className={styles.proofGrid}>
        {proofs.map(({ title, status, icon: Icon }) => (
          <div className={styles.proofItem} key={title}>
            <span className={styles.proofIcon} aria-hidden="true"><Icon /></span>
            <div>
              <h2 className={styles.proofTitle}>{title}</h2>
              <p className={styles.proofStatus}>{status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
