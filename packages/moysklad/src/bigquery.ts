import type * as Bq from '@google-cloud/bigquery/build/src/table';

type JSONPrimitive = string | number | bigint | boolean | Date | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONObject = {
  [member: string]: JSONValue;
};
type JSONArray = Array<JSONValue>;
type JSONList = Array<JSONObject>;

type TableMetadata = Bq.TableMetadata & { name: string };

export const datasetId = 'moysklad';

export interface CustomerOrder {
  id: string;
  name: string;
  sum: number;
  created: string;
  updated: string;
  agent_phone: string | null;
  state_name: string | null;
  [key: string]: JSONPrimitive;
}

export const customerOrderTable: TableMetadata = {
  name: 'customer_order',
  type: 'TABLE',
  timePartitioning: {
    type: 'MONTH',
    field: 'created',
  },
  tableConstraints: {
    primaryKey: { columns: ['id'] },
  },
  schema: {
    fields: [
      { name: 'id', type: 'STRING' },
      { name: 'name', type: 'STRING' },
      { name: 'sum', type: 'STRING' },
      { name: 'agent_phone', type: 'STRING' },
      { name: 'created', type: 'DATETIME' },
      { name: 'updated', type: 'DATETIME' },
    ],
  },
};
