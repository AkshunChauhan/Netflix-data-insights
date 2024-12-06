from django.db import models

class NetflixContent(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50)
    # genre = models.CharField(max_length=255)
    release_year = models.IntegerField()
    rating = models.CharField(max_length=50, null=True)
    duration = models.CharField(max_length=50, null=True)
    listed_in = models.TextField()
    country = models.CharField(max_length=255, null=True)

    def __str__(self):
        return self.title
