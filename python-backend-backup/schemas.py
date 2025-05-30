from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str = "customer"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    profile_image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Restaurant schemas
class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    cuisine_type: str
    phone: Optional[str] = None
    email: Optional[str] = None
    street_address: str
    apartment: Optional[str] = None
    city: str
    state: str
    postal_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cover_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    delivery_fee: float = 2.99
    minimum_order: float = 0.0
    estimated_delivery_time: int = 30

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    cover_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None
    is_open: Optional[bool] = None
    delivery_fee: Optional[float] = None
    minimum_order: Optional[float] = None
    estimated_delivery_time: Optional[int] = None

class RestaurantResponse(RestaurantBase):
    id: str
    owner_id: str
    is_active: bool
    is_open: bool
    average_rating: float
    total_reviews: int
    total_orders: int
    created_at: datetime

    class Config:
        from_attributes = True

# Menu Item schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    spice_level: int = 0
    calories: Optional[int] = None
    prep_time: int = 15
    category: str = "mains"

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    spice_level: Optional[int] = None
    calories: Optional[int] = None
    prep_time: Optional[int] = None
    category: Optional[str] = None

class MenuItemResponse(MenuItemBase):
    id: str
    restaurant_id: str
    sort_order: int
    created_at: datetime

    class Config:
        from_attributes = True

# Order Item schemas
class OrderItemBase(BaseModel):
    menu_item_id: str
    quantity: int
    special_instructions: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    id: str
    unit_price: float
    total_price: float
    menu_item: MenuItemResponse

    class Config:
        from_attributes = True

# Order schemas
class OrderBase(BaseModel):
    restaurant_id: str
    delivery_address: str
    delivery_instructions: Optional[str] = None
    special_instructions: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    estimated_delivery_time: Optional[datetime] = None
    actual_delivery_time: Optional[datetime] = None

class OrderResponse(OrderBase):
    id: str
    customer_id: str
    status: str
    subtotal: float
    delivery_fee: float
    tax_amount: float
    tip_amount: float
    total_amount: float
    estimated_delivery_time: Optional[datetime] = None
    actual_delivery_time: Optional[datetime] = None
    payment_status: str
    created_at: datetime
    restaurant: RestaurantResponse
    customer: UserResponse
    order_items: List[OrderItemResponse]

    class Config:
        from_attributes = True