import { fromPairs, pick, values } from 'ramda';
import fetch from 'node-fetch';
import { type Deal } from './types';

const allowedFields: readonly (keyof Deal)[] = ['ID', 'TITLE', 'TYPE_ID', 'STAGE_ID'];

export async function batchGetDeals(recordIds: (string | number)[]): Promise<Deal[]> {
  const body = { cmd: fromPairs(recordIds.map((id) => [`${id}`, `crm.deal.get?id=${id}`])) };

  const response = await fetch(`https://b24-x3gqgt.bitrix24.by/rest/1/phdahz5gpjz0hl37/batch.json`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const results = (await response.json()) as { result: { result: { [key: string]: Deal } } };

  const records = values(results.result.result);

  return records.map((record) => pick(allowedFields, record));
}

export async function getDeal(recordId: string | number) {
  const [res] = await batchGetDeals([recordId]);

  return res;
}