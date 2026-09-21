import type { Metadata } from "next";
import LegalPage from "@/components/site/LegalPage";

export const metadata: Metadata = {
  title: "Cookies policy",
  description: "How this template uses cookies. Placeholder text - replace before launch.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage
      title="Cookies Policy"
      updated="20 Dec 2024"
      intro="This is placeholder policy text supplied with the template. It describes the cookie categories a storefront usually needs - replace it with an accurate description of what your build actually sets."
      sections={[
        {
          heading: "What information do we collect?",
          paragraphs: [
            "Cookies set by this kind of storefront fall into four groups: strictly necessary, preferences, analytics and marketing. Only the first is set before you make a choice.",
          ],
        },
        {
          heading: "How do we use your information?",
          paragraphs: [
            "Strictly necessary cookies keep a session alive, remember the contents of a bag, and carry a token through checkout. They cannot be switched off without breaking the shop.",
            "Preference cookies remember choices such as language, currency or a dismissed banner. They are optional and expire within a year.",
          ],
        },
        {
          heading: "Do we use cookies and other tracking technologies?",
          paragraphs: [
            "Analytics cookies measure which pages are read and where visitors arrived from. This template ships with none configured; if you add a provider, name it here along with its retention period.",
            "Marketing cookies build a profile across sites in order to target advertising. They always require prior consent in the EU and UK.",
          ],
        },
        {
          heading: "How long do we keep your information?",
          paragraphs: [
            "Session cookies are discarded when you close the browser. Persistent cookies used by this template would expire within twelve months at the latest.",
          ],
        },
        {
          heading: "How do we keep your information safe?",
          paragraphs: [
            "Cookies are set over TLS with the Secure and SameSite attributes, and no cookie set by the shop itself carries payment data.",
          ],
        },
        {
          heading: "What are your privacy rights?",
          paragraphs: [
            "Every major browser lets you block or delete cookies from its settings, and consent must be as easy to withdraw as it was to give. Blocking the strictly necessary category will stop checkout from working.",
          ],
        },
      ]}
    />
  );
}
