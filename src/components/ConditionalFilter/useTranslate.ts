import { useIntl } from "react-intl";

import { FilterContainer, FilterElement } from "./FilterElement";
import { ConditionItem } from "./FilterElement/ConditionOptions";
import { isItemOption, isItemOptionArray, ItemOption } from "./FilterElement/ConditionValue";
import { booleanOptionMessages, conditionOperatorMessages, leftOperatorsMessages } from "./intl";
import { LeftOperand } from "./LeftOperandsProvider";

type LeftOperandKey = keyof typeof leftOperatorsMessages;
type ConditionKey = keyof typeof conditionOperatorMessages;
type BooleanKey = keyof typeof booleanOptionMessages;

export const useTranslate = () => {
  const intl = useIntl();

  const formatLeftOperand = (label: LeftOperandKey) => {
    const key = leftOperatorsMessages[label];

    if (!key) return label;

    return intl.formatMessage(leftOperatorsMessages[label]);
  };

  const formatConditionLabel = (label: string): string => {
    const key = conditionOperatorMessages[label as ConditionKey];

    if (!key) return label;

    return intl.formatMessage(key);
  };

  const formatBooleanLabel = (label: string): string => {
    const key = booleanOptionMessages[label as BooleanKey];

    if (!key) return label;

    return intl.formatMessage(key);
  };

  const translateConditionItem = (item: ConditionItem): void => {
    if (!item.originalLabel) {
      item.originalLabel = item.label;
    }

    item.label = formatConditionLabel(item.originalLabel);
  };

  const translateBooleanItem = (item: ItemOption): void => {
    item.label = formatBooleanLabel(item.label);
  };

  return {
    translateOperandOptions: (operands: LeftOperand[]) =>
      operands.map(el => ({
        ...el,
        label: formatLeftOperand(el.label as LeftOperandKey),
      })),
    translateFilterContainer: (container: FilterContainer) =>
      container.map(el => {
        if (FilterElement.isFilterElement(el)) {
          // Translate left operand label
          el.value.setLabel(formatLeftOperand(el.value.label as LeftOperandKey));

          // Translate condition operator labels
          el.condition.options.forEach(translateConditionItem);

          if (el.condition.selected.conditionValue) {
            translateConditionItem(el.condition.selected.conditionValue);
          }

          // Translate boolean option labels (Yes/No)
          el.condition.selected.options.forEach(opt => {
            if (isItemOption(opt)) {
              translateBooleanItem(opt);
            }
          });

          if (isItemOption(el.condition.selected.value)) {
            translateBooleanItem(el.condition.selected.value);
          }

          if (isItemOptionArray(el.condition.selected.value)) {
            el.condition.selected.value.forEach(translateBooleanItem);
          }
        }

        return el;
      }),
  };
};
