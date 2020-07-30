require("dotenv").config();
const { WakaTimeClient, RANGE } = require("wakatime-client");
const MongoClient = require("mongodb").MongoClient;
const { WAKATIME_API_KEY: wakatimeApiKey, MONGODB_URL: url } = process.env;

const wakatime = new WakaTimeClient(wakatimeApiKey);

async function connectDb() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) {
        reject(err);
      }
      console.log("数据库已连接!");
      resolve(db);
    });
  });
}

async function main() {
  // const stats = await wakatime.getMyStats({ range: RANGE.LAST_7_DAYS });
  // console.log(stats)
  const db = await connectDb().catch(err => {
    console.log(err);
  });
  const collection = db.db("projectTime").collection("durations");
  const date = "2020-07-30";
  const durationsRaw = await wakatime.getMyDurations({ date });
  const durations = durationsRaw.data.map(
    ({ created_at, duration, id, machine_name_id, project, time }) => ({
      created_at,
      duration,
      id,
      machine_name_id,
      project,
      time,
      date
    })
  );
  console.log(durations);
  collection.insertMany(durations, function(err, res) {
    if (err) throw err;
    console.log("插入的文档数量为: " + res.insertedCount);
  });

  db.close();
}

(async () => {
  await main();
})();
