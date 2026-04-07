from django.urls import path
from .views import create_user, get_user, login_user, logout_user, get_current_user, update_current_user, forgot_password, reset_password, verify_email, resend_verification_code

urlpatterns = [
    path('create/', create_user, name='create_user'),
    path('verify-email/', verify_email, name='verify_email'),
    path('resend-verification/', resend_verification_code, name='resend_verification_code'),
    path('login/', login_user, name='login_user'),
    path('logout/', logout_user, name='logout_user'),
    path('me/', get_current_user, name='get_current_user'),
    path('profile/', update_current_user, name='update_current_user'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset-password/', reset_password, name='reset_password'),
    path('<int:user_id>/', get_user, name='get_user'),
]
