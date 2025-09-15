import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL; // same as in your .env
const client = new MongoClient(url);

async function fixStudentAssignments() {
  try {
    await client.connect();
    const db = client.db(); // default DB from connection string
    const collection = db.collection("StudentAssignment");

    // Delete records where assignmentId is null
    const result = await collection.deleteMany({ assignmentId: null });
    console.log(
      "Deleted broken StudentAssignment records:",
      result.deletedCount
    );
  } catch (err) {
    console.error("Error fixing StudentAssignments:", err);
  } finally {
    await client.close();
  }
}

fixStudentAssignments();
