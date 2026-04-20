import { useUser } from "@dashboard/auth";
import { getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { homePageMessages } from "./messages";

export const WelcomePageTitle = () => {
  const { user } = useUser();
  const userName = getUserName(user, true);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Text as="h1" size={9} data-test-id="home-header">
        <FormattedMessage {...homePageMessages.title} values={{ userName }} />
      </Text>
      <Text size={4} color="default2">
        <FormattedMessage {...homePageMessages.subtitle} />
      </Text>
    </Box>
  );
};
