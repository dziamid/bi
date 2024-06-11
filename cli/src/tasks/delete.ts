import { bigqueryCdc } from '@bi/bitrix24';

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';

const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new bigqueryCdc.managedwriter.WriterClient({ projectId });

const data = [
  {
    ID: '123',
  },
];

const result = await bigqueryCdc.deleteRowsWithDefaultStream(writeClient, destinationTable, data);
console.log(result);

writeClient.close();
