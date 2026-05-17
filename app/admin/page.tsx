import { redirect } from "next/navigation";
import { Activity, Bot, Database, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { isAdminAuthenticated } from "../lib/auth";

async function getMarkets() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/markets`, {
      cache: "no-store"
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const markets = await getMarkets();

  return (
    <main className="min-h-screen bg-grid-radial px-4 py-8 text-white sm:px-6">
      <div className="grid-overlay pointer-events-none fixed inset-0" />
      <div className="relative mx-auto max-w-7xl">
        <header className="glass mb-6 flex flex-col gap-4 rounded-3xl p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan">Admin Console</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">NeuraTrade Control Room</h1>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 font-semibold transition hover:border-cyan/60">
              <LogOut className="mr-2" size={18} /> Sign out
            </button>
          </form>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Market API", markets.length ? "Online" : "Fallback", Activity],
            ["Admin Auth", "Protected", ShieldCheck],
            ["Wallet Mode", "Demo only", Wallet],
            ["Bot Engine", "Paper mode", Bot]
          ].map(([label, value, Icon]) => (
            <div key={label as string} className="glass rounded-3xl p-5">
              <Icon className="text-cyan" size={24} />
              <p className="mt-5 text-sm text-slate-400">{label as string}</p>
              <p className="mt-2 text-2xl font-semibold">{value as string}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Live CoinGecko Feed</h2>
              <span className="rounded-full bg-mint/10 px-3 py-1 text-sm text-mint">{markets.length} assets</span>
            </div>
            <div className="space-y-3">
              {markets.map((coin: any) => (
                <div key={coin.id} className="grid gap-2 rounded-2xl bg-white/[0.04] p-4 text-sm md:grid-cols-[1fr_auto_auto]">
                  <div>
                    <p className="font-semibold">{coin.name} <span className="text-slate-400">{coin.symbol}</span></p>
                    <p className="text-xs text-slate-500">Market cap ${Number(coin.marketCap).toLocaleString()}</p>
                  </div>
                  <p>${Number(coin.price).toLocaleString()}</p>
                  <p className={coin.change24h >= 0 ? "text-mint" : "text-rose-300"}>{coin.change24h >= 0 ? "+" : ""}{Number(coin.change24h).toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <Database className="text-cyan" />
            <h2 className="mt-5 text-2xl font-semibold">Next Admin Upgrades</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {[
                "Save bot settings in Supabase",
                "Add editable coin watchlist",
                "Create user roles",
                "Add private trade journal",
                "Connect exchange testnet only"
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/[0.04] p-4">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
