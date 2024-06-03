import { Bitrix24Event } from '../types';

export const bitrix24MockEvent: Bitrix24Event = {
  event: 'ONCRMDEALCREATE',
  event_id: '33',
  data: {
    FIELDS: {
      ID: '123',
    },
  },
  ts: '1716989310',
  auth: {
    domain: 'b24-x3gqgt.bitrix24.by',
    client_endpoint: 'https://b24-x3gqgt.bitrix24.by/rest/',
    server_endpoint: 'https://oauth.bitrix.info/rest/',
    member_id: 'b4cb1a09664d01dd5c4ca5228f924e95',
    application_token: 'ba1ecbehzjjogj8d1lcsrz0uzrurmtlx',
  },
};
