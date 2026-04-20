import { defineMessages } from "react-intl";

/**
 * Email template content messages for all reasons and languages.
 * These are extracted for React Intl translation support.
 */
export const emailTemplateMessages = defineMessages({
  // Crafting reason templates
  craftingSubjectEn: {
    id: "BRI+ju",
    defaultMessage: "Update: We are crafting your order #{{id}}",
    description: "Email subject when item is being crafted",
  },
  craftingBodyEn: {
    id: "HJt3sA",
    defaultMessage:
      "<p>Hi {{name}},</p><p>Just a quick note to let you know our artisans have started working on your order. It will be ready soon!</p><p>Thank you for your patience.</p><p>Best regards,<br/>The Team</p>",
    description: "Email body when item is being crafted",
  },
  craftingSubjectFr: {
    id: "vQ4W5p",
    defaultMessage: "Mise a jour: Nous fabriquons votre commande #{{id}}",
    description: "French - Email subject when item is being crafted",
  },
  craftingBodyFr: {
    id: "JfwOIS",
    defaultMessage:
      "<p>Bonjour {{name}},</p><p>Nous tenions a vous informer que nos artisans ont commence a travailler sur votre commande. Elle sera bientot prete !</p><p>Merci pour votre patience.</p><p>Cordialement,<br/>L'equipe</p>",
    description: "French - Email body when item is being crafted",
  },
  craftingSubjectDe: {
    id: "iEnxYC",
    defaultMessage: "Update: Wir fertigen Ihre Bestellung #{{id}}",
    description: "German - Email subject when item is being crafted",
  },
  craftingBodyDe: {
    id: "ri9d81",
    defaultMessage:
      "<p>Hallo {{name}},</p><p>Wir mochten Sie informieren, dass unsere Handwerker begonnen haben, an Ihrer Bestellung zu arbeiten. Sie wird bald fertig sein!</p><p>Vielen Dank fur Ihre Geduld.</p><p>Mit freundlichen Grussen,<br/>Das Team</p>",
    description: "German - Email body when item is being crafted",
  },
  craftingSubjectEs: {
    id: "Gp51G8",
    defaultMessage: "Actualizacion: Estamos preparando tu pedido #{{id}}",
    description: "Spanish - Email subject when item is being crafted",
  },
  craftingBodyEs: {
    id: "/1OwY6",
    defaultMessage:
      "<p>Hola {{name}},</p><p>Queremos informarte que nuestros artesanos han comenzado a trabajar en tu pedido. Estara listo pronto!</p><p>Gracias por tu paciencia.</p><p>Saludos cordiales,<br/>El Equipo</p>",
    description: "Spanish - Email body when item is being crafted",
  },

  // Delay reason templates
  delaySubjectEn: {
    id: "xKLSF9",
    defaultMessage: "Order #{{id}}: Slight Delay",
    description: "Email subject for unexpected delay",
  },
  delayBodyEn: {
    id: "NV77ue",
    defaultMessage:
      "<p>Hi {{name}},</p><p>We wanted to let you know that we've encountered a small hiccup with your order. It will be delayed by 2-3 days.</p><p>We sincerely apologize for any inconvenience this may cause.</p><p>Best regards,<br/>The Team</p>",
    description: "Email body for unexpected delay",
  },
  delaySubjectFr: {
    id: "EAEVD1",
    defaultMessage: "Commande #{{id}}: Leger retard",
    description: "French - Email subject for unexpected delay",
  },
  delayBodyFr: {
    id: "fPZ/+P",
    defaultMessage:
      "<p>Bonjour {{name}},</p><p>Nous souhaitions vous informer que nous avons rencontre un petit contretemps. Votre commande sera retardee de 2-3 jours.</p><p>Nous nous excusons sincerement pour tout desagrement cause.</p><p>Cordialement,<br/>L'equipe</p>",
    description: "French - Email body for unexpected delay",
  },
  delaySubjectDe: {
    id: "tWss84",
    defaultMessage: "Bestellung #{{id}}: Kleine Verzogerung",
    description: "German - Email subject for unexpected delay",
  },
  delayBodyDe: {
    id: "70O9Ez",
    defaultMessage:
      "<p>Hallo {{name}},</p><p>Wir mochten Sie daruber informieren, dass es zu einer kleinen Verzogerung bei Ihrer Bestellung kommt. Sie wird sich um 2-3 Tage verzogern.</p><p>Wir entschuldigen uns aufrichtig fur etwaige Unannehmlichkeiten.</p><p>Mit freundlichen Grussen,<br/>Das Team</p>",
    description: "German - Email body for unexpected delay",
  },
  delaySubjectEs: {
    id: "3b9sS4",
    defaultMessage: "Pedido #{{id}}: Pequeno retraso",
    description: "Spanish - Email subject for unexpected delay",
  },
  delayBodyEs: {
    id: "7L7iMl",
    defaultMessage:
      "<p>Hola {{name}},</p><p>Queremos informarte que hemos tenido un pequeno inconveniente. Tu pedido se retrasara 2-3 dias.</p><p>Pedimos disculpas por cualquier molestia que esto pueda causar.</p><p>Saludos cordiales,<br/>El Equipo</p>",
    description: "Spanish - Email body for unexpected delay",
  },

  // Shipping soon reason templates
  shippingSoonSubjectEn: {
    id: "4FVLZE",
    defaultMessage: "Good news! Order #{{id}} shipping soon",
    description: "Email subject for shipping soon notification",
  },
  shippingSoonBodyEn: {
    id: "KZgSgn",
    defaultMessage:
      "<p>Hi {{name}},</p><p>Great news! Your order is almost ready and will be shipped very soon. You'll receive tracking information once it's on its way.</p><p>Thank you for shopping with us!</p><p>Best regards,<br/>The Team</p>",
    description: "Email body for shipping soon notification",
  },
  shippingSoonSubjectFr: {
    id: "ikvxkI",
    defaultMessage: "Bonne nouvelle! Commande #{{id}} bientot expediee",
    description: "French - Email subject for shipping soon notification",
  },
  shippingSoonBodyFr: {
    id: "r6H7Jf",
    defaultMessage:
      "<p>Bonjour {{name}},</p><p>Excellente nouvelle ! Votre commande est presque prete et sera expediee tres prochainement. Vous recevrez les informations de suivi des qu'elle sera en route.</p><p>Merci d'avoir fait vos achats chez nous !</p><p>Cordialement,<br/>L'equipe</p>",
    description: "French - Email body for shipping soon notification",
  },
  shippingSoonSubjectDe: {
    id: "V5SxnE",
    defaultMessage: "Gute Nachrichten! Bestellung #{{id}} wird bald versandt",
    description: "German - Email subject for shipping soon notification",
  },
  shippingSoonBodyDe: {
    id: "kwS2h/",
    defaultMessage:
      "<p>Hallo {{name}},</p><p>Tolle Neuigkeiten! Ihre Bestellung ist fast fertig und wird sehr bald versandt. Sie erhalten Tracking-Informationen, sobald sie unterwegs ist.</p><p>Vielen Dank, dass Sie bei uns eingekauft haben!</p><p>Mit freundlichen Grussen,<br/>Das Team</p>",
    description: "German - Email body for shipping soon notification",
  },
  shippingSoonSubjectEs: {
    id: "8VCGUp",
    defaultMessage: "Buenas noticias! Pedido #{{id}} se enviara pronto",
    description: "Spanish - Email subject for shipping soon notification",
  },
  shippingSoonBodyEs: {
    id: "jnpw1K",
    defaultMessage:
      "<p>Hola {{name}},</p><p>Excelentes noticias! Tu pedido esta casi listo y sera enviado muy pronto. Recibiras la informacion de seguimiento una vez que este en camino.</p><p>Gracias por comprar con nosotros!</p><p>Saludos cordiales,<br/>El Equipo</p>",
    description: "Spanish - Email body for shipping soon notification",
  },

  // Quality check reason templates
  qualityCheckSubjectEn: {
    id: "gXpTmr",
    defaultMessage: "Order #{{id}}: Quality Check in Progress",
    description: "Email subject for quality check in progress",
  },
  qualityCheckBodyEn: {
    id: "ZoS9uo",
    defaultMessage:
      "<p>Hi {{name}},</p><p>Your order is currently going through our quality assurance process. We want to make sure everything is perfect before shipping it to you.</p><p>This should only take a short while longer.</p><p>Best regards,<br/>The Team</p>",
    description: "Email body for quality check in progress",
  },
  qualityCheckSubjectFr: {
    id: "vLjAce",
    defaultMessage: "Commande #{{id}}: Controle qualite en cours",
    description: "French - Email subject for quality check in progress",
  },
  qualityCheckBodyFr: {
    id: "FesXFq",
    defaultMessage:
      "<p>Bonjour {{name}},</p><p>Votre commande est actuellement en cours de verification qualite. Nous voulons nous assurer que tout est parfait avant de vous l'expedier.</p><p>Cela ne devrait prendre que peu de temps.</p><p>Cordialement,<br/>L'equipe</p>",
    description: "French - Email body for quality check in progress",
  },
  qualityCheckSubjectDe: {
    id: "gi5So+",
    defaultMessage: "Bestellung #{{id}}: Qualitatskontrolle lauft",
    description: "German - Email subject for quality check in progress",
  },
  qualityCheckBodyDe: {
    id: "bQpbUr",
    defaultMessage:
      "<p>Hallo {{name}},</p><p>Ihre Bestellung durchlauft derzeit unsere Qualitatskontrolle. Wir mochten sicherstellen, dass alles perfekt ist, bevor wir sie an Sie versenden.</p><p>Dies sollte nur noch kurze Zeit dauern.</p><p>Mit freundlichen Grussen,<br/>Das Team</p>",
    description: "German - Email body for quality check in progress",
  },
  qualityCheckSubjectEs: {
    id: "W4/2tN",
    defaultMessage: "Pedido #{{id}}: Control de calidad en curso",
    description: "Spanish - Email subject for quality check in progress",
  },
  qualityCheckBodyEs: {
    id: "ryPJWT",
    defaultMessage:
      "<p>Hola {{name}},</p><p>Tu pedido esta pasando por nuestro proceso de control de calidad. Queremos asegurarnos de que todo este perfecto antes de enviartelo.</p><p>Esto solo deberia tomar un poco mas de tiempo.</p><p>Saludos cordiales,<br/>El Equipo</p>",
    description: "Spanish - Email body for quality check in progress",
  },

  // Custom reason templates (not typically for translation, but kept for consistency)
  customSubjectEn: {
    id: "dccCge",
    defaultMessage: "Update regarding your order #{{id}}",
    description: "Email subject for custom message",
  },
  customBodyEn: {
    id: "lGzeBu",
    defaultMessage:
      "<p>Hi {{name}},</p><p>[Your custom message here]</p><p>Best regards,<br/>The Team</p>",
    description: "Email body for custom message",
  },
  customSubjectFr: {
    id: "c27Jo3",
    defaultMessage: "Mise a jour concernant votre commande #{{id}}",
    description: "French - Email subject for custom message",
  },
  customBodyFr: {
    id: "jxdFxp",
    defaultMessage:
      "<p>Bonjour {{name}},</p><p>[Votre message personnalise ici]</p><p>Cordialement,<br/>L'equipe</p>",
    description: "French - Email body for custom message",
  },
  customSubjectDe: {
    id: "SwtUI2",
    defaultMessage: "Update zu Ihrer Bestellung #{{id}}",
    description: "German - Email subject for custom message",
  },
  customBodyDe: {
    id: "Ef3D0M",
    defaultMessage:
      "<p>Hallo {{name}},</p><p>[Ihre personliche Nachricht hier]</p><p>Mit freundlichen Grussen,<br/>Das Team</p>",
    description: "German - Email body for custom message",
  },
  customSubjectEs: {
    id: "1D/vi3",
    defaultMessage: "Actualizacion sobre tu pedido #{{id}}",
    description: "Spanish - Email subject for custom message",
  },
  customBodyEs: {
    id: "ldVdCn",
    defaultMessage:
      "<p>Hola {{name}},</p><p>[Tu mensaje personalizado aqui]</p><p>Saludos cordiales,<br/>El Equipo</p>",
    description: "Spanish - Email body for custom message",
  },
});
