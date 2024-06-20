import { adapt, managedwriter } from '@google-cloud/bigquery-storage';
import type { JSONList, JSONObject } from '@google-cloud/bigquery-storage/build/src/managedwriter/json_writer';

export const WriterClient = managedwriter.WriterClient;

type WriterClient = managedwriter.WriterClient;

export enum WriteStreamView {
  WRITE_STREAM_VIEW_UNSPECIFIED = 0,
  BASIC = 1,
  FULL = 2,
}

type EventType = 'create' | 'update' | 'delete';

export async function syncRow(writeClient: WriterClient, table: string, row: JSONObject, eventType: EventType) {
  return syncRows(writeClient, table, [row], eventType);
}

export async function syncRows(writeClient: WriterClient, table: string, rows: JSONList, eventType: EventType) {
  if (['create', 'update'].includes(eventType)) {
    return upsertRows(writeClient, table, rows);
  } else {
    return deleteRows(writeClient, table, rows);
  }
}

export async function upsertRows(writeClient: WriterClient, destinationTable: string, rows: JSONList) {
  const rowsWithChangeType = rows.map((row) => {
    return {
      ...row,
      _CHANGE_TYPE: 'UPSERT',
    };
  });
  const writeStream = await writeClient.getWriteStream({
    streamId: `${destinationTable}/streams/_default`,
    view: WriteStreamView.FULL,
  });
  console.log(`Got write stream: ${writeStream.name}`);

  const tableSchema = writeStream.tableSchema;
  if (!tableSchema) {
    throw new Error('Table schema is not defined');
  }
  console.log(`Table schema: ${JSON.stringify(tableSchema)}`);

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
  const protoDescriptor = adapt.convertStorageSchemaToProto2Descriptor(tableSchemaWithChangeType, 'root');
  console.log(`Proto descriptor: ${JSON.stringify(protoDescriptor)}`);
  const connection = await writeClient.createStreamConnection({
    streamId: managedwriter.DefaultStream,
    destinationTable,
  });
  console.log(`Got connection for stream: ${connection.getStreamId()}`);

  const writer = new managedwriter.JSONWriter({
    connection,
    protoDescriptor,
  });
  console.log(`Created writer`);

  return writer.appendRows(rowsWithChangeType).getResult();
}

export async function deleteRows(writeClient: WriterClient, destinationTable: string, rows: JSONList) {
  const rowsWithChangeType = rows.map((row) => {
    return {
      ...row,
      _CHANGE_TYPE: 'DELETE',
    };
  });
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
  const protoDescriptor = adapt.convertStorageSchemaToProto2Descriptor(tableSchemaWithChangeType, 'root');

  const connection = await writeClient.createStreamConnection({
    streamId: managedwriter.DefaultStream,
    destinationTable,
  });

  const writer = new managedwriter.JSONWriter({
    connection,
    protoDescriptor,
  });

  return writer.appendRows(rowsWithChangeType).getResult();
}
