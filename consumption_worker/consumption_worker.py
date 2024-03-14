import redis
import time

# Connect to Redis server
redis_host = "redis"
redis_port = 6379
redis_client = redis.Redis(host=redis_host, port=redis_port)

# Wait for tasks indefinitely
while True:

    task = redis_client.blpop("consumption_worker")[1]
    print(f"Received task: {task.decode('utf-8')}")

    print(f"Processing task: {task.decode('utf-8')}")

    time.sleep(1)
