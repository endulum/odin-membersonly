const Member = require('./models/member');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dotenv = require('dotenv');
dotenv.config();

const mongoDB = process.env.MONGO;

main().catch(e => console.log(e));

async function main() { 
  console.log(`Connecting with URL "${mongoDB}"`);
  const conn = await mongoose.connect(mongoDB);
  console.log(`Connected to database "${conn.connection.name}"`);
  await emptyMembers();
  await populateMembers();
  console.log(`Nothing left to do, closing connection.`);
  mongoose.connection.close();
}

async function emptyMembers() {
  const members = (await Member.find({})).length;
  if (members > 0) {
    console.log(`Found ${members} members. Deleting...`);
    await Member.deleteMany({});
  }
}