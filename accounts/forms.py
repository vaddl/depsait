from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, label='Email адреса')

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')
        labels = {
            'username': "Ім'я користувача",
        }

class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        labels = {
            'username': "Ім'я користувача",
            'password': 'Пароль',
        }