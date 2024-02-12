from django.urls import path
from .views import UserRegistrationView, UserLoginView, ConsumerConsumptionHourlyInRangeView, ConsumerConsumptionDailyInRangeView, ConsumerConsumptionWeeklyInRangeView, ConsumerConsumptionMonthlyInRangeView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    #consumer
    path('consumer/<str:email>/consumption/hourly/<str:start_date>/<str:end_date>/', ConsumerConsumptionHourlyInRangeView.as_view(), name='consumer_consumption_hourly'),
    path('consumer/<str:email>/consumption/daily/<str:start_date>/<str:end_date>/', ConsumerConsumptionDailyInRangeView.as_view(), name='consumer_consumption_daily'),
    path('consumer/<str:email>/consumption/weekly/<str:start_date>/<str:end_date>/', ConsumerConsumptionWeeklyInRangeView.as_view(), name='consumer_consumption_weekly'),
    path('consumer/<str:email>/consumption/monthly/<str:start_date>/<str:end_date>/', ConsumerConsumptionMonthlyInRangeView.as_view(), name='consumer_consumption_monthly'),
]
