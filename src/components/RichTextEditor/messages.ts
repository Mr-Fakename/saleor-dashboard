import { defineMessages, IntlShape } from "react-intl";

export const editorJsMessages = defineMessages({
  toolNameText: {
    defaultMessage: "Text",
    id: "aA8bDw",
  },
  toolNameHeading: {
    defaultMessage: "Heading",
    id: "jT6/da",
  },
  toolNameList: {
    defaultMessage: "List",
    id: "nOk9mh",
  },
  toolNameOrderedList: {
    defaultMessage: "Ordered List",
    id: "rU4xig",
  },
  toolNameUnorderedList: {
    defaultMessage: "Unordered List",
    id: "doCCAq",
  },
  toolNameChecklist: {
    defaultMessage: "Checklist",
    id: "soCLV+",
  },
  toolNameQuote: {
    defaultMessage: "Quote",
    id: "atzUcB",
  },
  toolNameWarning: {
    defaultMessage: "Warning",
    id: "3SVI5p",
  },
  toolNameCode: {
    defaultMessage: "Code",
    id: "h2vipu",
  },
  toolNameDelimiter: {
    defaultMessage: "Delimiter",
    id: "Cj3YE3",
  },
  toolNameRawHTML: {
    defaultMessage: "Raw HTML",
    id: "6FG1eo",
  },
  toolNameTable: {
    defaultMessage: "Table",
    id: "IeBejt",
  },
  toolNameImage: {
    defaultMessage: "Image",
    id: "+0zv6g",
  },
  toolNameAttachment: {
    defaultMessage: "Attachment",
    id: "eLCAEP",
  },
  toolNameEmbed: {
    defaultMessage: "Embed",
    id: "bp3HuS",
  },
  toolNameBold: {
    defaultMessage: "Bold",
    id: "Dkkmwm",
  },
  toolNameItalic: {
    defaultMessage: "Italic",
    id: "g2V+es",
  },
  toolNameLink: {
    defaultMessage: "Link",
    id: "JBWS0c",
  },
  toolNameStrikethrough: {
    defaultMessage: "Strikethrough",
    id: "lH8y+X",
  },
  toolNameMarker: {
    defaultMessage: "Marker",
    id: "lOuRIe",
  },
  toolNameUnderline: {
    defaultMessage: "Underline",
    id: "SOtMvF",
  },
  toolNameInlineCode: {
    defaultMessage: "Inline Code",
    id: "B8y7Vr",
  },
  warningTitle: {
    defaultMessage: "Title",
    id: "9a9+ww",
  },
  warningMessage: {
    defaultMessage: "Message",
    id: "T7Ry38",
  },
  uiBlockTunesToggler: {
    defaultMessage: "Click to tune",
    id: "haWsfa",
  },
  uiToolboxAdd: {
    defaultMessage: "Add",
    id: "2/2yg+",
  },
  uiToolboxFilter: {
    defaultMessage: "Filter",
    id: "9Obw6C",
  },
  uiToolboxNothingFound: {
    defaultMessage: "Nothing found",
    id: "bz4Mm+",
  },
  uiInlineToolbarFilter: {
    defaultMessage: "Filter",
    id: "9Obw6C",
  },
  uiInlineToolbarNothingFound: {
    defaultMessage: "Nothing found",
    id: "bz4Mm+",
  },
  uiPopoverFilter: {
    defaultMessage: "Filter",
    id: "9Obw6C",
  },
  uiPopoverNothingFound: {
    defaultMessage: "Nothing found",
    id: "bz4Mm+",
  },
});

export function getEditorJsI18nConfig(intl: IntlShape) {
  return {
    messages: {
      ui: {
        blockTunes: {
          toggler: {
            "Click to tune": intl.formatMessage(editorJsMessages.uiBlockTunesToggler),
          },
        },
        inlineToolbar: {
          converter: {
            "Convert to": intl.formatMessage({
              defaultMessage: "Convert to",
              id: "Cv40mP",
            }),
          },
        },
        toolbar: {
          toolbox: {
            Add: intl.formatMessage(editorJsMessages.uiToolboxAdd),
            Filter: intl.formatMessage(editorJsMessages.uiToolboxFilter),
            "Nothing found": intl.formatMessage(editorJsMessages.uiToolboxNothingFound),
          },
        },
        popover: {
          Filter: intl.formatMessage(editorJsMessages.uiPopoverFilter),
          "Nothing found": intl.formatMessage(editorJsMessages.uiPopoverNothingFound),
        },
      },
      toolNames: {
        Text: intl.formatMessage(editorJsMessages.toolNameText),
        Heading: intl.formatMessage(editorJsMessages.toolNameHeading),
        List: intl.formatMessage(editorJsMessages.toolNameList),
        "Ordered List": intl.formatMessage(editorJsMessages.toolNameOrderedList),
        "Unordered List": intl.formatMessage(editorJsMessages.toolNameUnorderedList),
        Checklist: intl.formatMessage(editorJsMessages.toolNameChecklist),
        Quote: intl.formatMessage(editorJsMessages.toolNameQuote),
        Warning: intl.formatMessage(editorJsMessages.toolNameWarning),
        Code: intl.formatMessage(editorJsMessages.toolNameCode),
        Delimiter: intl.formatMessage(editorJsMessages.toolNameDelimiter),
        "Raw HTML": intl.formatMessage(editorJsMessages.toolNameRawHTML),
        Table: intl.formatMessage(editorJsMessages.toolNameTable),
        Image: intl.formatMessage(editorJsMessages.toolNameImage),
        Attachment: intl.formatMessage(editorJsMessages.toolNameAttachment),
        Embed: intl.formatMessage(editorJsMessages.toolNameEmbed),
        Bold: intl.formatMessage(editorJsMessages.toolNameBold),
        Italic: intl.formatMessage(editorJsMessages.toolNameItalic),
        Link: intl.formatMessage(editorJsMessages.toolNameLink),
        Strikethrough: intl.formatMessage(editorJsMessages.toolNameStrikethrough),
        Marker: intl.formatMessage(editorJsMessages.toolNameMarker),
        Underline: intl.formatMessage(editorJsMessages.toolNameUnderline),
        InlineCode: intl.formatMessage(editorJsMessages.toolNameInlineCode),
      },
      tools: {
        warning: {
          Title: intl.formatMessage(editorJsMessages.warningTitle),
          Message: intl.formatMessage(editorJsMessages.warningMessage),
        },
      },
    },
  };
}
