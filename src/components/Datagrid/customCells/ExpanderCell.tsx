import {
  CustomCell,
  CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";

export interface ExpanderCellProps {
  readonly kind: "expander-cell";
  readonly isExpanded: boolean;
  readonly hasExpander: boolean;
}

export type ExpanderCell = CustomCell<ExpanderCellProps>;

export const expanderCellRenderer: CustomRenderer<ExpanderCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is ExpanderCell =>
    (cell.data as ExpanderCellProps).kind === "expander-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const { isExpanded, hasExpander } = cell.data;

    if (!hasExpander) {
      return true;
    }

    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme);
    const size = 5;

    ctx.save();
    ctx.fillStyle = theme.textMedium;
    ctx.beginPath();

    if (isExpanded) {
      // Down-pointing triangle ▼
      ctx.moveTo(centerX - size, centerY - size / 2);
      ctx.lineTo(centerX + size, centerY - size / 2);
      ctx.lineTo(centerX, centerY + size / 2);
    } else {
      // Right-pointing triangle ▶
      ctx.moveTo(centerX - size / 2, centerY - size);
      ctx.lineTo(centerX + size / 2, centerY);
      ctx.lineTo(centerX - size / 2, centerY + size);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return true;
  },
  provideEditor: () => undefined,
  onPaste: () => undefined,
};
