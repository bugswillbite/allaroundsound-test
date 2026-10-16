import { createClient, OAuthStrategy, media } from '@wix/sdk';
import { items } from '@wix/data';

export const wix = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: '91c36def-03bc-4686-8b28-4951161d8e33' })
});

// Turns a Wix image value (wix:image://...) into a normal URL
export const imgUrl = (img, w, h) => media.getScaledToFillImageUrl(img, w, h, {});