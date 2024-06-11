import { bigqueryCdc } from '@bi/bitrix24';

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';

const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new bigqueryCdc.managedwriter.WriterClient({ projectId });

const data = [
  {
    ID: '101010',
    TITLE: 'Hello!!!!',
    STAGE_ID: 'NEW',
    TYPE_ID: 'FOO',
  },
  {
    ID: '101011',
    TITLE: 'Hello!!!!',
    STAGE_ID: 'NEW',
    TYPE_ID: 'FOO',
  },
  {
    ID: '101012',
    TITLE: 'Hello!!!!',
    STAGE_ID: 'NEW',
    TYPE_ID: 'FOO',
  },
];

const result = await bigqueryCdc.upsertRowsWithDefaultStream(writeClient, destinationTable, data);
console.log(result);

writeClient.close();
