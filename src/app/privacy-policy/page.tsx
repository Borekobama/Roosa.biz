import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How this template handles personal data. Placeholder text - replace before launch.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="20 Dec 2024"
      intro="This is placeholder policy text supplied with the template. Replace every section below with language reviewed by your own counsel before you publish."
      sections={[
        {
          heading: "What information do we collect?",
          paragraphs: [
            "A storefront collects what it needs to fulfil an order: a name, a delivery address, an email address, and a payment reference held by the payment provider rather than by the shop itself.",
            "If analytics is enabled it also records page views and referrers. This template ships with no analytics provider configured.",
            "Account details are separate from order details. If you create an account, the shop stores an email address and a hashed password; it never stores the password itself, and it cannot recover one for you.",
          ],
        },
        {
          heading: "How do we use your information?",
          paragraphs: [
            "Order data is processed to fulfil the contract you enter into when buying. Marketing email is sent only on the basis of consent, and that consent can be withdrawn from any message.",
            "Legitimate interest covers a small set of uses that you would reasonably expect: fraud checks at checkout, keeping the shop secure, and understanding which pages fail so they can be fixed.",
          ],
        },
        {
          heading: "Do we use cookies and other tracking technologies?",
          paragraphs: [
            "Strictly necessary cookies keep a session alive and carry a token through checkout. Anything beyond that category requires prior consent. See the cookies policy for the full breakdown.",
            "A consent record is itself stored in a cookie, so that the choice you made persists and you are not asked again on every page.",
          ],
        },
        {
          heading: "How long do we keep your information?",
          paragraphs: [
            "Order records are normally retained for the period required by tax law in the seller's jurisdiction. Marketing preferences are kept until you withdraw them.",
            "Support correspondence is normally kept for two years, which covers the period in which a return or warranty question is likely to arise.",
          ],
        },
        {
          heading: "How do we keep your information safe?",
          paragraphs: [
            "Data is transmitted over TLS and access is limited to the people who need it to operate the shop. Payment details never reach the shop's own systems.",
            "Access is logged, and administrative accounts require a second factor. Backups are encrypted at rest and restored only into the same environment.",
          ],
        },
        {
          heading: "What are your privacy rights?",
          paragraphs: [
            "Under the GDPR you can request access to your data, correction, deletion, restriction of processing, and portability. You may also complain to your national supervisory authority.",
            "You can exercise any of these rights without charge, and a response is due within one month. Complex requests may extend that by two further months, with notice.",
          ],
        },
        {
          heading: "How can you contact us about this policy?",
          paragraphs: [
            "Requests should go to the contact address published by the operator of the site. Replace this paragraph with a real address before publishing.",
            "Include enough detail to identify the order or account in question, but never send a password or full payment card number by email.",
          ],
        },
      ]}
    />
  );
}
