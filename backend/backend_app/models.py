from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.core.validators import RegexValidator
from timescale.db.models.fields import TimescaleDateTimeField
from timescale.db.models.managers import TimescaleManager
import pytz

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("user_type", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    USER_TYPE_CHOICES = (
        ("consumer", "Consumer"),
        ("provider", "Provider"),
        ("worker", "Worker"),
    )
    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, blank=True, null=True
    )

    objects = UserManager()

    def __str__(self):
        return self.email


class Cluster(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Consumer(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="consumer_profile"
    )
    power_supply_number = models.CharField(
        max_length=11,
        validators=[
            RegexValidator(
                regex="^\d{11}$",
                message="Power supply number must be 11 digits",
                code="invalid_power_supply_number",
            )
        ],
    )
    cluster = models.ForeignKey(
        Cluster,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="consumers",
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
        ("individual", "Individual"),
        ("company", "Company"),
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
    
    def save(self, *args, **kwargs):
        # check if this is an existing instance
        if self.pk:
            # get the original values from the database
            orig = Consumer.objects.get(pk=self.pk)
            # if consumer_type has changed, reset relevant fields
            if orig.consumer_type != self.consumer_type:
                # reset fields based on the original consumer_type
                if orig.consumer_type == "individual":
                    self.reset_common_fields()
                    self.reset_individual_fields()
                elif orig.consumer_type == "company":
                    self.reset_common_fields()
                    self.reset_company_fields()
        super(Consumer, self).save(*args, **kwargs)


    def reset_common_fields(self):
        """
        resets common fields to their default values.
        """
        self.cluster = None
        self.contact_phone = None
        self.building_type = None
        self.square_meters = None
        self.floor = None
        self.building_built = None
        self.frames = None
        self.heating_type = None
        self.have_solar_panels = None
        self.hot_water = None
        self.ev_car_charger = None
        
    def reset_individual_fields(self):
        """
        resets individual-specific fields to their default values.
        """
        self.full_name = None
        self.birthdate = None
        self.number_of_occupants = None
        self.type_of_occupants = None
        self.age_electricity_manager = None

    def reset_company_fields(self):
        """
        resets company-specific fields to their default values.
        """
        self.company_name = None
        self.tax_identification_number = None
        self.number_of_employees = None

    def check_fields_filled(self):
        common_fields = [
            "contact_phone",
            "building_type",
            "square_meters",
            "floor",
            "building_built",
            "frames",
            "heating_type",
            "have_solar_panels",
            "hot_water",
            "ev_car_charger",
        ]

        individual_specific_fields = [
            "full_name",
            "birthdate",
            "number_of_occupants",
            "type_of_occupants",
            "age_electricity_manager",
        ]
        company_specific_fields = [
            "company_name",
            "tax_identification_number",
            "number_of_employees",
        ]

        for field in common_fields:
            if getattr(self, field, None) in [
                None,
                "",
                False,
            ]:  # including False for BooleanFields
                return False

        if self.consumer_type == "individual":
            for field in individual_specific_fields:
                if getattr(self, field, None) in [None, ""]:
                    return False

        elif self.consumer_type == "company":
            for field in company_specific_fields:
                if getattr(self, field, None) in [None, ""]:
                    return False

        return True

    def __str__(self):
        return self.user.email + " - " + self.power_supply_number


class Provider(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="provider_profile"
    )

    def __str__(self):
        return self.user.email


class ConsumerConsumption(models.Model):
    consumer = models.ForeignKey(
        Consumer, on_delete=models.CASCADE, related_name="consumptions"
    )
    datetime = TimescaleDateTimeField(interval="1 hour")
    consumption_kwh = models.DecimalField(max_digits=10, decimal_places=3)

    objects = models.Manager()
    timescale = TimescaleManager()

    def __str__(self):
        athens_tz = pytz.timezone("Europe/Athens")
        localized_datetime = self.datetime.astimezone(athens_tz)
        formatted_datetime = localized_datetime.strftime("%Y-%m-%d %H:%M:%S")
        return f"{self.consumer} - {formatted_datetime} - {self.consumption_kwh} kWh"


class SecretProviderKey(models.Model):
    secret_provider_key = models.CharField(max_length=255, unique=True)


class ForecastingConsumerConsumption(models.Model):
    consumer = models.ForeignKey(
        Consumer, on_delete=models.CASCADE, related_name="forecasting_consumptions"
    )
    datetime = TimescaleDateTimeField(interval="1 hour")
    forecasting_consumption_kwh = models.DecimalField(max_digits=10, decimal_places=3)

    objects = models.Manager()
    timescale = TimescaleManager()

    def __str__(self):
        athens_tz = pytz.timezone("Europe/Athens")
        localized_datetime = self.datetime.astimezone(athens_tz)
        formatted_datetime = localized_datetime.strftime("%Y-%m-%d %H:%M:%S")
        return f"{self.consumer} - {formatted_datetime} - {self.forecasting_consumption_kwh} kWh"


class ConsumerHourlyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    hour = models.IntegerField(choices=[(i, i) for i in range(0, 24)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("consumer", "hour")
    
    def __str__(self):
        return f"{self.consumer} - {self.hour} - {self.consumption_kwh_sum} kWh"


class ConsumerDailyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    day = models.IntegerField(choices=[(i, i) for i in range(1, 8)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("consumer", "day")
    
    def __str__(self):
        return f"{self.consumer} - {self.day} - {self.consumption_kwh_sum} kWh"


class ConsumerMonthlyConsumptionAggregate(models.Model):
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    month = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("consumer", "month")
    
    def __str__(self):
        return f"{self.consumer} - {self.month} - {self.consumption_kwh_sum} kWh"


class ClusterConsumption(models.Model):
    cluster = models.ForeignKey(
        Cluster, on_delete=models.CASCADE, related_name="cluster_consumptions"
    )
    datetime = TimescaleDateTimeField(interval="1 hour")
    consumption_kwh = models.DecimalField(max_digits=10, decimal_places=3)

    objects = models.Manager()
    timescale = TimescaleManager()

    def __str__(self):
        athens_tz = pytz.timezone("Europe/Athens")
        localized_datetime = self.datetime.astimezone(athens_tz)
        formatted_datetime = localized_datetime.strftime("%Y-%m-%d %H:%M:%S")
        return f"{self.cluster} - {formatted_datetime} - {self.consumption_kwh} kWh"


class ClusterHourlyConsumptionAggregate(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    hour = models.IntegerField(choices=[(i, i) for i in range(0, 24)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("cluster", "hour")
    
    def __str__(self):
        return f"{self.cluster} - {self.hour} - {self.consumption_kwh_sum} kWh"


class ClusterDailyConsumptionAggregate(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    day = models.IntegerField(choices=[(i, i) for i in range(1, 8)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("cluster", "day")
    
    def __str__(self):
        return f"{self.cluster} - {self.day} - {self.consumption_kwh_sum} kWh"


class ClusterMonthlyConsumptionAggregate(models.Model):
    cluster = models.ForeignKey(Cluster, on_delete=models.CASCADE)
    month = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    consumption_kwh_sum = models.DecimalField(max_digits=10, decimal_places=3)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("cluster", "month")
    
    def __str__(self):
        return f"{self.cluster} - {self.month} - {self.consumption_kwh_sum} kWh"


class KwhPrice(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField(choices=[(i, i) for i in range(1, 13)])
    year = models.IntegerField()

    def __str__(self):
        return f"{self.month}/{self.year} - {self.price} per kWh"

    class Meta:
        unique_together = ("month", "year")

class ForecastingMetrics(models.Model):
    mape = models.DecimalField(max_digits=10, decimal_places=3)
    rmse = models.DecimalField(max_digits=10, decimal_places=3)
    mse = models.DecimalField(max_digits=10, decimal_places=3)
    
    def __str__(self):
        return f"MAPE: {self.mape} - RMSE: {self.rmse} - MSE: {self.mse}"
