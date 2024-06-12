import { bigqueryCdc } from '@bi/bitrix24';

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';
const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new bigqueryCdc.managedwriter.WriterClient({ projectId });

const writeStream = await writeClient.getWriteStream({
  streamId: `${destinationTable}/streams/_default`,
  view: bigqueryCdc.WriteStreamView.FULL,
});

console.log(`Got write stream: ${writeStream.name}`);