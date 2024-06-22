import * as table from './table';
import * as stream from './stream';

import { managedwriter } from '@google-cloud/bigquery-storage';
import { BigQuery } from '@google-cloud/bigquery';

type WriterClient = managedwriter.WriterClient;

enum WriteStreamView {
  WRITE_STREAM_VIEW_UNSPECIFIED = 0,
  BASIC = 1,
  FULL = 2,
}

export { table, stream, type WriterClient, BigQuery, WriteStreamView };
