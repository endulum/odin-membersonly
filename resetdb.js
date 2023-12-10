const Member = require('./models/member');
const Message = require('./models/message');

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
  await emptyMessages();
  await emptyMembers();
  await populateMembers();
  console.log(`Nothing left to do, closing connection.`);
  mongoose.connection.close();
}

async function emptyMessages() {
  const messages = (await Message.find({})).length;
  if (messages > 0) {
    if (messages > 0) {
      console.log(`Found ${messages} messages. Deleting...`);
      await Message.deleteMany({});
    }
  }
}

async function emptyMembers() {
  const members = (await Member.find({})).length;
  if (members > 0) {
    console.log(`Found ${members} members. Deleting...`);
    await Member.deleteMany({});
  }
}

async function populateMembers() {
  const someone = await Member.create({
    username: 'someone',
    password: 'someone',
    isVerified: true
  });

  await Message.create({
    author: someone,
    text: 'Lorem ipsum dolor sit amet.'
  });

  await Message.create({
    author: someone,
    text: 'Consectetur adipscing elit.'
  });
}