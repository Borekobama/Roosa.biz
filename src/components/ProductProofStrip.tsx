import { Check, Heart } from "lucide-react";
import styles from "./Homepage.module.css";

const proofs = [
  { title: "Three-ply softness", status: "[VERIFICATION_REQUIRED]", icon: Check },
  { title: "Dermatologically tested", status: "[TEST_DOCUMENT_REQUIRED]", icon: Check },
  { title: "FSC-certified", status: "[CERTIFICATE_URL_REQUIRED]", icon: Check },
  { title: "Supports child protection", status: "[CONTRIBUTION_PROOF_REQUIRED]", icon: Heart },
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
