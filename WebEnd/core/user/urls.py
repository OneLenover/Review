from django.urls import path
from .views import register_user, user_login, user_logout, get_manager_id

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('get_manager_id/', get_manager_id, name='get_manager_id'),
]