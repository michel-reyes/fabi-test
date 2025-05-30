import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Hash password using bcrypt
 */
function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Seed the database with initial data
 */
async function main(): Promise<void> {
  console.log('🌱 Seeding database with initial data...');
  
  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ubereats.com' },
      update: {},
      create: {
        email: 'admin@ubereats.com',
        passwordHash: await hashPassword('admin123'),
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        phone: '+1-555-000-0000'
      }
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
    
    // Create seller users
    const marioUser = await prisma.user.upsert({
      where: { email: 'mario@italianplace.com' },
      update: {},
      create: {
        email: 'mario@italianplace.com',
        passwordHash: await hashPassword('mario123'),
        firstName: 'Mario',
        lastName: 'Rossi',
        role: 'seller',
        phone: '+1-555-123-4567'
      }
    });
    
    const chenUser = await prisma.user.upsert({
      where: { email: 'chen@dragonpalace.com' },
      update: {},
      create: {
        email: 'chen@dragonpalace.com',
        passwordHash: await hashPassword('chen123'),
        firstName: 'Chen',
        lastName: 'Wang',
        role: 'seller',
        phone: '+1-555-345-6789'
      }
    });
    
    const giuseppeUser = await prisma.user.upsert({
      where: { email: 'giuseppe@bellaroma.com' },
      update: {},
      create: {
        email: 'giuseppe@bellaroma.com',
        passwordHash: await hashPassword('giuseppe123'),
        firstName: 'Giuseppe',
        lastName: 'Bianchi',
        role: 'seller',
        phone: '+1-555-234-5678'
      }
    });
    
    const liUser = await prisma.user.upsert({
      where: { email: 'li@goldenwok.com' },
      update: {},
      create: {
        email: 'li@goldenwok.com',
        passwordHash: await hashPassword('li123'),
        firstName: 'Li',
        lastName: 'Zhang',
        role: 'seller',
        phone: '+1-555-456-7890'
      }
    });
    
    console.log('✅ Created seller users');
    
    // Create customer users
    const customer1 = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        passwordHash: await hashPassword('customer123'),
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        phone: '+1-555-111-1111'
      }
    });
    
    const customer2 = await prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        passwordHash: await hashPassword('customer123'),
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'customer',
        phone: '+1-555-222-2222'
      }
    });
    
    console.log('✅ Created customer users');
    
    // Create restaurants
    const marioRestaurant = await prisma.restaurant.upsert({
      where: {
        id: 'mario-restaurant-id', // This ID will be replaced by uuid() in create
      },
      update: {},
      create: {
        ownerId: marioUser.id,
        name: "Mario's Italian Kitchen",
        description: "Authentic Italian cuisine with fresh ingredients and traditional recipes",
        cuisineType: "italian",
        phone: "+1-555-123-4567",
        email: "mario@italianplace.com",
        streetAddress: "123 Little Italy St",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        latitude: 40.7589,
        longitude: -73.9441,
        coverImageUrl: "https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop",
        isActive: true,
        isOpen: true,
        averageRating: 4.5,
        totalReviews: 234,
        deliveryFee: 3.99,
        minimumOrder: 15.00,
        estimatedDeliveryTime: 35
      }
    });
    
    const bellaRestaurant = await prisma.restaurant.upsert({
      where: {
        id: 'bella-restaurant-id', // This ID will be replaced by uuid() in create
      },
      update: {},
      create: {
        ownerId: giuseppeUser.id,
        name: "Bella Roma Pizzeria",
        description: "Wood-fired pizzas and homemade pasta in the heart of the city",
        cuisineType: "italian",
        phone: "+1-555-234-5678",
        email: "giuseppe@bellaroma.com",
        streetAddress: "456 Roma Avenue",
        city: "New York",
        state: "NY",
        postalCode: "10014",
        latitude: 40.7505,
        longitude: -73.9934,
        coverImageUrl: "https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=400&h=200&fit=crop",
        isActive: true,
        isOpen: true,
        averageRating: 4.3,
        totalReviews: 189,
        deliveryFee: 2.99,
        minimumOrder: 12.00,
        estimatedDeliveryTime: 30
      }
    });
    
    const dragonRestaurant = await prisma.restaurant.upsert({
      where: {
        id: 'dragon-restaurant-id', // This ID will be replaced by uuid() in create
      },
      update: {},
      create: {
        ownerId: chenUser.id,
        name: "Dragon Palace",
        description: "Traditional Szechuan and Cantonese dishes with bold flavors",
        cuisineType: "chinese",
        phone: "+1-555-345-6789",
        email: "chen@dragonpalace.com",
        streetAddress: "789 Chinatown Ave",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        latitude: 40.7157,
        longitude: -73.9970,
        coverImageUrl: "https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg?w=400&h=200&fit=crop",
        isActive: true,
        isOpen: true,
        averageRating: 4.7,
        totalReviews: 312,
        deliveryFee: 4.99,
        minimumOrder: 20.00,
        estimatedDeliveryTime: 25
      }
    });
    
    const goldenRestaurant = await prisma.restaurant.upsert({
      where: {
        id: 'golden-restaurant-id', // This ID will be replaced by uuid() in create
      },
      update: {},
      create: {
        ownerId: liUser.id,
        name: "Golden Wok Express",
        description: "Fast and delicious Chinese takeout with generous portions",
        cuisineType: "chinese",
        phone: "+1-555-456-7890",
        email: "li@goldenwok.com",
        streetAddress: "321 Dragon Street",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        latitude: 40.7183,
        longitude: -73.9944,
        coverImageUrl: "https://images.unsplash.com/photo-1598444800952-884dfce6f145?w=400&h=200&fit=crop",
        isActive: true,
        isOpen: false,
        averageRating: 4.2,
        totalReviews: 156,
        deliveryFee: 3.49,
        minimumOrder: 10.00,
        estimatedDeliveryTime: 20
      }
    });
    
    console.log('✅ Created restaurants');
    
    // Create menu items for Mario's Italian Kitchen
    const marioItems = [
      {
        restaurantId: marioRestaurant.id,
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella, tomato sauce, and basil",
        price: 18.99,
        category: "mains",
        imageUrl: "https://images.pexels.com/photos/28528512/pexels-photo-28528512.jpeg?w=300&h=200&fit=crop",
        isVegetarian: true
      },
      {
        restaurantId: marioRestaurant.id,
        name: "Spaghetti Carbonara",
        description: "Traditional Roman pasta with eggs, pecorino cheese, and pancetta",
        price: 22.50,
        category: "mains",
        imageUrl: "https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop"
      },
      {
        restaurantId: marioRestaurant.id,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        price: 8.99,
        category: "desserts",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
        isVegetarian: true
      },
      {
        restaurantId: marioRestaurant.id,
        name: "Bruschetta Trio",
        description: "Three pieces of toasted bread with different toppings",
        price: 12.99,
        category: "appetizers",
        imageUrl: "https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop",
        isVegetarian: true
      }
    ];
    
    // Create menu items for Dragon Palace
    const dragonItems = [
      {
        restaurantId: dragonRestaurant.id,
        name: "Kung Pao Chicken",
        description: "Spicy Szechuan chicken with peanuts and vegetables",
        price: 16.99,
        category: "mains",
        imageUrl: "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
      },
      {
        restaurantId: dragonRestaurant.id,
        name: "Pork Dumplings (8 pcs)",
        description: "Steamed pork dumplings with ginger soy dipping sauce",
        price: 12.99,
        category: "appetizers",
        imageUrl: "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
      },
      {
        restaurantId: dragonRestaurant.id,
        name: "Yang Chow Fried Rice",
        description: "Traditional fried rice with shrimp, char siu, and eggs",
        price: 14.99,
        category: "mains",
        imageUrl: "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
      },
      {
        restaurantId: dragonRestaurant.id,
        name: "Hot and Sour Soup",
        description: "Traditional Chinese soup with tofu, mushrooms, and bamboo shoots",
        price: 8.99,
        category: "appetizers",
        imageUrl: "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop",
        isVegetarian: true
      }
    ];
    
    // Create menu items one by one (SQLite doesn't support createMany with skipDuplicates)
    console.log('Creating menu items...');
    for (const item of [...marioItems, ...dragonItems]) {
      await prisma.menuItem.create({
        data: item
      });
    }
    
    console.log('✅ Created menu items');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@ubereats.com / admin123');
    console.log('Seller (Mario): mario@italianplace.com / mario123'); 
    console.log('Seller (Chen): chen@dragonpalace.com / chen123');
    console.log('Customer: john@example.com / customer123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close database connection
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
