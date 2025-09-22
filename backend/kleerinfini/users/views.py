from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterProducerSerializer, LoginSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from subscriptions.models import Subscription
from django.utils import timezone
from datetime import timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.

class RegisterProducerView(APIView):
    def post(self, request):
        serializer = RegisterProducerSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Création automatique de l'abonnement initial (30 jours)
            start_date = timezone.now()
            end_date = start_date + timedelta(days=30)
            Subscription.objects.create(
                user=user,
                start_date=start_date,
                end_date=end_date,
                status='en_attente',
            )
            return Response({'message': 'Producteur créé avec succès. Abonnement initial créé.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='Adresse email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Mot de passe'),
            },
            example={
                'email': 'user@example.com',
                'password': 'votre_mot_de_passe'
            }
        ),
        operation_description="Connexion utilisateur (client, producteur ou admin). Retourne un JWT si succès.",
        responses={
            200: openapi.Response(
                description="Token JWT et infos utilisateur",
                examples={
                    "application/json": {
                        "refresh": "<refresh_token>",
                        "access": "<access_token>",
                        "user": {"id": "<uuid>", "role": "producer"}
                    }
                }
            ),
            401: "Mot de passe incorrect.",
            404: "Utilisateur non trouvé."
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user': {
                            'id': str(user.id),
                            'role': user.role,
                        }
                    })
                else:
                    return Response({'error': 'Mot de passe incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({'error': 'Utilisateur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
