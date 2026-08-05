import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return <SiteShell locale="en"><main className="section section--pink"><div className="container stack" style={{minHeight:"62svh",justifyContent:"center"}}><span className="eyebrow">404 · Paper trail lost</span><h1 className="display">This sheet tore off.</h1><p className="body-lg">The page you requested could not be found.</p><div><Link className="button button--primary" href="/en">Return home</Link></div></div></main></SiteShell>;
}
