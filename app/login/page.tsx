import { Cpu, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen bg-grid-radial px-4 py-10 text-white sm:px-6">
      <div className="grid-overlay pointer-events-none fixed inset-0" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <Link href="/" className="mb-10 flex items-center gap-3 font-semibold">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan text-night"><Cpu size={22} /></span>
              NeuraTrade AI
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan">Private Console</p>
            <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
              Secure access for your trading dashboard.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Sign in to manage the admin console, monitor CoinGecko market status, and prepare future wallet and bot controls.
            </p>
          </section>

          <section className="glass glow-border rounded-3xl p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan/15 text-cyan"><LockKeyhole /></span>
              <div>
                <h2 className="text-2xl font-semibold">Admin Login</h2>
                <p className="text-sm text-slate-400">Use your private dashboard credentials.</p>
              </div>
            </div>

            {searchParams.error && (
              <div className="mb-5 rounded-2xl border border-rose-300/30 bg-rose-300/10 p-4 text-sm text-rose-200">
                Login failed. Check your username and password.
              </div>
            )}

            <form action="/api/auth/login" method="post" className="space-y-4">
              <label className="block text-sm text-slate-300">
                Username
                <input name="username" required autoComplete="username" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-cyan" />
              </label>
              <label className="block text-sm text-slate-300">
                Password
                <input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-cyan" />
              </label>
              <button className="w-full rounded-2xl bg-cyan px-5 py-4 font-semibold text-night shadow-glow transition hover:bg-white">
                Sign in
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-mint/20 bg-mint/10 p-4 text-sm text-mint">
              <ShieldCheck size={18} />
              Protected by an encrypted, HTTP-only session cookie.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
