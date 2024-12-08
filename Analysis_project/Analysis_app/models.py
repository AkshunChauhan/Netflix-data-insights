from django.db import models

class NetflixContent(models.Model):
    """
    Model representing Netflix content data, including metadata such as title, type, 
    release year, rating, duration, genre, and country of origin.
    """

    title = models.CharField(max_length=255)

    type = models.CharField(max_length=50)

    release_year = models.IntegerField()

    rating = models.CharField(max_length=50, null=True)

    duration = models.CharField(max_length=50, null=True)

    listed_in = models.TextField()

    country = models.CharField(max_length=255, null=True)

    def __str__(self):
        """
        String representation of the model, which displays the title of the content.
        """
        return self.title
