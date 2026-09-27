/**
 * Legal texts, taken from the live ROOSA site (roosa.net, which roosa.biz
 * redirects to) with their structure kept: section headings, the bold
 * sub-headings inside the rights section, lists and the line breaks of the
 * address blocks. Rendered by components/site/LegalPage.
 */

/** A paragraph (line breaks kept), a bullet list, or a sub-heading. */
export type LegalBlock = string | { list: string[] } | { sub: string };

export type LegalSection = { heading?: string; blocks: LegalBlock[] };

export const impressum: LegalSection[] = [
  {
    "blocks": [
      "ROOSA® ist eine eingetragene Marke der ROOSA AG",
      "Verantwortliche Instanz:\nROOSA AG\nKirschgartenstrasse 12\n4051 Basel\nSchweiz\nE-Mail: info@roosa.biz"
    ]
  },
  {
    "heading": "Vertretungsberechtigte Person",
    "blocks": [
      "Beat Mörker",
      "Name des Unternehmens: ROOSA AG\nRegistrationsnummer: CHE-168.391.777\nUmsatzsteuer-Identifikationsnummer: CH-270-3016294-3"
    ]
  },
  {
    "heading": "Haftungsausschluss",
    "blocks": [
      "Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.\nHaftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.",
      "Alle Angebote sind freibleibend. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen."
    ]
  },
  {
    "heading": "Haftungsausschluss für Inhalte und Links",
    "blocks": [
      "Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des jeweiligen Nutzers."
    ]
  },
  {
    "heading": "Urheberrechtserklärung",
    "blocks": [
      "Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf dieser Website, gehören ausschliesslich der ROOSA AG oder den speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen."
    ]
  }
];

export const datenschutz: LegalSection[] = [
  {
    "blocks": [
      "ROOSA AG\nKirschgartenstrasse 12\n4051 Basel\nSchweiz\nE-Mail: info@roosa.biz"
    ]
  },
  {
    "heading": "Vertretungsberechtigte Person",
    "blocks": [
      "Beat Mörker",
      "Name des Unternehmens: ROOSA AG"
    ]
  },
  {
    "heading": "Datenschutzbeauftragte/r",
    "blocks": [
      "ROOSA AG\ninfo@roosa.biz"
    ]
  },
  {
    "heading": "Allgemeines / Einleitung",
    "blocks": [
      "Gestützt auf Artikel 13 der Schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.",
      "In Zusammenarbeit mit unseren Hosting-Providern bemühen wir uns, die Datenbanken so gut wie möglich vor unberechtigtem Zugriff, Verlust, Missbrauch oder Verfälschung zu schützen.",
      "Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.",
      "Durch die Nutzung dieser Website erklären Sie sich mit der Erhebung, Verarbeitung und Nutzung von Daten gemäss der nachfolgenden Beschreibung einverstanden. Diese Website kann grundsätzlich ohne Registrierung besucht werden. Daten wie aufgerufene Seiten oder Namen von aufgerufenen Dateien, Datum und Uhrzeit werden zu statistischen Zwecken auf dem Server gespeichert, ohne dass diese Daten unmittelbar auf Ihre Person bezogen werden. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben."
    ]
  },
  {
    "heading": "Verarbeitung personenbezogener Daten",
    "blocks": [
      "Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen. Eine betroffene Person ist eine Person, über die personenbezogene Daten verarbeitet werden. Die Verarbeitung umfasst jeden Umgang mit personenbezogenen Daten, unabhängig von den verwendeten Mitteln und Verfahren, insbesondere die Speicherung, Weitergabe, Beschaffung, Löschung, Aufbewahrung, Veränderung, Vernichtung und Verwendung personenbezogener Daten.",
      "Wir verarbeiten personenbezogene Daten in Übereinstimmung mit dem Schweizer Datenschutzrecht. Sofern und soweit die EU-DSGVO anwendbar ist, verarbeiten wir personenbezogene Daten darüber hinaus auf folgenden Rechtsgrundlagen in Verbindung mit Art. 6 (1) GDPR:\nlit. a) Verarbeitung personenbezogener Daten mit Einwilligung der betroffenen Person.\nlit. b) Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrages mit der betroffenen Person sowie zur Durchführung entsprechender vorvertraglicher Massnahmen.\nlit. c) Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen Verpflichtung, der wir nach geltendem Recht der EU oder nach geltendem Recht eines Landes, in dem die GDPR ganz oder teilweise anwendbar ist, unterliegen.\nlit. d) Verarbeitung personenbezogener Daten zur Wahrung lebenswichtiger Interessen der betroffenen Person oder einer anderen natürlichen Person.\nlit. f) Verarbeitung personenbezogener Daten zur Wahrung der berechtigten Interessen von uns oder von Dritten, sofern nicht die Grundfreiheiten und Rechte und Interessen der betroffenen Person überwiegen. Zu den berechtigten Interessen gehören insbesondere unser geschäftliches Interesse, unsere Website bereitstellen zu können, die Informationssicherheit, die Durchsetzung eigener Rechtsansprüche und die Einhaltung des schweizerischen Rechts.",
      "Wir verarbeiten personenbezogene Daten für die Dauer, die für den jeweiligen Zweck oder die jeweiligen Zwecke erforderlich ist. Bei längerfristigen Aufbewahrungspflichten aufgrund gesetzlicher und anderer Verpflichtungen, denen wir unterliegen, schränken wir die Bearbeitung entsprechend ein."
    ]
  },
  {
    "heading": "Cookies",
    "blocks": [
      "Diese Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die es ermöglichen, spezifische, auf den Nutzer bezogene Informationen auf dem Endgerät des Nutzers zu speichern, während der Nutzer die Website nutzt. Cookies ermöglichen es insbesondere, die Nutzungshäufigkeit und die Anzahl der Nutzer der Seiten zu ermitteln, Verhaltensmuster der Seitennutzung zu analysieren, aber auch, unser Angebot kundenfreundlicher zu gestalten. Cookies bleiben über das Ende einer Browser-Sitzung hinaus gespeichert und können bei einem erneuten Besuch der Seite wieder abgerufen werden. Wenn Sie dies nicht wünschen, sollten Sie Ihren Internet-Browser so einstellen, dass er die Annahme von Cookies verweigert.",
      "Ein genereller Widerspruch gegen die Verwendung von Cookies zu Online-Marketing-Zwecken kann für eine Vielzahl der Dienste, insbesondere beim Tracking, über die US-Seite http://www.aboutads.info/choices/ oder die EU-Seite http://www.youronlinechoices.com/ erklärt werden. Darüber hinaus kann die Speicherung von Cookies durch Deaktivierung in den Browsereinstellungen erreicht werden. Bitte beachten Sie, dass in diesem Fall nicht alle Funktionen dieses Online-Angebots genutzt werden können."
    ]
  },
  {
    "heading": "Mit SSL/TLS-Verschlüsselung",
    "blocks": [
      "Diese Website verwendet aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie z.B. Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.",
      "Wenn die SSL- oder TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten gelesen werden."
    ]
  },
  {
    "heading": "Server-Log-Dateien",
    "blocks": [
      "Der Provider dieser Website erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:\nBrowsertyp und Browserversion\nVerwendetes Betriebssystem\nReferrer URL\nHostname des zugreifenden Rechners\nZeitpunkt der Serveranfrage",
      "Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn uns konkrete Anhaltspunkte für eine rechtswidrige Nutzung bekannt werden."
    ]
  },
  {
    "heading": "Dienste von Drittanbietern",
    "blocks": [
      "Diese Website kann Google Maps zur Einbettung von Karten, Google Invisible reCAPTCHA zum Schutz vor Bots und Spam und YouTube zur Einbettung von Videos nutzen.",
      "Diese Dienste der amerikanischen Google LLC verwenden u.a. Cookies, wodurch Daten an Google in die USA übertragen werden, wobei wir davon ausgehen, dass in diesem Zusammenhang allein durch die Nutzung unserer Website kein personenbezogenes Tracking stattfindet.",
      "Google hat sich verpflichtet, einen angemessenen Datenschutz gemäss dem US-amerikanisch-europäischen und dem US-amerikanisch-schweizerischen Privacy Shield zu gewährleisten.",
      "Weitere Informationen finden Sie in den Datenschutzbestimmungen von Google."
    ]
  },
  {
    "heading": "Kontaktformular",
    "blocks": [
      "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter."
    ]
  },
  {
    "heading": "Rechte der betroffenen Person",
    "blocks": [
      {
        "sub": "Recht auf Bestätigung"
      },
      "Jede betroffene Person hat das Recht, vom Betreiber der Website eine Bestätigung darüber zu verlangen, ob sie betreffende personenbezogene Daten verarbeitet werden. Wenn Sie dieses Bestätigungsrecht ausüben möchten, können Sie sich jederzeit an den Datenschutzbeauftragten wenden.",
      {
        "sub": "Auskunftsrecht"
      },
      "Jede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, vom Betreiber dieser Website jederzeit unentgeltlich Auskunft über die zu ihrer Person gespeicherten Daten und eine Kopie dieser Auskunft zu erhalten. Darüber hinaus kann ggf. Auskunft über Folgendes erteilt werden:\nZwecke der Verarbeitung\nKategorien der verarbeiteten personenbezogenen Daten\nEmpfänger, an die die personenbezogenen Daten weitergegeben wurden oder werden\nwenn möglich, die geplante Dauer der Speicherung der personenbezogenen Daten oder, falls dies nicht möglich ist, die Kriterien für die Festlegung dieser Dauer\ndas Bestehen eines Rechts auf Berichtigung oder Löschung der sie betreffenden personenbezogenen Daten oder auf Einschränkung der Verarbeitung durch den für die Verarbeitung Verantwortlichen oder ein Recht auf Widerspruch gegen eine solche Verarbeitung\ndas Bestehen eines Beschwerderechts bei einer Aufsichtsbehörde\nwenn die personenbezogenen Daten nicht bei der betroffenen Person erhoben werden: Alle verfügbaren Informationen über die Herkunft der Daten.\nAusserdem hat die betroffene Person das Recht, darüber informiert zu werden, ob personenbezogene Daten in ein Drittland oder an eine internationale Organisation übermittelt worden sind. Ist dies der Fall, so hat die betroffene Person ausserdem das Recht, Auskunft über die geeigneten Garantien im Zusammenhang mit der Übermittlung zu erhalten.\nWenn Sie von diesem Auskunftsrecht Gebrauch machen möchten, können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden.",
      {
        "sub": "Recht auf Berichtigung"
      },
      "Jede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, die unverzügliche Berichtigung sie betreffender unrichtiger personenbezogener Daten zu verlangen. Darüber hinaus hat die betroffene Person das Recht, unter Berücksichtigung der Zwecke der Verarbeitung, die Vervollständigung unvollständiger personenbezogener Daten – auch mittels einer ergänzenden Erklärung – zu verlangen.\nWenn Sie dieses Recht auf Berichtigung ausüben möchten, können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden.",
      {
        "sub": "Recht auf Löschung (Recht auf Vergessenwerden)"
      },
      "Jede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, von dem für die Verarbeitung Verantwortlichen dieser Website die unverzügliche Löschung der sie betreffenden personenbezogenen Daten zu verlangen, sofern einer der folgenden Gründe zutrifft und die Verarbeitung nicht mehr erforderlich ist:\nDie personenbezogenen Daten wurden für Zwecke erhoben oder auf sonstige Weise verarbeitet, für die sie nicht mehr erforderlich sind.\nDie betroffene Person widerruft die Einwilligung, auf der die Verarbeitung beruhte, und es gibt keine andere Rechtsgrundlage für die Verarbeitung\nDie betroffene Person legt aus Gründen, die sich aus ihrer besonderen Situation ergeben, Widerspruch gegen die Verarbeitung ein, und es liegen keine vorrangigen berechtigten Gründe für die Verarbeitung vor, oder die betroffene Person legt im Falle von Direktwerbung und damit verbundenem Profiling Widerspruch gegen die Verarbeitung ein\nDie personenbezogenen Daten wurden unrechtmässig verarbeitet\nDie Löschung der personenbezogenen Daten ist zur Erfüllung einer rechtlichen Verpflichtung nach dem Unionsrecht oder dem Recht der Mitgliedstaaten erforderlich, dem der für die Verarbeitung Verantwortliche unterliegt\nDie personenbezogenen Daten wurden in Bezug auf angebotene Dienste der Informationsgesellschaft erhoben, die direkt an ein Kind gerichtet sind\nWenn einer der oben genannten Gründe zutrifft und Sie die Löschung von personenbezogenen Daten, die beim Betreiber dieser Website gespeichert sind, veranlassen möchten, können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden. Der Datenschutzbeauftragte dieser Website wird veranlassen, dass dem Löschverlangen unverzüglich nachgekommen wird.",
      {
        "sub": "Recht auf Einschränkung der Verarbeitung"
      },
      "Jede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, von dem für die Verarbeitung Verantwortlichen dieser Website die Einschränkung der Verarbeitung zu verlangen, wenn eine der folgenden Bedingungen erfüllt ist:\nDie Richtigkeit der personenbezogenen Daten wird von der betroffenen Person bestritten, und zwar für einen Zeitraum, der es dem für die Verarbeitung Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen Daten zu überprüfen\nDie Verarbeitung ist unrechtmässig, die betroffene Person legt Widerspruch gegen die Löschung der personenbezogenen Daten ein und verlangt stattdessen die Einschränkung der Nutzung der personenbezogenen Daten\nDer für die Verarbeitung Verantwortliche benötigt die personenbezogenen Daten nicht mehr für die Zwecke der Verarbeitung, die betroffene Person benötigt sie jedoch für die Geltendmachung, Die betroffene Person hat aus Gründen, die sich aus ihrer besonderen Situation ergeben, Widerspruch gegen die Verarbeitung eingelegt, und es steht noch nicht fest, ob die berechtigten Interessen des Verantwortlichen gegenüber denen der betroffenen Person überwiegen\nWenn eine der vorgenannten Voraussetzungen gegeben ist, können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden, um die Einschränkung der Verarbeitung personenbezogener Daten beim Betreiber dieser Website zu verlangen. Der Datenschutzbeauftragte dieser Website wird die Einschränkung der Verarbeitung veranlassen.",
      {
        "sub": "Recht auf Datenübertragbarkeit"
      },
      "Jede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, die sie betreffenden personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten. Darüber hinaus hat die betroffene Person das Recht, zu erwirken, dass die personenbezogenen Daten direkt von einem für die Verarbeitung Verantwortlichen an einen anderen für die Verarbeitung Verantwortlichen übermittelt werden, sofern dies technisch machbar ist und sofern dadurch nicht die Rechte und Freiheiten anderer Personen beeinträchtigt werden.\nUm das Recht auf Datenübertragbarkeit geltend zu machen, können Sie sich jederzeit an den vom Betreiber dieser Website benannten Datenschutzbeauftragten wenden.\nEin Widerspruchsrecht\nJede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, aus Gründen, die sich aus ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung sie betreffender personenbezogener Daten Widerspruch einzulegen.\nDer Betreiber dieser Website wird die personenbezogenen Daten im Falle des Widerspruchs nicht mehr verarbeiten, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die die Interessen, Rechte und Freiheiten der betroffenen Person überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.\nUm von Ihrem Widerspruchsrecht Gebrauch zu machen, können Sie sich direkt an den Datenschutzbeauftragten dieser Website wenden.\nRecht auf Widerruf einer datenschutzrechtlichen Einwilligung\nJede von der Verarbeitung personenbezogener Daten betroffene Person hat das Recht, eine erteilte Einwilligung in die Verarbeitung personenbezogener Daten jederzeit zu widerrufen.\nWenn Sie von Ihrem Recht auf Widerruf einer Einwilligung Gebrauch machen möchten, können Sie sich jederzeit an unseren Datenschutzbeauftragten wenden."
    ]
  },
  {
    "heading": "Kostenpflichtige Dienste",
    "blocks": [
      "Für die Erbringung von kostenpflichtigen Dienstleistungen fragen wir weitere Daten, wie z.B. Zahlungsdaten, ab, um Ihren Auftrag ausführen zu können. Wir speichern diese Daten in unseren Systemen, bis die gesetzlichen Aufbewahrungsfristen abgelaufen sind."
    ]
  },
  {
    "heading": "Urheberrechte",
    "blocks": [
      "Das Urheberrecht und alle anderen Rechte an den Inhalten, Bildern, Fotos oder sonstigen Dateien auf der Website gehören ausschliesslich dem Betreiber dieser Website oder den namentlich genannten Rechteinhabern. Für die Vervielfältigung sämtlicher Dateien muss vorab die schriftliche Zustimmung der Urheberrechtsinhaber eingeholt werden.\nWer ohne Zustimmung der jeweiligen Urheberrechtsinhaber eine Urheberrechtsverletzung begeht, kann sich strafbar machen und unter Umständen Schadenersatzansprüche geltend machen."
    ]
  },
  {
    "heading": "Haftungsausschluss",
    "blocks": [
      "Alle Angaben auf unserer Website wurden sorgfältig geprüft. Wir sind bemüht, dafür Sorge zu tragen, dass die von uns bereitgestellten Informationen aktuell, richtig und vollständig sind. Dennoch ist das Auftreten von Fehlern nicht völlig auszuschliessen, so dass wir für die Vollständigkeit, Richtigkeit und Aktualität der Informationen, auch journalistisch-redaktioneller Art, keine Gewähr übernehmen können. Haftungsansprüche, die sich auf Schäden materieller oder ideeller Art beziehen, welche durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen.\nDer Herausgeber kann Texte nach eigenem Ermessen und ohne vorherige Ankündigung ändern oder löschen und ist nicht dazu verpflichtet, die Inhalte dieser Website zu aktualisieren. Die Nutzung dieser Website bzw. der Zugang zu ihr erfolgt auf eigenes Risiko des Besuchers. Der Herausgeber, seine Kunden oder Partner sind nicht verantwortlich für Schäden, wie z.B. direkte, indirekte, zufällige oder Folgeschäden, die angeblich durch den Besuch dieser Website verursacht wurden und übernehmen folglich keine Haftung für solche Schäden.\nDer Herausgeber übernimmt auch keine Verantwortung oder Haftung für den Inhalt und die Verfügbarkeit von Websites Dritter, die über externe Links von dieser Website aus erreicht werden können. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich. Der Herausgeber distanziert sich daher ausdrücklich von allen fremden Inhalten, die möglicherweise straf- oder haftungsrechtlich relevant sind oder gegen die guten Sitten verstossen."
    ]
  },
  {
    "heading": "Google Maps",
    "blocks": [
      "Diese Website nutzt das Angebot von Google Maps. Dies ermöglicht es uns, interaktive Karten direkt auf der Website darzustellen und Ihnen die komfortable Nutzung der Kartenfunktion zu ermöglichen. Durch den Besuch der Website erhält Google die Information, dass Sie die entsprechende Unterseite unserer Website aufgerufen haben. Dies geschieht unabhängig davon, ob Google ein Nutzerkonto bereitstellt, über das Sie eingeloggt sind, oder ob kein Nutzerkonto vorhanden ist. Wenn Sie bei Google eingeloggt sind, werden Ihre Daten direkt Ihrem Konto zugeordnet. Wenn Sie die Zuordnung zu Ihrem Profil bei Google nicht wünschen, müssen Sie sich vor Aktivierung der Schaltfläche ausloggen. Google speichert Ihre Daten als Nutzungsprofile und nutzt sie für Zwecke der Werbung, Marktforschung und/oder bedarfsgerechten Gestaltung seiner Website. Eine solche Auswertung erfolgt insbesondere (auch für nicht eingeloggte Nutzer) zur Erbringung bedarfsgerechter Werbung und um andere Nutzer des sozialen Netzwerks über Ihre Aktivitäten auf unserer Website zu informieren. Sie haben das Recht, der Erstellung dieser Nutzerprofile zu widersprechen, wobei Sie sich zur Ausübung dieses Rechts an Google wenden müssen. Nähere Informationen zu Zweck und Umfang der Datenerhebung und -verarbeitung durch Google sowie weitere Informationen zu Ihren diesbezüglichen Rechten und Einstellungsmöglichkeiten zum Schutz Ihrer Privatsphäre finden Sie unter: www.google.de/intl/de/policies/privacy."
    ]
  },
  {
    "heading": "Google Ads",
    "blocks": [
      "Diese Website verwendet Google Conversion Tracking. Wenn Sie über eine von Google geschaltete Anzeige auf unsere Website gelangt sind, wird von Google Ads ein Cookie auf Ihrem Computer gesetzt. Das Cookie für das Conversion-Tracking wird gesetzt, wenn ein Nutzer auf eine von Google geschaltete Anzeige klickt. Diese Cookies verlieren nach 30 Tagen ihre Gültigkeit und werden nicht zur persönlichen Identifizierung verwendet. Wenn der Nutzer bestimmte Seiten unserer Website besucht und das Cookie noch nicht abgelaufen ist, können wir und Google erkennen, dass der Nutzer auf die Anzeige geklickt hat und zu dieser Seite weitergeleitet wurde. Jeder Google Ads-Kunde erhält ein anderes Cookie. Cookies können daher nicht über die Websites der Ads-Kunden hinweg nachverfolgt werden. Die mithilfe des Conversion-Cookies gewonnenen Informationen werden verwendet, um Conversion-Statistiken für Ads-Kunden zu erstellen, die sich für das Conversion-Tracking entschieden haben. Die Kunden erfahren die Gesamtzahl der Nutzer, die auf ihre Anzeige geklickt haben und zu einer mit einem Conversion-Tracking-Tag versehenen Seite weitergeleitet wurden. Sie erhalten jedoch keine Informationen, die zur persönlichen Identifizierung von Nutzern verwendet werden können.\nWenn Sie nicht am Tracking teilnehmen möchten, können Sie das Setzen eines dafür erforderlichen Cookies verweigern – zum Beispiel durch eine Browser-Einstellung, die das automatische Setzen von Cookies generell deaktiviert, oder indem Sie Ihren Browser so einstellen, dass Cookies von der Domain „googleleadservices.com“ blockiert werden.\nBitte beachten Sie, dass Sie die Opt-Out-Cookies nicht löschen dürfen, solange Sie nicht möchten, dass Messdaten erfasst werden. Wenn Sie alle Ihre Cookies im Browser gelöscht haben, müssen Sie das jeweilige Opt-Out-Cookie erneut setzen."
    ]
  },
  {
    "heading": "Google Remarketing",
    "blocks": [
      "Diese Website benutzt die Remarketing-Funktion der Google Inc. Die Funktion dient dazu, Website-Besuchern innerhalb des Google-Werbenetzwerks interessenbezogene Werbung zu präsentieren. Im Browser des Website-Besuchers wird ein sogenanntes „Cookie“ gespeichert, das es ermöglicht, den Besucher wiederzuerkennen, wenn er Websites besucht, die dem Google-Werbenetzwerk angehören. Auf diesen Websites kann dem Besucher Werbung angezeigt werden, die sich auf Inhalte bezieht, die der Besucher zuvor auf Websites aufgerufen hat, die die Remarketing-Funktion von Google nutzen.\nNach eigenen Angaben erhebt Google bei diesem Vorgang keine personenbezogenen Daten. Wenn Sie die Remarketing-Funktion von Google jedoch nicht nutzen möchten, können Sie diese grundsätzlich deaktivieren, indem Sie die entsprechenden Einstellungen unter http://www.google.com/settings/ads vornehmen. Alternativ können Sie die Verwendung von Cookies für interessenbezogene Werbung über die Werbenetzwerk-Initiative deaktivieren, indem Sie den Anweisungen unter http://www.networkadvertising.org/managing/opt_out.asp folgen."
    ]
  },
  {
    "heading": "Google reCAPTCHA",
    "blocks": [
      "Diese Website verwendet den reCAPTCHA-Dienst von Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland „Google“). Die Abfrage dient dazu, zu unterscheiden, ob die Eingabe durch einen Menschen oder durch eine automatisierte, maschinelle Verarbeitung erfolgt. Die Abfrage beinhaltet die Übermittlung der IP-Adresse und ggf. weiterer von Google für den reCAPTCHA-Dienst benötigter Daten an Google. Zu diesem Zweck wird Ihre Eingabe an Google übermittelt und dort weiterverwendet. Ihre IP-Adresse wird von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung dieses Dienstes auszuwerten. Die im Rahmen von reCaptcha von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Ihre Daten können dabei auch in die USA übertragen werden. Für Datenübermittlungen in die USA gibt es einen Angemessenheitsbeschluss der Europäischen Kommission, das „Privacy Shield“. Google nimmt an dem „Privacy Shield“ teil und hat sich den Anforderungen unterworfen. Durch Betätigen der Abfrage stimmen Sie der Verarbeitung Ihrer Daten zu. Die Verarbeitung erfolgt auf Grundlage von Art. 6 (1) lit. a DSGVO mit Ihrer Einwilligung. Sie können Ihre Einwilligung jederzeit widerrufen, ohne dass die Rechtmässigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung berührt wird.\nWeitere Informationen zu Google reCAPTCHA und den dazugehörigen Datenschutzbestimmungen finden Sie unter: https://policies.google.com/privacy?hl=de"
    ]
  },
  {
    "heading": "Google Analytics",
    "blocks": [
      "Diese Website benutzt Google Analytics, einen Webanalysedienst, der von Google Ireland Limited bereitgestellt wird. Befindet sich der für die Datenverarbeitung auf dieser Website Verantwortliche ausserhalb des Europäischen Wirtschaftsraums oder der Schweiz, so wird die Datenverarbeitung von Google Analytics von Google LLC durchgeführt. Google LLC und Google Ireland Limited werden im Folgenden als „Google“ bezeichnet.\nDie gewonnenen Statistiken ermöglichen es uns, unser Angebot zu verbessern und für Sie als Nutzer interessanter zu gestalten. Diese Website verwendet Google Analytics auch für eine geräteübergreifende Analyse der Besucherströme, die über eine Benutzerkennung erfolgt. Wenn Sie über ein Google-Benutzerkonto verfügen, können Sie die geräteübergreifende Analyse Ihrer Nutzung in den dortigen Einstellungen unter „Meine Daten“, „Persönliche Daten“ deaktivieren.\nDie Rechtsgrundlage für den Einsatz von Google Analytics ist Art. 6 Abs. 1 S. 1 lit. f DS-GVO. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt. Wir weisen Sie darauf hin, dass auf dieser Website Google Analytics um den Code „_anonymizeIp();“ erweitert wurde, um eine anonymisierte Erfassung von IP-Adressen zu gewährleisten. Das bedeutet, dass IP-Adressen in gekürzter Form verarbeitet werden, so dass sie nicht mit einer bestimmten Person in Verbindung gebracht werden können. Sollten die über Sie erhobenen Daten einer Person zugeordnet werden können, wird dies sofort ausgeschlossen und die personenbezogenen Daten werden umgehend gelöscht.\nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen. Für die Ausnahmefälle, in denen personenbezogene Daten in die USA übertragen werden, hat sich Google dem EU-US Privacy Shield unterworfen, https://www.privacyshield.gov/EU-US-Framework.\nGoogle Analytics verwendet Cookies. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: Google Analytics deaktivieren.\nDarüber hinaus können Sie auch die Nutzung von Google Analytics verhindern, indem Sie auf diesen Link klicken: Google Analytics deaktivieren. Dadurch wird ein sog. Opt-Out-Cookie auf Ihrem Datenträger gespeichert, der die Verarbeitung personenbezogener Daten durch Google Analytics verhindert. Bitte beachten Sie, dass beim Löschen aller Cookies auf Ihrem Endgerät auch diese Opt-Out-Cookies gelöscht werden, d.h. Sie müssen die Opt-Out-Cookies erneut setzen, wenn Sie diese Form der Datenerhebung weiterhin verhindern wollen. Die Opt-Out-Cookies werden pro Browser und Computer/Endgerät gesetzt und müssen daher für jeden Browser, Computer oder jedes andere Endgerät separat aktiviert werden."
    ]
  },
  {
    "heading": "Google AdSense",
    "blocks": [
      "Wir verwenden auf dieser Website Google AdSense. Dies ist ein Werbeprogramm der Firma Google Inc. In Europa ist die Firma Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland) für alle Google-Dienste verantwortlich. Google AdSense ermöglicht es uns, auf dieser Website Anzeigen zu schalten, die für unser Thema relevant sind.",
      "Google AdSense verwendet Cookies, um Anzeigen zu schalten, die für Nutzer relevant sind, um Berichte über die Kampagnenleistung zu verbessern oder um zu verhindern, dass ein Nutzer dieselben Anzeigen mehrmals sieht. Über eine Cookie-ID zeichnet Google auf, welche Anzeigen in welchem Browser angezeigt werden, und kann so verhindern, dass sie mehrfach angezeigt werden. Darüber hinaus kann Google AdSense Cookie-IDs verwenden, um so genannte Conversions aufzuzeichnen, die mit Anzeigenaufrufen in Verbindung stehen. Dies ist zum Beispiel der Fall, wenn ein Nutzer eine Google Ads-Anzeige sieht und später mit demselben Browser die Website des Werbetreibenden aufruft und dort etwas kauft. Nach Angaben von Google enthalten Google Ads-Cookies keine persönlichen Informationen.",
      "Durch die verwendeten Marketing-Tools baut Ihr Browser automatisch eine direkte Verbindung mit dem Server von Google auf. Durch die Einbindung von Google Ads erhält Google die Information, dass Sie den entsprechenden Teil unserer Website aufgerufen oder auf eine Anzeige von uns geklickt haben. Sofern Sie bei einem Google-Dienst registriert sind, kann Google den Besuch Ihrem Konto zuordnen. Auch wenn Sie nicht bei Google registriert sind oder sich nicht eingeloggt haben, besteht die Möglichkeit, dass Google Ihre IP-Adresse in Erfahrung bringt und speichert.",
      "Sie können die Teilnahme an diesem Tracking-Verfahren auf verschiedene Weise verhindern:",
      "durch eine entsprechende Einstellung Ihrer Browser-Software; insbesondere führt die Unterdrückung von Drittanbieter-Cookies dazu, dass Sie keine Werbung von Drittanbietern erhalten;\ndurch die Deaktivierung von Conversion-Tracking-Cookies, indem Sie Ihren Browser so einstellen, dass Cookies von der Domain „www. googleadservices.com“, https://adssettings.google.com, wobei diese Einstellung gelöscht wird, wenn Sie Ihre Cookies löschen;\ndurch die Deaktivierung von interessenbezogener Werbung von den Anbietern, die Teil der Selbstregulierungskampagne „About Ads“ sind, über den Link https://www.aboutads.info/choices, wobei diese Einstellung gelöscht wird, wenn Sie Ihre Cookies löschen;\ndurch die dauerhafte Deaktivierung in Ihren Browsern Firefox, Internetexplorer oder Google Chrome über den Link https://www.google.com/settings/ads/plugin. Wir weisen Sie darauf hin, dass Sie in diesem Fall gegebenenfalls nicht alle Funktionen dieses Angebots vollumfänglich nutzen können.\nDie Rechtsgrundlage für die Verarbeitung Ihrer Daten ist eine Interessenabwägung, wonach der oben beschriebenen Verarbeitung Ihrer personenbezogenen Daten keine überwiegenden Interessen Ihrerseits entgegenstehen (Art. 6 Abs. 1 S. 1 lit. f DSGVO). Weitere Informationen zu Google Ads von Google finden Sie unter https://ads.google.com/intl/de_DE/home/, sowie zum Datenschutz bei Google allgemein: https://www.google.de/intl/de/policies/privacy. Alternativ können Sie die Website der Network Advertising Initiative (NAI) unter https://www.networkadvertising.org besuchen."
    ]
  },
  {
    "heading": "Google WebFonts",
    "blocks": [
      "Diese Website verwendet für die einheitliche Darstellung von Schriftarten sogenannte Webfonts, die von Google bereitgestellt werden. Wenn Sie eine Seite aufrufen, lädt Ihr Browser die benötigten Web Fonts in seinen Browser-Cache, um Texte und Schriften korrekt darzustellen. Wenn Ihr Browser keine Web Fonts unterstützt, wird eine Standardschriftart von Ihrem Computer verwendet.\nWeitere Informationen zu Google Web Fonts finden Sie unter https://developers.google.com/fonts/faq und in den Datenschutzbestimmungen von Google: https://www.google.com/policies/privacy/"
    ]
  },
  {
    "heading": "Google TagManager",
    "blocks": [
      "Der Google Tag Manager ist eine Lösung, mit der wir über eine Schnittstelle sogenannte Website-Tags verwalten und so z.B. Google Analytics und andere Google-Marketingdienste in unser Online-Angebot integrieren können. Der Tag Manager selbst, der die Tags implementiert, verarbeitet keine personenbezogenen Daten der Nutzer. Hinsichtlich der Verarbeitung personenbezogener Daten der Nutzer verweisen wir auf die folgenden Informationen zu den Google-Diensten. Verwendungsrichtlinien: https://www.google.com/intl/de/tagmanager/use-policy.html."
    ]
  },
  {
    "heading": "Facebook",
    "blocks": [
      "Diese Website nutzt Funktionen der Facebook Inc, 1601 S. California Ave, Palo Alto, CA 94304, USA . Wenn Sie unsere Seiten mit Facebook-Plugins aufrufen, wird eine Verbindung zwischen Ihrem Browser und den Facebook-Servern hergestellt. Dabei werden bereits Daten an Facebook übermittelt. Wenn Sie ein Facebook-Konto besitzen, können diese Daten mit diesem verknüpft werden. Wenn Sie nicht möchten, dass diese Daten mit Ihrem Facebook-Konto verknüpft werden, loggen Sie sich bitte vor dem Besuch unserer Seite bei Facebook aus. Interaktionen, insbesondere die Nutzung einer Kommentarfunktion oder das Anklicken eines „Gefällt mir“- oder „Teilen“-Buttons, werden ebenfalls an Facebook weitergeleitet. Mehr dazu erfahren Sie unter https://de-de.facebook.com/about/privacy."
    ]
  },
  {
    "heading": "Twitter",
    "blocks": [
      "Diese Website nutzt Funktionen der Twitter, Inc. 1355 Market St, Suite 900, San Francisco, CA 94103, USA. Wenn Sie unsere Seiten mit Twitter-Plug-Ins aufrufen, wird eine Verbindung zwischen Ihrem Browser und den Servern von Twitter hergestellt. Dabei werden bereits Daten an Twitter übertragen. Wenn Sie ein Twitter-Konto besitzen, können diese Daten mit diesem verknüpft werden. Wenn Sie nicht möchten, dass diese Daten mit Ihrem Twitter-Account verknüpft werden, loggen Sie sich bitte vor dem Besuch unserer Seite bei Twitter aus. Interaktionen, insbesondere das Anklicken einer „Re-Tweet“-Schaltfläche, werden ebenfalls an Twitter weitergeleitet. Mehr dazu erfahren Sie unter https://twitter.com/privacy."
    ]
  },
  {
    "heading": "Instagram",
    "blocks": [
      "Auf unserer Website sind Funktionen des Dienstes Instagram eingebunden. Diese Funktionen werden angeboten durch die Instagram Inc., 1601 Willow Road, Menlo Park, CA, 94025, USA. Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können Sie die Inhalte unserer Seiten auf Ihrem Instagram-Profil verlinken, indem Sie den Instagram-Button anklicken. Dadurch kann Instagram den Besuch unserer Seiten Ihrem Benutzerkonto zuordnen. Wir weisen darauf hin, dass wir als Anbieter der Seiten keine Kenntnis vom Inhalt der übermittelten Daten sowie deren Nutzung durch Instagram erhalten. Weitere Informationen finden Sie in den Datenschutzbestimmungen von Instagram: http://instagram.com/about/legal/privacy/"
    ]
  },
  {
    "heading": "Externe Zahlungsdienstleister",
    "blocks": [
      "Diese Website nutzt externe Zahlungsdienstleister, über deren Plattformen Nutzer und wir Zahlungstransaktionen durchführen können. Zum Beispiel über\nPostFinance (https://www.postfinance.ch/de/detail/rechtliches-barrierefreiheit.html)\nVisa (https://www.visa.de/nutzungsbedingungen/visa-privacy-center.html)\nMastercard (https://www.mastercard.ch/de-ch/datenschutz.html)\nAmerican Express (https://www.americanexpress.com/de/legal/online-datenschutzerklarung.html)\nPaypal (https://www.paypal.com/de/webapps/mpp/ua/privacy-full)\nBexio AG (https://www.bexio.com/de-CH/datenschutz)\nPayrexx AG (https://www.payrexx. ch/site/assets/files/2592/datenschutzerklaerung.pdf)\nApple Pay (https://support.apple.com/de-ch/ht203027)\nStripe (https://stripe.com/ch/privacy)\nKlarna (https://www.klarna.com/de/datenschutz/)\nSkrill (https://www.skrill.com/de/fusszeile/datenschutzrichtlinie/)\nGiropay (https://www.giropay.de/rechtliches/datenschutzerklaerung) etc.\nIm Rahmen der Vertragserfüllung setzen wir die Zahlungsdienstleister auf der Grundlage der Schweizerischen Datenschutzverordnung und, soweit erforderlich, Art. 6 Abs. 1 lit. b. EU-DSGVO. Darüber hinaus setzen wir externe Zahlungsdienstleister auf der Grundlage unserer berechtigten Interessen nach der Schweizerischen Datenschutzverordnung sowie, soweit erforderlich, nach Art. 6 Abs.. 1 lit. f. EU-DSGVO ein, um unseren Nutzern effektive und sichere Zahlungsmöglichkeiten zu bieten.\nDie von den Zahlungsdienstleistern verarbeiteten Daten umfassen u.a. Bestandsdaten, wie Name und Adresse, Bankdaten, wie Kontonummern oder Kreditkartennummern, Passwörter, TANs und Prüfsummen, sowie Vertrags-, Summen- und empfängerbezogene Informationen. Die Angaben werden benötigt, um die Transaktionen durchzuführen. Die eingegebenen Daten werden jedoch nur von den Zahlungsdienstleistern verarbeitet und bei diesen gespeichert. Wir als Betreiber erhalten keine Informationen über (Bank-)Konto oder Kreditkarte, sondern nur Informationen zur Bestätigung (Annahme) oder Ablehnung der Zahlung. Unter Umständen werden die Daten von den Zahlungsdienstleistern an Wirtschaftsauskunfteien übermittelt. Zweck dieser Übermittlung ist die Überprüfung der Identität und der Kreditwürdigkeit. Diesbezüglich verweisen wir auf die Geschäftsbedingungen und Datenschutzhinweise der Zahlungsdienstleister.\nFür den Zahlungsverkehr gelten die Geschäftsbedingungen und die Datenschutzerklärung der jeweiligen Zahlungsdienstleister, die innerhalb der jeweiligen Website oder Transaktionsanwendungen abgerufen werden können. Auf diese verweisen wir auch zum Zwecke der weiteren Information und Geltendmachung von Widerrufs-, Auskunfts- und sonstigen Betroffenenrechten."
    ]
  },
  {
    "heading": "Adobe-Schriften",
    "blocks": [
      "Wir verwenden Adobe Fonts für die visuelle Gestaltung unserer Website. Adobe Fonts ist ein Dienst von Adobe Systems Incorporated, 345 Park Avenue, San Jose, CA 95110-2704, USA (Adobe), der uns den Zugang zu einer Schriftartenbibliothek ermöglicht. Um die von uns verwendeten Schriftarten einzubinden, muss dein Browser eine Verbindung zu einem Adobe-Server in den USA herstellen und die für unsere Website erforderliche Schriftart herunterladen. Dadurch erhält Adobe die Information, dass unsere Website über deine IP-Adresse aufgerufen wurde. Weitere Informationen zu Adobe Fonts findest du in den Datenschutzbestimmungen von Adobe, die du hier abrufen kannst: https://www.adobe.com/de/privacy/policy.html"
    ]
  },
  {
    "heading": "Monotype-Schriften",
    "blocks": [
      "Diese Website nutzt Fonts.com, einen von Monotype Imaging Holdings Inc. bereitgestellten Dienst zur Visualisierung von Schriften, der es dieser Website ermöglicht, entsprechende Inhalte auf ihren Seiten einzubetten. Erfasste persönliche Daten: Nutzungsdaten und verschiedene Arten von Daten, wie in der Datenschutzrichtlinie des Dienstes beschrieben. Ort der Verarbeitung: Vereinigte Staaten von Amerika (USA); Datenschutzrichtlinien."
    ]
  },
  {
    "heading": "Audio- und Videokonferenzen",
    "blocks": [
      "Wir nutzen Audio- und Videokonferenzdienste, um mit unseren Nutzern und anderen zu kommunizieren. Insbesondere können wir damit Audio- und Videokonferenzen, virtuelle Meetings und Schulungen wie Webinare durchführen.",
      "Wir nutzen nur Dienste, für die ein angemessenes Datenschutzniveau gewährleistet ist. Neben dieser Datenschutzerklärung gelten auch die Geschäftsbedingungen der genutzten Dienste, wie z.B. Nutzungsbedingungen oder Datenschutzerklärungen.",
      "Insbesondere nutzen wir Zoom, einen Dienst der amerikanischen Zoom Video Communications Inc. Zoom gewährt auch den Nutzern in der Schweiz die Rechte nach der europäischen Datenschutzgrundverordnung (GDPR). Weitere Informationen zu Art, Umfang und Zweck der Datenverarbeitung finden Sie in den Datenschutzrichtlinien und auf der Seite „Rechtliche Bestimmungen und Datenschutz“ von Zoom jeweils."
    ]
  },
  {
    "heading": "YouTube",
    "blocks": [
      "Auf dieser Website sind Funktionen des Dienstes „YouTube“ integriert. „YouTube“ ist Eigentum von Google Ireland Limited, einem nach irischem Recht gegründeten und betriebenen Unternehmen mit Sitz in Gordon House, Barrow Street, Dublin 4, Irland, das die Dienste im Europäischen Wirtschaftsraum und in der Schweiz betreibt.\nIhre rechtliche Vereinbarung mit „YouTube“ besteht aus den Bedingungen, die Sie unter dem folgenden Link finden: https://www.youtube.com/static?gl=de&template=terms&hl=de. Diese Bedingungen stellen eine rechtsverbindliche Vereinbarung zwischen Ihnen und „YouTube“ bezüglich Ihrer Nutzung der Dienste dar. In den Datenschutzbestimmungen von Google wird erläutert, wie „YouTube“ Ihre persönlichen Daten behandelt und schützt, wenn Sie den Dienst nutzen."
    ]
  },
  {
    "heading": "Vimeo",
    "blocks": [
      "Auf dieser Website sind Plugins des Videoportals Vimeo der Vimeo, LLC, 555 West 18th Street, New York, New York 10011, USA eingebunden. Wenn Sie eine Seite aufrufen, die einen oder mehrere Vimeo-Videoclips anbietet, wird eine direkte Verbindung zwischen Ihrem Browser und einem Server von Vimeo in den USA hergestellt. Dabei werden Informationen über Ihren Besuch und Ihre IP-Adresse dort gespeichert. Durch Interaktionen mit den Vimeo-Plugins (z.B. Anklicken des Start-Buttons) werden diese Informationen ebenfalls an Vimeo übermittelt und dort gespeichert. Die Datenschutzerklärung von Vimeo mit näheren Informationen zur Erhebung und Nutzung Ihrer Daten durch Vimeo finden Sie in der Datenschutzerklärung von Vimeo.",
      "Wenn Sie ein Vimeo-Benutzerkonto haben und nicht möchten, dass Vimeo über diese Website Daten über Sie sammelt und mit Ihren bei Vimeo gespeicherten Mitgliedsdaten verknüpft, müssen Sie sich vor dem Besuch dieser Website bei Vimeo ausloggen.",
      "Zudem ruft Vimeo über einen iFrame, in dem das Video aufgerufen wird, den Google Analytics Tracker auf. Dies ist ein eigenes Tracking von Vimeo, auf das wir keinen Zugriff haben. Sie können das Tracking durch Google Analytics verhindern, indem Sie die Deaktivierungstools verwenden, die Google für einige Internetbrowser anbietet. Sie können darüber hinaus die Erfassung der durch Google Analytics erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren:",
      "https://tools.google.com/dlpage/gaoptout?hl=de"
    ]
  },
  {
    "heading": "Datenübermittlung in die USA",
    "blocks": [
      "Auf unserer Website sind u.a. Tools von Unternehmen mit Sitz in den USA eingebunden. Wenn diese Tools aktiv sind, können Ihre personenbezogenen Daten an die US-Server der jeweiligen Unternehmen übertragen werden. Wir weisen darauf hin, dass die USA kein sicherer Drittstaat im Sinne des EU-Datenschutzrechts sind. US-Unternehmen sind verpflichtet, personenbezogene Daten an Sicherheitsbehörden herauszugeben, ohne dass Sie als Betroffener dagegen rechtlich vorgehen können. Es kann daher nicht ausgeschlossen werden, dass US-Behörden (z.B. Geheimdienste) Ihre auf US-Servern befindlichen Daten zu Überwachungszwecken verarbeiten, auswerten und dauerhaft speichern. Auf diese Verarbeitungsvorgänge haben wir keinen Einfluss."
    ]
  },
  {
    "heading": "Änderungen",
    "blocks": [
      "Wir können diese Datenschutzrichtlinie jederzeit ohne vorherige Ankündigung ändern. Es gilt die jeweils aktuelle, auf unserer Website veröffentlichte Fassung. Soweit die Datenschutzerklärung Teil einer Vereinbarung mit Ihnen ist, werden wir Sie im Falle einer Aktualisierung per E-Mail oder auf andere geeignete Weise über die Änderung informieren."
    ]
  },
  {
    "heading": "Haftungsausschluss",
    "blocks": [
      "Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.\nHaftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.",
      "Alle Angebote sind freibleibend. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen."
    ]
  }
];

export const agb: LegalSection[] = [
  {
    "heading": "§ 1 Geltung, Begriffsdefinitionen",
    "blocks": [
      "(1) ROOSA AG, Kirschgartenstrasse 12, 4051 Basel, Schweiz (im Folgenden: „wir“ oder „ROOSA“) betreibt unter der Webseite https://roosa.net einen Online-Shop für Waren. Die nachfolgenden allgemeinen Geschäftsbedingungen gelten für alle Leistungen zwischen uns und unseren Kunden (im Folgenden: „Kunde“ oder „Sie“) in ihrer zum Zeitpunkt der Bestellung gültigen Fassung, soweit nicht etwas anderes ausdrücklich vereinbart wurde.",
      "(2) „Verbraucher“ im Sinne dieser Geschäftsbedingungen ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können. „Unternehmer“ ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt, wobei eine rechtsfähige Personengesellschaft eine Personengesellschaft ist, die mit der Fähigkeit ausgestattet ist, Rechte zu erwerben und Verbindlichkeiten einzugehen."
    ]
  },
  {
    "heading": "§ 2 Zustandekommen der Verträge, Speicherung des Vertragstextes",
    "blocks": [
      "(1) Die folgenden Regelungen über den Vertragsabschluss gelten für Bestellungen über unseren Online-Shop unter https://roosa.net.",
      "(2) Unsere Produktdarstellungen im Internet sind unverbindlich und kein verbindliches Angebot zum Abschluss eines Vertrages.",
      "(3) Bei Eingang einer Bestellung in unserem Online-Shop gelten folgende Regelungen: Der Kunde gibt ein bindendes Vertragsangebot ab, indem er die in unserem Online-Shop vorgesehene Bestellprozedur erfolgreich durchläuft. Die Bestellung erfolgt in folgenden Schritten:",
      {
        "list": [
          "Auswahl der gewünschten Ware,",
          "Hinzufügen der Produkte durch Anklicken des entsprechenden Buttons (z.B. „In den Warenkorb“, „In die Einkaufstasche“ o.ä.),",
          "Prüfung der Angaben im Warenkorb,",
          "Aufrufen der Bestellübersicht durch Anklicken des entsprechenden Buttons (z.B. „Weiter zur Kasse“, „Weiter zur Zahlung“, „Zur Bestellübersicht“ o.ä.),",
          "Eingabe/Prüfung der Adress- und Kontaktdaten, Auswahl der Zahlungsart, Bestätigung der AGB und Widerrufsbelehrung,",
          "Sofern die vereinbarte Beschaffenheit der Ware von deren üblichen Beschaffenheit und Verwendungsvoraussetzungen abweicht, Bestätigung einer negativen Beschaffenheitsvereinbarung,",
          "Abschluss der Bestellung durch Betätigung des Buttons „Jetzt kaufen“. Dies stellt Ihre verbindliche Bestellung dar.",
          "Der Vertrag kommt zustande, indem Ihnen innerhalb von drei Werktagen an die angegebene E-Mail-Adresse eine Bestellbestätigung von uns zugeht."
        ]
      },
      "(4) Im Falle des Vertragsschlusses kommt der Vertrag mit ROOSA AG, Kirschgartenstrasse 12, 4051 Basel, Schweiz zustande.",
      "(5) Vor der Bestellung können die Vertragsdaten über die Druckfunktion des Browsers ausgedruckt oder elektronisch gesichert werden. Die Abwicklung der Bestellung und Übermittlung aller im Zusammenhang mit dem Vertragsschluss erforderlichen Informationen, insbesondere der Bestelldaten, der AGB und der Widerrufsbelehrung, erfolgt per E-Mail nach dem Auslösen der Bestellung durch Sie, zum Teil automatisiert. Wir speichern den Vertragstext nach Vertragsschluss nicht.",
      "(6) Eingabefehler können mittels der üblichen Tastatur-, Maus- und Browser-Funktionen (z.B. »Zurück-Button« des Browsers) berichtigt werden. Sie können auch dadurch berichtigt werden, dass Sie den Bestellvorgang vorzeitig abbrechen, das Browserfenster schließen und den Vorgang wiederholen.",
      "(7) Die Abwicklung der Bestellung und Übermittlung aller im Zusammenhang mit dem Vertragsschluss erforderlichen Informationen erfolgt per E-Mail zum Teil automatisiert. Sie haben deshalb sicherzustellen, dass die von Ihnen bei uns hinterlegte E-Mail-Adresse zutreffend ist, der Empfang der E-Mails technisch sichergestellt und insbesondere nicht durch SPAM-Filter verhindert wird."
    ]
  },
  {
    "heading": "§ 3 Gegenstand des Vertrages und wesentliche Merkmale der Produkte",
    "blocks": [
      "(1) Bei unserem Online-Shop ist Vertragsgegenstand:",
      {
        "list": [
          "Der Verkauf von Waren. Die konkret angebotenen Waren können Sie unseren Artikelseiten entnehmen."
        ]
      },
      "(2) Die wesentlichen Merkmale der Ware finden sich in der Artikelbeschreibung. Sofern die vereinbarte Beschaffenheit der Ware von deren üblichen Beschaffenheit und Verwendungsvoraussetzungen abweicht, wird darauf in der Artikelbeschreibung ausdrücklich hingewiesen (negative Beschaffenheitsvereinbarung). Soweit der Kunde seine ausdrückliche Einwilligung in die negative Beschaffenheitsabweichung erteilt hat, definiert diese den Vertragsgegenstand."
    ]
  },
  {
    "heading": "§ 4 Preise, Versandkosten und Lieferung",
    "blocks": [
      "(1) Die in den jeweiligen Angeboten angeführten Preise sowie die Versandkosten sind Gesamtpreise und beinhalten alle Preisbestandteile einschließlich aller anfallenden Steuern.",
      "(2) Der jeweilige Kaufpreis ist vor der Lieferung des Produktes zu leisten (Vorkasse), es sei denn, wir bieten ausdrücklich den Kauf auf Rechnung an. Die Ihnen zur Verfügung stehenden Zahlungsarten sind unter einer entsprechend bezeichneten Schaltfläche im Online-Shop oder im jeweiligen Angebot ausgewiesen. Soweit bei den einzelnen Zahlungsarten nicht anders angegeben, sind die Zahlungsansprüche sofort zur Zahlung fällig.",
      "(3) Zusätzlich zu den angegebenen Preisen können für die Lieferung von Produkten Versandkosten anfallen, sofern der jeweilige Artikel nicht als versandkostenfrei ausgewiesen ist. Die Versandkosten werden Ihnen auf den Angeboten, ggf. im Warenkorbsystem und auf der Bestellübersicht nochmals deutlich mitgeteilt.",
      "(4) Alle angebotenen Produkte sind, sofern nicht in der Produktbeschreibung deutlich anders angegeben, sofort versandfertig (Lieferzeit: 1-3 Werktage nach dem Eingang der Zahlung).",
      "(5) Es bestehen die folgenden Liefergebietsbeschränkungen: Die Lieferung erfolgt in folgende Länder: Deutschland, Schweiz, Österreich.",
      "(6) Scheitert die Zustellung der Ware aus Gründen, die Sie zu vertreten haben, tragen Sie die uns hierdurch entstehenden angemessenen Kosten. Dies gilt im Hinblick auf die Kosten für die Hinsendung nicht, wenn Sie Ihr Widerrufsrecht wirksam ausüben. Für die Rücksendekosten gilt bei wirksamer Ausübung des Widerrufsrechts durch Sie die in der Widerrufsbelehrung von uns hierzu getroffenen Regelung."
    ]
  },
  {
    "heading": "§ 5 Zurückbehaltungsrecht, Eigentumsvorbehalt",
    "blocks": [
      "(1) Ein Zurückbehaltungsrecht können Sie nur ausüben, soweit es sich um Forderungen aus demselben Vertragsverhältnis handelt.",
      "(2) Die Ware bleibt bis zur vollständigen Zahlung des Kaufpreises unser Eigentum."
    ]
  },
  {
    "heading": "§ 6 Widerrufsrecht",
    "blocks": [
      "Als Verbraucher haben Sie ein Widerrufsrecht. Dieses richtet sich nach unserer Widerrufsbelehrung (https://roosa.net/widerrufsbelehrung/)."
    ]
  },
  {
    "heading": "§ 7 Vertragssprache",
    "blocks": [
      "Als Vertragssprache steht ausschließlich Deutsch zur Verfügung."
    ]
  },
  {
    "heading": "§ 8 Haftung",
    "blocks": [
      "(1) Vorbehaltlich der nachfolgenden Ausnahmen ist unsere Haftung für vertragliche Pflichtverletzungen sowie aus unerlaubter Handlung auf Vorsatz oder grobe Fahrlässigkeit beschränkt.",
      "(2) Wir haften bei leichter Fahrlässigkeit im Falle der Verletzung des Lebens, des Körpers, der Gesundheit oder bei Verletzung einer vertragswesentlichen Pflicht unbeschränkt. Wenn wir durch leichte Fahrlässigkeit mit der Leistung in Verzug geraten sind, wenn die Leistung unmöglich geworden ist oder wenn wir eine vertragswesentliche Pflicht verletzt haben, ist die Haftung für darauf zurückzuführende Sach- und Vermögensschäden auf den vertragstypisch vorhersehbaren Schaden begrenzt. Eine vertragswesentliche Pflicht ist eine solche, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht, deren Verletzung die Erreichung des Vertragszwecks gefährdet und auf deren Einhaltung Sie regelmäßig vertrauen dürfen. Dazu gehört insbesondere unsere Pflicht zum Tätigwerden und der Erfüllung der vertraglich geschuldeten Leistung, die in § 3 beschrieben wird."
    ]
  },
  {
    "heading": "§ 9 Gewährleistung",
    "blocks": [
      "(1) Die Gewährleistung richtet sich nach den gesetzlichen Bestimmungen.",
      "(2) Gegenüber Unternehmern beträgt die Gewährleistungsfrist auf gelieferte Sachen 12 Monate.",
      "(3) Als Verbraucher werden Sie gebeten, die Sache/die digitalen Güter oder die erbrachte Dienstleistung bei Vertragserfüllung umgehend auf Vollständigkeit, offensichtliche Mängel und Transportschäden zu überprüfen und uns sowie dem Spediteur Beanstandungen schnellstmöglich mitzuteilen. Kommen Sie dem nicht nach, hat dies natürlich keine Auswirkung auf Ihre gesetzlichen Gewährleistungsansprüche."
    ]
  },
  {
    "heading": "§ 10 Schlussbestimmungen/Streitbeilegung",
    "blocks": [
      "(1) Es gilt deutsches Recht. Bei Verbrauchern gilt diese Rechtswahl nur, soweit hierdurch der durch zwingende Bestimmungen des Rechts des Staates des gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird (Günstigkeitsprinzip).",
      "(2) Die Bestimmungen des UN-Kaufrechts finden ausdrücklich keine Anwendung.",
      "(3) Sofern es sich beim Kunden um einen Kaufmann, eine juristische Person des öffentlichen Rechts oder um ein öffentlich-rechtliches Sondervermögen handelt, ist Gerichtsstand für alle Streitigkeiten aus Vertragsverhältnissen zwischen dem Kunden und dem Anbieter der Sitz des Anbieters.",
      "(4)\n\nZur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit."
    ]
  }
];

export const widerruf: LegalSection[] = [
  {
    "heading": "Widerrufsrecht für Verbraucher",
    "blocks": [
      "(Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden kann.)"
    ]
  },
  {
    "heading": "Widerrufsrecht",
    "blocks": [
      "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",
      "Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag,",
      {
        "list": [
          "an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat, sofern Sie eine oder mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt haben und diese einheitlich geliefert wird bzw. werden, oder",
          "an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat, sofern Sie mehrere Waren im Rahmen einer einheitlichen Bestellung bestellt haben und diese getrennt geliefert werden, oder",
          "an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Teilsendung oder das letzte Stück in Besitz genommen haben bzw. hat, sofern Sie eine Ware bestellt haben, die in mehreren Teilsendungen oder Stücken geliefert wird, oder",
          "an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die erste Ware in Besitz genommen haben bzw. hat, sofern Sie einen Vertrag zur regelmäßigen Lieferung von Waren über einen festgelegten Zeitraum hinweg geschlossen haben."
        ]
      },
      "Sie können Ihr Widerrufsrecht auch online unter https://roosa.net/widerrufsbelehrung/ ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (zB durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs.",
      "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie vor Fristablauf Ihre Widerrufserklärung über die Widerrufsrechtsfunktion (den sog. „Widerrufsbutton“) versendet haben.",
      "Zudem können Sie Ihr Widerrufsrecht auszuüben, indem Sie uns (ROOSA AG, Kirschgartenstrasse 12, 4051 Basel, Schweiz, Telefonnummer: +41 58 502 23 43, E-Mail-Adresse: info@roosa.biz) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.",
      "In diesem Fall reicht zur Wahrung der Widerrufsfrist aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden."
    ]
  },
  {
    "heading": "Folgen des Widerrufs",
    "blocks": [
      "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
      "Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.",
      "Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.",
      "Wir tragen die Kosten der Rücksendung der Waren.",
      "Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist."
    ]
  },
  {
    "heading": "Ausschluss des Widerrufsrechts",
    "blocks": [
      "Das Widerrufsrecht besteht nach § 312g Abs. 2 BGB nicht bei:",
      {
        "list": [
          "Verträgen zur Lieferung alkoholischer Getränke, deren Preis bei Vertragsschluss vereinbart wurde, die aber frühestens 30 Tage nach Vertragsschluss geliefert werden können und deren aktueller Wert von Schwankungen auf dem Markt abhängt, auf die der Unternehmer keinen Einfluss hat"
        ]
      },
      {
        "list": [
          "Verträgen zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde"
        ]
      }
    ]
  },
  {
    "heading": "Muster-Widerrufsformular",
    "blocks": [
      "(Wenn Sie den Vertrag widerrufen wollen, dann nutzen Sie die online von uns bereitgestellte Widerrufsfunktion unter https://roosa.net/widerrufsbelehrung/ oder füllen Sie dieses Formular aus und senden Sie es zurück.)",
      "– An",
      "ROOSA AG, Kirschgartenstrasse 12, 4051 Basel, Schweiz, Telefonnummer: +41 58 502 23 43, E-Mail-Adresse: info@roosa.biz",
      "– Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/ die Erbringung der folgenden Dienstleistung (*)",
      "– Bestellt am (*)/erhalten am (*)",
      "– Name des/der Verbraucher(s)",
      "– Anschrift des/der Verbraucher(s)",
      "– Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
      "– Datum",
      "___________\n(*) Unzutreffendes streichen."
    ]
  }
];
