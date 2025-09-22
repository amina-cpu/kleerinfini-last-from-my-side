import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('kleerinfini')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'relance-abonnements-quotidienne': {
        'task': 'subscriptions.tasks.relance_abonnements',
        'schedule': crontab(hour=7, minute=0),  # tous les jours à 7h du matin
    },
} 