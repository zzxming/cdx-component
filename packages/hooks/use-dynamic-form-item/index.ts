import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';
import { ensureArray } from '@cdx-component/utils';
import AsyncValidator from 'async-validator';
import { reactive } from 'vue';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export const formItemValidateStates = ['', 'error', 'validating', 'success'] as const;
export type ValidateState = (typeof formItemValidateStates)[number];
export interface IFormItem {
  name: string;
  type: string;
  payload: any;
  prop?: any;
  event?: Record<string, (...args: any[]) => void>;
  next: ((current: IFormItem, prev: IFormItem[]) => IFormItem | null) | null;
  sub: ((current: IFormItem, parent: IFormItem[]) => IFormItem[] | null) | null;
  prev: IFormItem | null;
  parent: IFormItem | null;
  rules: RuleItem | RuleItem[];
  validateState?: ValidateState;
  validateErrorMessage?: string;
  resetFormItem: () => void;
}
export type CreateFormItemOption = Omit<IFormItem, 'prev' | 'parent' | 'validateState' | 'validateErrorMessage' | 'resetFormItem'>;
export interface FormValidateFailure {
  errors: ValidateError[];
  fields: ValidateFieldsError;
}

export const useDynamicFormItem = (options: Optional<CreateFormItemOption, 'rules'>): IFormItem => {
  const rules = [];
  if (options.rules) {
    rules.push(...ensureArray(options.rules));
  }
  const next = (current: IFormItem, prev: IFormItem[]) => {
    if (options.next) {
      const nextFormItem = options.next(current, prev);
      if (nextFormItem) {
        nextFormItem.prev = current;
        nextFormItem.parent = current.parent;
        return nextFormItem;
      }
    }
    return null;
  };
  const sub = (current: IFormItem, parent: IFormItem[]) => {
    if (options.sub) {
      const subFormItem = options.sub(current, parent);
      if (subFormItem && subFormItem.length > 0) {
        for (const subItem of subFormItem) {
          if (subItem) {
            subItem.parent = current;
          }
        }
        return subFormItem;
      }
    }
    return null;
  };
  const formItemData = reactive<IFormItem>({
    ...options,
    prev: null,
    parent: null,
    rules,
    validateState: '' as const,
    validateErrorMessage: '',
    next,
    sub,
    resetFormItem: () => void 0,
  });

  const resetFormItem = () => {
    Object.assign(formItemData, {
      ...options,
      validateState: '' as const,
      validateErrorMessage: '',
    });
  };

  formItemData.resetFormItem = resetFormItem;

  return formItemData;
};

export const getPrevsFormItem = (formItem: IFormItem) => {
  let point = formItem;
  const prevs = [];
  while (point && point.prev) {
    point = point.prev;
    prevs.unshift(point);
  }
  return prevs;
};

export const getNextFormItem = (formItem: IFormItem | null) => {
  const current = formItem;
  if (!current || !formItem.next) return null;
  return formItem.next(current, getPrevsFormItem(current));
};

export const getParentsFormItem = (formItem: IFormItem) => {
  let point = formItem;
  const parents = [];
  while (point && point.parent) {
    point = point.parent;
    parents.unshift(point);
  }
  return parents;
};

export const getSubFormItem = (formItem: IFormItem | null) => {
  const current = formItem;
  if (!current || !formItem.sub) return null;
  return formItem.sub(current, getParentsFormItem(current));
};

export const validateFormItem = async (formItem: IFormItem) => {
  const modelName = formItem.name;
  const validator = new AsyncValidator({
    [modelName]: formItem.rules,
  });
  formItem.validateState = 'validating';
  return validator
    .validate({ [modelName]: formItem.payload }, { firstFields: true })
    .then(() => {
      formItem.validateState = 'success';
      return true;
    })
    .catch((error: FormValidateFailure) => {
      formItem.validateState = 'error';
      formItem.validateErrorMessage = error.errors[0].message;
      throw error;
    });
};

export const getAllNextPayload = async (formItem: IFormItem | null, validate = false): Promise<{ payloads: Record<string, any>; isValid: boolean }> => {
  let currentFormItem = formItem;
  const payloads: Record<string, any> = {};
  let isValid = true;
  while (currentFormItem) {
    const payload = {
      payload: currentFormItem.payload,
      errorMessage: null,
    };
    if (!currentFormItem.name) {
      throw new Error(`FormItem has no name`);
    }
    if (validate) {
      await validateFormItem(currentFormItem)
        .then(() => {})
        .catch(({ errors, _fields }) => {
          payload.errorMessage = errors[0].message;
          isValid = false;
        });
    }
    payloads[currentFormItem.name] = payload;
    const subs = getSubFormItem(currentFormItem);
    if (subs && subs.length > 0) {
      for (const sub of subs) {
        const subPayload = await getAllNextPayload(sub, validate);
        Object.assign(payloads, subPayload.payloads);
        isValid = isValid && subPayload.isValid;
      }
    }
    currentFormItem = getNextFormItem(currentFormItem);
  }
  return {
    payloads,
    isValid,
  };
};
