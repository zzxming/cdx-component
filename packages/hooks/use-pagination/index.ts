import type { ComputedRef, Ref } from 'vue';
import { computed, isRef, ref, watch } from 'vue';

export interface PageOptions {
  page: number;
  pageSize: number;
};

export const LoadStatus = {
  loading: 'loading',
  nomore: 'nomore',
  error: 'error',
  success: 'success',
};

export interface PaginationData {
  listSize: Ref<number> | ComputedRef<number>;
  loadFunc: Ref<(pageOptions: PageOptions, ...args: any[]) => Promise<void | { data: { total: number } }>>;
};
export interface PaginationOptions {
  autoAddPage: boolean;
  pageSize: number | Ref<number>;
};

export const usePagination = ({ listSize, loadFunc }: PaginationData, { pageSize = 20, autoAddPage = false }: Partial<PaginationOptions> = {}) => {
  const dataTotal = ref(0);
  const currentPage = ref(autoAddPage ? 0 : 1);
  const loadDataSize = computed(() => (isRef(pageSize) ? pageSize.value : pageSize));
  const loading = ref(false);
  const loadError = ref(false);
  const loaded = ref(false);

  const loadStatus = computed(() => {
    if (loading.value) {
      return LoadStatus.loading;
    }
    if (loadError.value) {
      return LoadStatus.error;
    }
    if (listSize.value < dataTotal.value || !loaded.value) {
      return LoadStatus.success;
    }
    return LoadStatus.nomore;
  });
  const loadMore = async (...args: any[]) => {
    if (autoAddPage) {
      currentPage.value += 1;
    }
    loading.value = true;
    await loadFunc.value({ page: currentPage.value, pageSize: loadDataSize.value }, ...args)
      .then((res) => {
        if (res) {
          dataTotal.value = res.data.total;
        }
      })
      .catch(() => {
        loadError.value = true;
        if (autoAddPage) {
          currentPage.value -= 1;
        }
      });
    loaded.value = true;
    loading.value = false;
  };
  const reset = () => {
    dataTotal.value = 0;
    currentPage.value = autoAddPage ? 0 : 1;
    loading.value = false;
    loadError.value = false;
  };

  watch(loadFunc, () => {
    reset();
    loadMore();
  });

  return {
    loading,
    loadError,
    total: dataTotal,
    currentPage,
    pageSize: loadDataSize,
    loadStatus,
    loadMore,
    reset,
  };
};
