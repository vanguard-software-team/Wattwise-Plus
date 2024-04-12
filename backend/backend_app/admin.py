from django.contrib import admin
from .models import *


admin.site.register(CustomUser)
admin.site.register(Consumer)
admin.site.register(Provider)
admin.site.register(Cluster)
admin.site.register(SecretProviderKey)
admin.site.register(ConsumerConsumption)
admin.site.register(ConsumerHourlyConsumptionAggregate)
admin.site.register(ConsumerDailyConsumptionAggregate)
admin.site.register(ConsumerMonthlyConsumptionAggregate)
admin.site.register(ClusterHourlyConsumptionAggregate)
admin.site.register(ClusterDailyConsumptionAggregate)
admin.site.register(ClusterMonthlyConsumptionAggregate)
admin.site.register(ClusterConsumption)
admin.site.register(ForecastingConsumerConsumption)
admin.site.register(KwhPrice)
admin.site.register(ForecastingMetrics)
