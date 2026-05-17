"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  Gauge,
  Headphones,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  MessageSquare,
  Pause,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wallet,
  X,
  Zap
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";

type View = "overview" | "bots" | "wallet" | "signals" | "security";
type Tx = { id: string; type: string; asset: string; amount: string; status: string; time: string };
type BotState = { name: string; market: string; allocation: number; risk: number; status: "Live" | "Paused" };
type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
};

const fallbackMarkets: MarketCoin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 103824, change24h: 4.82, marketCap: 2060000000000, volume: 8200000000 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 5412, change24h: 2.18, marketCap: 650000000000, volume: 5100000000 },
  { id: "solana", symbol: "SOL", name: "Solana", price: 214.7, change24h: 8.06, marketCap: 101000000000, volume: 2400000000 },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 724.11, change24h: 1.42, marketCap: 105000000000, volume: 980000000 },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum", price: 2.18, change24h: -0.74, marketCap: 7100000000, volume: 310000000 },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 31.09, change24h: 5.33, marketCap: 19000000000, volume: 740000000 }
];

const navItems: Array<[View, string, typeof Gauge]> = [
  ["overview", "Dashboard", Gauge],
  ["bots", "AI Bots", Bot],
  ["wallet", "Wallet", Wallet],
  ["signals", "Signals", LineChart],
  ["security", "Security", ShieldCheck]
];

function formatCurrency(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: value > 100 ? 0 : 2
  }).format(value);
}

function formatChange(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function AICore() {
  const mesh = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.22;
      mesh.current.rotation.y = t * 0.34;
    }
    if (ring.current) {
      ring.current.rotation.z = t * -0.28;
      ring.current.rotation.x = Math.sin(t * 0.4) * 0.18;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.45, 2]} />
        <meshStandardMaterial color="#23e6ff" emissive="#2563eb" emissiveIntensity={0.55} roughness={0.24} metalness={0.72} wireframe />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.05, 0.015, 16, 160]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.2} />
      </mesh>
      <mesh rotation={[1.15, 0.35, 0.25]}>
        <torusGeometry args={[2.52, 0.01, 16, 160]} />
        <meshStandardMaterial color="#44ffb1" emissive="#44ffb1" emissiveIntensity={0.9} />
      </mesh>
      <pointLight position={[2, 2, 3]} intensity={35} color="#23e6ff" />
      <pointLight position={[-2, -1, 2]} intensity={28} color="#a855f7" />
    </group>
  );
}

function HeroVisual() {
  return (
    <motion.div
      style={{ y: useTransform(useScroll().scrollYProgress, [0, 0.35], [0, -90]) }}
      className="relative h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#080d1e]/70 shadow-glow"
    >
      <Canvas camera={{ position: [0, 0, 5.2], fov: 48 }}>
        <ambientLight intensity={0.45} />
        <AICore />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(5,7,17,.2)_52%,rgba(5,7,17,.82)_100%)]" />
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} className="glass absolute left-5 top-6 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan">AI Signal</p>
        <p className="mt-2 text-2xl font-semibold">87.4%</p>
        <p className="text-sm text-slate-300">BTC long confidence</p>
      </motion.div>
      <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} className="glass absolute bottom-6 right-5 w-56 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Activity size={16} className="text-mint" /> Live execution
        </div>
        <div className="mt-4 h-24 rounded-xl bg-[linear-gradient(135deg,rgba(35,230,255,.22),rgba(168,85,247,.16))] p-3">
          <div className="flex h-full items-end gap-1">
            {[30, 46, 38, 72, 58, 86, 65, 94, 76, 98].map((height) => (
              <span key={height} className="flex-1 rounded-t bg-cyan/80" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300">{copy}</p>
    </div>
  );
}

function ChartPanel({ activeMarket, marketCoin }: { activeMarket: string; marketCoin?: MarketCoin }) {
  const points = activeMarket === "ETH" ? "0,72 56,60 112,70 168,44 224,30 280,42 336,22 392,28 448,16 504,20" : "0,78 56,64 112,72 168,38 224,46 280,26 336,42 392,18 448,30 504,12";
  const price = marketCoin ? formatCurrency(marketCoin.price) : activeMarket === "ETH" ? "$5,412.18" : "$103,824.20";
  const change = marketCoin ? formatChange(marketCoin.change24h) : "+4.82%";
  const volume = marketCoin ? `Vol 24h ${formatCurrency(marketCoin.volume, true)}` : "Vol 24h $8.2B";
  const changeIsPositive = !change.startsWith("-");

  return (
    <div className="glass glow-border rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{activeMarket} / USDT Perpetual</p>
          <h3 className="mt-1 text-2xl font-semibold">{price}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm ${changeIsPositive ? "border-mint/30 bg-mint/10 text-mint" : "border-rose-300/30 bg-rose-300/10 text-rose-300"}`}>{change}</span>
      </div>
      <svg viewBox="0 0 504 120" className="mt-7 h-44 w-full overflow-visible">
        <defs>
          <linearGradient id="chart" x1="0" x2="1">
            <stop stopColor="#23e6ff" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#23e6ff" stopOpacity=".35" />
            <stop offset="1" stopColor="#23e6ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points} L 504 120 L 0 120 Z`} fill="url(#area)" />
        <motion.polyline key={activeMarket} points={points} fill="none" stroke="url(#chart)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />
      </svg>
      <div className="grid grid-cols-3 gap-3 text-sm">
        {[volume, "AI Sharpe 2.92", "Risk low"].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300">{item}</div>
        ))}
      </div>
    </div>
  );
}

function AppDashboard({ markets, marketStatus }: { markets: MarketCoin[]; marketStatus: string }) {
  const [view, setView] = useState<View>("overview");
  const [activeMarket, setActiveMarket] = useState("BTC");
  const [bot, setBot] = useState<BotState>({ name: "Astra Scalper", market: "BTC/USDT", allocation: 72, risk: 8, status: "Live" });
  const [txs, setTxs] = useState<Tx[]>([
    { id: "TX-9081", type: "Withdrawal", asset: "ETH", amount: "2.42", status: "Confirmed", time: "2m ago" },
    { id: "TX-9077", type: "Deposit", asset: "USDT", amount: "12,000", status: "Scanning", time: "8m ago" },
    { id: "TX-9069", type: "Bot fee", asset: "USDC", amount: "149", status: "Settled", time: "21m ago" }
  ]);
  const [notice, setNotice] = useState("AI signal refreshed: BTC long confidence increased to 87.4%.");
  const [securityStep, setSecurityStep] = useState(2);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(["Neura support online. Ask about bots, wallet flows, or API setup."]);
  const selectedMarket = markets.find((coin) => coin.symbol === activeMarket) ?? markets[0];

  function addTransaction(type: string, formData: FormData) {
    const asset = String(formData.get("asset") || "USDT");
    const amount = String(formData.get("amount") || "0");
    const tx: Tx = {
      id: `TX-${Math.floor(1000 + Math.random() * 8999)}`,
      type,
      asset,
      amount,
      status: type === "Withdrawal" ? "Verification" : "Scanning",
      time: "now"
    };
    setTxs((items) => [tx, ...items].slice(0, 6));
    setNotice(`${type} request created for ${amount} ${asset}.`);
  }

  function submitBot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBot({
      name: String(form.get("name") || "AI Bot"),
      market: String(form.get("market") || "BTC/USDT"),
      allocation: Number(form.get("allocation") || 50),
      risk: Number(form.get("risk") || 8),
      status: "Live"
    });
    setNotice("Bot configuration deployed to paper execution.");
  }

  return (
    <section id="Dashboard" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionTitle eyebrow="Functional Platform" title="A real SaaS dashboard, wired for interaction." copy="Switch modules, configure bots, submit wallet actions, track transactions, advance security checks, manage notifications, and chat with support." />
      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="glass rounded-3xl p-3">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan text-night"><Cpu size={18} /></span>
            <div>
              <p className="font-semibold">Neura Console</p>
              <p className="text-xs text-slate-400">Paper trading mode</p>
            </div>
          </div>
          <div className="grid gap-2">
            {navItems.map(([id, label, Icon]) => (
              <button key={id} onClick={() => setView(id)} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${view === id ? "bg-cyan text-night" : "text-slate-300 hover:bg-white/[0.06] hover:text-white"}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-mint/20 bg-mint/10 p-4 text-sm text-mint">
            <p className="font-semibold">System online</p>
            <p className="mt-1 text-mint/80">42ms signal latency</p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {markets.slice(0, 3).map((coin) => (
                <button key={coin.id} onClick={() => setActiveMarket(coin.symbol)} className={`rounded-full px-4 py-2 text-sm transition ${activeMarket === coin.symbol ? "bg-white text-night" : "border border-white/10 text-slate-300 hover:border-cyan/60"}`}>
                  {coin.symbol}/USD
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="glass rounded-full px-4 py-2 text-sm text-slate-300">{marketStatus}</span>
              <button onClick={() => setNotice("")} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Bell size={16} className="text-cyan" /> {notice ? "1 notification" : "Notifications clear"}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              {view === "overview" && <Overview activeMarket={activeMarket} marketCoin={selectedMarket} bot={bot} txs={txs} notice={notice} />}
              {view === "bots" && <Bots bot={bot} setBot={setBot} submitBot={submitBot} />}
              {view === "wallet" && <WalletView addTransaction={addTransaction} txs={txs} />}
              {view === "signals" && <Signals />}
              {view === "security" && <Security securityStep={securityStep} setSecurityStep={setSecurityStep} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <SupportChat open={chatOpen} setOpen={setChatOpen} messages={chatMessages} setMessages={setChatMessages} />
    </section>
  );
}

function Overview({ activeMarket, marketCoin, bot, txs, notice }: { activeMarket: string; marketCoin?: MarketCoin; bot: BotState; txs: Tx[]; notice: string }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-5">
        {notice && <div className="glass rounded-2xl border-cyan/30 p-4 text-sm text-cyan">{notice}</div>}
        <ChartPanel activeMarket={activeMarket} marketCoin={marketCoin} />
        <div className="grid gap-5 md:grid-cols-3">
          {[["Portfolio", "$428,904", "+18.6%", CircleDollarSign], ["Bot Profit", "$62,410", "+31.2%", Bot], ["Risk Shield", "98.8%", "Protected", LockKeyhole]].map(([label, value, sub, Icon]) => (
            <motion.div key={label as string} whileHover={{ y: -6 }} className="glass rounded-3xl p-5">
              <Icon className="text-cyan" size={22} />
              <p className="mt-5 text-sm text-slate-400">{label as string}</p>
              <p className="mt-1 text-3xl font-semibold">{value as string}</p>
              <p className="mt-2 text-sm text-mint">{sub as string}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid gap-5">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{bot.name}</h3>
            <span className="rounded-full bg-mint/15 px-3 py-1 text-xs text-mint">{bot.status}</span>
          </div>
          <p className="mt-5 text-4xl font-semibold">{bot.allocation}%</p>
          <p className="mt-2 text-sm text-slate-400">Capital routed to {bot.market}</p>
          <div className="mt-5 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${bot.allocation}%` }} />
          </div>
        </div>
        <TransactionList txs={txs} />
      </div>
    </div>
  );
}

function Bots({ bot, setBot, submitBot }: { bot: BotState; setBot: (bot: BotState) => void; submitBot: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <form onSubmit={submitBot} className="glass glow-border rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <UploadCloud className="text-cyan" />
          <div>
            <h3 className="text-xl font-semibold">Bot Upload And Configuration</h3>
            <p className="text-sm text-slate-400">Deploy a paper strategy profile with live controls.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-300">Bot name<input name="name" defaultValue={bot.name} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-cyan" /></label>
          <label className="text-sm text-slate-300">Market<select name="market" defaultValue={bot.market} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0a1022] px-4 py-3 text-white outline-none focus:border-cyan"><option>BTC/USDT</option><option>ETH/USDT</option><option>SOL/USDT</option></select></label>
          <label className="text-sm text-slate-300">Allocation<input name="allocation" type="range" min="10" max="95" defaultValue={bot.allocation} className="mt-4 w-full accent-cyan" /></label>
          <label className="text-sm text-slate-300">Max drawdown<input name="risk" type="range" min="2" max="20" defaultValue={bot.risk} className="mt-4 w-full accent-violet" /></label>
        </div>
        <button className="mt-6 rounded-2xl bg-cyan px-5 py-3 font-semibold text-night transition hover:bg-white"><Rocket className="mr-2 inline" size={18} /> Deploy Bot</button>
      </form>
      <div className="glass rounded-3xl p-6">
        <h3 className="text-xl font-semibold">Runtime Controls</h3>
        <div className="mt-5 grid gap-3">
          <button onClick={() => setBot({ ...bot, status: bot.status === "Live" ? "Paused" : "Live" })} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 transition hover:border-cyan/60">
            {bot.status === "Live" ? <Pause size={18} /> : <Play size={18} />} {bot.status === "Live" ? "Pause automation" : "Resume automation"}
          </button>
          {["Backtest last 30 days", "Sync TradingView webhook", "Export strategy logs"].map((action) => (
            <button key={action} className="rounded-2xl bg-white/[0.04] px-5 py-3 text-left text-slate-300 transition hover:bg-white/[0.08]">{action}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WalletView({ addTransaction, txs }: { addTransaction: (type: string, formData: FormData) => void; txs: Tx[] }) {
  function handleSubmit(type: string) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addTransaction(type, new FormData(event.currentTarget));
      event.currentTarget.reset();
    };
  }

  return (
    <div id="Wallet" className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="glass rounded-3xl p-6">
        <h3 className="text-xl font-semibold">Live Wallet Balance</h3>
        <p className="mt-5 text-5xl font-semibold">$182,491.33</p>
        <p className="mt-3 text-sm text-slate-400">USDT, BTC, ETH, SOL, BNB, LINK, USDC</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {["USDT 82,400", "BTC 0.84", "ETH 12.7", "SOL 340"].map((asset) => <div key={asset} className="rounded-2xl bg-white/[0.04] p-4 text-sm text-slate-300">{asset}</div>)}
        </div>
      </div>
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          {["Deposit", "Withdrawal"].map((type) => (
            <form key={type} onSubmit={handleSubmit(type)} className="glass rounded-3xl p-5">
              <h3 className="font-semibold">{type === "Deposit" ? "Deposit Crypto" : "Withdraw Crypto"}</h3>
              <select name="asset" className="mt-4 w-full rounded-2xl border border-white/10 bg-[#0a1022] px-4 py-3 outline-none focus:border-cyan"><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
              <input name="amount" required placeholder="Amount" className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none focus:border-cyan" />
              {type === "Withdrawal" && <input name="address" required placeholder="Wallet address" className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none focus:border-cyan" />}
              <button className="mt-4 w-full rounded-2xl bg-cyan px-4 py-3 font-semibold text-night transition hover:bg-white">{type}</button>
            </form>
          ))}
        </div>
        <TransactionList txs={txs} />
      </div>
    </div>
  );
}

function TransactionList({ txs }: { txs: Tx[] }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="font-semibold">Real-Time Transactions</h3>
      <div className="mt-4 space-y-3">
        {txs.map((tx) => (
          <div key={tx.id} className="grid gap-2 rounded-2xl bg-white/[0.04] p-3 text-sm sm:grid-cols-[1fr_auto]">
            <div><span className="text-slate-300">{tx.type}</span> <span className="text-white">{tx.amount} {tx.asset}</span><p className="text-xs text-slate-500">{tx.id} · {tx.time}</p></div>
            <span className={tx.status === "Confirmed" || tx.status === "Settled" ? "text-mint" : "text-cyan"}>{tx.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Signals() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {[["ETH breakout", "91%", "Momentum cluster forming above resistance.", Sparkles], ["SOL mean reversion", "76%", "Liquidity sweep detected near support.", Zap], ["BTC volatility", "High", "AI predicts elevated funding pressure.", Activity]].map(([title, score, copy, Icon]) => (
        <motion.div key={title as string} whileHover={{ rotateX: 4, rotateY: -4, y: -8 }} className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between"><Icon className="text-cyan" size={24} /><span className="rounded-full bg-violet/15 px-3 py-1 text-sm text-violet">{score as string}</span></div>
          <h3 className="mt-6 text-xl font-semibold">{title as string}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{copy as string}</p>
          <button className="mt-5 rounded-2xl border border-white/10 px-4 py-2 text-sm transition hover:border-cyan/60">Create alert</button>
        </motion.div>
      ))}
      <div className="glass rounded-3xl p-6 lg:col-span-3">
        <h3 className="text-xl font-semibold">Trader Leaderboard</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["Astra Quant", "Nova Scalper", "Helix Alpha", "Orbit DAO"].map((name, index) => (
            <div key={name} className="rounded-2xl bg-white/[0.04] p-4">
              <span className="text-cyan">#{index + 1}</span>
              <p className="mt-2 font-semibold">{name}</p>
              <p className="text-mint">+{[42, 36, 29, 24][index]}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Security({ securityStep, setSecurityStep }: { securityStep: number; setSecurityStep: (step: number) => void }) {
  const steps = ["Wallet linked", "Passkey verified", "AI withdrawal scan", "Cold vault approval"];
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-xl font-semibold">Multi-Step Verification</h3>
      <p className="mt-2 text-sm text-slate-400">Advance the demo security state to model KYC, passkeys, vault approval, and withdrawal scanning.</p>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <button key={step} onClick={() => setSecurityStep(Math.max(securityStep, index + 1))} className="flex w-full items-center gap-4 rounded-2xl bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]">
            <span className={`grid h-10 w-10 place-items-center rounded-full ${index < securityStep ? "bg-mint/15 text-mint" : "bg-white/10 text-slate-300"}`}>{index < securityStep ? <Check size={18} /> : index + 1}</span>
            <div className="flex-1"><p className="font-medium">{step}</p><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full ${index < securityStep ? "w-full bg-mint" : "w-1/3 bg-cyan"}`} /></div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SupportChat({ open, setOpen, messages, setMessages }: { open: boolean; setOpen: (open: boolean) => void; messages: string[]; setMessages: (messages: string[]) => void }) {
  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") || "").trim();
    if (!message) return;
    setMessages([...messages, message, "Got it. A specialist would receive this with your dashboard context."]);
    event.currentTarget.reset();
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} className="glass mb-3 w-[min(360px,calc(100vw-2.5rem))] rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between"><p className="font-semibold">Live Support</p><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button></div>
            <div className="max-h-56 space-y-2 overflow-auto pr-1">
              {messages.map((message, index) => <p key={`${message}-${index}`} className={`rounded-2xl p-3 text-sm ${index % 2 ? "bg-cyan text-night" : "bg-white/[0.06] text-slate-200"}`}>{message}</p>)}
            </div>
            <form onSubmit={send} className="mt-3 flex gap-2">
              <input name="message" placeholder="Ask support..." className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none focus:border-cyan" />
              <button className="rounded-2xl bg-cyan px-4 font-semibold text-night">Send</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} className="glass glow-border flex items-center gap-3 rounded-full px-5 py-4 text-sm font-semibold">
        <Headphones className="text-cyan" size={20} /> Live support
        <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-mint" /></span>
      </button>
    </div>
  );
}

function LandingSections() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[["$18.6B", "monthly volume"], ["42ms", "signal latency"], ["128K", "active traders"], ["99.99%", "vault uptime"]].map(([value, label]) => (
            <motion.div key={label} whileInView={{ y: [16, 0], opacity: [0, 1] }} viewport={{ once: true }} className="glass rounded-3xl p-6 text-center">
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-slate-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="Pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="Pricing" title="Scale from solo trading to institutional automation." copy="Transparent SaaS plans for signal-driven portfolios, strategy teams, and white-glove treasury desks." />
        <div className="grid gap-5 lg:grid-cols-3">
          {[["Signal", "$49", "AI cards, alerts, paper trading"], ["Autopilot", "$149", "Bot deployment, wallet flows, analytics"], ["Institution", "Custom", "Vault approvals, API limits, dedicated support"]].map(([plan, price, copy], index) => (
            <div key={plan} className={`glass rounded-3xl p-6 ${index === 1 ? "glow-border" : ""}`}>
              <p className="text-lg font-semibold">{plan}</p>
              <p className="mt-5 text-4xl font-semibold">{price}</p>
              <p className="mt-3 text-sm text-slate-300">{copy}</p>
              <button className="mt-8 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-night transition hover:bg-cyan">Choose plan</button>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-3xl font-semibold">Trusted by high-velocity teams.</h2>
          <p className="mt-4 text-slate-300">Built for traders who need enterprise-grade polish without slowing down decision velocity.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">{["Binance-ready", "TradingView signals", "Bybit routing", "Ledger vaults"].map((logo) => <span key={logo} className="rounded-full border border-white/10 px-4 py-2">{logo}</span>)}</div>
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {["The interface feels like an institutional terminal made for humans.", "We moved from manual alerts to governed AI execution in a week.", "The security flow gave our treasury team confidence to automate."].map((quote, index) => (
              <div key={quote} className="min-w-[260px] rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-slate-200">"{quote}"</p>
                <p className="mt-5 text-sm text-cyan">Quant operator {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <SectionTitle eyebrow="FAQ" title="Built for trust, speed, and extensibility." copy="The product surface is designed to be API-ready while keeping the demo cinematic and conversion focused." />
        <div className="space-y-3">
          {["Can I connect multiple exchanges?", "Does the bot execute withdrawals automatically?", "Is this ready for real market data APIs?"].map((question, index) => (
            <details key={question} className="glass rounded-2xl p-5">
              <summary className="cursor-pointer font-semibold">{question}</summary>
              <p className="mt-3 text-sm leading-6 text-slate-300">{index === 1 ? "High-risk actions are designed around approval gates, passkeys, and vault checks." : "Yes. The interface is structured so exchange, wallet, KYC, and market-data services can be wired behind the visible modules."}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [markets, setMarkets] = useState<MarketCoin[]>(fallbackMarkets);
  const [marketStatus, setMarketStatus] = useState("Demo market fallback");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const tickerItems = useMemo(() => [...markets, ...markets], [markets]);

  useEffect(() => {
    let cancelled = false;

    async function loadMarkets() {
      try {
        const response = await fetch("/api/markets");
        if (!response.ok) {
          throw new Error("CoinGecko unavailable");
        }
        const data = (await response.json()) as MarketCoin[];
        if (!cancelled && data.length) {
          setMarkets(data);
          setMarketStatus(`Live CoinGecko prices · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
        }
      } catch {
        if (!cancelled) {
          setMarketStatus("Using demo fallback · CoinGecko unavailable");
        }
      }
    }

    loadMarkets();
    const timer = window.setInterval(loadMarkets, 60000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-grid-radial text-white">
      <motion.div className="fixed left-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-cyan via-bluefire to-violet" style={{ scaleX: progress }} />
      <div className="grid-overlay pointer-events-none fixed inset-0" />
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-night/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-3 font-semibold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan text-night"><Cpu size={20} /></span>NeuraTrade AI</a>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {["Dashboard", "Pricing", "FAQ"].map((item) => <a key={item} href={item === "FAQ" ? "#Pricing" : `#${item}`} className="transition hover:text-cyan">{item}</a>)}
          </nav>
          <div className="hidden items-center gap-3 md:flex"><a href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm">Sign in</a><a href="#Dashboard" className="rounded-full bg-cyan px-4 py-2 text-sm font-semibold text-night">Launch Dashboard</a></div>
          <button className="md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && <div className="border-t border-white/10 bg-night px-4 py-4 md:hidden">{["Dashboard", "Pricing", "FAQ"].map((item) => <a key={item} href={item === "FAQ" ? "#Pricing" : `#${item}`} className="block py-3 text-slate-200" onClick={() => setOpen(false)}>{item}</a>)}</div>}
      </header>

      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-4 py-2 text-sm text-cyan"><Sparkles size={16} /> Autonomous crypto intelligence</div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">Start Trading Smarter With AI</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A cinematic premium fintech dashboard for real-time market intelligence, AI trading bots, secure wallet operations, and portfolio automation.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#Dashboard" className="inline-flex items-center justify-center rounded-2xl bg-cyan px-6 py-4 font-semibold text-night shadow-glow transition hover:bg-white">Launch Dashboard <ChevronRight className="ml-2" size={18} /></a>
            <a href="#Dashboard" className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 font-semibold text-white transition hover:border-violet/70">Connect Wallet <Wallet className="ml-2" size={18} /></a>
          </div>
        </motion.div>
        <HeroVisual />
      </section>

      <div className="relative z-10 border-y border-white/10 bg-white/[0.03] py-4">
        <div className="ticker-track flex w-[200%] gap-4 whitespace-nowrap">
          {tickerItems.map((coin, index) => <span key={`${coin.id}-${index}`} className="mx-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-sm"><span className="text-slate-400">{coin.symbol}</span> <span>{formatCurrency(coin.price)}</span> <span className={coin.change24h < 0 ? "text-rose-300" : "text-mint"}>{formatChange(coin.change24h)}</span></span>)}
        </div>
      </div>

      <AppDashboard markets={markets} marketStatus={marketStatus} />
      <LandingSections />

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>NeuraTrade AI. Premium AI crypto infrastructure concept.</p>
          <div className="flex flex-wrap gap-4">{["Docs", "API", "Security", "X", "LinkedIn", "Discord"].map((item) => <a key={item} href="#" className="hover:text-cyan">{item}</a>)}</div>
        </div>
      </footer>
    </main>
  );
}
