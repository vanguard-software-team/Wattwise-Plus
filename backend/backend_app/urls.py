from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    ConsumerConsumptionHourlyInRangeView,
    ConsumerConsumptionDailyInRangeView,
    ConsumerConsumptionWeeklyInRangeView,
    ConsumerConsumptionMonthlyInRangeView,
    ConsumerConsumptionHourlyAggregateView,
    ConsumerConsumptionDailyAggregateView,
    ConsumerConsumptionMonthlyAggregateView,
    ForecastingConsumerConsumptionHourlyInRangeView,
    ForecastingConsumerConsumptionDailyInRangeView,
    ForecastingConsumerConsumptionWeeklyInRangeView,
    ConsumerInfoView,
    ConsumerInfoUpdateView,
    PasswordChangeView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # user
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # consumer
    path(
        "consumer/<str:email>/consumption/hourly/<str:start_date>/<str:end_date>/",
        ConsumerConsumptionHourlyInRangeView.as_view(),
        name="consumer_consumption_hourly",
    ),
    path(
        "consumer/<str:email>/consumption/daily/<str:start_date>/<str:end_date>/",
        ConsumerConsumptionDailyInRangeView.as_view(),
        name="consumer_consumption_daily",
    ),
    path(
        "consumer/<str:email>/consumption/weekly/<str:start_date>/<str:end_date>/",
        ConsumerConsumptionWeeklyInRangeView.as_view(),
        name="consumer_consumption_weekly",
    ),
    path(
        "consumer/<str:email>/consumption/monthly/<str:start_date>/<str:end_date>/",
        ConsumerConsumptionMonthlyInRangeView.as_view(),
        name="consumer_consumption_monthly",
    ),
    path(
        "consumer/<str:email>/aggregate/hours",
        ConsumerConsumptionHourlyAggregateView.as_view(),
        name="consumer_consumption_hourly_aggregate",
    ),
    path(
        "consumer/<str:email>/aggregate/days",
        ConsumerConsumptionDailyAggregateView.as_view(),
        name="consumer_consumption_daily_aggregate",
    ),
    path(
        "consumer/<str:email>/aggregate/months",
        ConsumerConsumptionMonthlyAggregateView.as_view(),
        name="consumer_consumption_monthly_aggregate",
    ),
    path(
        "consumer/<str:email>/forecasting/consumption/hourly/<str:start_date>/<str:end_date>/",
        ForecastingConsumerConsumptionHourlyInRangeView.as_view(),
        name="forecasting_consumer_consumption_hourly",
    ),
    path(
        "consumer/<str:email>/forecasting/consumption/daily/<str:start_date>/<str:end_date>/",
        ForecastingConsumerConsumptionDailyInRangeView.as_view(),
        name="forecasting_consumer_consumption_hourly",
    ),
    path(
        "consumer/<str:email>/forecasting/consumption/weekly/<str:start_date>/<str:end_date>/",
        ForecastingConsumerConsumptionWeeklyInRangeView.as_view(),
        name="forecasting_consumer_consumption_hourly",
    ),
    path(
        "consumer/<str:email>/",
        ConsumerInfoView.as_view(),
        name="consumer_info_get",
    ),
    path(
        "consumer/<str:email>/update/",
        ConsumerInfoUpdateView.as_view(),
        name="consumer_info_update",
    ),
    path(
        "consumer/<str:email>/update/password/",
        PasswordChangeView.as_view(),
        name='user_change_password',
    )

]
