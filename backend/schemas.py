from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    name: str
    slug: str
    parent_id: Optional[int] = None
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    parent_id: Optional[int] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ArticleCreate(BaseModel):
    title: str
    slug: str
    content: str
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    status: Optional[str] = "draft"


class ArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    category_id: Optional[int] = None
    author_id: Optional[int] = None
    status: str
    views: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    department: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str