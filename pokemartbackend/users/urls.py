from django.urls import path
from .views import create_user, get_user, login_user, logout_user

urlpatterns = [
    path('create/', create_user, name='create_user'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
    path('<int:user_id>/', get_user, name='get_user'),
]