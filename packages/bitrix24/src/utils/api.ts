import { fromPairs, pick, values } from 'ramda';
import fetch from 'node-fetch';
import {type Deal, type JSONObject} from './types';

const allowedFields: readonly (keyof Deal)[] = ['ID', 'TITLE', 'TYPE_ID', 'STAGE_ID'];

type ListDealResult = {
  result: Deal[];
  total: number;
  next: string;
  time: {
    start: number;
    finish: number;
    duration: number;
    processing: number;
    date_start: string; // '2024-06-12T12:08:39+03:00'
    date_finish: string; // '2024-06-12T12:08:39+03:00'
    operating_reset_at: number;
    operating: number;
  };
};

export async function listDeals() {
  const response = await fetch(`https://b24-x3gqgt.bitrix24.by/rest/1/phdahz5gpjz0hl37/crm.deal.list.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = (await response.json()) as Promise<ListDealResult>;
  return result;
}

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

  return values(results.result.result);
}

export async function getDeal(recordId: string | number) {
  const [res] = await batchGetDeals([recordId]);

  return res;
}
