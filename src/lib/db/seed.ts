import { config } from 'dotenv';
import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

// Load environment variables
config({ path: '.env.local' });

async function seed() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash("2inchdoyle", 10);
    
    // Create admin user
    const [admin] = await db.insert(users).values({
      username: "Dovy",
      email: "idigo1234@gmail.com",
      password: hashedPassword,
      isAdmin: true,
    }).returning();
    
    console.log("✅ Admin user created!");
    console.log("Username:", admin.username);
    console.log("Email:", admin.email);
    console.log("Password: YOUR_PASSWORD");
    console.log("\n⚠️  Change this password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();