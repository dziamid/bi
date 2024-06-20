export type BatchEvent = {
  auditContext: Context;
  events: Event[];
};

export type SingleEvent = {
  auditContext: Context;
  event: Event;
};

type Event = {
  meta: {
    type: string; // 'customerorder';
    href: string; //'https://api.moysklad.ru/api/remap/1.2/entity/customerorder/8173ca11-2e2b-11ef-0a80-117500594b05';
  };
  action: string; // 'CREATE' or 'UPDATE'
  accountId: string; // 'ce76a0d0-2329-11ef-0a80-058500006004';
};

type Context = {
  meta: {
    type: string; //'audit';
    href: string; //'https://api.moysklad.ru/api/remap/1.2/audit/817863fb-2e2b-11ef-0a80-117500594b09';
  };
  uid: string; //'admin@dzdev';
  moment: string; //'2024-06-19 14:03:06';
};
