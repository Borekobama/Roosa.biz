"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/[locale]/editorial.module.css";

export function ContactForm({ variant = "contact" }: { variant?: "contact" | "b2b" }) {
  const [status, setStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("This demonstration form is not connected yet. Your information has not been sent or stored. Configure an approved form endpoint before launch.");
  }
  const b2b = variant === "b2b";
  return <form className={styles.form} onSubmit={submit} aria-describedby={status ? "form-status" : undefined}>
    <div className={styles.field}><label htmlFor={`${variant}-name`}>Name</label><input id={`${variant}-name`} name="name" autoComplete="name" required /></div>
    {b2b && <div className={styles.field}><label htmlFor="b2b-company">Company</label><input id="b2b-company" name="company" autoComplete="organization" required /></div>}
    <div className={styles.field}><label htmlFor={`${variant}-email`}>{b2b ? "Work email" : "Email"}</label><input id={`${variant}-email`} name="email" type="email" autoComplete="email" required /></div>
    {b2b && <><div className={styles.field}><label htmlFor="b2b-country">Country</label><input id="b2b-country" name="country" autoComplete="country-name" required /></div><div className={styles.field}><label htmlFor="b2b-type">Business type</label><select id="b2b-type" name="businessType" required defaultValue=""><option value="" disabled>Select one</option><option>Retailer</option><option>Office</option><option>Hotel</option><option>Restaurant</option><option>Distributor</option><option>Corporate buyer</option></select></div><div className={styles.field}><label htmlFor="b2b-volume">Estimated volume</label><input id="b2b-volume" name="estimatedVolume" placeholder="Approximate packs per month" required /></div></>}
    {!b2b && <div className={styles.field}><label htmlFor="contact-topic">Topic</label><select id="contact-topic" name="topic" defaultValue="General question"><option>General question</option><option>Order support</option><option>Impact information</option><option>Press enquiry</option></select></div>}
    <div className={`${styles.field} ${styles.fieldFull}`}><label htmlFor={`${variant}-message`}>Message</label><textarea id={`${variant}-message`} name="message" required /></div>
    <label className={styles.consent}><input type="checkbox" name="consent" required /><span>I agree that ROOSA may use these details to respond to this enquiry. No marketing consent is implied.</span></label>
    <button className="button button--primary" type="submit">{b2b ? "Prepare enquiry" : "Prepare message"}</button>
    {status && <p className={styles.status} id="form-status" role="status">{status}</p>}
  </form>;
}
