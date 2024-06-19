import type { TableMetadata as TableMetadataOrig } from '@google-cloud/bigquery/build/src/table';
type JSONPrimitive = string | number | bigint | boolean | Date | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONObject = {
  [member: string]: JSONValue;
};
type JSONArray = Array<JSONValue>;
type JSONList = Array<JSONObject>;

type TableMetadata = TableMetadataOrig & { name: string };
export const dealTable: TableMetadata = {
  name: 'deal',
  type: 'TABLE',
  timePartitioning: {
    type: 'MONTH',
    field: 'DATE_CREATE',
  },
  tableConstraints: {
    primaryKey: { columns: ['ID'] },
  },
  schema: {
    fields: [
      { name: 'ID', type: 'STRING' },
      { name: 'TITLE', type: 'STRING' },
      { name: 'STAGE_ID', type: 'STRING' },
      { name: 'TYPE_ID', type: 'STRING' },
      { name: 'DATE_CREATE', type: 'DATETIME' },
      { name: 'DATE_MODIFY', type: 'DATETIME' },
    ],
  },
};

export const dealCategoryStageTable: TableMetadata = {
  name: 'deal_category_stage',
  type: 'TABLE',
  tableConstraints: {
    primaryKey: { columns: ['STATUS_ID'] },
  },
  schema: {
    fields: [
      { name: 'NAME', type: 'STRING' },
      { name: 'SORT', type: 'INT64' },
      { name: 'STATUS_ID', type: 'STRING' },
    ],
  },
};

export interface Deal {
  ID: string;
  TITLE: string;
  STAGE_ID: string;
  TYPE_ID: string;

  [key: string]: JSONPrimitive;
}

export interface DealCategoryStage {
  NAME: string;
  SORT: number;
  STATUS_ID: string;
  [key: string]: JSONPrimitive;
}
