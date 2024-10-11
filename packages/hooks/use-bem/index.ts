import { namespace } from '@cdx-component/constants';
import { createNamespace } from '@cdx-component/utils';

export const useBem = (block: string, pre: string = namespace) => createNamespace(block, pre);
