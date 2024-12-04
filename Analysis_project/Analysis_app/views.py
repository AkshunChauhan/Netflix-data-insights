from django.shortcuts import render
from .models import NetflixContent
from .data_analysis import create_visualizations, load_data, clean_data

def home(request):
    create_visualizations(clean_data(load_data()))
    return render(request, 'home.html')

def filter_content(request):
    year = request.GET.get('year')
    genre = request.GET.get('genre')
    queryset = NetflixContent.objects.all()
    if year:
        queryset = queryset.filter(release_year=year)
    if genre:
        queryset = queryset.filter(listed_in__icontains=genre)
    return render(request, 'home.html', {'content': queryset})
