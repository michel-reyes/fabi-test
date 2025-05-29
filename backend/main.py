from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import SessionLocal, engine, Base
from models import User, Restaurant, MenuItem, Order, OrderItem
from schemas import (
    UserCreate, UserResponse, Token, 
    RestaurantCreate, RestaurantResponse, RestaurantUpdate,
    MenuItemCreate, MenuItemResponse, MenuItemUpdate,
    OrderCreate, OrderResponse, OrderUpdate
)
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from crud import (
    create_user, get_user_by_email, 
    create_restaurant, get_restaurants, get_restaurant, update_restaurant, delete_restaurant,
    create_menu_item, get_menu_items, get_menu_item, update_menu_item, delete_menu_item,
    create_order, get_orders, get_order, update_order
)

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="UberEats Clone API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication endpoints
@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    return create_user(db=db, user=user)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# Restaurant endpoints
@app.post("/restaurants", response_model=RestaurantResponse)
async def create_restaurant_endpoint(
    restaurant: RestaurantCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new restaurant (sellers and admins only)"""
    if current_user.role not in ["seller", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only sellers and admins can create restaurants"
        )
    
    return create_restaurant(db=db, restaurant=restaurant, owner_id=current_user.id)

@app.get("/restaurants", response_model=List[RestaurantResponse])
async def get_restaurants_endpoint(
    skip: int = 0,
    limit: int = 100,
    cuisine_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all restaurants with optional filtering"""
    return get_restaurants(db, skip=skip, limit=limit, cuisine_type=cuisine_type)

@app.get("/restaurants/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant_endpoint(restaurant_id: str, db: Session = Depends(get_db)):
    """Get a specific restaurant"""
    restaurant = get_restaurant(db, restaurant_id=restaurant_id)
    if restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@app.put("/restaurants/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant_endpoint(
    restaurant_id: str,
    restaurant_update: RestaurantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a restaurant (owner or admin only)"""
    restaurant = get_restaurant(db, restaurant_id=restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Check if user owns the restaurant or is admin
    if current_user.role != "admin" and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own restaurants"
        )
    
    return update_restaurant(db=db, restaurant_id=restaurant_id, restaurant_update=restaurant_update)

@app.delete("/restaurants/{restaurant_id}")
async def delete_restaurant_endpoint(
    restaurant_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a restaurant (owner or admin only)"""
    restaurant = get_restaurant(db, restaurant_id=restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Check if user owns the restaurant or is admin
    if current_user.role != "admin" and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own restaurants"
        )
    
    delete_restaurant(db=db, restaurant_id=restaurant_id)
    return {"message": "Restaurant deleted successfully"}

@app.get("/my-restaurants", response_model=List[RestaurantResponse])
async def get_my_restaurants(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get restaurants owned by current user"""
    if current_user.role not in ["seller", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only sellers and admins can access this endpoint"
        )
    
    return get_restaurants(db, owner_id=current_user.id)

# Menu Item endpoints
@app.post("/restaurants/{restaurant_id}/menu-items", response_model=MenuItemResponse)
async def create_menu_item_endpoint(
    restaurant_id: str,
    menu_item: MenuItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a menu item for a restaurant"""
    restaurant = get_restaurant(db, restaurant_id=restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Check if user owns the restaurant or is admin
    if current_user.role != "admin" and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only add menu items to your own restaurants"
        )
    
    return create_menu_item(db=db, menu_item=menu_item, restaurant_id=restaurant_id)

@app.get("/restaurants/{restaurant_id}/menu-items", response_model=List[MenuItemResponse])
async def get_menu_items_endpoint(
    restaurant_id: str,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get menu items for a restaurant"""
    return get_menu_items(db, restaurant_id=restaurant_id, category=category)

@app.put("/menu-items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item_endpoint(
    item_id: str,
    menu_item_update: MenuItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a menu item"""
    menu_item = get_menu_item(db, item_id=item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Check if user owns the restaurant or is admin
    restaurant = get_restaurant(db, restaurant_id=menu_item.restaurant_id)
    if current_user.role != "admin" and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update menu items from your own restaurants"
        )
    
    return update_menu_item(db=db, item_id=item_id, menu_item_update=menu_item_update)

@app.delete("/menu-items/{item_id}")
async def delete_menu_item_endpoint(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a menu item"""
    menu_item = get_menu_item(db, item_id=item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Check if user owns the restaurant or is admin
    restaurant = get_restaurant(db, restaurant_id=menu_item.restaurant_id)
    if current_user.role != "admin" and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete menu items from your own restaurants"
        )
    
    delete_menu_item(db=db, item_id=item_id)
    return {"message": "Menu item deleted successfully"}

# Order endpoints
@app.post("/orders", response_model=OrderResponse)
async def create_order_endpoint(
    order: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    return create_order(db=db, order=order, customer_id=current_user.id)

@app.get("/orders", response_model=List[OrderResponse])
async def get_orders_endpoint(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get orders (customers see their own, sellers see their restaurant orders, admins see all)"""
    if current_user.role == "customer":
        return get_orders(db, customer_id=current_user.id, skip=skip, limit=limit, status=status)
    elif current_user.role == "seller":
        # Get orders for seller's restaurants
        return get_orders(db, seller_id=current_user.id, skip=skip, limit=limit, status=status)
    else:  # admin
        return get_orders(db, skip=skip, limit=limit, status=status)

@app.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_endpoint(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order"""
    order = get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check permissions
    if current_user.role == "customer" and order.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only view your own orders")
    elif current_user.role == "seller":
        restaurant = get_restaurant(db, restaurant_id=order.restaurant_id)
        if restaurant.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only view orders for your restaurants")
    
    return order

@app.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order_endpoint(
    order_id: str,
    order_update: OrderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order status (sellers and admins only)"""
    if current_user.role == "customer":
        raise HTTPException(status_code=403, detail="Customers cannot update order status")
    
    order = get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if seller owns the restaurant
    if current_user.role == "seller":
        restaurant = get_restaurant(db, restaurant_id=order.restaurant_id)
        if restaurant.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="You can only update orders for your restaurants")
    
    return update_order(db=db, order_id=order_id, order_update=order_update)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)