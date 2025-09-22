from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Invitation
from .serializers import InviteClientSerializer
from users.permissions import IsAdmin
import uuid
from django.utils import timezone
from datetime import timedelta
from users.models import User
from django.contrib.auth.hashers import make_password

# Create your views here.

class InviteClientView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = InviteClientSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            token = str(uuid.uuid4())
            expires_at = timezone.now() + timedelta(hours=72)
            invitation = Invitation.objects.create(
                email=email,
                token=token,
                expires_at=expires_at,
            )
            # Ici, on renvoie juste le lien d'invitation (à envoyer par email côté admin plus tard)
            link = f"/api/register/invite/{token}/"
            return Response({'message': 'Invitation créée.', 'invitation_link': link}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterInviteGetView(APIView):
    def get(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token)
            if not invitation.is_valid():
                return Response({'error': 'Invitation expirée ou déjà utilisée.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'email': invitation.email, 'expires_at': invitation.expires_at})
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)

class RegisterInvitePostView(APIView):
    def post(self, request, token):
        try:
            invitation = Invitation.objects.get(token=token)
            if not invitation.is_valid():
                return Response({'error': 'Invitation expirée ou déjà utilisée.'}, status=status.HTTP_400_BAD_REQUEST)
            password = request.data.get('password')
            if not password:
                return Response({'error': 'Mot de passe requis.'}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(email=invitation.email, password=password, role='client')
            invitation.used = True
            invitation.save()
            return Response({'message': 'Compte client créé avec succès.'})
        except Invitation.DoesNotExist:
            return Response({'error': 'Invitation introuvable.'}, status=status.HTTP_404_NOT_FOUND)
