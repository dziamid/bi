import { adapt, managedwriter } from '@google-cloud/bigquery-storage';
import type { JSONList } from '@google-cloud/bigquery-storage/build/src/managedwriter/json_writer';

enum WriteStreamView {
  WRITE_STREAM_VIEW_UNSPECIFIED = 0,
  BASIC = 1,
  FULL = 2,
}

const { WriterClient, JSONWriter } = managedwriter;

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';

const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new WriterClient({ projectId });

try {
  const writeStream = await writeClient.getWriteStream({
    streamId: `${destinationTable}/streams/_default`,
    view: WriteStreamView.FULL,
  });
  const tableSchema = writeStream.tableSchema;
  if (!tableSchema) {
    throw new Error('Table schema is not defined');
  }
  const tableSchemaWithChangeType = {
    fields: tableSchema?.fields?.concat([
      {
        fields: [],
        name: '_CHANGE_TYPE',
        type: 'STRING',
        mode: 'NULLABLE',
        description: '',
        maxLength: '0',
        precision: '0',
        scale: '0',
        defaultValueExpression: '',
        rangeElementType: null,
      },
    ]),
  };
  console.log(`Table schema: ${JSON.stringify(tableSchemaWithChangeType)}`);

  const protoDescriptor = adapt.convertStorageSchemaToProto2Descriptor(tableSchemaWithChangeType, 'root');

  const connection = await writeClient.createStreamConnection({
    streamId: managedwriter.DefaultStream,
    destinationTable,
  });

  const writer = new JSONWriter({
    connection,
    protoDescriptor,
  });

  const rows: JSONList = [
    {
      ID: '101010',
      TITLE: 'Hello!!!!',
      STAGE_ID: 'NEW',
      TYPE_ID: 'FOO',
      _CHANGE_TYPE: 'UPSERT',
    },
  ];

  const result = await writer.appendRows(rows).getResult();
  console.log('Write result:', result);
} catch (err) {
  console.log(err);
} finally {
  writeClient.close();
}
