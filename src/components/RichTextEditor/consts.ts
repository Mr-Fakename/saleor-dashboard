// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import Attaches from "@editorjs/attaches";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Raw from "@editorjs/raw";
import Table from "@editorjs/table";
import Underline from "@editorjs/underline";
import Warning from "@editorjs/warning";
import createGenericInlineTool from "editorjs-inline-tool";

const inlineToolbar = [
  "link",
  "bold",
  "italic",
  "strikethrough",
  "marker",
  "underline",
  "inlineCode",
];

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  embed: Embed,
  header: {
    class: Header,
    config: {
      defaultLevel: 1,
      levels: [1, 2, 3, 4, 5, 6],
    },
    inlineToolbar,
  },
  list: {
    class: List,
    inlineToolbar,
  },
  quote: {
    class: Quote,
    inlineToolbar,
  },
  paragraph: {
    // @ts-expect-error Type mismatch between editorjs libraries (@editorjs/list and @editorjs/editorjs)
    class: Paragraph,
    inlineToolbar,
  },
  image: {
    class: ImageTool,
    config: {
      // Endpoints are overridden with GraphQL uploaders in RichTextEditor.tsx
      // This avoids CORS issues and uses Saleor's fileUpload mutation
      field: "image",
      types: "image/*",
    },
    inlineToolbar: ["link"],
  },
  table: {
    class: Table,
    inlineToolbar,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  code: {
    class: Code,
  },
  delimiter: Delimiter,
  warning: {
    class: Warning,
    inlineToolbar,
  },
  raw: Raw,
  attaches: {
    class: Attaches,
    config: {
      // Endpoint is overridden with GraphQL uploader in RichTextEditor.tsx
      // This avoids CORS issues and uses Saleor's fileUpload mutation
      field: "file",
      types: "*",
    },
  },
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {},
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: StrikethroughIcon,
  }),
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  underline: Underline,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C",
  },
};
