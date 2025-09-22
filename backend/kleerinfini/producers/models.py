from django.db import models
from users.models import User

# Create your models here.

class ProducerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='producer_profile')
    company_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    address = models.CharField(max_length=255, blank=True)
    # Ajoute d'autres champs spécifiques au producteur ici

    def __str__(self):
        return f"Profil de {self.user.email}"
