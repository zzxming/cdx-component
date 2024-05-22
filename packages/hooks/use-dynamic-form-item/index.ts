import AsyncValidator from 'async-validator';
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';
import { ensureArray } from '@cdx-component/utils';
import { reactive } from 'vue';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export const formItemValidateStates = ['', 'error', 'validating', 'success'] as const;
export type ValidateState = (typeof formItemValidateStates)[number];
export interface IFormItem {
    name: string;
    type: string;
    payload: any;
    prop?: any;
    next: ((current: IFormItem, parent: IFormItem[]) => IFormItem | null) | null;
    parent: IFormItem | null;
    rules: RuleItem | RuleItem[];
    validateState?: ValidateState;
    validateErrorMessage?: string;
}
export interface CreateFormItemOption
    extends Omit<IFormItem, 'parent' | 'validateState' | 'validateErrorMessage' | 'resetFormItem'> {}
export interface FormValidateFailure {
    errors: ValidateError[];
    fields: ValidateFieldsError;
}

export const useDynamicFormItem = (options: Optional<CreateFormItemOption, 'rules'>) => {
    const next = (current: IFormItem, parent: IFormItem[]) => {
        if (options.next) {
            const nextFormItem = options.next(current, parent);
            if (nextFormItem) {
                nextFormItem.parent = current;
                return nextFormItem;
            }
        }
        return null;
    };
    const rules = [];
    options.rules && rules.push(...ensureArray(options.rules));

    const resetFormItem = () => {
        Object.assign(formItemData, {
            ...options,
            validateState: '' as const,
            validateErrorMessage: '',
        });
    };
    const formItemData = reactive({
        ...options,
        next,
        parent: null,
        rules,
        validateState: '' as const,
        validateErrorMessage: '',
        resetFormItem,
    });

    return formItemData;
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

export const getNextFormItem = (formItem: IFormItem | null) => {
    const current = formItem;
    if (!current || !formItem.next) return null;
    return formItem.next(current, getParentsFormItem(current));
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
            return Promise.reject(error);
        });
};

export const getAllNextPayload = async (formItem: IFormItem | null, validate = false) => {
    let currentFormItem = formItem;
    const payloads: Record<string, any> = {};
    let isValid = true;
    while (currentFormItem) {
        const payload = {
            value: currentFormItem.payload,
            errorMessage: null,
        };
        if (!currentFormItem.name) {
            throw new Error(`FormItem has no name`);
        }
        if (validate) {
            await validateFormItem(currentFormItem)
                .then(() => {})
                .catch(({ errors, fields }) => {
                    payload.errorMessage = errors[0].message;
                    isValid = false;
                });
        }
        payloads[currentFormItem.name] = payload;
        currentFormItem = getNextFormItem(currentFormItem);
    }
    return {
        payloads,
        isValid,
    };
};
