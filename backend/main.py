from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from security import hash_password
from models import Category, Article, User
from schemas import CategoryCreate, CategoryResponse, ArticleCreate, ArticleResponse, UserCreate, UserResponse

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "PulseDesk-KB API is running"}

@app.post("/categories", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    new_category = Category(
        name=category.name,
        slug=category.slug,
        parent_id=category.parent_id,
        description=category.description
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.get("/articles", response_model=list[ArticleResponse])
def get_articles(db: Session = Depends(get_db)):
    return db.query(Article).all()

@app.post("/articles", response_model=ArticleResponse)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    new_article = Article(
        title=article.title,
        slug=article.slug,
        content=article.content,
        category_id=article.category_id,
        author_id=article.author_id,
        status=article.status
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article

@app.get("/categories", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        department=user.department
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user