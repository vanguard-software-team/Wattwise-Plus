import redis
import schedule
import time
from datetime import datetime

# Redis connection setup
redis_host = "redis"  # Change this to your Redis host
redis_port = 6379  # Default Redis port
redis_client = redis.Redis(host=redis_host, port=redis_port)

# Updated Define tasks with a minute task added
tasks = [
    {"id": "hourly_consumption", "worker": "consumption_worker", "schedule": "hourly"},
    {"id": "daily_aggregation", "worker": "aggregation_worker", "schedule": "daily"},
    {"id": "hourly_forecasting", "worker": "forecasting_worker", "schedule": "hourly"},
    {"id": "daily_clustering", "worker": "clustering_worker", "schedule": "daily"},
    {"id": "second_example", "worker": "consumption_worker", "schedule": "second"},
]

def schedule_tasks():
    for task in tasks:
        if task["schedule"] == "hourly":
            schedule.every().hour.at(":00").do(assign_task, task=task)
        elif task["schedule"] == "daily":
            schedule.every().day.at("00:00").do(assign_task, task=task)
        elif task["schedule"] == "second":  # Handle minute tasks
            schedule.every().second.do(assign_task, task=task)

def assign_task(task):
    task_key = f"{task['id']}"
    if not redis_client.exists(task_key):
        redis_client.lpush(task["worker"], task_key)
        print(f"Task assigned: {task_key}")
    else:
        print(f"Task already exists: {task_key}")

if __name__ == "__main__":
    schedule_tasks()
    
    while True:
        print("Checking for tasks...")
        schedule.run_pending()
        time.sleep(1)
