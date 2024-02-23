from django.core.management.base import BaseCommand
from backend_app.models import CustomUser
import environ

class Command(BaseCommand):
    help = 'Creates workers automatically'

    def handle(self, *args, **options):
        env = environ.Env()
        environ.Env.read_env()  # .env is in the same directory as manage.py


        email = env('WATTWISE_WORKER_EMAIL', default='worker@mail.com')
        password = env('WATTWISE_WORKER_PASSWORD', default='02B4z<2£0&g%')

        self.stdout.write("Attempting to create worker")
        
        
        if not CustomUser.objects.filter(email=email).exists():
            CustomUser.objects.create_user(email=email,password=password,user_type='worker')
            self.stdout.write(self.style.SUCCESS('Successfully created woker.'))
        else:
            self.stdout.write(self.style.WARNING('Worker already exists.'))