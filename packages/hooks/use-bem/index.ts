import { createNamespace } from '@cdx-component/utils';
import { namespace } from '@cdx-component/constants';

export const useBem = (block: string, pre: string = namespace) => createNamespace(pre, block);
