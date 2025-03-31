from functools import wraps
from django.contrib.auth.decorators import login_required

def track_activity(activity_type):
    def decorator(view_func):
        @wraps(view_func)
        @login_required
        def wrapper(request, *args, **kwargs):
            # Проверяем наличие статистики
            if not hasattr(request.user, 'statistics'):
                from .models import UserStatistics
                UserStatistics.objects.create(user=request.user)
            
            # Обновляем статистику
            request.user.statistics.increment_activity(activity_type)
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator 