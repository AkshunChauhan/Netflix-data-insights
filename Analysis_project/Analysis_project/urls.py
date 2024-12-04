from django.contrib import admin
from django.urls import path, include  # Add include for app URLs

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("Analysis_app.urls")),  # Include the URLs of your app
]
