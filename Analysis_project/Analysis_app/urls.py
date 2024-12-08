from django.urls import path
from . import views

urlpatterns = [
    # Home page route
    path('', views.home, name='home'),  # Renders the main home page of the application

    # Content filtering route
    path('filter/', views.filter_content, name='filter'),  # API for filtering content based on year and genre

    # Route to get available years for filtering
    path('years/', views.get_available_years, name='get_available_years'),  # API to fetch distinct years from the database

    # Route to get all data for bar chart visualization
    path('all_data/', views.all_data, name='all_data'),  # API to fetch data aggregated by year for bar chart

    # Route to get country-specific content data for pie chart
    path('country_data/', views.country_data, name='country_data'),  # API to fetch content count grouped by country

    # Route to get content type data for pie chart
    path('type_data/', views.type_data, name='type_data'),  # API to fetch content count grouped by type (e.g., Movie, TV Show)

    path('matplotlib_chart/', views.matplotlib_chart, name='matplotlib_chart'),
]

