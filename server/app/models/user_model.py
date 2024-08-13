from datetime import datetime, timezone

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from ..helpers import to_dict


class Friends(BaseModel):
    followers: List[str] = Field(default_factory=list)
    following: List[str] = Field(default_factory=list)

    def to_dict(self) -> Dict:
        return to_dict(self)


class User(BaseModel):
    avatar_url: Optional[str] = None
    username: str = Field(..., min_length=1, max_length=50)
    email: str
    password: str = Field(..., min_length=6)
    date_of_birth: datetime
    age: int
    bio: Optional[str] = Field(..., max_length=100)
    isPaid: bool
    subscription_start_date: Optional[datetime] = None
    subscription_end_date: Optional[datetime] = None
    hobbies: List[str] = Field(default_factory=list)
    friends: Friends = Field(default_factory=Friends)
    posts: List[str] = Field(default_factory=list)

    def to_dict(self) -> Dict:
        return to_dict(self)

    def is_subscription_active(self) -> bool:
        if self.isPaid and self.subscription_end_date:
            if datetime.now(timezone.utc) >= self.subscription_end_date:
                # If the subscription has expired, update isPaid to False
                self.isPaid = False
                self.subscription_end_date = None
            else:
                return True
        return False


class UserWithoutPassword(BaseModel):
    avatar_url: Optional[str] = None
    username: str = Field(..., min_length=1, max_length=50)
    email: str
    date_of_birth: datetime
    age: int
    bio: Optional[str] = Field(..., max_length=100)
    isPaid: bool = False
    subscription_start_date: Optional[datetime] = None
    subscription_end_date: Optional[datetime] = None
    hobbies: List[str] = Field(default_factory=list)
    friends: Friends = Field(default_factory=Friends)
    posts: List[str] = Field(default_factory=list)

    def to_dict(self) -> Dict:
        return to_dict(self)

    def is_subscription_active(self) -> bool:
        if self.isPaid and self.subscription_end_date:
            if self.subscription_end_date.tzinfo is None:
                self.subscription_end_date = self.subscription_end_date.replace(tzinfo=timezone.utc)

            if datetime.now(timezone.utc) >= self.subscription_end_date:
                self.isPaid = False
                self.subscription_end_date = None
                self.subscription_start_date = None
            else:
                return True
        return False


class UserRegistration(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: str
    password: str = Field(..., min_length=6)
    date_of_birth: datetime
    bio: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    email: str
    password: str = Field(..., min_length=6)


class EditUser(BaseModel):
    avatar_url: Optional[str] = None
    username: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)
    age: Optional[int] = None
    bio: Optional[str] = Field(None, max_length=100)
