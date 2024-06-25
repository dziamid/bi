import fetch from 'node-fetch';
import * as moysklad from '@bi/moysklad/src/index';
import { format, parseISO } from 'date-fns';

type Meta = {
  href: string; //'https://api.moysklad.ru/api/remap/1.2/entity/customerorder/6a87cfef-2e00-11ef-0a80-07bf004d8e54';
  metadataHref: string; //'https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata';
  type: string; //'customerorder';
  mediaType: string; //'application/json';
  uuidHref: string; //'https://online.moysklad.ru/app/#customerorder/edit?id=6a87cfef-2e00-11ef-0a80-07bf004d8e54';
};

type MetaList = {
  href: string; // 'https://api.moysklad.ru/api/remap/1.2/entity/customerorder/6a87cfef-2e00-11ef-0a80-07bf004d8e54/files';
  type: string; //'files';
  mediaType: string; //'application/json';
  size: number; // 0;
  limit: number; //1000;
  offset: number; //0;
};

export type CustomerOrder = {
  meta: Meta;
  id: string; //'6a87cfef-2e00-11ef-0a80-07bf004d8e54';
  accountId: string; //'ce76a0d0-2329-11ef-0a80-058500006004';
  owner: {
    meta: Meta;
  };
  shared: false;
  group: {
    meta: Meta;
  };
  updated: string; //'2024-06-19 09:09:15.100';
  name: string; //'00001';
  externalCode: string; //'MiPLoBF-hcmysIm6jswCc3';
  moment: string; //'2024-06-19 08:54:00.000';
  applicable: boolean; //true;
  rate: {
    currency: {
      meta: Meta;
    };
  };
  sum: 0.0;
  store: {
    meta: Meta;
  };
  agent: {
    meta: Meta;
  };
  organization: {
    meta: Meta;
  };
  state: {
    meta: Meta;
  };
  created: string; // '2024-06-19 08:54:39.394';
  printed: boolean; //false;
  published: boolean; //false;
  files: {
    meta: MetaList;
  };
  positions: {
    meta: MetaList;
  };
  vatEnabled: true;
  vatIncluded: true;
  vatSum: 0.0;
  payedSum: 0.0;
  shippedSum: 0.0;
  invoicedSum: 0.0;
  reservedSum: 0.0;
};

type Counterparty = {
  meta: Meta;
  id: string;
  accountId: string;
  owner: Meta;
  shared: false;
  group: Meta;
  updated: string; //"2024-06-19 08:55:45.683",
  name: string; //"Контрагент 1",
  externalCode: string; //"PK7k8ofQgbN9x9FdjyhlH2",
  archived: boolean; //false,
  created: string; //"2024-06-19 08:55:45.683",
  companyType: string; //"legal",
  phone: string; //"+995591926157",
  accounts: MetaList;
  tags: [];
  notes: MetaList;
  state: Meta;
  salesAmount: 0.0;
  files: MetaList;
};

type CustomerOrderState = {
  meta: Meta;
  id: string; //"ceeee220-2329-11ef-0a80-02c200104db4",
  accountId: string; //"ce76a0d0-2329-11ef-0a80-058500006004",
  name: string; //"Новый",
  color: number; // 15106326,
  stateType: string; //"Regular",
  entityType: string; //"customerorder"
};

type ListCustomerOrder = {
  context: {
    employee: {
      meta: Meta;
    };
  };
  meta: MetaList;
  rows: CustomerOrder[];
};

type WebhookList = {
  context: {
    employee: {
      meta: Meta;
    };
  };
  meta: MetaList;
  rows: Webhook[];
};

type Webhook = {
  meta: Meta;
  id: string; //"af8944da-2e2a-11ef-0a80-0d0f00e3a6fb",
  accountId: string; // "ce76a0d0-2329-11ef-0a80-058500006004",
  entityType: string; //"customerorder",
  url: string; //"https://webhook.site/1e4052b5-03d4-46e0-8a1e-c1c3e98d1a9c",
  method: string; //"POST",
  enabled: boolean; //true,
  action: string; //"CREATE"
};

export async function listCustomerOrder() {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/customerorder`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });

  const result = (await response.json()) as Promise<ListCustomerOrder>;
  return result;
}

export async function getCustomerOrder(id: string) {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/customerorder/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });

  const result = (await response.json()) as Promise<CustomerOrder>;
  return result;
}

export async function getCounterparty(id: string) {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/counterparty/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });

  const result = (await response.json()) as Promise<Counterparty>;
  return result;
}

export async function getCustomerOrderState(id: string) {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });

  const result = (await response.json()) as Promise<CustomerOrderState>;
  return result;
}

export function getMetaId(meta: Meta) {
  return meta.href.split('/').pop() as string;
}

export async function mapCustomerOrder(record: moysklad.api.CustomerOrder): Promise<moysklad.bigquery.CustomerOrder> {
  const agentId = moysklad.api.getMetaId(record.agent.meta);
  const agentP = moysklad.api.getCounterparty(agentId);
  const stateId = moysklad.api.getMetaId(record.state.meta);
  const stateP = moysklad.api.getCustomerOrderState(stateId);

  const agent = await agentP;
  const state = await stateP;

  return {
    id: record.id,
    name: record.name,
    sum: record.sum,
    agent_phone: agent?.phone || null,
    state_name: state?.name || null,
    created: format(parseISO(record.created), 'yyyy-MM-dd HH:mm:ss'),
    updated: format(parseISO(record.updated), 'yyyy-MM-dd HH:mm:ss'),
  };
}

export async function listWebhooks() {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/webhook`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });

  const result = (await response.json()) as Promise<WebhookList>;
  return result;
}

export async function createWebhook(url: string, entityType: string, action: string) {
  const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
    body: JSON.stringify({
      url,
      entityType,
      action,
      method: 'POST',
    }),
  });

  const result = (await response.json()) as Promise<Webhook>;
  return result;
}

export async function deleteWebhook(id: string) {
  await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/webhook/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ffd8e780a7d8d26e7afb8d1873affcef03390067',
    },
  });
}
