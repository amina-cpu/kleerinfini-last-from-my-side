from django.db import models
import uuid
from users.models import User

# Create your models here.

class Notification(models.Model):
    TYPE_CHOICES = [
        ('paiement', 'Paiement'),
        ('message', 'Message'),
        ('demande', 'Demande'),
        ('alerte', 'Alerte'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification pour {self.user.email} ({self.type})"
