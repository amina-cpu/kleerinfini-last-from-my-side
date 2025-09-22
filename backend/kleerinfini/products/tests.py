from django.core.management.base import BaseCommand
from products.models import Category, Product
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Populate database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        self.stdout.write('Clearing existing products and categories...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        self.stdout.write('Creating test categories...')
        
        # Create categories for Algerian products
        categories_data = [
            {'name': 'Agroalimentaire', 'description': 'Produits alimentaires et agricoles', 'type': 'food'},
            {'name': 'Produits laitiers', 'description': 'Fromages et produits laitiers artisanaux', 'type': 'dairy'},
        ]
        
        categories = []
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            categories.append(category)
            if created:
                self.stdout.write(f'Created category: {category.name}')

        self.stdout.write('Creating test products...')
        
        # New Algerian products data
        products_data = [
            {
                'name': 'Huile d\'olive',
                'desc_courte': 'Huile d\'olive extra-vierge pressée à froid',
                'description': 'Huile d\'olive extra-vierge, pressée à froid, issue d\'oliveraies locales',
                'desc_longue': 'Huile d\'olive extra-vierge, pressée à froid, issue d\'oliveraies locales. Produit artisanal offrant une saveur fruitée et une texture riche, idéal pour la cuisine ou les usages cosmétiques. Potentiellement certifiée bio, riche en antioxydants, production traditionnelle.',
                'cle_min': 'huile-olive-algerie',
                'prix_indicatif': Decimal('25.00'),  # Estimated price per liter
                'delai_production': '2-4 semaines',
                'images': ['image30'],  # Using image2 for olive oil
                'est_pret': True,
                'region_org': 'Algérie (Béjaïa, Tizi Ouzou)',
                'langue_du_product': 'Français',
                'category': 'Agroalimentaire'
            },
            {
                'name': 'Fromage artisanal',
                'desc_courte': 'Fromage artisanal à partir de lait local',
                'description': 'Fromage artisanal fabriqué à partir de lait local (vache, chèvre ou brebis)',
                'desc_longue': 'Fromage artisanal fabriqué à partir de lait local (vache, chèvre ou brebis), affiné de manière traditionnelle. Disponible en roues, cylindres ou blocs, avec croûtes naturelles ou marquées, offrant une variété de textures (frais, semi-affiné, affiné). Authentique, artisanal, potentiellement certifié halal ou bio.',
                'cle_min': 'fromage-artisanal-algerie',
                'prix_indicatif': Decimal('18.00'),  # Estimated price per kg
                'delai_production': '3-6 semaines',
                'images': ['image31'],  # Using image1 for cheese
                'est_pret': True,
                'region_org': 'Algérie',
                'langue_du_product': 'Français',
                'category': 'Produits laitiers'
            },
            {
                'name': 'Tomate',
                'desc_courte': 'Tomates fraîches cultivées localement',
                'description': 'Tomates fraîches cultivées localement, récoltées à maturité',
                'desc_longue': 'Tomates fraîches cultivées localement, récoltées à maturité, avec une chair juteuse et savoureuse. Disponibles en variétés locales (tomates rondes ou allongées), idéales pour la cuisine ou la transformation (sauce, conserve). Potentiellement certifiée bio ou conforme aux normes locales, riche en goût et en nutriments.',
                'cle_min': 'tomate-fraiche-algerie',
                'prix_indicatif': Decimal('3.50'),  # Estimated price per kg
                'delai_production': '1-2 semaines',
                'images': ['image3'],  # Using image3 for tomatoes
                'est_pret': True,
                'region_org': 'Algérie',
                'langue_du_product': 'Français',
                'category': 'Agroalimentaire'
            },
        ]

        for product_data in products_data:
            category_name = product_data.pop('category')
            category = next(cat for cat in categories if cat.name == category_name)
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    **product_data,
                    'category': category,
                    'views': random.randint(50, 500)
                }
            )
            
            if created:
                self.stdout.write(f'Created product: {product.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {Category.objects.count()} categories '
                f'and {Product.objects.count()} products'
            )
        )