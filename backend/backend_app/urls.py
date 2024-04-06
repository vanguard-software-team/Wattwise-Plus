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
    PasswordChangeView,
    ClusterInfoView,
    ClusterConsumptionHourlyInRangeView,
    ClusterConsumptionDailyInRangeView,
    ClusterConsumptionWeeklyInRangeView,
    ClusterConsumptionMonthlyInRangeView,
    ClusterConsumptionHourlyAggregateView,
    ClusterConsumptionDailyAggregateView,
    ClusterConsumptionMonthlyAggregateView,
    KwhPriceCreateUpdateView,
    KwhPriceListView,
    ForecastingMetricsView,
    OutlierDetectionView,
)
from .views_demo import AddConsumerConsumptionView, AddConsumerForecastingView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    # user
    path('', include_docs_urls(title='Wattise API', public=True)),
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "user/update/password",
        PasswordChangeView.as_view(),
        name="user_change_password",
    ),
    # consumer
    path(
        "consumer/consumption/hourly",
        ConsumerConsumptionHourlyInRangeView.as_view(),
        name="consumer_consumption_hourly",
    ),
    path(
        "consumer/consumption/daily",
        ConsumerConsumptionDailyInRangeView.as_view(),
        name="consumer_consumption_daily",
    ),
    path(
        "consumer/consumption/weekly",
        ConsumerConsumptionWeeklyInRangeView.as_view(),
        name="consumer_consumption_weekly",
    ),
    path(
        "consumer/consumption/monthly",
        ConsumerConsumptionMonthlyInRangeView.as_view(),
        name="consumer_consumption_monthly",
    ),
    path(
        "consumer/aggregate/hours",
        ConsumerConsumptionHourlyAggregateView.as_view(),
        name="consumer_consumption_hourly_aggregate",
    ),
    path(
        "consumer/aggregate/days",
        ConsumerConsumptionDailyAggregateView.as_view(),
        name="consumer_consumption_daily_aggregate",
    ),
    path(
        "consumer/aggregate/months",
        ConsumerConsumptionMonthlyAggregateView.as_view(),
        name="consumer_consumption_monthly_aggregate",
    ),
    path(
        "consumer/forecasting/consumption/hourly",
        ForecastingConsumerConsumptionHourlyInRangeView.as_view(),
        name="forecasting_consumer_consumption_hourly",
    ),
    path(
        "consumer/forecasting/consumption/daily",
        ForecastingConsumerConsumptionDailyInRangeView.as_view(),
        name="forecasting_consumer_consumption_daily",
    ),
    path(
        "consumer/forecasting/consumption/weekly",
        ForecastingConsumerConsumptionWeeklyInRangeView.as_view(),
        name="forecasting_consumer_consumption_weekly",
    ),
    path(
        "consumer",
        ConsumerInfoView.as_view(),
        name="consumer_info_get",
    ),
    path(
        "consumer/update",
        ConsumerInfoUpdateView.as_view(),
        name="consumer_info_update",
    ),
    path(
        "cluster/info",
        ClusterInfoView.as_view(),
        name="cluster_info_get",
    ),
    path(
        "cluster/consumption/hourly",
        ClusterConsumptionHourlyInRangeView.as_view(),
        name="consumer_consumption_hourly",
    ),
    path(
        "cluster/consumption/daily",
        ClusterConsumptionDailyInRangeView.as_view(),
        name="consumer_consumption_daily",
    ),
    path(
        "cluster/consumption/weekly",
        ClusterConsumptionWeeklyInRangeView.as_view(),
        name="consumer_consumption_weekly",
    ),
    path(
        "cluster/consumption/monthly",
        ClusterConsumptionMonthlyInRangeView.as_view(),
        name="consumer_consumption_monthly",
    ),
    path(
        "cluster/aggregate/hours",
        ClusterConsumptionHourlyAggregateView.as_view(),
        name="cluster_consumption_hourly_aggregate",
    ),
    path(
        "cluster/aggregate/days",
        ClusterConsumptionDailyAggregateView.as_view(),
        name="cluster_consumption_daily_aggregate",
    ),
    path(
        "cluster/aggregate/months",
        ClusterConsumptionMonthlyAggregateView.as_view(),
        name="cluster_consumption_monthly_aggregate",
    ),
    path(
        "kwh-price/update",
        KwhPriceCreateUpdateView.as_view(),
        name="kwh_price_create_update",
    ),
    path("kwh-price/list", KwhPriceListView.as_view(), name="kwh_price_list"),
    path("forecasting/metrics", ForecastingMetricsView.as_view(), name="forecasting_metrics"),
    path ("outliers", OutlierDetectionView.as_view(), name="outliers"),
    path(
        "add/consumer/consumption",
        AddConsumerConsumptionView.as_view(),
        name="add_consumer_consumption",
    ),
    path(
        "add/consumer/forecasting",
        AddConsumerForecastingView.as_view(),
        name="add_consumer_forecasting",
    ),
]
