import os
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, ForeignKey, DateTime, LargeBinary, JSON, Float
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.sql import func
from sqlalchemy.event import listen

Base = declarative_base()
DB_PATH = os.getenv("DATABASE_URL", "sqlite:///./agentic_canvas.db")
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

# --- Models ---

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    chat = relationship("Chat", back_populates="messages")

class Artifact(Base):
    __tablename__ = "artifacts"
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    data = Column(LargeBinary, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class FileUpload(Base):
    __tablename__ = "file_uploads"
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    data = Column(LargeBinary, nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now())

class Vector(Base):
    __tablename__ = "vectors"
    id = Column(Integer, primary_key=True)
    object_id = Column(String, nullable=False)  # e.g., message or artifact id
    object_type = Column(String, nullable=False)  # e.g., 'message', 'artifact'
    embedding = Column(Text, nullable=False)  # Store as JSON/text
    vector_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

# --- sqlite-vec extension loader ---

def load_sqlite_vec(dbapi_conn, connection_record):
    try:
        dbapi_conn.enable_load_extension(True)
        dbapi_conn.execute("SELECT load_extension('sqlite_vec')")
    except Exception as e:
        print("Could not load sqlite_vec extension:", e)

if DB_PATH.startswith("sqlite"):
    listen(engine, "connect", load_sqlite_vec)

def init_db():
    Base.metadata.create_all(bind=engine)