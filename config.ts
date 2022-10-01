const NHOSTREGION = process.env.NEXT_PUBLIC_NHOST_REGION!;
const SUBDOMAIN = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN!;
const XHasuraAdminSecret = process.env.NEXT_PUBLIC_X_HASURA_ADMIN_SCERET!;
const XHasuraRole = process.env.NEXT_PUBLIC_X_HASURA_ROLE!;

export { NHOSTREGION, SUBDOMAIN, XHasuraAdminSecret, XHasuraRole };
