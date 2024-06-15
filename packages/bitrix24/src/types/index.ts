export type JSONPrimitive = string | number | bigint | boolean | Date | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = {
  [member: string]: JSONValue;
};
export type JSONArray = Array<JSONValue>;
export type JSONList = Array<JSONObject>;

export type Bitrix24Event = {
  event: 'ONCRMDEALUPDATE' | 'ONCRMDEALCREATE' | 'ONCRMDEALDELETE';
  event_id: string; // "33",
  data: {
    FIELDS: {
      ID: string; // "11"
    };
  };
  ts: string; // "1716989310",
  auth: {
    domain: string; // "b24-x3gqgt.bitrix24.by",
    client_endpoint: string; //"https://b24-x3gqgt.bitrix24.by/rest/",
    server_endpoint: string; //"https://oauth.bitrix.info/rest/",
    member_id: string; //"b4cb1a09664d01dd5c4ca5228f924e95",
    application_token: string; //"ba1ecbehzjjogj8d1lcsrz0uzrurmtlx"
  };
};

export type BatchEvent = {
  id: string;
  model: 'deal' | 'unknown';
  eventType: 'create' | 'update' | 'delete' | 'unknown';
};

export interface Deal {
  ID: string;
  TITLE: string;
  STAGE_ID: string;
  TYPE_ID: string;

  [key: string]: JSONPrimitive;
}

export interface DealCategoryStage {
  NAME: string;
  SORT: number;
  STATUS_ID: string;
  [key: string]: JSONPrimitive;
}
