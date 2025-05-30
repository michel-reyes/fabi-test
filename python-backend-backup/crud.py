from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime

from models import User, Restaurant, MenuItem, Order, OrderItem
from schemas import UserCreate, RestaurantCreate, RestaurantUpdate, MenuItemCreate, MenuItemUpdate, OrderCreate, OrderUpdate, OrderItemCreate
from auth import get_password_hash

# User CRUD operations
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Restaurant CRUD operations
def create_restaurant(db: Session, restaurant: RestaurantCreate, owner_id: str):
    db_restaurant = Restaurant(
        owner_id=owner_id,
        **restaurant.dict()
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

def get_restaurants(db: Session, skip: int = 0, limit: int = 100, cuisine_type: Optional[str] = None, owner_id: Optional[str] = None):
    query = db.query(Restaurant)
    
    if cuisine_type:
        query = query.filter(Restaurant.cuisine_type == cuisine_type)
    
    if owner_id:
        query = query.filter(Restaurant.owner_id == owner_id)
    
    return query.filter(Restaurant.is_active == True).offset(skip).limit(limit).all()

def get_restaurant(db: Session, restaurant_id: str):
    return db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

def update_restaurant(db: Session, restaurant_id: str, restaurant_update: RestaurantUpdate):
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if db_restaurant:
        update_data = restaurant_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_restaurant, field, value)
        db.commit()
        db.refresh(db_restaurant)
    return db_restaurant

def delete_restaurant(db: Session, restaurant_id: str):
    db_restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if db_restaurant:
        db.delete(db_restaurant)
        db.commit()
    return db_restaurant

# Menu Item CRUD operations
def create_menu_item(db: Session, menu_item: MenuItemCreate, restaurant_id: str):
    db_menu_item = MenuItem(
        restaurant_id=restaurant_id,
        **menu_item.dict()
    )
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item

def get_menu_items(db: Session, restaurant_id: str, category: Optional[str] = None):
    query = db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id)
    
    if category:
        query = query.filter(MenuItem.category == category)
    
    return query.filter(MenuItem.is_available == True).order_by(MenuItem.sort_order, MenuItem.name).all()

def get_menu_item(db: Session, item_id: str):
    return db.query(MenuItem).filter(MenuItem.id == item_id).first()

def update_menu_item(db: Session, item_id: str, menu_item_update: MenuItemUpdate):
    db_menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if db_menu_item:
        update_data = menu_item_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_menu_item, field, value)
        db.commit()
        db.refresh(db_menu_item)
    return db_menu_item

def delete_menu_item(db: Session, item_id: str):
    db_menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if db_menu_item:
        db.delete(db_menu_item)
        db.commit()
    return db_menu_item

# Order CRUD operations
def create_order(db: Session, order: OrderCreate, customer_id: str):
    # Get restaurant info for calculations
    restaurant = get_restaurant(db, order.restaurant_id)
    if not restaurant:
        return None
    
    # Calculate order totals
    subtotal = 0
    order_items_data = []
    
    for item_data in order.items:
        menu_item = get_menu_item(db, item_data.menu_item_id)
        if menu_item:
            item_total = menu_item.price * item_data.quantity
            subtotal += item_total
            order_items_data.append({
                "menu_item": menu_item,
                "quantity": item_data.quantity,
                "unit_price": menu_item.price,
                "total_price": item_total,
                "special_instructions": item_data.special_instructions
            })
    
    # Calculate other charges
    delivery_fee = restaurant.delivery_fee
    tax_amount = subtotal * 0.08  # 8% tax
    total_amount = subtotal + delivery_fee + tax_amount
    
    # Create order
    db_order = Order(
        customer_id=customer_id,
        restaurant_id=order.restaurant_id,
        delivery_address=order.delivery_address,
        delivery_instructions=order.delivery_instructions,
        special_instructions=order.special_instructions,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        estimated_delivery_time=datetime.utcnow().replace(minute=datetime.utcnow().minute + restaurant.estimated_delivery_time)
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            menu_item_id=item_data["menu_item"].id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"],
            special_instructions=item_data["special_instructions"]
        )
        db.add(db_order_item)
    
    db.commit()
    
    # Update restaurant total orders
    restaurant.total_orders += 1
    db.commit()
    
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None, 
               customer_id: Optional[str] = None, seller_id: Optional[str] = None):
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    
    if seller_id:
        # Get orders for restaurants owned by this seller
        restaurant_ids = db.query(Restaurant.id).filter(Restaurant.owner_id == seller_id).subquery()
        query = query.filter(Order.restaurant_id.in_(restaurant_ids))
    
    return query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def get_order(db: Session, order_id: str):
    return db.query(Order).filter(Order.id == order_id).first()

def update_order(db: Session, order_id: str, order_update: OrderUpdate):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        update_data = order_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_order, field, value)
        db.commit()
        db.refresh(db_order)
    return db_order