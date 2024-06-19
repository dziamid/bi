import { BigQuery } from '@google-cloud/bigquery'; // Create a BigQuery client
import { bigqueryV2 } from '@bi/bitrix24';

const datasetId = bigqueryV2.config.datasetId;

// Create a BigQuery client
const bigquery = new BigQuery();

// SQL query to create the view
const query = `
  SELECT
    s.*,
    d.*,
    CONCAT(s.SORT, ' ', s.NAME) as NAME_WITH_ORDER
  FROM
    \`${datasetId}.${bigqueryV2.meta.dealCategoryStageTable.name}\` s
  LEFT JOIN
    \`${datasetId}.${bigqueryV2.meta.dealTable.name}\` d
  ON
    s.STATUS_ID = d.STAGE_ID
`;

const viewId = `deal_with_category_stage_view`;

await bigqueryV2.table.deleteTable(bigquery, datasetId, viewId);

const [view] = await bigqueryV2.table.createTable(bigquery, datasetId, viewId, {
  type: 'VIEW',
  view: query,
});

console.log(`View ${view.id} created successfully.`);
