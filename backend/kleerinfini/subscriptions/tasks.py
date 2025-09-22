from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from subscriptions.models import Subscription
from notifications.models import Notification
from users.models import User

@shared_task
def relance_abonnements():
    now = timezone.now()
    dans_5j = now + timedelta(days=5)
    # Relance pour abonnements qui expirent dans 5 jours
    exp_soon = Subscription.objects.filter(end_date__date=dans_5j.date(), status='actif')
    for sub in exp_soon:
        Notification.objects.create(
            user=sub.user,
            type='alerte',
            message="Votre abonnement expire dans 5 jours. Pensez à le renouveler !"
        )
    # Relance pour abonnements déjà expirés
    exp = Subscription.objects.filter(end_date__lt=now, status='actif')
    for sub in exp:
        Notification.objects.create(
            user=sub.user,
            type='alerte',
            message="Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser la plateforme."
        )
        sub.status = 'expire'
        sub.save() 