import type { Locale } from "@/types/content";

/*
 * Real editorial migrated from roosa.net. German is the source language and is
 * reproduced verbatim; the English rendering is a working translation and is
 * labelled as such in the UI. French falls back to English with the same
 * notice until a reviewed translation exists.
 *
 * Every article keeps its source URL so an editor can diff against the live
 * post, and `safeguarding` flags the stories that name children or families —
 * those must clear a safeguarding review before publication.
 */

export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type JournalCopy = { title: string; lead: string; body: JournalBlock[] };

export type JournalArticle = {
  slug: string;
  date: string;
  categories: string[];
  image: string;
  imageAlt: string;
  sourceUrl: string;
  safeguarding: boolean;
  copy: { de: JournalCopy; en: JournalCopy };
};

export const journalCategories = ["Presse", "Jobs", "Online-Shop"] as const;

export const journalArticles: JournalArticle[] = [
  {
    slug: "der-kleine-kaempfer",
    date: "2026-05-26",
    categories: ["Presse"],
    image: "/media/journal/little-fighter.jpg",
    imageAlt: "Beat Mörker holds Logan in front of a helicopter and a red Ferrari at the Pfaffnau helibase",
    sourceUrl: "https://roosa.net/2026/05/26/der-kleine-kaempfer/",
    safeguarding: true,
    copy: {
      de: {
        title: "Der kleine Kämpfer",
        lead: "Ein Ferrari, ein Helikopterflug und ein Tag, den Logan und seine Familie so schnell nicht vergessen werden.",
        body: [
          { type: "p", text: "Der 4-jährige Logan Swanson kämpft derzeit gegen eine schwere Krebserkrankung. Sein grösster Wunsch war es schon lange einmal, Ferrari zu fahren. Für ihn war das kaum vorstellbar. Doch genau diesen Traum wollten wir ihm erfüllen. Gemeinsam mit Beat Mörker, dem «König des Klopapiers», holten wir Logan und seine Familie zu einem ganz besonderen Tag ab. Mit dem Ferrari ging es Richtung Helibase in Pfaffnau zu Swiss Helicopter." },
          { type: "p", text: "Während der Fahrt strahlte Logan über das ganze Gesicht. Doch damit war die Überraschung noch nicht vorbei. Denn Logan fand Helikopter schon immer faszinierend und hatte den Wunsch, einen Flug diesmal ganz bewusst erleben zu dürfen." },
          { type: "p", text: "Vor einiger Zeit musste Logan aufgrund seines Gesundheitszustandes bereits einmal mit einem Rettungshelikopter ins Spital geflogen werden. Damals war er jedoch gesundheitlich so angeschlagen, dass er den Flug kaum mitbekam. Umso schöner war es, dass er dieses Erlebnis nun gemeinsam mit seiner Familie in Ruhe geniessen durfte." },
          { type: "p", text: "Dank der unglaublichen Unterstützung von Swiss Helicopter und Pilot Stefan Frech wurde genau das möglich." },
          { type: "p", text: "Ein riesiges Dankeschön an Stefan Frech, der komplett kostenlos geflogen ist und auf sein Pilotenhonorar verzichtet hat. Ebenso ein grosses Dankeschön an Swiss Helicopter für das grosszügige Entgegenkommen und die Unterstützung dieses besonderen Tages. Mit an Bord waren sein Vater Gerald Büttner, sein Bruder Leon Swanson sowie Beat Mörker. Gemeinsam erlebten sie einen rund 45-minütigen Flug voller Emotionen, Freude und unvergesslicher Momente." },
          { type: "p", text: "Das Schönste daran: Logan fühlte sich im Helikopter so wohl und geborgen, dass er während des Fluges sogar etwa 15 Minuten eingeschlafen ist." },
          { type: "p", text: "Nach der Rückkehr wartete bereits die nächste Überraschung auf ihn: Logan erhielt als Geschenk genau denselben Ferrari als Modellauto sowie denselben Helikopter von Swiss Helicopter." },
          { type: "p", text: "Solche Momente zeigen, wie wichtig Zusammenhalt, Menschlichkeit und Mitgefühl sind. Für uns war dieser Tag unbezahlbar." },
          { type: "p", text: "Wir wünschen Logan, seiner Mama Michaela Swanson, seinem Papa Gerald Büttner, seinem Bruder Leon und dem kleinen Lennox weiterhin ganz viel Kraft." },
        ],
      },
      en: {
        title: "The little fighter",
        lead: "A Ferrari, a helicopter flight, and a day Logan and his family will not forget in a hurry.",
        body: [
          { type: "p", text: "Four-year-old Logan Swanson is currently fighting a serious cancer diagnosis. For a long time his greatest wish had been to ride in a Ferrari. To him it seemed barely imaginable — and it was exactly that dream we wanted to make real. Together with Beat Mörker, the “king of toilet paper”, we collected Logan and his family for a very special day. The Ferrari took them towards the Swiss Helicopter helibase in Pfaffnau." },
          { type: "p", text: "Logan beamed for the whole drive. But the surprise was not over yet: helicopters had always fascinated him, and he had wished to experience a flight properly this time." },
          { type: "p", text: "Some time ago Logan had already had to be flown to hospital by rescue helicopter because of his condition. Back then he was too unwell to take much of the flight in. That made it all the better that he could now enjoy the experience calmly, with his family." },
          { type: "p", text: "It was made possible by the incredible support of Swiss Helicopter and pilot Stefan Frech." },
          { type: "p", text: "An enormous thank you to Stefan Frech, who flew entirely free of charge and waived his pilot’s fee. And a big thank you to Swiss Helicopter for their generosity in supporting the day. On board were Logan’s father Gerald Büttner, his brother Leon Swanson and Beat Mörker. Together they shared a roughly 45-minute flight full of emotion, joy and unforgettable moments." },
          { type: "p", text: "The loveliest part: Logan felt so safe and comfortable in the helicopter that he fell asleep for about fifteen minutes mid-flight." },
          { type: "p", text: "Another surprise was waiting when they landed. Logan was given a model of that same Ferrari, along with the same helicopter from Swiss Helicopter." },
          { type: "p", text: "Moments like these show how much solidarity, humanity and compassion matter. For us, the day was priceless." },
          { type: "p", text: "We wish Logan, his mother Michaela Swanson, his father Gerald Büttner, his brother Leon and little Lennox a great deal of strength." },
        ],
      },
    },
  },
  {
    slug: "voller-einsatz-fuer-den-guten-zweck",
    date: "2026-05-13",
    categories: ["Jobs", "Presse"],
    image: "/media/journal/field-team.jpg",
    imageAlt: "A ROOSA door-to-door seller in a pink hoodie beside the branded ROOSA van, loaded with paper packs",
    sourceUrl: "https://roosa.net/2026/05/13/voller-einsatz-fuer-den-guten-zweck/",
    safeguarding: false,
    copy: {
      de: {
        title: "Voller Einsatz für den guten Zweck",
        lead: "Unsere Hausverkäufer sind täglich unterwegs — für den Verkauf und für den Kinder- und Jugendschutz.",
        body: [
          { type: "p", text: "Auch unsere Hausverkäufer sind täglich mit vollem Einsatz unterwegs – nicht nur für den Verkauf, sondern auch für den guten Zweck. Mit jedem Gespräch, jedem Besuch und jedem Verkauf unterstützen sie aktiv den Kinder- und Jugendschutz in der Schweiz. Ihr Engagement hilft dabei, wichtige Präventionsprojekte gegen Mobbing, Gewalt und Ausgrenzung zu ermöglichen." },
          { type: "p", text: "Gemeinsam handeln wir – für eine starke Zukunft unserer Kinder." },
        ],
      },
      en: {
        title: "Full commitment, for a good cause",
        lead: "Our door-to-door sellers are out every day — for the sale, and for child and youth protection.",
        body: [
          { type: "p", text: "Our door-to-door sellers are out every day giving it everything they have — not only for the sale, but for the cause behind it. With every conversation, every visit and every sale they actively support child and youth protection in Switzerland. Their commitment helps make important prevention projects against bullying, violence and exclusion possible." },
          { type: "p", text: "We act together — for a strong future for our children." },
        ],
      },
    },
  },
  {
    slug: "volle-tanks-fuer-152-familien-in-berlin",
    date: "2026-04-21",
    categories: ["Presse"],
    image: "/media/journal/family-support.jpg",
    imageAlt: "The ROOSA team in pink hoodies at a support event",
    sourceUrl: "https://roosa.net/2026/04/21/volle-tanks-fuer-152-familien-in-berlin/",
    safeguarding: false,
    copy: {
      de: {
        title: "Volle Tanks für 152 Familien in Berlin",
        lead: "152 Familien, 4 788 Liter Benzin und ein Tag voller Zusammenhalt.",
        body: [
          { type: "p", text: "Eine Woche nach unserer erfolgreichen Aktion in Buckten haben wir auch in Deutschland viele Familien unterstützt. Die gesamte Aktion in Berlin führte dazu, dass 152 Familien insgesamt 4.788 Liter Benzin gratis tanken konnten, was circa 10.000 Euro kostete. Außerdem spendete der Tankstellen-Chef noch Bratwürstchen und andere Leckereien, auch um den kleinen Gästen eine Freude zu machen. Insgesamt war es ein gelungener Tag voller Unterstützung und Zusammenhalt in schwierigen Zeiten." },
          { type: "p", text: "Das mediale Interesse an der Aktion war enorm. Viele Plattformen berichteten darüber und verbreiteten die Nachricht von Beat Mörkers großzügiger Geste. Die Berichterstattung trug zur Sichtbarkeit und positiven Resonanz der Aktion bei." },
        ],
      },
      en: {
        title: "Full tanks for 152 families in Berlin",
        lead: "152 families, 4,788 litres of fuel, and a day of solidarity.",
        body: [
          { type: "p", text: "A week after our successful campaign in Buckten, we supported many families in Germany too. The Berlin campaign meant 152 families could fill up with a total of 4,788 litres of fuel free of charge, at a cost of roughly EUR 10,000. The petrol station manager also donated sausages and other treats, partly to give the younger guests a treat of their own. All in all it was a good day, full of support and solidarity in difficult times." },
          { type: "p", text: "Media interest in the campaign was enormous. Many outlets reported on it and spread word of Beat Mörker’s generous gesture. That coverage added to the visibility and the positive response the campaign received." },
        ],
      },
    },
  },
  {
    slug: "neuer-hoodie-im-online-shop",
    date: "2026-04-10",
    categories: ["Online-Shop"],
    image: "/media/journal/hoodie.jpg",
    imageAlt: "The new ROOSA hoodie photographed for the online shop",
    sourceUrl: "https://roosa.net/2026/04/10/neuer-hoodie-im-online-shop-stylisch-und-fuer-einen-guten-zweck/",
    safeguarding: false,
    copy: {
      de: {
        title: "Neuer Hoodie im Online-Shop",
        lead: "Von jedem verkauften Hoodie gehen CHF 10.00 an das Bündnis KinderSchutz.",
        body: [
          { type: "p", text: "Hey du! Wir haben großartige Neuigkeiten für dich: Unser neuer Hoodie ist jetzt im Online-Shop erhältlich! Er vereint nicht nur coolen Style und mega Komfort, sondern hilft auch noch einer wichtigen Sache. Das Beste daran? Von jedem verkauften Hoodie spenden wir CHF 10,00 an das Bündnis KinderSchutz. Damit hilfst du aktiv mit, Kindern in Not zu helfen!" },
          { type: "h2", text: "Über das Bündnis KinderSchutz" },
          { type: "p", text: "Das Bündnis KinderSchutz engagiert sich für den Schutz und die Rechte von Kindern. Sie setzen sich für Projekte ein, die das Bewusstsein für die Herausforderungen von Kindern schärfen und bieten ihnen die Unterstützung, die sie brauchen." },
          { type: "h2", text: "Produktdetails" },
          { type: "list", items: ["Material: Superweiche Baumwolle für den besten Tragekomfort", "Größen: XS, S, M, L, XL, XXL"] },
          { type: "h2", text: "Warum solltest du unseren Hoodie kaufen?" },
          { type: "list", items: [
            "Bequem: Der Hoodie hat nicht nur einen lässigen Look, sondern ist auch super angenehm zu tragen.",
            "Gutes Gewissen: Mit jedem Kauf unterstützt du eine tolle Initiative, die sich für das Wohl von Kindern einsetzt.",
            "Vielseitig: Der Hoodie lässt sich klasse kombinieren und ist für jede Jahreszeit geeignet.",
          ] },
          { type: "p", text: "Egal, ob beim Sport, beim Chillen zu Hause oder beim Treffen mit Freunden – dieser Hoodie ist einfach perfekt für jede Gelegenheit. Mit seinem lässigen Design und der bequemen Passform wirst du ihn lieben!" },
        ],
      },
      en: {
        title: "New hoodie in the online shop",
        lead: "CHF 10.00 from every hoodie sold goes to Bündnis KinderSchutz.",
        body: [
          { type: "p", text: "Hey you! We have great news: our new hoodie is now available in the online shop. It combines a cool look with serious comfort — and it supports something that matters. The best part? For every hoodie sold we donate CHF 10.00 to Bündnis KinderSchutz, so you are actively helping children in need." },
          { type: "h2", text: "About Bündnis KinderSchutz" },
          { type: "p", text: "Bündnis KinderSchutz works for the protection and the rights of children. It backs projects that raise awareness of the challenges children face, and offers them the support they need." },
          { type: "h2", text: "Product details" },
          { type: "list", items: ["Material: super-soft cotton for the best wearing comfort", "Sizes: XS, S, M, L, XL, XXL"] },
          { type: "h2", text: "Why buy our hoodie?" },
          { type: "list", items: [
            "Comfortable: the hoodie has a relaxed look and is genuinely pleasant to wear.",
            "Good conscience: every purchase supports an initiative working for children’s wellbeing.",
            "Versatile: it combines easily and suits any season.",
          ] },
          { type: "p", text: "Whether you are training, relaxing at home or meeting friends — this hoodie fits any occasion. With its relaxed design and comfortable fit, you will love it." },
        ],
      },
    },
  },
  {
    slug: "roosa-bei-prosieben-galileo",
    date: "2025-11-25",
    categories: ["Presse"],
    image: "/media/journal/galileo.jpg",
    imageAlt: "ROOSA featured in the ProSieben GALILEO segment",
    sourceUrl: "https://roosa.net/2025/11/25/roosa-bei-prosieben-galileo/",
    safeguarding: false,
    copy: {
      de: {
        title: "ROOSA bei ProSieben GALILEO",
        lead: "„Beat Mörker: König des Klopapiers“ — ROOSA im ProSieben-Format „How To Make Money Fast“.",
        body: [
          { type: "p", text: "Am 19. & 24. November 2025 wurde ROOSA Klopapier im ProSieben-Format „How To Make Money Fast“ (GALILEO) vorgestellt. In der Folge „Beat Mörker: König des Klopapiers“ begleitet das TV-Team unseren Gründer Beat Mörker und zeigt, wie aus einer Idee ein erfolgreiches Unternehmen mit sozialem Anspruch wurde – inklusive unseres Mottos „ROOSA Klopapier – für einen guten Zweck“." },
          { type: "p", text: "Der Beitrag gibt Einblick in die Entstehung von ROOSA, unsere tägliche Arbeit und unser Engagement für Kinder- und Jugendschutz. Wir freuen uns sehr über das grosse Interesse und bedanken uns bei allen Zuschauerinnen und Zuschauern, die ROOSA unterstützen." },
          { type: "p", text: "Die Sendung kann jederzeit in der Mediathek von Joyn unter dem Titel „Beat Mörker: König des Klopapiers“ nochmals angeschaut werden." },
        ],
      },
      en: {
        title: "ROOSA on ProSieben GALILEO",
        lead: "“Beat Mörker: king of toilet paper” — ROOSA in the ProSieben format “How To Make Money Fast”.",
        body: [
          { type: "p", text: "On 19 and 24 November 2025, ROOSA toilet paper featured in the ProSieben format “How To Make Money Fast” (GALILEO). In the episode “Beat Mörker: king of toilet paper”, the television team follows our founder Beat Mörker and shows how an idea became a successful business with a social purpose — including our motto, “ROOSA toilet paper — for a good cause”." },
          { type: "p", text: "The segment gives an insight into how ROOSA came about, our day-to-day work and our commitment to child and youth protection. We are delighted by the level of interest and grateful to everyone who watched and supports ROOSA." },
          { type: "p", text: "The programme can be watched again any time in the Joyn media library under the title “Beat Mörker: König des Klopapiers”." },
        ],
      },
    },
  },
];

/** German is the source language; English is a working translation. French has
 *  none yet, so it is served the English text with the notice shown. */
export function articleCopy(article: JournalArticle, locale: Locale) {
  const isSource = locale === "de";
  return {
    copy: isSource ? article.copy.de : article.copy.en,
    isSourceLanguage: isSource,
    translationPending: locale === "fr",
  };
}

export function findArticle(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
