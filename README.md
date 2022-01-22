# FLOW price stats

This bot changes the name of a channel to match the price of a cryptocurrency,
a la Statbot

## Building

```sh
docker build . -t flow-price-stat
```

## Running

```sh
docker-compose up -d
```

## Env variables

Configure in `.env`

- `DISCORD_TOKEN` - your token. required
- `BOT_ID` - the ID of your bot. required
- `STAT_CHANNEL_ID` - the ID of the channel to edit. required
- `TICKER_SYMBOL` - binance ticker symbol name. defaults to `FLOWUSDT`
- `STAT_NAME_PREFIX` - prefix of the message. defaults to `FLOW price: $`
- `STAT_NAME_SUFFIX` - suffix of the message. defaults to `USD`
- `UPDATE_INTERVAL` - update interval in seconds. defaults to `60`
