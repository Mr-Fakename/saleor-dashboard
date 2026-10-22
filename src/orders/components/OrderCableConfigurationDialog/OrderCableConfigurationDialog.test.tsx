import Wrapper from "@test/wrapper";
import { render, RenderResult, screen } from "@testing-library/react";

import { getCableComponentRefs, MetadataItem } from "./cableConfiguration";
import {
  OrderCableConfigurationDialog,
  OrderCableConfigurationDialogLine,
} from "./OrderCableConfigurationDialog";
import { appMarkerFor, appWrittenCableMetadata, withValue } from "./testFixtures";
import { CableComponentNames, useCableComponentNames } from "./useCableComponentNames";
import {
  CableLinePrivateMetadata,
  useCableLinePrivateMetadata,
} from "./useCableLinePrivateMetadata";

jest.mock("./useCableLinePrivateMetadata", () => ({
  useCableLinePrivateMetadata: jest.fn(),
}));
jest.mock("./useCableComponentNames", () => ({
  useCableComponentNames: jest.fn(),
}));

const mockedUseCableLinePrivateMetadata = useCableLinePrivateMetadata as jest.MockedFunction<
  typeof useCableLinePrivateMetadata
>;
const mockedUseCableComponentNames = useCableComponentNames as jest.MockedFunction<
  typeof useCableComponentNames
>;

const UNVERIFIED = "Unverified configuration";
const VERIFIED = "Verified configuration";
// runtime cutoff (window.__SALEOR_CONFIG__.CABLE_VERIFICATION_CUTOFF) used by these tests:
// orders before it may predate the marker, after it may not
const CUTOFF = "2026-10-23T00:00:00Z";
const OLD_ORDER = "2026-01-15T10:00:00+00:00";
const NEW_ORDER = "2027-01-15T10:00:00+00:00";

const originalConfig = window.__SALEOR_CONFIG__;

const setRuntimeCutoff = (value: string | undefined) => {
  window.__SALEOR_CONFIG__ = {
    ...originalConfig,
    CABLE_VERIFICATION_CUTOFF: value,
  } as typeof originalConfig;
};

beforeEach(() => {
  setRuntimeCutoff(CUTOFF);
});

afterAll(() => {
  window.__SALEOR_CONFIG__ = originalConfig;
});

const lineWith = (metadata: MetadataItem[]): OrderCableConfigurationDialogLine => ({
  id: "T3JkZXJMaW5lOjE=",
  productName: "Câble sur mesure",
  quantity: 1,
  metadata: metadata.map(item => ({ ...item, __typename: "MetadataItem" })),
  variant: null,
});

/** Saleor knows every component under the very name the cart carries. */
const honestNames = (metadata: MetadataItem[]): CableComponentNames => ({
  state: "ready",
  variants: getCableComponentRefs(metadata).map(ref => ({
    id: ref.id,
    name: ref.cartLabel ?? "",
    productName: ref.cartLabel ?? "",
  })),
});

const renderDialog = (
  line: OrderCableConfigurationDialogLine,
  marker: CableLinePrivateMetadata,
  {
    names = honestNames(line.metadata),
    orderCreatedAt = OLD_ORDER,
    channelSlug = "default-channel",
  }: { names?: CableComponentNames; orderCreatedAt?: string; channelSlug?: string } = {},
): RenderResult => {
  mockedUseCableLinePrivateMetadata.mockReturnValue(marker);
  mockedUseCableComponentNames.mockReturnValue(names);

  return render(
    <Wrapper>
      <OrderCableConfigurationDialog
        open={true}
        onClose={jest.fn()}
        orderId="order-id"
        channelSlug={channelSlug}
        orderCreatedAt={orderCreatedAt}
        line={line}
      />
    </Wrapper>,
  );
};

describe("OrderCableConfigurationDialog — configuration verification (NR-33)", () => {
  beforeEach(() => {
    mockedUseCableLinePrivateMetadata.mockReset();
    mockedUseCableComponentNames.mockReset();
  });

  it("warns softly that forged cable metadata without a marker is unverified, on an order that may predate the marker", () => {
    // Arrange — a 50 m cable described through Saleor's public checkoutLinesAdd
    const forged = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

    // Act
    renderDialog(lineWith(forged), { state: "ready", privateMetadata: [] });

    // Assert
    expect(screen.getByText(UNVERIFIED)).toBeInTheDocument();
    expect(
      screen.getByText(/created before verification existed, or modified outside the configurator/),
    ).toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
    // the (untrusted) configuration is still shown, under the warning
    expect(screen.getByText("5000 cm (50.00 m)")).toBeInTheDocument();
  });

  it("shows a matching marker as verified", () => {
    // Arrange
    const line = lineWith(appWrittenCableMetadata);

    // Act
    renderDialog(line, {
      state: "ready",
      privateMetadata: [appMarkerFor(appWrittenCableMetadata)],
    });

    // Assert
    expect(screen.getByText(VERIFIED)).toBeInTheDocument();
    expect(screen.queryByText(UNVERIFIED)).not.toBeInTheDocument();
  });

  it("warns and names the changed fields when the metadata no longer matches the marker", () => {
    // Arrange — a genuine 100 cm line whose public metadata was rewritten afterwards
    const modified = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

    // Act
    renderDialog(lineWith(modified), {
      state: "ready",
      privateMetadata: [appMarkerFor(appWrittenCableMetadata)],
    });

    // Assert
    expect(screen.getByText(UNVERIFIED)).toBeInTheDocument();
    expect(screen.getByText(/no longer match what the configurator recorded/)).toBeInTheDocument();
    expect(screen.getByText("longueur_cable_cm")).toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
  });

  it("NR-36: does not verify a line carrying a cable key the app never wrote", () => {
    // Arrange
    const withColour = [...appWrittenCableMetadata, { key: "couleur_cable_name", value: "Rouge" }];

    // Act
    renderDialog(lineWith(withColour), {
      state: "ready",
      privateMetadata: [appMarkerFor(appWrittenCableMetadata)],
    });

    // Assert
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
    expect(screen.getByText("couleur_cable_name")).toBeInTheDocument();
  });

  it("claims nothing while the marker is loading", () => {
    // Arrange
    const line = lineWith(appWrittenCableMetadata);

    // Act
    renderDialog(line, { state: "loading" });

    // Assert
    expect(screen.getByText("Checking the configuration…")).toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
    expect(screen.queryByText(UNVERIFIED)).not.toBeInTheDocument();
  });

  it("says the configuration could not be checked when the marker cannot be loaded", () => {
    // Arrange
    const line = lineWith(appWrittenCableMetadata);

    // Act
    renderDialog(line, { state: "error" });

    // Assert
    expect(screen.getByText("Configuration not checked")).toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
  });

  it("loads the private metadata of this order's line while open", () => {
    // Arrange
    const line = lineWith(appWrittenCableMetadata);

    // Act
    renderDialog(line, { state: "loading" });

    // Assert
    expect(mockedUseCableLinePrivateMetadata).toHaveBeenLastCalledWith({
      orderId: "order-id",
      lineId: line.id,
      open: true,
    });
  });
});

describe("OrderCableConfigurationDialog — missing marker after the cutoff (M1)", () => {
  beforeEach(() => {
    mockedUseCableLinePrivateMetadata.mockReset();
    mockedUseCableComponentNames.mockReset();
  });

  it("shows a missing marker as an error, with no harmless explanation, on an order created after the cutoff", () => {
    // Arrange
    const forged = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

    // Act
    renderDialog(
      lineWith(forged),
      { state: "ready", privateMetadata: [] },
      { orderCreatedAt: NEW_ORDER },
    );

    // Assert
    expect(screen.getByText(UNVERIFIED)).toBeInTheDocument();
    expect(screen.getByText(/has no configurator record, although/)).toBeInTheDocument();
    expect(screen.queryByText(/created before verification existed/)).not.toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
  });
});

describe("OrderCableConfigurationDialog — component names (NR-35)", () => {
  beforeEach(() => {
    mockedUseCableLinePrivateMetadata.mockReset();
    mockedUseCableComponentNames.mockReset();
  });

  // the cheapest valid ids, wearing the names of expensive parts
  const vouched = withValue(
    withValue(appWrittenCableMetadata, "connecteur_1_name", "Neutrik XLR gold"),
    "type_cable_name",
    "Câble Mogami",
  );
  const lyingNames = (): CableComponentNames => ({
    state: "ready",
    variants: [
      { id: "UHJvZHVjdFZhcmlhbnQ6MTAx", name: "Jack 6.35", productName: "Jack 6.35" },
      { id: "UHJvZHVjdFZhcmlhbnQ6MTEx", name: "Jack B", productName: "Jack B" },
      { id: "UHJvZHVjdFZhcmlhbnQ6MjAx", name: "Câble", productName: "Câble" },
      { id: "UHJvZHVjdFZhcmlhbnQ6MzAx", name: "Gaine", productName: "Gaine" },
    ],
  });

  it("shows the names Saleor holds for the ids, not the names the shopper typed", () => {
    // Act — even with a marker that matches (the app recorded the typed names)
    renderDialog(
      lineWith(vouched),
      { state: "ready", privateMetadata: [appMarkerFor(vouched)] },
      { names: lyingNames() },
    );

    // Assert
    expect(screen.getAllByText("Jack 6.35").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Câble").length).toBeGreaterThan(0);
    // the typed names survive only as flagged, secondary text
    expect(screen.getByText(/Cart label.*Neutrik XLR gold/)).toBeInTheDocument();
    expect(screen.getByText(/Cart label.*Câble Mogami/)).toBeInTheDocument();
    expect(screen.queryByText("Neutrik XLR gold")).not.toBeInTheDocument();
  });

  it("still shows Verified, with a WARNING, when a component no longer resolves (deleted or unpublished)", () => {
    // Arrange
    const names = lyingNames();

    if (names.state === "ready") {
      names.variants.shift();
    }

    // Act
    renderDialog(
      lineWith(appWrittenCableMetadata),
      { state: "ready", privateMetadata: [appMarkerFor(appWrittenCableMetadata)] },
      { names },
    );

    // Assert — the line matches its record: the lookup only adds a note
    expect(screen.getByText(VERIFIED)).toBeInTheDocument();
    expect(screen.getByText(/no longer in the catalogue/)).toBeInTheDocument();
    expect(screen.queryByText(UNVERIFIED)).not.toBeInTheDocument();
  });

  it("keeps the verdict and adds a note while the names are loading, and when they cannot be loaded", () => {
    // Act
    const { unmount } = renderDialog(
      lineWith(appWrittenCableMetadata),
      { state: "ready", privateMetadata: [appMarkerFor(appWrittenCableMetadata)] },
      { names: { state: "loading" } },
    );

    // Assert
    expect(screen.getByText(VERIFIED)).toBeInTheDocument();
    expect(screen.getByText("Checking the component names…")).toBeInTheDocument();
    unmount();

    renderDialog(
      lineWith(appWrittenCableMetadata),
      { state: "ready", privateMetadata: [appMarkerFor(appWrittenCableMetadata)] },
      { names: { state: "error" } },
    );
    expect(screen.getByText(VERIFIED)).toBeInTheDocument();
    expect(screen.getByText("Component names not checked")).toBeInTheDocument();
  });

  it("looks the components up in the order's channel", () => {
    // Act
    renderDialog(
      lineWith(appWrittenCableMetadata),
      { state: "loading" },
      { channelSlug: "default-channel" },
    );

    // Assert
    expect(mockedUseCableComponentNames).toHaveBeenLastCalledWith(
      expect.objectContaining({ channel: "default-channel", open: true }),
    );
  });
});

describe("OrderCableConfigurationDialog — the marker verdict is never replaced by the name lookup (P2-a)", () => {
  beforeEach(() => {
    mockedUseCableLinePrivateMetadata.mockReset();
    mockedUseCableComponentNames.mockReset();
  });

  const FORGED_REQUIRED = /has no configurator record, although/;
  const forged = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

  it.each([
    [
      "errors (e.g. a malformed id such as x rejected the whole query)",
      { state: "error" } as CableComponentNames,
    ],
    ["is still loading", { state: "loading" } as CableComponentNames],
    ["returns nothing", { state: "ready", variants: [] } as CableComponentNames],
  ])("keeps 'treat as forged' when the name lookup %s", (_label, names) => {
    // Act — no marker on an order created after the cutoff
    renderDialog(
      lineWith(forged),
      { state: "ready", privateMetadata: [] },
      { names, orderCreatedAt: NEW_ORDER },
    );

    // Assert
    expect(screen.getByText(UNVERIFIED)).toBeInTheDocument();
    expect(screen.getByText(FORGED_REQUIRED)).toBeInTheDocument();
    expect(screen.queryByText("Configuration not checked")).not.toBeInTheDocument();
    expect(screen.queryByText(VERIFIED)).not.toBeInTheDocument();
  });

  it("keeps 'modified' (with the changed fields) when the name lookup fails", () => {
    // Act
    renderDialog(
      lineWith(forged),
      { state: "ready", privateMetadata: [appMarkerFor(appWrittenCableMetadata)] },
      { names: { state: "error" } },
    );

    // Assert
    expect(screen.getByText(/no longer match what the configurator recorded/)).toBeInTheDocument();
    expect(screen.getByText("longueur_cable_cm")).toBeInTheDocument();
    expect(screen.getByText("Component names not checked")).toBeInTheDocument();
  });

  it("shows unresolved components on an unverified line as an error note, under the verdict", () => {
    // Act
    renderDialog(
      lineWith(forged),
      { state: "ready", privateMetadata: [] },
      { names: { state: "ready", variants: [] }, orderCreatedAt: NEW_ORDER },
    );

    // Assert
    expect(screen.getByText(FORGED_REQUIRED)).toBeInTheDocument();
    expect(screen.getByText(/could not be found in the catalogue/)).toBeInTheDocument();
  });
});

describe("OrderCableConfigurationDialog — no runtime cutoff configured (P1-b)", () => {
  beforeEach(() => {
    mockedUseCableLinePrivateMetadata.mockReset();
    mockedUseCableComponentNames.mockReset();
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const forged = withValue(appWrittenCableMetadata, "longueur_cable_cm", "5000");

  it.each([undefined, ""])(
    "uses the soft wording for a missing marker, even on a recent order, when the value is %p",
    value => {
      // Arrange
      setRuntimeCutoff(value);

      // Act
      renderDialog(
        lineWith(forged),
        { state: "ready", privateMetadata: [] },
        { orderCreatedAt: NEW_ORDER },
      );

      // Assert — never the placeholder date, never the hard wording
      expect(
        screen.getByText(/created before verification existed, or modified outside/),
      ).toBeInTheDocument();
      expect(screen.queryByText(/has no configurator record, although/)).not.toBeInTheDocument();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("CABLE_VERIFICATION_CUTOFF"),
      );
    },
  );

  it("uses the hard wording for a recent order once the value is set", () => {
    // Arrange
    setRuntimeCutoff(CUTOFF);

    // Act
    renderDialog(
      lineWith(forged),
      { state: "ready", privateMetadata: [] },
      { orderCreatedAt: NEW_ORDER },
    );

    // Assert
    expect(screen.getByText(/has no configurator record, although/)).toBeInTheDocument();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
