from django.http import JsonResponse
from .models import NetflixContent
from .data_analysis import create_visualizations, load_data, clean_data
from django.db.models import Count, Value
from django.db.models.functions import Coalesce

def home(request):
    # Create visualizations
    create_visualizations(clean_data(load_data()))

    # Optional: Send paths to graphs in the response for React to display
    response_data = {
        'genres_graph': '/static/genres.png',
        'ratings_graph': '/static/ratings.png',
        'trend_graph': '/static/trend.png',
    }

    return JsonResponse(response_data)

def filter_content(request):
    year = request.GET.get('year')
    genre = request.GET.get('genre')

    queryset = NetflixContent.objects.all()

    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)

    # Prepare filtered content data to send to React
    content_data = list(queryset.values('title', 'type', 'release_year', 'rating', 'listed_in'))

    return JsonResponse({'content': content_data})

def get_available_years(request):
    """
    Returns a list of unique years available in the dataset.
    """
    years = NetflixContent.objects.values_list('release_year', flat=True).distinct().order_by('release_year')
    return JsonResponse({"years": list(years)})

def all_data(request):
    # Get filter parameters from the request
    year = request.GET.get('year')
    genre = request.GET.get('genre')

    # Start with a base queryset that includes all content
    queryset = NetflixContent.objects.all()

    # Apply filters if specified
    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)

    # Query the database to get the total number of shows per year, after filtering
    shows_per_year = queryset.values('release_year').annotate(total_shows=Count('id')).order_by('release_year')

    # Extract the years and counts for the chart
    bar_chart_labels = [str(show['release_year']) for show in shows_per_year]
    bar_chart_data = [show['total_shows'] for show in shows_per_year]

    # If you need data for all years (even those with no shows), you can fill in the missing years
    # For now, we'll assume no missing years in the dataset.

    data = {
        'barChartLabels': bar_chart_labels,
        'barChartData': bar_chart_data,
        'barChartDataAll': bar_chart_data,  # You can modify this as per your needs
    }
    return JsonResponse(data)

def country_data(request):
    # Query the count of content per country, leaving 'null' values as they are
    country_counts = NetflixContent.objects.values('country') \
        .annotate(count=Count('id')) \
        .order_by('-count')

    # Prepare data for the Pie chart
    labels = [item['country'] if item['country'] is not None else 'Not Available' for item in country_counts]
    data = [item['count'] for item in country_counts]

    return JsonResponse({'labels': labels, 'data': data})


def type_data(request):
    """
    Returns a pie chart dataset for content distribution by type (e.g., Movie, TV Show).
    """
    # Query the count of content per type
    type_counts = NetflixContent.objects.values('type').annotate(count=Count('id')).order_by('-count')
    labels = [entry['type'] for entry in type_counts]
    data = [entry['count'] for entry in type_counts]

    return JsonResponse({'labels': labels, 'data': data})