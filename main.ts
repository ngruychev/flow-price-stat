import {
  createBot,
  startBot,
} from "https://deno.land/x/discordeno@13.0.0-rc15/mod.ts";
import {
  enableCachePlugin,
  enableCacheSweepers,
} from "https://deno.land/x/discordeno_cache_plugin@0.0.18/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.1.0/mod.ts";

const envConfig = config();

function getEnv(name: string): string | undefined {
  return Deno.env.get(name) ?? envConfig[name];
}

function unwrap<T>(value?: T, message?: string): T {
  const errMessage = message ?? "did not expect value";
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function unwrapEnv(name: string): string {
  return unwrap(getEnv(name), `${name} env not set`);
}

const token = unwrapEnv("DISCORD_TOKEN");
const botId = BigInt(unwrapEnv("BOT_ID"));
const statChannelId = BigInt(unwrapEnv("STAT_CHANNEL_ID"));

const tickerSymbol = getEnv("TICKER_SYMBOL") ?? "FLOWUSDT";
const statNamePrefix = getEnv("STAT_NAME_PREFIX") ?? "FLOW price: $";
const statNameSuffix = getEnv("STAT_NAME_SUFFIX") ?? " USD";
const updateInterval = parseInt(getEnv("UPDATE_INTERVAL") ?? "60", 10);

const baseBot = createBot({
  token,
  intents: ["Guilds", "GuildMessages"],
  botId,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
      console.log(
        `Invite link: https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=1040&scope=bot`,
      );
    },
    messageCreate(_bot, _message) {
      // we do nothing :^)
    },
  },
});

const bot = enableCachePlugin(baseBot);

enableCacheSweepers(bot);

await startBot(bot);

async function getPrice(): Promise<number> {
  const { price: priceStr } = await (await fetch(
    `https://api.binance.com/api/v1/ticker/price?symbol=${tickerSymbol}`,
  )).json();
  const price = parseFloat(priceStr);
  return price;
}

async function updateChannel(price: number) {
  await bot.helpers.editChannel(statChannelId, {
    name: `${statNamePrefix}${price}${statNameSuffix}`,
  });
}

const _updateIntervalId = setInterval(async () => {
  const price = await getPrice();
  await updateChannel(price);
  console.log(
    `Updated channel ${statChannelId} with text "${statNamePrefix}${price}${statNameSuffix}"`,
  );
}, updateInterval);
