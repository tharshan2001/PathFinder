import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user/User.js";
import Connection from "./models/user/connectionRef.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PathFinder";

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Connection.deleteMany({});
    console.log("Cleared existing data");

    // Create test users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        headline: "Software Engineer at Tech Corp",
        about: "Passionate about building great software",
        location: "San Francisco, CA",
        skills: [
          { skill: "JavaScript", endorsementsCount: 5 },
          { skill: "React", endorsementsCount: 3 },
          { skill: "Node.js", endorsementsCount: 2 }
        ],
        connectionsCount: 0,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        headline: "Product Manager at Startup",
        about: "Building products people love",
        location: "New York, NY",
        skills: [
          { skill: "Product Management", endorsementsCount: 8 },
          { skill: "Agile", endorsementsCount: 4 },
          { skill: "UX", endorsementsCount: 3 }
        ],
        connectionsCount: 0,
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        headline: "Full Stack Developer",
        about: "Love coding and coffee",
        location: "Austin, TX",
        skills: [
          { skill: "Python", endorsementsCount: 6 },
          { skill: "Django", endorsementsCount: 4 },
          { skill: "React", endorsementsCount: 3 },
          { skill: "AWS", endorsementsCount: 2 }
        ],
        connectionsCount: 0,
      },
      {
        name: "Sarah Williams",
        email: "sarah@example.com",
        password: hashedPassword,
        headline: "Data Scientist at AI Company",
        about: "Turning data into insights",
        location: "Seattle, WA",
        skills: [
          { skill: "Python", endorsementsCount: 10 },
          { skill: "Machine Learning", endorsementsCount: 7 },
          { skill: "TensorFlow", endorsementsCount: 5 }
        ],
        connectionsCount: 0,
      },
      {
        name: "David Brown",
        email: "david@example.com",
        password: hashedPassword,
        headline: "DevOps Engineer",
        about: "Making deployments painless",
        location: "Denver, CO",
        skills: [
          { skill: "Docker", endorsementsCount: 8 },
          { skill: "Kubernetes", endorsementsCount: 6 },
          { skill: "AWS", endorsementsCount: 5 },
          { skill: "CI/CD", endorsementsCount: 4 }
        ],
        connectionsCount: 0,
      },
    ]);

    console.log("Created 5 test users:");
    users.forEach((u) => console.log(`  - ${u.name} (${u.email})`));

    // Create some connections between users
    const connections = await Connection.insertMany([
      {
        requester: users[0]._id, // John
        recipient: users[1]._id, // Jane
        status: "accepted",
      },
      {
        requester: users[0]._id, // John
        recipient: users[2]._id, // Mike
        status: "accepted",
      },
      {
        requester: users[3]._id, // Sarah
        recipient: users[0]._id, // John
        status: "pending",
      },
      {
        requester: users[4]._id, // David
        recipient: users[0]._id, // John
        status: "pending",
      },
      {
        requester: users[2]._id, // Mike
        recipient: users[1]._id, // Jane
        status: "accepted",
      },
      {
        requester: users[3]._id, // Sarah
        recipient: users[1]._id, // Jane
        status: "pending",
      },
    ]);

    console.log("\nCreated connections:");
    connections.forEach((c) => {
      const requester = users.find((u) => u._id.toString() === c.requester.toString());
      const recipient = users.find((u) => u._id.toString() === c.recipient.toString());
      console.log(`  - ${requester.name} -> ${recipient.name} (${c.status})`);
    });

    // Update connections count
    await User.findByIdAndUpdate(users[0]._id, { $set: { connectionsCount: 2 } });
    await User.findByIdAndUpdate(users[1]._id, { $set: { connectionsCount: 2 } });
    await User.findByIdAndUpdate(users[2]._id, { $set: { connectionsCount: 2 } });

    console.log("\n✅ Seed completed successfully!");
    console.log("\nTest accounts:");
    console.log("  Email: john@example.com | Password: password123");
    console.log("  Email: jane@example.com | Password: password123");
    console.log("  Email: mike@example.com | Password: password123");
    console.log("  Email: sarah@example.com | Password: password123");
    console.log("  Email: david@example.com | Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
