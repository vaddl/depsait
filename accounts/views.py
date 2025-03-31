from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.generic import CreateView
from django.urls import reverse_lazy
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import UserStatistics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Ласкаво просимо, {user.username}!')
            return redirect('home')
    else:
        form = CustomAuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def register_view(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Создаем статистику для нового пользователя
            UserStatistics.objects.create(user=user)
            login(request, user)
            messages.success(request, 'Реєстрація успішна!')
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, 'Ви вийшли з системи')
    return redirect('home')

@login_required
def profile_view(request):
    # Проверяем наличие статистики
    if not hasattr(request.user, 'statistics'):
        UserStatistics.objects.create(user=request.user)
    return render(request, 'accounts/profile.html')

class UpdateThemeView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            theme = request.data.get('theme', 'light')
            request.user.theme_preference = theme
            request.user.save()
            return Response({'status': 'success'})
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED) 