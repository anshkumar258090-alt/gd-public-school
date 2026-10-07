import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://C7NMWQzuaCOsjsMZ:C7NMWQzuaCOsjsMZ@gdps.sjdv92k.mongodb.net/gdps?retryWrites=true&w=majority';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
