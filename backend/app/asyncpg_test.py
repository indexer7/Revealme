import asyncio
import asyncpg
import os

async def main():
    dsn = os.getenv("DATABASE_URL", "")
    print(f"Trying to connect to: {dsn}")
    try:
        conn = await asyncpg.connect(dsn=dsn)
        print("✅ Connected to Postgres!")
        await conn.close()
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main()) 