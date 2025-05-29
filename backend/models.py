from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(String, default="customer")  # customer, seller, admin
    is_active = Column(Boolean, default=True)
    profile_image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owned_restaurants = relationship("Restaurant", back_populates="owner")
    orders = relationship("Order", back_populates="customer")

class Restaurant(Base):
    __tablename__ = "restaurants"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    cuisine_type = Column(String, nullable=False)  # italian, chinese
    phone = Column(String)
    email = Column(String)
    
    # Address fields
    street_address = Column(String, nullable=False)
    apartment = Column(String)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Business details
    cover_image_url = Column(String)
    logo_url = Column(String)
    is_active = Column(Boolean, default=True)
    is_open = Column(Boolean, default=False)
    
    # Ratings and stats
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_orders = Column(Integer, default=0)
    
    # Delivery info
    delivery_fee = Column(Float, default=2.99)
    minimum_order = Column(Float, default=0.0)
    estimated_delivery_time = Column(Integer, default=30)  # in minutes
    
    # Business hours (stored as JSON)
    business_hours = Column(JSON)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="owned_restaurants")
    menu_items = relationship("MenuItem", back_populates="restaurant")
    orders = relationship("Order", back_populates="restaurant")

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    image_url = Column(String)
    
    # Item details
    is_available = Column(Boolean, default=True)
    is_vegetarian = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    spice_level = Column(Integer, default=0)  # 0-5 scale
    calories = Column(Integer)
    prep_time = Column(Integer, default=15)  # in minutes
    category = Column(String, default="mains")  # appetizers, mains, desserts, beverages
    
    # Customization options (stored as JSON)
    customization_options = Column(JSON)
    
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)
    
    # Order status
    status = Column(String, default="pending")  # pending, confirmed, preparing, ready, picked_up, delivering, delivered, cancelled
    
    # Delivery information
    delivery_address = Column(String, nullable=False)
    delivery_instructions = Column(Text)
    
    # Order totals
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False)
    tip_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    # Timing
    estimated_delivery_time = Column(DateTime(timezone=True))
    actual_delivery_time = Column(DateTime(timezone=True))
    
    # Payment (placeholder for future integration)
    payment_status = Column(String, default="pending")
    payment_method = Column(String)
    
    # Special instructions
    special_instructions = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="orders")
    restaurant = relationship("Restaurant", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    menu_item_id = Column(String, ForeignKey("menu_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Customizations for this specific order item
    customizations = Column(JSON)
    special_instructions = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")