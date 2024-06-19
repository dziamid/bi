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
  DATE_CREATE: string;
  DATE_MODIFY: string;

  // "ID": "1",
  // "TITLE": "Велосипед 123",
  // "TYPE_ID": "SALE",
  // "STAGE_ID": "WON",
  // "PROBABILITY": null,
  // "CURRENCY_ID": "BYN",
  // "OPPORTUNITY": "0.00",
  // "IS_MANUAL_OPPORTUNITY": "N",
  // "TAX_VALUE": null,
  // "LEAD_ID": null,
  // "COMPANY_ID": "0",
  // "CONTACT_ID": null,
  // "QUOTE_ID": null,
  // "BEGINDATE": "2024-05-27T03:00:00+03:00",
  // "CLOSEDATE": "2024-06-12T03:00:00+03:00",
  // "ASSIGNED_BY_ID": "1",
  // "CREATED_BY_ID": "1",
  // "MODIFY_BY_ID": "1",

  // "OPENED": "Y",
  // "CLOSED": "Y",
  // "COMMENTS": null,
  // "ADDITIONAL_INFO": null,
  // "LOCATION_ID": null,
  // "CATEGORY_ID": "0",
  // "STAGE_SEMANTIC_ID": "S",
  // "IS_NEW": "N",
  // "IS_RECURRING": "N",
  // "IS_RETURN_CUSTOMER": "N",
  // "IS_REPEATED_APPROACH": "N",
  // "SOURCE_ID": null,
  // "SOURCE_DESCRIPTION": null,
  // "ORIGINATOR_ID": null,
  // "ORIGIN_ID": null,
  // "MOVED_BY_ID": "1",
  // "MOVED_TIME": "2024-06-12T14:12:53+03:00",
  // "LAST_ACTIVITY_TIME": "2024-05-27T17:08:16+03:00",
  // "UTM_SOURCE": null,
  // "UTM_MEDIUM": null,
  // "UTM_CAMPAIGN": null,
  // "UTM_CONTENT": null,
  // "UTM_TERM": null,
  // "LAST_ACTIVITY_BY": "1"
  //
  [key: string]: JSONPrimitive;
}

export interface DealCategoryStage {
  NAME: string;
  SORT: number;
  STATUS_ID: string;

  [key: string]: JSONPrimitive;
}
