// Email templates with multi-language support

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface TemplateOverride extends EmailTemplate {
  lastModified: number;
}

export interface TemplateOverrides {
  [key: string]: TemplateOverride;
}

export interface EmailReason {
  id: string;
  labelId: string;
  defaultLabel: string;
}

// Available email reasons/categories
export const EMAIL_REASONS: EmailReason[] = [
  { id: "crafting", labelId: "emailReason.crafting", defaultLabel: "Item is being crafted" },
  { id: "delay", labelId: "emailReason.delay", defaultLabel: "Unexpected delay" },
  { id: "shipping_soon", labelId: "emailReason.shippingSoon", defaultLabel: "Shipping soon" },
  {
    id: "quality_check",
    labelId: "emailReason.qualityCheck",
    defaultLabel: "Quality check in progress",
  },
  { id: "custom", labelId: "emailReason.custom", defaultLabel: "Custom message" },
];

// Templates organized by reason and language
const TEMPLATES: Record<string, Record<string, EmailTemplate>> = {
  crafting: {
    EN: {
      subject: "Update: We are crafting your order #{{id}}",
      body: `<p>Hi {{name}},</p>
<p>Just a quick note to let you know our artisans have started working on your order. It will be ready soon!</p>
<p>Thank you for your patience.</p>
<p>Best regards,<br/>The Team</p>`,
    },
    FR: {
      subject: "Mise a jour: Nous fabriquons votre commande #{{id}}",
      body: `<p>Bonjour {{name}},</p>
<p>Nous tenions a vous informer que nos artisans ont commence a travailler sur votre commande. Elle sera bientot prete !</p>
<p>Merci pour votre patience.</p>
<p>Cordialement,<br/>L'equipe</p>`,
    },
    DE: {
      subject: "Update: Wir fertigen Ihre Bestellung #{{id}}",
      body: `<p>Hallo {{name}},</p>
<p>Wir mochten Sie informieren, dass unsere Handwerker begonnen haben, an Ihrer Bestellung zu arbeiten. Sie wird bald fertig sein!</p>
<p>Vielen Dank fur Ihre Geduld.</p>
<p>Mit freundlichen Grussen,<br/>Das Team</p>`,
    },
    ES: {
      subject: "Actualizacion: Estamos preparando tu pedido #{{id}}",
      body: `<p>Hola {{name}},</p>
<p>Queremos informarte que nuestros artesanos han comenzado a trabajar en tu pedido. Estara listo pronto!</p>
<p>Gracias por tu paciencia.</p>
<p>Saludos cordiales,<br/>El Equipo</p>`,
    },
  },
  delay: {
    EN: {
      subject: "Order #{{id}}: Slight Delay",
      body: `<p>Hi {{name}},</p>
<p>We wanted to let you know that we've encountered a small hiccup with your order. It will be delayed by 2-3 days.</p>
<p>We sincerely apologize for any inconvenience this may cause.</p>
<p>Best regards,<br/>The Team</p>`,
    },
    FR: {
      subject: "Commande #{{id}}: Leger retard",
      body: `<p>Bonjour {{name}},</p>
<p>Nous souhaitions vous informer que nous avons rencontre un petit contretemps. Votre commande sera retardee de 2-3 jours.</p>
<p>Nous nous excusons sincerement pour tout desagrement cause.</p>
<p>Cordialement,<br/>L'equipe</p>`,
    },
    DE: {
      subject: "Bestellung #{{id}}: Kleine Verzogerung",
      body: `<p>Hallo {{name}},</p>
<p>Wir mochten Sie daruber informieren, dass es zu einer kleinen Verzogerung bei Ihrer Bestellung kommt. Sie wird sich um 2-3 Tage verzogern.</p>
<p>Wir entschuldigen uns aufrichtig fur etwaige Unannehmlichkeiten.</p>
<p>Mit freundlichen Grussen,<br/>Das Team</p>`,
    },
    ES: {
      subject: "Pedido #{{id}}: Pequeno retraso",
      body: `<p>Hola {{name}},</p>
<p>Queremos informarte que hemos tenido un pequeno inconveniente. Tu pedido se retrasara 2-3 dias.</p>
<p>Pedimos disculpas por cualquier molestia que esto pueda causar.</p>
<p>Saludos cordiales,<br/>El Equipo</p>`,
    },
  },
  shipping_soon: {
    EN: {
      subject: "Good news! Order #{{id}} shipping soon",
      body: `<p>Hi {{name}},</p>
<p>Great news! Your order is almost ready and will be shipped very soon. You'll receive tracking information once it's on its way.</p>
<p>Thank you for shopping with us!</p>
<p>Best regards,<br/>The Team</p>`,
    },
    FR: {
      subject: "Bonne nouvelle! Commande #{{id}} bientot expediee",
      body: `<p>Bonjour {{name}},</p>
<p>Excellente nouvelle ! Votre commande est presque prete et sera expediee tres prochainement. Vous recevrez les informations de suivi des qu'elle sera en route.</p>
<p>Merci d'avoir fait vos achats chez nous !</p>
<p>Cordialement,<br/>L'equipe</p>`,
    },
    DE: {
      subject: "Gute Nachrichten! Bestellung #{{id}} wird bald versandt",
      body: `<p>Hallo {{name}},</p>
<p>Tolle Neuigkeiten! Ihre Bestellung ist fast fertig und wird sehr bald versandt. Sie erhalten Tracking-Informationen, sobald sie unterwegs ist.</p>
<p>Vielen Dank, dass Sie bei uns eingekauft haben!</p>
<p>Mit freundlichen Grussen,<br/>Das Team</p>`,
    },
    ES: {
      subject: "Buenas noticias! Pedido #{{id}} se enviara pronto",
      body: `<p>Hola {{name}},</p>
<p>Excelentes noticias! Tu pedido esta casi listo y sera enviado muy pronto. Recibiras la informacion de seguimiento una vez que este en camino.</p>
<p>Gracias por comprar con nosotros!</p>
<p>Saludos cordiales,<br/>El Equipo</p>`,
    },
  },
  quality_check: {
    EN: {
      subject: "Order #{{id}}: Quality Check in Progress",
      body: `<p>Hi {{name}},</p>
<p>Your order is currently going through our quality assurance process. We want to make sure everything is perfect before shipping it to you.</p>
<p>This should only take a short while longer.</p>
<p>Best regards,<br/>The Team</p>`,
    },
    FR: {
      subject: "Commande #{{id}}: Controle qualite en cours",
      body: `<p>Bonjour {{name}},</p>
<p>Votre commande est actuellement en cours de verification qualite. Nous voulons nous assurer que tout est parfait avant de vous l'expedier.</p>
<p>Cela ne devrait prendre que peu de temps.</p>
<p>Cordialement,<br/>L'equipe</p>`,
    },
    DE: {
      subject: "Bestellung #{{id}}: Qualitatskontrolle lauft",
      body: `<p>Hallo {{name}},</p>
<p>Ihre Bestellung durchlauft derzeit unsere Qualitatskontrolle. Wir mochten sicherstellen, dass alles perfekt ist, bevor wir sie an Sie versenden.</p>
<p>Dies sollte nur noch kurze Zeit dauern.</p>
<p>Mit freundlichen Grussen,<br/>Das Team</p>`,
    },
    ES: {
      subject: "Pedido #{{id}}: Control de calidad en curso",
      body: `<p>Hola {{name}},</p>
<p>Tu pedido esta pasando por nuestro proceso de control de calidad. Queremos asegurarnos de que todo este perfecto antes de enviartelo.</p>
<p>Esto solo deberia tomar un poco mas de tiempo.</p>
<p>Saludos cordiales,<br/>El Equipo</p>`,
    },
  },
  custom: {
    EN: {
      subject: "Update regarding your order #{{id}}",
      body: `<p>Hi {{name}},</p>
<p>[Your custom message here]</p>
<p>Best regards,<br/>The Team</p>`,
    },
    FR: {
      subject: "Mise a jour concernant votre commande #{{id}}",
      body: `<p>Bonjour {{name}},</p>
<p>[Votre message personnalise ici]</p>
<p>Cordialement,<br/>L'equipe</p>`,
    },
    DE: {
      subject: "Update zu Ihrer Bestellung #{{id}}",
      body: `<p>Hallo {{name}},</p>
<p>[Ihre personliche Nachricht hier]</p>
<p>Mit freundlichen Grussen,<br/>Das Team</p>`,
    },
    ES: {
      subject: "Actualizacion sobre tu pedido #{{id}}",
      body: `<p>Hola {{name}},</p>
<p>[Tu mensaje personalizado aqui]</p>
<p>Saludos cordiales,<br/>El Equipo</p>`,
    },
  },
};

/**
 * Get email template content for a given reason and language code.
 * Resolution order:
 * 1. Override (if exists for reason:lang combination)
 * 2. Template (from TEMPLATES, with language fallback)
 * Falls back to base language (e.g., 'fr' for 'fr_FR') and then to English.
 */
export const getEmailTemplate = (
  reason: string,
  langCode: string,
  overrides?: TemplateOverrides,
): EmailTemplate | null => {
  const normalizedLang = langCode.split(/[_-]/)[0].toUpperCase();
  const overrideKey = `${reason}:${normalizedLang}`;

  // Check for override first
  if (overrides && overrideKey in overrides) {
    const override = overrides[overrideKey];

    return {
      subject: override.subject,
      body: override.body,
    };
  }

  // Fall back to template
  const reasonGroup = TEMPLATES[reason];

  if (!reasonGroup) {
    return null;
  }

  // Order of preference: Normalized language -> English fallback
  return reasonGroup[normalizedLang] || reasonGroup["EN"] || null;
};

/**
 * Replace template placeholders with actual values.
 */
export const fillTemplate = (
  template: EmailTemplate,
  data: { id: string; name: string },
): EmailTemplate => {
  const replacePlaceholders = (text: string): string =>
    text.replace(/\{\{id\}\}/g, data.id).replace(/\{\{name\}\}/g, data.name);

  return {
    subject: replacePlaceholders(template.subject),
    body: replacePlaceholders(template.body),
  };
};
