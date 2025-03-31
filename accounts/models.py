from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    theme_preference = models.CharField(
        max_length=10,
        choices=[('light', 'Світла'), ('dark', 'Темна')],
        default='light'
    )
    
    def __str__(self):
        return self.username

class UserStatistics(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='statistics')
    data_analysis_count = models.IntegerField(default=0)
    modeling_count = models.IntegerField(default=0)
    optimization_count = models.IntegerField(default=0)
    ai_assistant_count = models.IntegerField(default=0)
    last_activity = models.DateTimeField(default=timezone.now)
    total_calculations = models.IntegerField(default=0)
    favorite_model = models.CharField(max_length=20, default='linear')
    
    class Meta:
        verbose_name = 'Статистика користувача'
        verbose_name_plural = 'Статистика користувачів'
    
    def increment_activity(self, activity_type):
        if activity_type == 'analysis':
            self.data_analysis_count += 1
        elif activity_type == 'modeling':
            self.modeling_count += 1
        elif activity_type == 'optimization':
            self.optimization_count += 1
        elif activity_type == 'ai':
            self.ai_assistant_count += 1
            
        self.total_calculations = (
            self.data_analysis_count + 
            self.modeling_count + 
            self.optimization_count + 
            self.ai_assistant_count
        )
        
        # Определяем любимую модель
        counts = {
            'linear': self.data_analysis_count,
            'exponential': self.modeling_count,
            'polynomial': self.modeling_count,
            'logarithmic': self.modeling_count,
            'trigonometric': self.modeling_count
        }
        self.favorite_model = max(counts.items(), key=lambda x: x[1])[0]
        
        self.last_activity = timezone.now()
        self.save()