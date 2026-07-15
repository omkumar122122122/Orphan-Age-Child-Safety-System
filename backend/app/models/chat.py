"""
Pydantic request / response models for the /api/chat endpoint.
"""
from pydantic import BaseModel, Field
from typing import Optional


class ConversationTurn(BaseModel):
    """A single turn in the conversation history."""
    role: str = Field(..., description="Either 'user' or 'model'")
    content: str = Field(..., description="The message text")


class ChatRequest(BaseModel):
    """Incoming chat request from the React frontend."""
    message: str = Field(..., min_length=1, max_length=4000, description="User's message")
    conversation: list[ConversationTurn] = Field(
        default_factory=list,
        description="Prior conversation turns (user + model) for context"
    )
    parentId: Optional[str] = Field(None, description="Parent identifier for personalised context")
    childId: Optional[str] = Field(None, description="Child identifier for personalised context")


class ChatResponse(BaseModel):
    """Outgoing response sent to the React frontend."""
    reply: str = Field(..., description="AI-generated reply (may contain Markdown)")
