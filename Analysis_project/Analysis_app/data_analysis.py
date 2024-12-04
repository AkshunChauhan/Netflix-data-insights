import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from .models import NetflixContent
import logging
import matplotlib
matplotlib.use("Agg")  # Use non-GUI backend
# Configure logging
logging.basicConfig(level=logging.INFO)

# Define the base directory for file operations
BASE_DIR = Path(__file__).resolve().parent

# Ensure the static directory exists for saving visualizations
(BASE_DIR / 'static').mkdir(exist_ok=True, parents=True)

def load_data():
    """
    Load the Netflix dataset from the 'netflix_titles.csv' file.
    """
    filepath = BASE_DIR / 'netflix_titles.csv'
    try:
        df = pd.read_csv(filepath)
        logging.info("Dataset loaded successfully.")
        return df
    except FileNotFoundError:
        logging.error(f"File not found at {filepath}. Ensure the file exists.")
        return None
    except pd.errors.EmptyDataError:
        logging.error("The file is empty.")
        return None


def clean_data(df):
    """
    Clean the dataset by removing rows with missing essential values.
    """
    initial_shape = df.shape
    df.dropna(subset=['type', 'title', 'release_year'], inplace=True)
    logging.info(f"Data cleaned. Rows reduced from {initial_shape[0]} to {df.shape[0]}.")
    return df


def populate_database(df):
    """
    Populate the database with cleaned Netflix dataset.
    """
    try:
        netflix_objects = [
            NetflixContent(
                title=row['title'],
                type=row['type'],
                release_year=row['release_year'],
                rating=row.get('rating'),
                duration=row.get('duration'),
                listed_in=row['listed_in']
            )
            for _, row in df.iterrows()
        ]
        NetflixContent.objects.bulk_create(netflix_objects)
        logging.info("Database populated successfully.")
    except Exception as e:
        logging.error(f"Error populating the database: {e}")


def analyze_genres(df):
    """
    Analyze the most common genres in the dataset.
    """
    genre_counts = df['listed_in'].str.split(',').explode().str.strip().value_counts()
    logging.info("Genres analyzed successfully.")
    return genre_counts


def analyze_ratings(df):
    """
    Analyze the distribution of content ratings.
    """
    ratings = df['rating'].value_counts()
    logging.info("Ratings analyzed successfully.")
    return ratings


def analyze_trend(df):
    """
    Analyze the trend of content additions over the years.
    """
    trend = df['release_year'].value_counts().sort_index()
    logging.info("Trends analyzed successfully.")
    return trend


def create_visualizations(df):
    """
    Create and save visualizations for genres, ratings, and trends.
    """
    try:
        genre_counts = analyze_genres(df)
        ratings = analyze_ratings(df)
        trend = analyze_trend(df)

        # Top Genres
        genre_counts.head(10).plot(kind='bar', title="Top Genres", color='skyblue')
        plt.ylabel("Count")
        plt.savefig(BASE_DIR / 'static/genres.png')
        plt.close()
        logging.info("Genres visualization saved as 'genres.png'.")

        # Content Ratings
        ratings.plot(kind='bar', title="Content Ratings", color='salmon')
        plt.ylabel("Count")
        plt.savefig(BASE_DIR / 'static/ratings.png')
        plt.close()
        logging.info("Ratings visualization saved as 'ratings.png'.")

        # Trend Over Years
        trend.plot(kind='line', title="Trend of Additions Over Years", color='green')
        plt.ylabel("Count")
        plt.xlabel("Year")
        plt.savefig(BASE_DIR / 'static/trend.png')
        plt.close()
        logging.info("Trend visualization saved as 'trend.png'.")

    except Exception as e:
        logging.error(f"Error creating visualizations: {e}")
