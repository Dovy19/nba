import { config } from 'dotenv';
import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from 'drizzle-orm';

// Load environment variables
config({ path: '.env.local' });

async function seed() {
  try {
    console.log('🌱 Starting seed...\n');

    // Users to create
    const usersToCreate = [
      { 
        username: "Dovy", 
        email: "idigo1234@gmail.com", 
        password: "2inchdoyle", 
        isAdmin: true 
      },
      { 
        username: "Karolis", 
        email: null, 
        password: "karkalas", 
        isAdmin: false 
      },
      { 
        username: "Ovid", 
        email: null, 
        password: "ovid123", 
        isAdmin: false 
      },
      { 
        username: "Mantas", 
        email: null, 
        password: "mantelis", 
        isAdmin: false 
      },
      { 
        username: "Sebastian", 
        email: null, 
        password: "sebastian11", 
        isAdmin: false 
      },
    ];

    for (const user of usersToCreate) {
      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, user.username))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⏭️  User "${user.username}" already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create user
      const [createdUser] = await db
        .insert(users)
        .values({
          username: user.username,
          email: user.email,
          password: hashedPassword,
          isAdmin: user.isAdmin,
        })
        .returning();

      console.log(`✅ Created user: ${createdUser.username}${user.isAdmin ? ' (Admin)' : ''}`);
    }

    console.log('\n✨ Seeding complete!');
    console.log('\n📋 User Credentials:');
    console.log('   Dovy (Admin):  username: Dovy     | password: 2inchdoyle');
    console.log('   Karolis:       username: Karolis  | password: karkalas');
    console.log('   Ovid:          username: Ovid     | password: ovid123');
    console.log('\n💡 Predictions will show as "Dovy\'s Prediction", "Karolis\'s Prediction", etc.');
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();