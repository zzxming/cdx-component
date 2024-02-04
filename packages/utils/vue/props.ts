import { PropType } from 'vue';

export const definePropType = <T>(val: any) => val as PropType<T>;
