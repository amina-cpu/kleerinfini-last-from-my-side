# Update your products/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=50, blank=True)
    specific_fields = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
  
    name = models.CharField(max_length=255, verbose_name='Nom')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField(blank=True, verbose_name='Description')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
  
    desc_courte = models.CharField(max_length=255, blank=True, verbose_name='Description courte')
    cle_min = models.CharField(max_length=100, blank=True, verbose_name='Clé minimum')
    prix_indicatif = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name='Prix indicatif')
    delai_production = models.CharField(max_length=100, blank=True, verbose_name='Délai de production')
    images = models.JSONField(default=list, blank=True, verbose_name='Images')
    fiche_tech = models.FileField(upload_to='fiches_tech/', null=True, blank=True, verbose_name='Fiche technique')
    est_pret = models.BooleanField(default=False, verbose_name='Est prêt')
    desc_longue = models.TextField(blank=True, verbose_name='Description longue')
    region_org = models.CharField(max_length=100, blank=True, verbose_name='Région d\'origine')
    langue_du_product = models.CharField(max_length=50, blank=True, verbose_name='Langue du produit')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'