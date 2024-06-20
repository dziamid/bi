import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';

const datasetId = bitrix24.bigquery.datasetId;
const dealCategoryStageTable = bitrix24.bigquery.dealCategoryStageTable;

// Create a BigQuery client
const bigquery = new bq.BigQuery();

// SQL query to create the view
const query = `
  SELECT
    s.*,
    d.*,
    CONCAT(s.SORT, ' ', s.NAME) as NAME_WITH_ORDER
  FROM
    \`${datasetId}.${dealCategoryStageTable.name}\` s
  LEFT JOIN
    \`${datasetId}.${bitrix24.bigquery.dealTable.name}\` d
  ON
    s.STATUS_ID = d.STAGE_ID
`;

const viewId = `deal_with_category_stage_view`;

const [view] = await bq.table.recreateTable(bigquery, datasetId, viewId, {
  type: 'VIEW',
  view: query,
});

console.log(`View ${view.id} created successfully.`);
