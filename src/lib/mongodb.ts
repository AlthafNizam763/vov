import { MongoClient } from "mongodb";
import dns from "dns";

/**
 * Windows / local-resolver workaround.
 *
 * Node's bundled DNS resolver (c-ares) can be pointed at a loopback address
 * (e.g. 127.0.0.1) set by a VPN, WSL, Docker, or a local DNS/ad-block proxy,
 * where nothing is listening. That makes the SRV + TXT lookups required by
 * `mongodb+srv://` fail with `querySrv ECONNREFUSED`.
 *
 * A one-shot `dns.setServers()` isn't enough here: the Next.js server runtime
 * resets the process-wide default DNS servers after our module loads, undoing
 * the fix before the driver ever runs its lookup. So instead we pin a dedicated
 * Resolver to public DNS and override the exact functions the MongoDB driver
 * calls (`dns.resolveSrv` / `dns.resolveTxt`, both callback and promise forms).
 * Those overrides can't be reset by anything else in the process.
 *
 * The whole thing only activates when the resolver is actually on loopback, so
 * real hosts (production Linux, Vercel, etc.) are left completely untouched.
 */
function pinSrvDnsIfLoopback() {
  const onLoopback = dns
    .getServers()
    .some((s) => s.startsWith("127.") || s === "::1" || s === "");
  if (!onLoopback) return;

  const publicServers = ["1.1.1.1", "8.8.8.8"];

  // Callback-style resolver (dns.resolveSrv/resolveTxt with a callback).
  const cbResolver = new dns.Resolver();
  cbResolver.setServers(publicServers);
  dns.resolveSrv = cbResolver.resolveSrv.bind(cbResolver);
  dns.resolveTxt = cbResolver.resolveTxt.bind(cbResolver);

  // Promise-style resolver (dns.promises.resolveSrv/resolveTxt).
  const pResolver = new dns.promises.Resolver();
  pResolver.setServers(publicServers);
  dns.promises.resolveSrv = pResolver.resolveSrv.bind(pResolver);
  dns.promises.resolveTxt = pResolver.resolveTxt.bind(pResolver);
}
pinSrvDnsIfLoopback();

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("❌ Please add your MONGODB_URI to .env.local");
}

const client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  // In dev mode, reuse the same connection across HMR reloads
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
