from django.urls import path
from .views import index, RegisterView , YourProtectedView , CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
TokenObtainPairView,
TokenRefreshView,
)

urlpatterns = [
    path("", index, name="index"),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name="sign_up"),
    path('api/customview/', YourProtectedView.as_view(), name="your_protected_view"),
]

