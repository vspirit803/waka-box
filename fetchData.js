require("dotenv").config();
const { WakaTimeClient, RANGE } = require("wakatime-client");

const { WAKATIME_API_KEY: wakatimeApiKey } = process.env;

const wakatime = new WakaTimeClient(wakatimeApiKey);

console.log(wakatimeApiKey);

async function main() {
  // const stats = await wakatime.getMyStats({ range: RANGE.LAST_7_DAYS });
  // console.log(stats)

  const stats = await wakatime.getMyDurations({ date: "2020-07-30" });
  console.log(stats);
}

(async () => {
  await main();
})();
