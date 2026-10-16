   import { createClient, OAuthStrategy } from '@wix/sdk';
   import { items } from '@wix/data';
   import { submissions } from '@wix/forms';

   export const wix = createClient({
     modules: { items, submissions },
     auth: OAuthStrategy({ clientId: '91c36def-03bc-4686-8b28-4951161d8e33' })
   });