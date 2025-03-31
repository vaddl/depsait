from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/calculate/', views.CalculationView.as_view(), name='calculation'),
    path('api/advanced-calculate/', views.AdvancedCalculationView.as_view(), name='advanced_calculation'),
    path('api/ai-assistant/', views.AIAssistantView.as_view(), name='ai_assistant'),
]