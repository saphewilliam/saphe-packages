import fuzzysort from 'fuzzysort';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Columns, ColumnTypes, Data, Options, Row, SearchMode } from './types';
import { ColumnType, ColumnTypeEnum } from './useColumnType';
import { Visibility } from './useVisibility';
import { getRowValue } from './util';

export type MatchedText = { value: string; highlighted: boolean }[];

export type HighlightFunc = (match: string) => MatchedText;

interface SearchState<T extends ColumnTypes> {
  searchedData: Data<T>;
  setSearchString: Dispatch<SetStateAction<string>>;
  searchString: string;
  highlight: HighlightFunc;
}

async function searchFuzzy<T extends ColumnTypes>(
  preparedData: PreparedData<T>,
  searchString: string,
  columnNames: string[],
): Promise<Data<T>> {
  const searched = await fuzzysort.goAsync(searchString, preparedData, {
    keys: columnNames,
  });
  return searched.map((row) => row.obj.originalRow);
}

async function searchExact<T extends ColumnTypes>(
  preparedData: PreparedData<T>,
  searchString: string,
  columnNames: string[],
): Promise<Data<T>> {
  const searched = preparedData.filter((row) => {
    for (const [columnName, value] of Object.entries(row)) {
      if (
        columnNames.indexOf(columnName) !== -1 &&
        (value as unknown as string).toLowerCase().indexOf(searchString.toLowerCase()) !== -1
      )
        return true;
    }
    return false;
  });

  return searched.map((row) => row.originalRow);
}

type PreparedData<T extends ColumnTypes> = { originalRow: Row<T> }[];

async function prepareData<T extends ColumnTypes>(
  data: Data<T>,
  columns: Columns<T>,
): Promise<PreparedData<T>> {
  return data.map((row) =>
    Object.entries(columns).reduce(
      (prev, [columnName, column]) => {
        const value = getRowValue(row, columnName);
        const stringValue = column.stringify ? column.stringify(value, row) : String(value);
        return { ...prev, [columnName]: stringValue };
      },
      { originalRow: row },
    ),
  );
}

function getSearchableColumnNames<T extends ColumnTypes>(
  columns: Columns<T>,
  columnType: ColumnType<T>,
  visibility: Visibility<T>,
): string[] {
  return Object.entries(columns)
    .filter(([columnName, column]) => {
      if (!visibility[columnName] || column.unsearchable) return false;
      if (column.stringify) return true;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (columnType[columnName]! === ColumnTypeEnum.COMPLEX) {
        console.warn(
          `Column '${columnName}' is being searched, but is a complex object with no preconfigured 'stringify' function. Please define a stringify function OR set 'unsearchable' to 'true'`,
        );
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (columnType[columnName]! === ColumnTypeEnum.UNDEFINED) return false;
      return true;
    })
    .map(([columnName]) => columnName);
}

export default function useSearch<T extends ColumnTypes>(
  columns: Columns<T>,
  data: Data<T>,
  visibility: Visibility<T>,
  columnType: ColumnType<T>,
  options?: Options<T>,
): SearchState<T> {
  const [searchString, setSearchString] = useState('');
  const [searchedData, setSearchedData] = useState(data);

  const highlight: HighlightFunc = useCallback(
    (query: string) => {
      if (searchString === '') return [{ value: query, highlighted: false }];
      else if (options?.search?.mode === SearchMode.EXACT) {
        const match = query.toLowerCase().indexOf(searchString.toLowerCase());
        if (match === -1) return [{ value: query, highlighted: false }];
        else
          return [
            { value: query.substr(0, match), highlighted: false },
            {
              value: query.substr(match, searchString.length),
              highlighted: true,
            },
            {
              value: query.substr(match + searchString.length),
              highlighted: false,
            },
          ];
      } else {
        const match = fuzzysort.single(searchString, query);
        if (match === null) return [{ value: query, highlighted: false }];
        else {
          const delimiter = '~.*>+';
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return fuzzysort
            .highlight(match, delimiter, delimiter)!
            .split(delimiter)
            .map((value, idx) => ({ value, highlighted: idx % 2 === 1 }));
        }
      }
    },
    [searchString, options],
  );

  useEffect(() => {
    if (searchString === '') setSearchedData(data);
    else {
      const search = async () => {
        const columnNames = getSearchableColumnNames(columns, columnType, visibility);
        const preparedData = await prepareData(data, columns);
        if (options?.search?.mode === SearchMode.EXACT)
          setSearchedData(await searchExact(preparedData, searchString, columnNames));
        else setSearchedData(await searchFuzzy(preparedData, searchString, columnNames));
      };
      search();
    }
  }, [columns, data, visibility, options, searchString, setSearchedData, columnType]);

  return { searchString, setSearchString, searchedData, highlight };
}
