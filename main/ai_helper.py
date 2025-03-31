import re
import json
from typing import Dict, List, Tuple

class LocalAIHelper:
    def __init__(self):
        # Шаблоны для распознавания типов задач
        self.patterns = {
            'falling_object': {
                'keywords': ['падіння', 'швидкість падіння', 'вільне падіння', 'гравітація'],
                'model': 'polynomial',
                'explanation': 'Для моделювання падіння об\'єктів найкраще підходить квадратична функція, яка враховує прискорення вільного падіння',
                'parameters': [4.9, 0, 0],  # a=4.9 (g/2), b=0, c=0
                'recommendations': [
                    'Врахуйте початкову швидкість об\'єкта',
                    'Додайте опір повітря для більш точної моделі',
                    'Розгляньте вплив маси об\'єкта'
                ]
            },
            'population_growth': {
                'keywords': ['зростання', 'популяція', 'експоненціальне', 'розмноження'],
                'model': 'exponential',
                'explanation': 'Зростання популяції найкраще описується експоненціальною моделлю',
                'parameters': [1, 0.5],  # A=1, k=0.5
                'recommendations': [
                    'Врахуйте обмеження ресурсів',
                    'Додайте фактор конкуренції',
                    'Розгляньте сезонні коливання'
                ]
            },
            'oscillation': {
                'keywords': ['коливання', 'гармонічні', 'маятник', 'хвиля', 'періодичний'],
                'model': 'sinusoidal',
                'explanation': 'Коливальні процеси найкраще описуються синусоїдальною функцією',
                'parameters': [1, 1, 0, 0],  # A=1, ω=1, φ=0, b=0
                'recommendations': [
                    'Врахуйте затухання коливань',
                    'Додайте зовнішні сили',
                    'Розгляньте резонансні явища'
                ]
            },
            'linear_process': {
                'keywords': ['лінійний', 'пряма', 'пропорційний', 'рівномірний'],
                'model': 'linear',
                'explanation': 'Процес має лінійний характер, найкраще описується прямою лінією',
                'parameters': [1, 0],  # a=1, b=0
                'recommendations': [
                    'Перевірте наявність нелінійних ефектів',
                    'Врахуйте можливі відхилення',
                    'Розгляньте граничні умови'
                ]
            },
            'decay_process': {
                'keywords': ['розпад', 'затухання', 'спадання', 'зменшення'],
                'model': 'logarithmic',
                'explanation': 'Процес затухання найкраще описується логарифмічною функцією',
                'parameters': [1, 0, 0],  # a=1, b=0, c=0
                'recommendations': [
                    'Врахуйте початкові умови',
                    'Розгляньте фактори впливу',
                    'Проаналізуйте швидкість затухання'
                ]
            }
        }

    def analyze_problem(self, problem_description: str) -> str:
        """Анализирует описание задачи и подбирает подходящую модель"""
        
        # Приводим текст к нижнему регистру для лучшего сопоставления
        problem_lower = problem_description.lower()
        
        # Ищем наиболее подходящий шаблон
        best_match = None
        max_matches = 0
        
        for pattern_name, pattern_data in self.patterns.items():
            matches = sum(1 for keyword in pattern_data['keywords'] if keyword.lower() in problem_lower)
            if matches > max_matches:
                max_matches = matches
                best_match = pattern_data
        
        # Если не нашли подходящий шаблон, используем линейную модель как базовую
        if not best_match:
            best_match = self.patterns['linear_process']
        
        # Формируем HTML-ответ
        html_response = f"""
        <h5>Аналіз задачі</h5>
        <p>На основі опису задачі: "{problem_description}"</p>
        
        <h5>Рекомендована математична модель</h5>
        <p>Тип моделі: <strong>{best_match['model']}</strong></p>
        <div class="alert alert-light">
            <code>
                Рекомендовані параметри:<br>
                {', '.join(str(p) for p in best_match['parameters'])}
            </code>
        </div>
        
        <h5>Пояснення вибору моделі</h5>
        <p>{best_match['explanation']}</p>
        
        <h5>Додаткові рекомендації</h5>
        <ul>
            {''.join(f'<li>{rec}</li>' for rec in best_match['recommendations'])}
        </ul>
        
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i> 
            Для візуалізації цієї моделі використовуйте вкладку "Моделювання" 
            з вказаними параметрами.
        </div>
        """
        
        return html_response

# Создаем глобальный экземпляр помощника
ai_helper = LocalAIHelper() 