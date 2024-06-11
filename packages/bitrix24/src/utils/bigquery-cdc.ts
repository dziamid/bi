import { adapt, managedwriter } from '@google-cloud/bigquery-storage';
import type { JSONList } from '@google-cloud/bigquery-storage/build/src/managedwriter/json_writer';
import type { Bitrix24Event, Deal } from '@bi/bitrix24/src/utils/types';
import { getEventTypeFromEvent, getRecordIdFromEvent, isCreatedOrUpdatedEvent } from '@bi/bitrix24/src/utils/utils';
import { getDeal } from '@bi/bitrix24/src/utils/api';

export { managedwriter };
type WriterClient = managedwriter.WriterClient;

enum WriteStreamView {
  WRITE_STREAM_VIEW_UNSPECIFIED = 0,
  BASIC = 1,
  FULL = 2,
}

export async function syncEventToBigquery(writeClient: WriterClient, destinationTable: string, event: Bitrix24Event) {
  const recordId = getRecordIdFromEvent(event);

  let data: Deal | undefined;

  if (isCreatedOrUpdatedEvent(event)) {
    data = await getDeal(recordId);
    if (!data) {
      throw new Error(`Record with ID ${recordId} not found`);
    }

    const rows = [
      {
        ID: data.ID,
        TITLE: data.TITLE,
        STAGE_ID: data.STAGE_ID,
        TYPE_ID: data.TYPE_ID,
      },
    ];

    return upsertRowsWithDefaultStream(writeClient, destinationTable, rows);
  } else {
    const rows = [
      {
        ID: event.data.FIELDS.ID,
      },
    ];
    return deleteRowsWithDefaultStream(writeClient, destinationTable, rows);
  }
}

export async function upsertRowsWithDefaultStream(writeClient: WriterClient, destinationTable: string, rows: JSONList) {
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

export async function deleteRowsWithDefaultStream(writeClient: WriterClient, destinationTable: string, rows: JSONList) {
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
