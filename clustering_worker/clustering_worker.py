import redis
import time

REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_CLIENT = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
WORKER_NAME = "clustering_worker"



worker_list_key = f"list_{WORKER_NAME}"

while True:
    _, task_key = REDIS_CLIENT.brpop(worker_list_key)
    task_key = task_key.decode('utf-8')
    
    print(f"Received task: {task_key}")
    print(f"Processing task: {task_key}")
    time.sleep(1)
    
    print(f"Task completed: {task_key}")
