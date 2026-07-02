// Email templates with multi-language support.
//
// The message bodies below are the *inner content* only (greeting + message +
// sign-off). At send time they are wrapped in the branded Dess shell
// (wrapBrandedEmail) so manual emails match the automatic SMTP App event
// templates in email-templates/*.mjml: same logo, colors, typography, footer.

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
      subject: "Your order #{{id}} is being assembled",
      body: `<p>Hi {{name}},</p>
<p>A quick update: our workshop has started assembling your order <strong>#{{id}}</strong>. It will be ready soon!</p>
<p>Thank you for your patience.</p>
<p>Best regards,<br/>The Dess team</p>`,
    },
    FR: {
      subject: "Votre commande n°{{id}} est en cours d'assemblage",
      body: `<p>Bonjour {{name}},</p>
<p>Petite mise à jour : notre atelier a commencé l'assemblage de votre commande <strong>n°{{id}}</strong>. Elle sera bientôt prête !</p>
<p>Merci pour votre patience.</p>
<p>Cordialement,<br/>L'équipe Dess</p>`,
    },
    DE: {
      subject: "Ihre Bestellung #{{id}} wird gerade gefertigt",
      body: `<p>Hallo {{name}},</p>
<p>Ein kurzes Update: Unsere Werkstatt hat mit der Fertigung Ihrer Bestellung <strong>#{{id}}</strong> begonnen. Sie wird bald fertig sein!</p>
<p>Vielen Dank für Ihre Geduld.</p>
<p>Mit freundlichen Grüßen,<br/>Das Dess-Team</p>`,
    },
    ES: {
      subject: "Tu pedido n.º{{id}} está siendo montado",
      body: `<p>Hola {{name}},</p>
<p>Una breve actualización: nuestro taller ha comenzado el montaje de tu pedido <strong>n.º{{id}}</strong>. ¡Estará listo pronto!</p>
<p>Gracias por tu paciencia.</p>
<p>Saludos cordiales,<br/>El equipo Dess</p>`,
    },
  },
  delay: {
    EN: {
      subject: "Order #{{id}}: slight delay",
      body: `<p>Hi {{name}},</p>
<p>We wanted to let you know that we've encountered a small hiccup with your order <strong>#{{id}}</strong>. It will be delayed by 2–3 days.</p>
<p>We sincerely apologize for any inconvenience this may cause.</p>
<p>Best regards,<br/>The Dess team</p>`,
    },
    FR: {
      subject: "Commande n°{{id}} : léger retard",
      body: `<p>Bonjour {{name}},</p>
<p>Nous souhaitions vous informer que nous avons rencontré un petit contretemps concernant votre commande <strong>n°{{id}}</strong>. Elle sera retardée de 2 à 3 jours.</p>
<p>Nous nous excusons sincèrement pour la gêne occasionnée.</p>
<p>Cordialement,<br/>L'équipe Dess</p>`,
    },
    DE: {
      subject: "Bestellung #{{id}}: kleine Verzögerung",
      body: `<p>Hallo {{name}},</p>
<p>Wir möchten Sie darüber informieren, dass es bei Ihrer Bestellung <strong>#{{id}}</strong> zu einer kleinen Verzögerung kommt. Sie verzögert sich um 2–3 Tage.</p>
<p>Wir entschuldigen uns aufrichtig für etwaige Unannehmlichkeiten.</p>
<p>Mit freundlichen Grüßen,<br/>Das Dess-Team</p>`,
    },
    ES: {
      subject: "Pedido n.º{{id}}: pequeño retraso",
      body: `<p>Hola {{name}},</p>
<p>Queremos informarte de que hemos tenido un pequeño contratiempo con tu pedido <strong>n.º{{id}}</strong>. Se retrasará 2–3 días.</p>
<p>Pedimos disculpas por cualquier molestia que esto pueda causar.</p>
<p>Saludos cordiales,<br/>El equipo Dess</p>`,
    },
  },
  shipping_soon: {
    EN: {
      subject: "Good news! Order #{{id}} ships soon",
      body: `<p>Hi {{name}},</p>
<p>Great news! Your order <strong>#{{id}}</strong> is almost ready and will be shipped very soon. You'll receive tracking information once it's on its way.</p>
<p>Thank you for shopping with us!</p>
<p>Best regards,<br/>The Dess team</p>`,
    },
    FR: {
      subject: "Bonne nouvelle ! Commande n°{{id}} bientôt expédiée",
      body: `<p>Bonjour {{name}},</p>
<p>Excellente nouvelle ! Votre commande <strong>n°{{id}}</strong> est presque prête et sera expédiée très prochainement. Vous recevrez les informations de suivi dès qu'elle sera en route.</p>
<p>Merci pour votre confiance !</p>
<p>Cordialement,<br/>L'équipe Dess</p>`,
    },
    DE: {
      subject: "Gute Nachrichten! Bestellung #{{id}} wird bald versandt",
      body: `<p>Hallo {{name}},</p>
<p>Tolle Neuigkeiten! Ihre Bestellung <strong>#{{id}}</strong> ist fast fertig und wird sehr bald versandt. Sie erhalten die Sendungsverfolgung, sobald sie unterwegs ist.</p>
<p>Vielen Dank für Ihren Einkauf!</p>
<p>Mit freundlichen Grüßen,<br/>Das Dess-Team</p>`,
    },
    ES: {
      subject: "¡Buenas noticias! El pedido n.º{{id}} se enviará pronto",
      body: `<p>Hola {{name}},</p>
<p>¡Excelentes noticias! Tu pedido <strong>n.º{{id}}</strong> está casi listo y será enviado muy pronto. Recibirás la información de seguimiento en cuanto esté en camino.</p>
<p>¡Gracias por comprar con nosotros!</p>
<p>Saludos cordiales,<br/>El equipo Dess</p>`,
    },
  },
  quality_check: {
    EN: {
      subject: "Order #{{id}}: quality check in progress",
      body: `<p>Hi {{name}},</p>
<p>Your order <strong>#{{id}}</strong> is currently going through our quality checks. We want to make sure everything is perfect before shipping it to you.</p>
<p>This should only take a short while longer.</p>
<p>Best regards,<br/>The Dess team</p>`,
    },
    FR: {
      subject: "Commande n°{{id}} : contrôle qualité en cours",
      body: `<p>Bonjour {{name}},</p>
<p>Votre commande <strong>n°{{id}}</strong> est actuellement en cours de contrôle qualité. Nous voulons nous assurer que tout est parfait avant de vous l'expédier.</p>
<p>Cela ne devrait prendre que peu de temps.</p>
<p>Cordialement,<br/>L'équipe Dess</p>`,
    },
    DE: {
      subject: "Bestellung #{{id}}: Qualitätskontrolle läuft",
      body: `<p>Hallo {{name}},</p>
<p>Ihre Bestellung <strong>#{{id}}</strong> durchläuft derzeit unsere Qualitätskontrolle. Wir möchten sicherstellen, dass alles perfekt ist, bevor wir sie an Sie versenden.</p>
<p>Dies sollte nur noch kurze Zeit dauern.</p>
<p>Mit freundlichen Grüßen,<br/>Das Dess-Team</p>`,
    },
    ES: {
      subject: "Pedido n.º{{id}}: control de calidad en curso",
      body: `<p>Hola {{name}},</p>
<p>Tu pedido <strong>n.º{{id}}</strong> está pasando por nuestro control de calidad. Queremos asegurarnos de que todo esté perfecto antes de enviártelo.</p>
<p>Esto solo debería tomar un poco más de tiempo.</p>
<p>Saludos cordiales,<br/>El equipo Dess</p>`,
    },
  },
  custom: {
    EN: {
      subject: "Update regarding your order #{{id}}",
      body: `<p>Hi {{name}},</p>
<p>[Your custom message here]</p>
<p>Best regards,<br/>The Dess team</p>`,
    },
    FR: {
      subject: "Mise à jour concernant votre commande n°{{id}}",
      body: `<p>Bonjour {{name}},</p>
<p>[Votre message personnalisé ici]</p>
<p>Cordialement,<br/>L'équipe Dess</p>`,
    },
    DE: {
      subject: "Update zu Ihrer Bestellung #{{id}}",
      body: `<p>Hallo {{name}},</p>
<p>[Ihre persönliche Nachricht hier]</p>
<p>Mit freundlichen Grüßen,<br/>Das Dess-Team</p>`,
    },
    ES: {
      subject: "Actualización sobre tu pedido n.º{{id}}",
      body: `<p>Hola {{name}},</p>
<p>[Tu mensaje personalizado aquí]</p>
<p>Saludos cordiales,<br/>El equipo Dess</p>`,
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

/**
 * Wrap the message content in the branded Dess email shell so manual emails
 * look identical to the automatic SMTP App event emails (email-templates/*.mjml):
 * light warm-gray background, white rounded card, logo + blue divider header,
 * and the standard footer (contact, social, legal links).
 *
 * The markup is table-based with inline styles for email-client compatibility
 * (the SMTP App's /api/send transports the HTML as-is, without MJML compilation).
 */
export const wrapBrandedEmail = (bodyHtml: string): string => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>Dess</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f4f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f4f2;">
  <tr>
    <td align="center" style="padding:32px 24px 8px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
        <tr>
          <td align="center" style="padding:0;">
            <img src="https://www.dess-equipement.com/logo-dess-2023.png" alt="Dess" width="116" style="display:block;width:116px;height:auto;border:0;"/>
            <div style="height:14px;line-height:14px;">&nbsp;</div>
            <div style="width:40px;border-top:2px solid #003db0;margin:0 auto;"></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:24px 24px 0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border-radius:16px;">
        <tr>
          <td style="padding:40px 30px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:1.65;color:#44403c;">
            ${bodyHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding:24px 24px 36px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
        <tr>
          <td align="center" style="font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.7;color:#78716c;">
            <strong style="color:#44403c;">Dess</strong><br/>
            <a href="mailto:contact@dess-equipement.com" style="color:#003db0;text-decoration:none;">contact@dess-equipement.com</a> &nbsp;&middot;&nbsp; +33 6 63 65 72 70
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:14px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#a8a29e;">
            <a href="https://www.dess-equipement.com/mentions-legales" style="color:#a8a29e;text-decoration:none;">Mentions l&eacute;gales</a> &nbsp;&middot;&nbsp; <a href="https://www.dess-equipement.com/confidentialite" style="color:#a8a29e;text-decoration:none;">Confidentialit&eacute;</a> &nbsp;&middot;&nbsp; <a href="https://www.dess-equipement.com/retractation" style="color:#a8a29e;text-decoration:none;">R&eacute;tractation</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:10px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#a8a29e;">
            &copy; Dess &mdash; Tous droits r&eacute;serv&eacute;s.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
