import { NextResponse } from "next/server";

const COINS = ["bitcoin", "ethereum", "solana", "binancecoin", "arbitrum", "chainlink"];

export const revalidate = 60;

export async function GET() {
  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("ids", COINS.join(","));
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(COINS.length));
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");
  url.searchParams.set("price_change_percentage", "24h");

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "CoinGecko request failed", status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      data.map((coin: any) => ({
        id: coin.id,
        symbol: String(coin.symbol).toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume
      }))
    );
  } catch {
    return NextResponse.json({ error: "Unable to reach CoinGecko" }, { status: 502 });
  }
}
