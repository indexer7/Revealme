#!/usr/bin/env python3
"""
User creation script for Reveal.me backend

Usage:
    python app/create_user.py <email> <password> [--role <role>]

Examples:
    python app/create_user.py alice@example.com "P@ssw0rd!" --role viewer
    python app/create_user.py admin@example.com "AdminP@ssw0rd!" --role admin
"""

# DEPRECATED: Use create_user_sync.py for user creation due to asyncpg/WSL2/Docker issues.

import asyncio
import argparse
import sys
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select

# Import app modules
from app.core.config import settings
from app.models.user import User
from app.models.enums import UserRole
from app.utils.security import hash_password


async def create_user(email: str, password: str, role: str = "viewer") -> None:
    """
    Create a new user in the database
    
    Args:
        email: User's email address
        password: Plain text password (will be hashed)
        role: User role (admin or viewer)
    """
    # Validate role
    try:
        user_role = UserRole(role)
    except ValueError:
        print(f"Error: Invalid role '{role}'. Must be one of: {[r.value for r in UserRole]}")
        sys.exit(1)
    
    # Create async engine and session using SQLAlchemy async
    print(f"Using DATABASE_URL: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL)
    
    async with AsyncSession(engine) as session:
        try:
            # Check if user already exists
            result = await session.execute(
                select(User).where(User.email == email)
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"Error: User with email '{email}' already exists")
                sys.exit(1)
            
            # Hash password
            hashed_password = hash_password(password)
            
            # Create new user
            new_user = User(
                id=uuid4(),
                email=email,
                hashed_password=hashed_password,
                role=user_role,
                is_active=True
            )
            
            # Add to database
            session.add(new_user)
            await session.commit()
            
            print(f"✅ Successfully created user:")
            print(f"   Email: {email}")
            print(f"   Role: {role}")
            print(f"   Active: True")
            
        except Exception as e:
            await session.rollback()
            print(f"Error creating user: {e}")
            sys.exit(1)
        finally:
            await engine.dispose()


def main():
    """Main function to parse arguments and create user"""
    parser = argparse.ArgumentParser(
        description="Create a new user in the Reveal.me database",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python app/create_user.py alice@example.com "P@ssw0rd!" --role viewer
  python app/create_user.py admin@example.com "AdminP@ssw0rd!" --role admin
        """
    )
    
    parser.add_argument("email", help="User's email address")
    parser.add_argument("password", help="User's password")
    parser.add_argument(
        "--role", 
        choices=["admin", "viewer"], 
        default="viewer",
        help="User role (default: viewer)"
    )
    
    args = parser.parse_args()
    
    # Validate email format (basic check)
    if "@" not in args.email or "." not in args.email:
        print("Error: Invalid email format")
        sys.exit(1)
    
    # Validate password length
    if len(args.password) < 8:
        print("Warning: Password is less than 8 characters")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Create user
    asyncio.run(create_user(args.email, args.password, args.role))


if __name__ == "__main__":
    main() 