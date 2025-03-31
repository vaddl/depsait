from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.decorators import login_required
import numpy as np
import json
import math
from django.core.exceptions import ValidationError
import re
from .ai_helper import ai_helper
from accounts.models import UserStatistics

# Create your views here.
def home(request):
    """
    Відображення для рендеру головної сторінки (index.html).
    """
    return render(request, 'main/home.html')

class CalculationView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            x = float(request.data.get('x', 0))
            y = x**2
            
            # Track statistics if user is authenticated
            if request.user.is_authenticated:
                stats, _ = UserStatistics.objects.get_or_create(user=request.user)
                stats.increment_activity('analysis')
            
            return Response({"x": x, "y": y}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        return Response({
            "error": "GET method is not allowed / Метод GET не дозволений",
            "example": {
                "post_body": {
                    "x": "value"
                }
            }
        }, status=status.HTTP_400_BAD_REQUEST)

class AdvancedCalculationView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Валидация входных данных
            model_type = request.data.get('model_type', '')
            if not model_type in ['linear', 'exponential', 'polynomial', 'logarithmic', 'trigonometric']:
                raise ValidationError('Невірний тип моделі')

            parameters_str = request.data.get('parameters', '')
            if not re.match(r'^[-0-9,.\s]+$', parameters_str):
                raise ValidationError('Параметри містять недопустимі символи')

            range_start = float(request.data.get('range_start', -10))
            range_end = float(request.data.get('range_end', 10))
            
            if range_start >= range_end:
                raise ValidationError('Початок діапазону має бути менше кінця')
            
            # Преобразуем строку параметров в список чисел
            parameters = [float(p.strip()) for p in parameters_str.split(',') if p.strip()]
            
            # Создаем массив x-значений
            x_values = np.linspace(range_start, range_end, 100).tolist()
            y_values = []
            equation = ""
            
            # Вычисляем y-значения в зависимости от типа модели
            if model_type == 'polynomial':
                # Полиномиальная модель: y = a0 + a1*x + a2*x^2 + ...
                equation = "y = " + " + ".join([f"{p}*x^{i}" if i > 0 else f"{p}" for i, p in enumerate(parameters)])
                for x in x_values:
                    y = sum(p * (x ** i) for i, p in enumerate(parameters))
                    y_values.append(y)
                    
            elif model_type == 'exponential':
                # Экспоненциальная модель: y = a * e^(b*x)
                if len(parameters) >= 2:
                    a, b = parameters[0], parameters[1]
                    equation = f"y = {a} * e^({b}*x)"
                    for x in x_values:
                        y = a * math.exp(b * x)
                        y_values.append(y)
                else:
                    return Response({"error": "Для експоненціальної моделі потрібно щонайменше 2 параметри"}, 
                                   status=status.HTTP_400_BAD_REQUEST)
                    
            elif model_type == 'logarithmic':
                # Логарифмическая модель: y = a + b*ln(x)
                if len(parameters) >= 2:
                    a, b = parameters[0], parameters[1]
                    equation = f"y = {a} + {b}*ln(x)"
                    for x in x_values:
                        if x > 0:  # Логарифм определен только для положительных x
                            y = a + b * math.log(x)
                            y_values.append(y)
                        else:
                            y_values.append(None)  # Null для отрицательных x
                else:
                    return Response({"error": "Для логарифмічної моделі потрібно щонайменше 2 параметри"}, 
                                   status=status.HTTP_400_BAD_REQUEST)
                    
            elif model_type == 'trigonometric':
                # Тригонометрическая модель: y = a*sin(b*x + c) + d
                if len(parameters) >= 4:
                    a, b, c, d = parameters[0], parameters[1], parameters[2], parameters[3]
                    equation = f"y = {a}*sin({b}*x + {c}) + {d}"
                    for x in x_values:
                        y = a * math.sin(b * x + c) + d
                        y_values.append(y)
                else:
                    return Response({"error": "Для тригонометричної моделі потрібно щонайменше 4 параметри"}, 
                                   status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Невідомий тип моделі"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Track statistics if user is authenticated
            if request.user.is_authenticated:
                stats, _ = UserStatistics.objects.get_or_create(user=request.user)
                stats.increment_activity('modeling')
                
                # Обновляем любимую модель, только если текущая модель использовалась больше всего
                model_counts = {
                    'linear': stats.data_analysis_count,
                    'exponential': stats.modeling_count,
                    'polynomial': stats.modeling_count,
                    'logarithmic': stats.modeling_count,
                    'trigonometric': stats.modeling_count
                }
                
                current_favorite = max(model_counts.items(), key=lambda x: x[1])[0]
                if current_favorite != stats.favorite_model:
                    stats.favorite_model = current_favorite
                    stats.save()
            
            return Response({
                "x_values": x_values,
                "y_values": y_values,
                "equation": equation
            }, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Внутрішня помилка сервера"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AIAssistantView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            problem = request.data.get('problem', '')
            if not problem:
                return Response(
                    {"error": "Будь ласка, опишіть вашу задачу"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Track statistics if user is authenticated
            if request.user.is_authenticated:
                stats, _ = UserStatistics.objects.get_or_create(user=request.user)
                stats.increment_activity('ai')
            
            # Get AI analysis
            response_html = ai_helper.analyze_problem(problem)
            
            return Response({"response": response_html}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Помилка при обробці запиту: {str(e)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )