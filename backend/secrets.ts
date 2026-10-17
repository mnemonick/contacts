type SentryConfig = { url: string; org: string; project: string; authToken: string };
type TLSConfig = { cert: string; key: string };

// Never imported by frontend code: it would end up in the bundle.
export default {
  sentry: undefined as SentryConfig | undefined,
  tls: undefined as TLSConfig | undefined
};
