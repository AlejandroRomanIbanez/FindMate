from pydantic import BaseModel, Field
from typing import Dict
from ..helpers import to_dict


class Post(BaseModel):
    content: str = Field(..., min_length=1, max_length=100)
    author: str
    img_url: str

    def to_dict(self) -> Dict:
        return to_dict(self)

