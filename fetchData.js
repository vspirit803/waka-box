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
  const dbConnect = await connectDb().catch(err => {
    console.log(err);
  });
  const db = dbConnect.db("projectTime");
  // const collection = db.collection("durations");
  const date = "2020-07-30";
  // const durationsRaw = await wakatime.getMyDurations({ date });
  // const durations = durationsRaw.data.map(
  //   ({ created_at, duration, id, machine_name_id, project, time }) => ({
  //     created_at,
  //     duration,
  //     id,
  //     machine_name_id,
  //     project,
  //     time,
  //     date,
  //   })
  // );
  // console.log(durations);
  // if (durations && durations.length) {
  //   db.collection("durations").insertMany(durations, function(err, res) {
  //     if (err) throw err;
  //     console.log("插入的durations数量为: " + res.insertedCount);
  //   });
  // }

  const summaryRaw = await wakatime.getMySummary({
    dateRange: { startDate: date, endDate: date }
  });
  const languages = summaryRaw.data?.[0]?.languages?.map(
    ({ name, percent, total_seconds }) => ({
      name,
      percent,
      total_seconds,
      date
    })
  );
  if (languages && languages.length) {
    db.collection("languages").insertMany(languages, function(err, res) {
      if (err) throw err;
      console.log("插入的languages数量为: " + res.insertedCount);
    });
  }

  //项目统计
  // const projects = summaryRaw.data?.[0]?.projects?.map(
  //   ({ name, percent, total_seconds }) => ({
  //     name,
  //     percent,
  //     total_seconds,
  //     date,
  //   })
  // );
  // if (languages && languages.length) {
  //   db.collection("languages").insertMany(languages, function(err, res) {
  //     if (err) throw err;
  //     console.log("插入的languages数量为: " + res.insertedCount);
  //   });
  // }

  dbConnect.close();
}

(async () => {
  await main();
})();
