import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
from auth import get_password_hash
from models import User, Restaurant, MenuItem

def seed_database():
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database with initial data...")
        
        # Create admin user
        admin_user = User(
            email="admin@ubereats.com",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role="admin",
            phone="+1-555-000-0000"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print(f"✅ Created admin user: {admin_user.email}")
        
        # Create seller users
        mario_user = User(
            email="mario@italianplace.com",
            password_hash=get_password_hash("mario123"),
            first_name="Mario",
            last_name="Rossi",
            role="seller",
            phone="+1-555-123-4567"
        )
        db.add(mario_user)
        
        chen_user = User(
            email="chen@dragonpalace.com",
            password_hash=get_password_hash("chen123"),
            first_name="Chen",
            last_name="Wang",
            role="seller",
            phone="+1-555-345-6789"
        )
        db.add(chen_user)
        
        giuseppe_user = User(
            email="giuseppe@bellaroma.com",
            password_hash=get_password_hash("giuseppe123"),
            first_name="Giuseppe",
            last_name="Bianchi",
            role="seller",
            phone="+1-555-234-5678"
        )
        db.add(giuseppe_user)
        
        li_user = User(
            email="li@goldenwok.com",
            password_hash=get_password_hash("li123"),
            first_name="Li",
            last_name="Zhang",
            role="seller",
            phone="+1-555-456-7890"
        )
        db.add(li_user)
        
        db.commit()
        db.refresh(mario_user)
        db.refresh(chen_user)
        db.refresh(giuseppe_user)
        db.refresh(li_user)
        print("✅ Created seller users")
        
        # Create customer users
        customer1 = User(
            email="john@example.com",
            password_hash=get_password_hash("customer123"),
            first_name="John",
            last_name="Doe",
            role="customer",
            phone="+1-555-111-1111"
        )
        db.add(customer1)
        
        customer2 = User(
            email="jane@example.com",
            password_hash=get_password_hash("customer123"),
            first_name="Jane",
            last_name="Smith",
            role="customer",
            phone="+1-555-222-2222"
        )
        db.add(customer2)
        
        db.commit()
        print("✅ Created customer users")
        
        # Create restaurants
        mario_restaurant = Restaurant(
            owner_id=mario_user.id,
            name="Mario's Italian Kitchen",
            description="Authentic Italian cuisine with fresh ingredients and traditional recipes",
            cuisine_type="italian",
            phone="+1-555-123-4567",
            email="mario@italianplace.com",
            street_address="123 Little Italy St",
            city="New York",
            state="NY",
            postal_code="10013",
            latitude=40.7589,
            longitude=-73.9441,
            cover_image_url="https://images.unsplash.com/photo-1574615552620-54cd32a28519?w=400&h=200&fit=crop",
            is_active=True,
            is_open=True,
            average_rating=4.5,
            total_reviews=234,
            delivery_fee=3.99,
            minimum_order=15.00,
            estimated_delivery_time=35
        )
        db.add(mario_restaurant)
        
        bella_restaurant = Restaurant(
            owner_id=giuseppe_user.id,
            name="Bella Roma Pizzeria",
            description="Wood-fired pizzas and homemade pasta in the heart of the city",
            cuisine_type="italian",
            phone="+1-555-234-5678",
            email="giuseppe@bellaroma.com",
            street_address="456 Roma Avenue",
            city="New York",
            state="NY",
            postal_code="10014",
            latitude=40.7505,
            longitude=-73.9934,
            cover_image_url="https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=400&h=200&fit=crop",
            is_active=True,
            is_open=True,
            average_rating=4.3,
            total_reviews=189,
            delivery_fee=2.99,
            minimum_order=12.00,
            estimated_delivery_time=30
        )
        db.add(bella_restaurant)
        
        dragon_restaurant = Restaurant(
            owner_id=chen_user.id,
            name="Dragon Palace",
            description="Traditional Szechuan and Cantonese dishes with bold flavors",
            cuisine_type="chinese",
            phone="+1-555-345-6789",
            email="chen@dragonpalace.com",
            street_address="789 Chinatown Ave",
            city="New York",
            state="NY",
            postal_code="10013",
            latitude=40.7157,
            longitude=-73.9970,
            cover_image_url="https://images.pexels.com/photos/2670327/pexels-photo-2670327.jpeg?w=400&h=200&fit=crop",
            is_active=True,
            is_open=True,
            average_rating=4.7,
            total_reviews=312,
            delivery_fee=4.99,
            minimum_order=20.00,
            estimated_delivery_time=25
        )
        db.add(dragon_restaurant)
        
        golden_restaurant = Restaurant(
            owner_id=li_user.id,
            name="Golden Wok Express",
            description="Fast and delicious Chinese takeout with generous portions",
            cuisine_type="chinese",
            phone="+1-555-456-7890",
            email="li@goldenwok.com",
            street_address="321 Dragon Street",
            city="New York",
            state="NY",
            postal_code="10013",
            latitude=40.7183,
            longitude=-73.9944,
            cover_image_url="https://images.unsplash.com/photo-1598444800952-884dfce6f145?w=400&h=200&fit=crop",
            is_active=True,
            is_open=False,
            average_rating=4.2,
            total_reviews=156,
            delivery_fee=3.49,
            minimum_order=10.00,
            estimated_delivery_time=20
        )
        db.add(golden_restaurant)
        
        db.commit()
        db.refresh(mario_restaurant)
        db.refresh(bella_restaurant)
        db.refresh(dragon_restaurant)
        db.refresh(golden_restaurant)
        print("✅ Created restaurants")
        
        # Create menu items for Mario's Italian Kitchen
        mario_items = [
            {
                "name": "Margherita Pizza",
                "description": "Classic pizza with fresh mozzarella, tomato sauce, and basil",
                "price": 18.99,
                "category": "mains",
                "image_url": "https://images.pexels.com/photos/28528512/pexels-photo-28528512.jpeg?w=300&h=200&fit=crop",
                "is_vegetarian": True
            },
            {
                "name": "Spaghetti Carbonara",
                "description": "Traditional Roman pasta with eggs, pecorino cheese, and pancetta",
                "price": 22.50,
                "category": "mains",
                "image_url": "https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop"
            },
            {
                "name": "Tiramisu",
                "description": "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
                "price": 8.99,
                "category": "desserts",
                "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
                "is_vegetarian": True
            },
            {
                "name": "Bruschetta Trio",
                "description": "Three pieces of toasted bread with different toppings",
                "price": 12.99,
                "category": "appetizers",
                "image_url": "https://images.unsplash.com/photo-1552580715-4d9bc27f1e2f?w=300&h=200&fit=crop",
                "is_vegetarian": True
            }
        ]
        
        for item_data in mario_items:
            menu_item = MenuItem(
                restaurant_id=mario_restaurant.id,
                **item_data
            )
            db.add(menu_item)
        
        # Create menu items for Dragon Palace
        dragon_items = [
            {
                "name": "Kung Pao Chicken",
                "description": "Spicy Szechuan chicken with peanuts and vegetables",
                "price": 16.99,
                "category": "mains",
                "image_url": "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
            },
            {
                "name": "Pork Dumplings (8 pcs)",
                "description": "Steamed pork dumplings with ginger soy dipping sauce",
                "price": 12.99,
                "category": "appetizers",
                "image_url": "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
            },
            {
                "name": "Yang Chow Fried Rice",
                "description": "Traditional fried rice with shrimp, char siu, and eggs",
                "price": 14.99,
                "category": "mains",
                "image_url": "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop"
            },
            {
                "name": "Hot and Sour Soup",
                "description": "Traditional Chinese soup with tofu, mushrooms, and bamboo shoots",
                "price": 8.99,
                "category": "appetizers",
                "image_url": "https://images.pexels.com/photos/6646264/pexels-photo-6646264.jpeg?w=300&h=200&fit=crop",
                "is_vegetarian": True
            }
        ]
        
        for item_data in dragon_items:
            menu_item = MenuItem(
                restaurant_id=dragon_restaurant.id,
                **item_data
            )
            db.add(menu_item)
        
        db.commit()
        print("✅ Created menu items")
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📝 Test Accounts:")
        print("Admin: admin@ubereats.com / admin123")
        print("Seller (Mario): mario@italianplace.com / mario123") 
        print("Seller (Chen): chen@dragonpalace.com / chen123")
        print("Customer: john@example.com / customer123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()