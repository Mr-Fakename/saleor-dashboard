---
"saleor-dashboard": patch
---

The order cable-configuration dialog now says whether the configuration can be trusted. Before, it showed the line's public metadata, which any customer can write through Saleor's public API. Now it checks that metadata against the private record that the checkout-prices app writes when it prices the cable. It shows "Verified configuration" when they match. It shows a warning when the record is missing (the line was added before the check existed, or outside the configurator) or no longer matches, and it lists the changed fields.

The check no longer depends on a build-time date. Set `CABLE_VERIFICATION_CUTOFF` when the container starts (for example `2026-10-25`). Orders from that date on with no record are shown as "treat as forged". With no value set, the dialog shows the soft warning for any missing record and logs a console warning. A failed component-name lookup now only adds a note under the verdict, and a component that was deleted or unpublished after the order is a warning on a line that matches its record.
