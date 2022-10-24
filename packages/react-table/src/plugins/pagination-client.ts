import { Plugin } from '../lib/plugin';

export interface GlobalConfig {
  /** Optional: enable pagination with `n` size pages*/
  pageSize?: number;
}

export interface Helpers {
  /** Current page number (between 0 and `pageAmount - 1`) */
  page: number;
  /** Maximum size of the pages */
  pageSize: number;
  /** Amount of pages */
  pageAmount: number;
  /** Utility function to set the current page if possible */
  setPage: (pageNumber: number) => void;
  /** Utility function to skip to the last available page */
  setLastPage: () => void;
  /** Utility function to skip to the first available page */
  setFirstPage: () => void;
  /** Utility function to move to the next page if possible */
  nextPage: () => void;
  /** Whether or not there is a next page to go to */
  canNext: boolean;
  /** Utility function to move to the previous page if possible */
  prevPage: () => void;
  /** Whether or not there is a previous page to go to */
  canPrev: boolean;
}

export interface State {
  page: number;
}

export const plugin: Plugin<
  'paginationClient',
  GlobalConfig,
  Record<string, never>,
  Helpers,
  State
> = {
  initialState: { page: 0 },
  process({ globalConfig, data, state, mutate }) {
    const pageAmount =
      globalConfig.pageSize === undefined || data.length === 0
        ? 1
        : Math.ceil(data.length / globalConfig.pageSize);

    const paginatedData =
      globalConfig.pageSize === undefined
        ? data
        : data.slice(
            state.page * globalConfig.pageSize,
            state.page * globalConfig.pageSize + globalConfig.pageSize,
          );

    const safeSetPage = (pageNumber: number) => {
      if (globalConfig.pageSize === undefined)
        console.warn('To enable pagination, please set the `pageSize` option');
      else if (pageNumber < 0 || pageNumber >= pageAmount)
        console.error(
          `Cannot set page to ${pageNumber}, should be in between 0 and ${pageAmount - 1}`,
        );
      else mutate.setPage(pageNumber);
    };

    return [
      paginatedData,
      {
        page: state.page,
        setPage: safeSetPage,
        pageAmount,
        // TODO return current page size (may be smaller than globalConfig.pageSize)
        pageSize: globalConfig.pageSize ?? 0,
        setFirstPage: () => safeSetPage(0),
        setLastPage: () => safeSetPage(pageAmount - 1),
        canPrev: state.page > 0,
        prevPage: () => safeSetPage(state.page - 1),
        canNext: state.page < pageAmount - 1,
        nextPage: () => safeSetPage(state.page + 1),
      },
    ];
  },
};
