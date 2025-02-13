export const WEBHOOKS = {
  CREATE_CONTENT: 'de204e88-fd1a-4c4a-bae3-1973a1a43857',
  STATUS_PEDIDO: 'dolores-status-pedido',
  DELETE_CONTENT: 'a31011c9-b1d2-4eee-a883-146db4e2ce6f',
  GET_CONTENT_DETAIL: 'dolores-content-detail',

  STEPS: [
    {
      retrieve: 'cef66e1d-b973-40b0-9704-72478b4670cd',
      update: 'b2e5bc6e-db0e-4b53-aac7-a7c76e42d1dd',
      export: 'dolores-exportar-conteudo-s1',
    },
    {
      retrieve: 'a5fa5a00-2839-4ce2-83a1-26bd7cfd8587',
      update: 'e3f73bed-f4bd-47a3-9dc2-29ff00243fe0',
      export: 'dolores-exportar-conteudo-s2',
    },
    {
      retrieve: 'eed10b3b-891e-41f5-b167-7d15a16bb96f',
      update: '204dbbf6-d76a-4b61-b8f6-19629412a621',
      export: 'dolores-exportar-conteudo-s3',
    },
    {
      retrieve: '7c9730cf-0742-4e84-83b0-55fa4de466a2',
      update: 'dolores-step-S4-new-outline-update',
      export: 'dolores-exportar-conteudo-s4',
    },
    {
      retrieve: 'dolores-step-S5-blog-post-retrieve',
      update: 'dolores-step-S5-blog-post-update',
      export: 'dolores-exportar-conteudo-s5',
    },
  ],
};
