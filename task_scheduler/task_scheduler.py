import redis
import schedule
import time
import pytz
import os

REDIS_HOST = os.environ.get('REDIS_HOST', 'redis')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))
REDIS_CLIENT = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
CONSUMPTION_WORKER_NAME = os.environ.get('CONSUMPTION_WORKER_NAME', 'consumption_worker')
AGGREGATION_WORKER_NAME = os.environ.get('AGGREGATION_WORKER_NAME', 'aggregation_worker')
FORECASTING_WORKER_NAME = os.environ.get('FORECASTING_WORKER_NAME', 'forecasting_worker')
CLUSTERING_WORKER_NAME = os.environ.get('CLUSTERING_WORKER_NAME', 'clustering_worker')

tasks = [
    {"id": "hourly_consumption", "worker": CONSUMPTION_WORKER_NAME, "schedule": "second"},
]

def task_exists(worker_list_key, task_key):
    tasks = REDIS_CLIENT.lrange(worker_list_key, 0, -1)
    tasks = [task.decode('utf-8') for task in tasks]
    return task_key in tasks

def assign_task(task):
    task_key = f"{task['id']}"
    worker_list_key = f"list_{task['worker']}"
    
    if not task_exists(worker_list_key, task_key):
        REDIS_CLIENT.lpush(worker_list_key, task_key)
        print(f"Task assigned: {task_key}")
    else:
        print(f"Task already exists: {task_key}")

def schedule_tasks():
    for task in tasks:
        if task["schedule"] == "daily":
            schedule.every().day.do(assign_task, task=task)
        elif task["schedule"] == "hourly":
            schedule.every().hour.do(assign_task, task=task)
        elif task["schedule"] == "minute":
            schedule.every().minute.do(assign_task, task=task)
        elif task["schedule"] == "second":
            schedule.every().second.do(assign_task, task=task)


if __name__ == "__main__":
    schedule_tasks()
    while True:
        schedule.run_pending()
        time.sleep(10)
