import { bigqueryV2 } from '@bi/bitrix24';

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';

const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new bigqueryV2.writeStream.managedwriter.WriterClient({ projectId });

const data = [
  {
    ID: '123',
  },
];

const result = await bigqueryV2.writeStream.deleteRowsWithDefaultStream(writeClient, destinationTable, data);
console.log(result);

writeClient.close();
