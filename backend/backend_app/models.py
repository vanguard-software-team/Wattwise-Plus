from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    USER_TYPE_CHOICES = (
        ('consumer', 'Consumer'),
        ('provider', 'Provider'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, blank=True, null=True)
    
    objects = UserManager()
    

    def __str__(self):
        return self.email
    

class Cluster(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name

class Consumer(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='consumer_profile')
    power_supply_number = models.CharField(
        max_length=11,
        validators=[
            RegexValidator(
                regex='^\d{11}$',
                message='Power supply number must be 11 digits',
                code='invalid_power_supply_number'
            )
        ]
    )
    cluster = models.ForeignKey(
    Cluster, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True, 
    related_name='consumers'
)


    contact_phone = models.CharField(max_length=15, blank=True, null=True)
    building_type = models.CharField(max_length=50, blank=True, null=True)
    square_meters = models.CharField(max_length=50, blank=True, null=True)
    floor = models.CharField(max_length=50, blank=True, null=True)
    building_built = models.CharField(max_length=50, blank=True, null=True)
    frames = models.CharField(max_length=255, blank=True, null=True)
    heating_type = models.CharField(max_length=255, blank=True, null=True)
    have_solar_panels = models.BooleanField(blank=True, null=True)
    hot_water = models.CharField(max_length=255, blank=True, null=True)
    ev_car_charger = models.BooleanField(blank=True, null=True)


    USER_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('company', 'Company'),
    ]
    consumer_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    

    # individual-specific fields
    full_name = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    number_of_occupants = models.IntegerField(blank=True, null=True)
    type_of_occupants = models.CharField(max_length=255, blank=True, null=True)
    age_electricity_manager = models.CharField(max_length=50, blank=True, null=True)


    # company-specific fields
    company_name = models.CharField(max_length=255, blank=True, null=True)
    tax_identification_number = models.CharField(max_length=20, blank=True, null=True)
    number_of_employees = models.IntegerField(blank=True, null=True)

    def check_fields_filled(self):
        common_fields = [
            'contact_phone', 'building_type', 
            'square_meters', 'floor', 'building_built', 'frames', 
            'heating_type', 'have_solar_panels', 'hot_water', 'ev_car_charger'
        ]

        individual_specific_fields = [
            'full_name', 'birthdate', 'number_of_occupants', 'type_of_occupants', 
            'age_electricity_manager'
        ]
        company_specific_fields = [
            'company_name', 'tax_identification_number', 'number_of_employees'
        ]

        for field in common_fields:
            if getattr(self, field, None) in [None, '', False]:  # including False for BooleanFields
                return False

        if self.consumer_type == 'individual':
            for field in individual_specific_fields:
                if getattr(self, field, None) in [None, '']:
                    return False

        elif self.consumer_type == 'company':
            for field in company_specific_fields:
                if getattr(self, field, None) in [None, '']:
                    return False

        return True



class Provider(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='provider_profile')


# run the above commands in the psql shell to create the hypertable for TimescaleDB
# SELECT create_hypertable('appname_consumerconsumption', 'datetime');
class ConsumerConsumption(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE, related_name='consumptions')
    datetime = models.DateTimeField()
    consumption_kwh = models.DecimalField(max_digits=10, decimal_places=3)

    class Meta:
        ordering = ['-datetime']
        get_latest_by = 'datetime'
        indexes = [
            models.Index(fields=['datetime']),
            models.Index(fields=['consumer', 'datetime']),
        ]

    def __str__(self):
        return f"{self.consumer} - {self.datetime.strftime('%Y-%m-%d %H:%M:%S')} - {self.consumption_kwh} kWh"
    

class ConsumerHourlyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    hour = models.IntegerField()  # 0 to 23
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('consumer', 'hour')

class ConsumerDailyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    day_of_week = models.IntegerField()  # 1 (Monday) to 7 (Sunday)
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('consumer', 'day_of_week')

class ConsumerMonthlyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    month = models.IntegerField()  # 1 to 12
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('consumer', 'month')

# cluster consumption model here


