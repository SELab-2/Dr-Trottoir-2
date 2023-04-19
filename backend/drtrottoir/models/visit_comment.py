from django.db import models
from .comment import Comment
from .visit import Visit


class VisitComment(Comment):
    visit = models.ForeignKey(Visit, verbose_name="visit commented", on_delete=models.CASCADE)
