from django.http import JsonResponse
from .models import NetflixContent
from .data_analysis import create_visualizations, load_data, clean_data

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