from django.http import JsonResponse
from .models import NetflixContent
from .data_analysis import create_visualizations, load_data, clean_data
from django.db.models import Count
from django.db.models.functions import Coalesce
import matplotlib.pyplot as plt
import io
import base64

def home(request):
    """
    Handles the home view by generating visualizations and sending paths 
    to the created graph images for the frontend to display.
    """
    create_visualizations(clean_data(load_data()))

    # Paths to visualization images
    response_data = {
        'genres_graph': '/static/genres.png',
        'ratings_graph': '/static/ratings.png',
        'trend_graph': '/static/trend.png',
    }

    return JsonResponse(response_data)

def filter_content(request):
    """
    Filters Netflix content based on year and genre parameters provided in the request.
    Returns a JSON response containing the filtered content.
    """
    year = request.GET.get('year')
    genre = request.GET.get('genre')

    queryset = NetflixContent.objects.all()

    # Apply filters
    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)

    # Serialize the filtered data
    content_data = list(queryset.values('title', 'type', 'release_year', 'rating', 'listed_in'))

    return JsonResponse({'content': content_data})

def get_available_years(request):
    """
    Fetches and returns a list of unique release years from the database,
    ordered chronologically, for use in filtering options.
    """
    years = NetflixContent.objects.values_list('release_year', flat=True).distinct().order_by('release_year')
    return JsonResponse({"years": list(years)})

def all_data(request):
    """
    Aggregates data for bar chart visualization. Filters can be applied by year and genre.
    Returns the total number of shows per release year.
    """
    year = request.GET.get('year')
    genre = request.GET.get('genre')

    queryset = NetflixContent.objects.all()

    # Apply filters
    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)

    # Aggregate data for the bar chart
    shows_per_year = queryset.values('release_year').annotate(total_shows=Count('id')).order_by('release_year')

    # Format data for visualization
    bar_chart_labels = [str(show['release_year']) for show in shows_per_year]
    bar_chart_data = [show['total_shows'] for show in shows_per_year]

    data = {
        'barChartLabels': bar_chart_labels,
        'barChartData': bar_chart_data,
        'barChartDataAll': bar_chart_data,
    }
    return JsonResponse(data)

def country_data(request):
    """
    Retrieves and returns content distribution by country for pie chart visualization.
    Filters data by the release year if specified.
    """
    year = request.GET.get('year')

    queryset = NetflixContent.objects.all()

    # Apply year filter
    if year:
        queryset = queryset.filter(release_year=year)

    # Count content by country
    country_counts = queryset.values('country').annotate(count=Count('id')).order_by('-count')

    # Prepare data for pie chart
    labels = [item['country'] if item['country'] else 'Not Available' for item in country_counts]
    data = [item['count'] for item in country_counts]

    return JsonResponse({'labels': labels, 'data': data})

def type_data(request):
    """
    Retrieves and returns content distribution by type (e.g., Movie, TV Show) 
    for pie chart visualization. Filters data by release year if specified.
    """
    year = request.GET.get('year')

    queryset = NetflixContent.objects.all()

    # Apply year filter
    if year:
        queryset = queryset.filter(release_year=year)

    # Count content by type
    type_counts = queryset.values('type').annotate(count=Count('id')).order_by('-count')

    # Prepare data for pie chart
    labels = [entry['type'] for entry in type_counts]
    data = [entry['count'] for entry in type_counts]

    return JsonResponse({'labels': labels, 'data': data})

def generate_matplotlib_chart(year=None, genre=None):
    """
    Generates a Matplotlib bar chart for the number of shows per year, filtered by year and genre.
    Returns the chart as a Base64-encoded string.
    """
    # Filter data based on year and genre
    queryset = NetflixContent.objects.all()
    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)

    # Aggregate data for the chart
    data = queryset.values('release_year').annotate(total_shows=Count('id')).order_by('release_year')

    # Prepare data for plotting
    years = [item['release_year'] for item in data]
    counts = [item['total_shows'] for item in data]

    # Create the Matplotlib bar chart
    plt.figure(figsize=(10, 5))
    plt.bar(years, counts, color='skyblue')
    plt.title('Number of Shows per Year')
    plt.xlabel('Year')
    plt.ylabel('Number of Shows')
    plt.tight_layout()

    # Convert the plot to a Base64-encoded string
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    chart_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    plt.close()

    return chart_base64

def matplotlib_chart(request):
    """
    Generates a Matplotlib chart based on filters (year, genre) and returns it as a Base64-encoded image.
    """
    year = request.GET.get('year')
    genre = request.GET.get('genre')

    # Generate the chart
    chart_base64 = generate_matplotlib_chart(year, genre)

    # Return the chart as a JSON response
    return JsonResponse({'chart': chart_base64})