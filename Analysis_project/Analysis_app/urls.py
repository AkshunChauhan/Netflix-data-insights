from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('filter/', views.filter_content, name='filter'),
    path('years/', views.get_available_years, name='get_available_years'),
    path('all_data/', views.all_data, name='all_data'),
]
