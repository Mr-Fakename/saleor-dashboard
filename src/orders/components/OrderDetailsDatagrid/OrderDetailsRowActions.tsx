import { rightColumnBoxShadow } from "@dashboard/components/Datagrid/ColumnPicker/utils";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { messages as cableConfigMessages } from "@dashboard/orders/components/OrderCableConfigurationDialog/messages";
import { IconButton } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import { Cable, Code } from "lucide-react";
import { IntlShape } from "react-intl";

import { CardMenuItem } from "../../../components/CardMenu";
import useStyles from "../../../components/Datagrid/styles";
import { messages } from "./messages";

interface OrderDetailsRowActionsProps {
  menuItems: CardMenuItem[];
  onShowMetadata: () => void;
  onShowCableConfiguration?: () => void;
  disabled?: boolean;
  intl: IntlShape;
}

export const OrderDetailsRowActions = ({
  menuItems,
  onShowMetadata,
  onShowCableConfiguration,
  disabled,
  intl,
}: OrderDetailsRowActionsProps) => {
  const classes = useStyles({ showMetadataButton: true });
  const firstMenuItem = menuItems[0];

  return (
    <div
      className={classes.rowAction}
      style={{
        boxShadow: rightColumnBoxShadow,
        ...(onShowCableConfiguration ? { gridTemplateColumns: "1fr auto 1fr auto 1fr" } : {}),
      }}
    >
      {onShowCableConfiguration && (
        <>
          <IconButton
            data-test-id="show-cable-configuration-button"
            disabled={disabled}
            onClick={onShowCableConfiguration}
            className={classes.ghostIcon}
            variant="ghost"
            title={intl.formatMessage(cableConfigMessages.showConfiguration)}
          >
            <Cable size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
          </IconButton>
          <Box height="100%" __width={1} backgroundColor={"default3"} />
        </>
      )}
      <IconButton
        data-test-id="show-metadata-button"
        disabled={disabled}
        onClick={onShowMetadata}
        className={classes.ghostIcon}
        variant="ghost"
        title={intl.formatMessage(messages.showMetadata)}
      >
        <Code size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
      </IconButton>
      {firstMenuItem?.Icon && (
        <>
          <Box height="100%" __width={1} backgroundColor={"default3"} />
          <IconButton
            data-test-id="row-action-button"
            disabled={disabled || firstMenuItem.disabled}
            onClick={() => firstMenuItem.onSelect()}
            className={classes.ghostIcon}
            variant="ghost"
            title={intl.formatMessage(messages.openProductDetail)}
          >
            {firstMenuItem.Icon}
          </IconButton>
        </>
      )}
    </div>
  );
};
