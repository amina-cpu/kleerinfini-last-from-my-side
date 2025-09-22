from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'views', 'created_at', 
            'category_id', 'category_name',
            'desc_courte', 'cle_min', 'prix_indicatif', 'delai_production',
            'images', 'fiche_tech', 'est_pret', 'desc_longue', 
            'region_org', 'langue_du_product'
        ]