from django.db import models
import secrets
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
class Feedback(models.Model):
    STATUS_CHOICES = [('NEW', 'Новое'),
                      ('IN_PROGRESS', 'В работе'),
                      ('COMPLETED', 'Завершенное'),
                      ('REJECTED', 'Отклонено'),
                      ]

    Feedback_date = models.DateField(auto_now=True)
    Feedback_name = models.CharField(max_length=100, default="Anonymous")
    Feedback_txt = models.TextField()
    verification_key = models.CharField(max_length=10, null=True, unique=True)
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='NEW')

    def save(self, *args, **kwargs):
        if not self.verification_key:
            self.verification_key = secrets.token_hex(5)
        super().save(*args, **kwargs)

class ImageAttachment(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='Images/', null=True, blank=True)
class manager(AbstractUser):
    email = models.EmailField(unique=True)
    def __str__(self):
        return self.username
class FeedbackResponse(models.Model):
    Response_theme = models.CharField(max_length=50, default="None")
    Response_txt = models.TextField(default="None")
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    manager = models.ForeignKey(manager, on_delete=models.CASCADE)
    Response_date = models.DateField(auto_now=True)
    Edited = models.BooleanField(default=False)
    Category = models.CharField(max_length=50, default="None")
class ImageResponse(models.Model):
    responseID = models.ForeignKey(FeedbackResponse, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/ResponseImages/', null=True, blank=True)