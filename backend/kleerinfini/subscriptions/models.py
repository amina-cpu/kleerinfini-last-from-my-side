from django.db import models
import uuid
from users.models import User

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('expire', 'Expiré'),
        ('suspendu', 'Suspendu'),
        ('en_attente', 'En attente validation'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('baridimob', 'Baridimob'),
        ('cib', 'CIB'),
        ('virement', 'Virement'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    proof_file_url = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)

    def __str__(self):
        return f"Abonnement de {self.user.email} ({self.status})"
