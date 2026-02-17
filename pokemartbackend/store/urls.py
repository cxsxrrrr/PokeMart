from django import urls
from . import views

urlpatterns = [
    urls.path('health/', views.health_check, name='health_check'),
    urls.path('cards/', views.list_limited_cards, name='list_limited_cards'),
]