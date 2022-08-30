require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATA_URL);
const coll = client.db("Notes").collection("Common");
const log = client.db("Notes").collection("Log");

client.connect(() => {
  console.log("Connected to DB");
});

exports.check = check = async (params) => {
  let data = await coll.countDocuments({ name: { $eq: params } });
  return data;
};

exports.create = create = async (obj) => {
  let data = await coll.insertOne(obj);
  delete obj.text;
  obj.access = 0;
  obj.last = Date().substring(0,24);
  await log.insertOne(obj);
  return data;
};

exports.find = find = async (params) => {
  let data = await coll.findOne({ name: params });
  let count = await log.findOne({ name: params });
  if(!!count) {
    await log.updateOne({name: params},{$set: {last: Date().substring(0,24)}});
    await log.updateOne({name: params},{$inc: {access : 1}});
  }
  return data;
};
