from django.contrib import admin
from .models import *


admin.site.register(CustomUser) 
admin.site.register(Consumer)
admin.site.register(Provider)
admin.site.register(SecretProviderKey)