import { createNamespace } from '@cdx-component/utils';
import { namespace } from '@cdx-component/constants';

export const useBem = (block: string) => {
    return createNamespace(namespace, block);
};
