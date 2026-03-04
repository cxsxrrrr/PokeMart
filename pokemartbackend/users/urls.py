from django.urls import path
from .views import create_user, get_user, login_user, logout_user, get_current_user

urlpatterns = [
    path('create/', create_user, name='create_user'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
    path('me/', get_current_user, name='get_current_user'),
    path('<int:user_id>/', get_user, name='get_user'),
]