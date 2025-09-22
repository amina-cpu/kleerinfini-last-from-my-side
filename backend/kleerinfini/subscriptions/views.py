from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Subscription
from .serializers import UploadProofSerializer
from users.permissions import IsProducer
from django.utils import timezone
from users.permissions import IsAdmin

# Create your views here.

class UploadProofView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsProducer]

    def post(self, request):
        # On suppose que le producteur n'a qu'un abonnement actif/en attente à la fois
        try:
            subscription = Subscription.objects.filter(user=request.user).order_by('-end_date').first()
            if not subscription:
                return Response({'error': "Aucun abonnement trouvé."}, status=status.HTTP_404_NOT_FOUND)
            serializer = UploadProofSerializer(subscription, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(status='en_attente')
                return Response({'message': 'Preuve de paiement envoyée, en attente de validation.'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ValidateSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        from .serializers import ValidateSubscriptionSerializer
        serializer = ValidateSubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            sub_id = serializer.validated_data['id']
            try:
                subscription = Subscription.objects.get(id=sub_id)
                subscription.status = 'actif'
                subscription.save()
                return Response({'message': 'Abonnement validé et activé.'})
            except Subscription.DoesNotExist:
                return Response({'error': 'Abonnement introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
