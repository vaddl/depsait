// Определяем все функции в объекте приложения
const MathApp = {
    // Инициализация графиков
    analysisChart: null,
    modelingChart: null,
    optimizationChart: null,

    // Цвета для графиков
    chartColors: {
        light: {
            primary: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.1)',
            grid: '#e2e8f0',
            text: '#1e293b'
        },
        dark: {
            primary: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.1)',
            grid: '#1e293b',
            text: '#f8fafc'
        }
    },

    // Статистические функции
    calculateMean: function(numbers) {
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    },

    calculateMedian: function(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    },

    calculateMode: function(numbers) {
        const frequency = {};
        let maxFreq = 0;
        let modes = [];

        numbers.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1;
            if (frequency[num] > maxFreq) {
                maxFreq = frequency[num];
                modes = [num];
            } else if (frequency[num] === maxFreq) {
                modes.push(num);
            }
        });

        return modes.length === Object.keys(frequency).length ? 'Немає моди' : modes.join(', ');
    },

    calculateStdDev: function(numbers) {
        const mean = this.calculateMean(numbers);
        const squareDiffs = numbers.map(num => Math.pow(num - mean, 2));
        return Math.sqrt(this.calculateMean(squareDiffs));
    },

    // Отображение статистики
    displayStats: function(stats) {
        console.log('Displaying stats:', stats); // Отладка
        const statsContainer = document.getElementById('analysis-stats');
        if (!statsContainer) {
            console.error('Stats container not found');
            return;
        }

        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Середнє:</span>
                    <span class="stat-value">${stats.mean.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Медіана:</span>
                    <span class="stat-value">${stats.median.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Мода:</span>
                    <span class="stat-value">${stats.mode}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Стандартне відхилення:</span>
                    <span class="stat-value">${stats.stdDev.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Мінімум:</span>
                    <span class="stat-value">${stats.min.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Максимум:</span>
                    <span class="stat-value">${stats.max.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Розмах:</span>
                    <span class="stat-value">${stats.range.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Кількість значень:</span>
                    <span class="stat-value">${stats.count}</span>
                </div>
            </div>
        `;
    },

    // Функция анализа данных
    calculateAnalysis: function() {
        console.log('calculateAnalysis called'); // Отладка
        const input = document.getElementById('data-input');
        if (!input) {
            console.error('Input element not found');
            return;
        }

        const inputValue = input.value;
        console.log('Input value:', inputValue); // Отладка

        const numbers = inputValue.split(',')
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n));
        
        console.log('Parsed numbers:', numbers); // Отладка

        if (numbers.length === 0) {
            alert('Будь ласка, введіть коректні числові дані');
            return;
        }

        try {
            // Обновление графика
            if (this.analysisChart) {
                this.analysisChart.data.datasets[0].data = numbers.map((value, index) => ({
                    x: index + 1,
                    y: value
                }));
                this.analysisChart.update('none'); // Обновляем без анимации
                console.log('Chart updated successfully'); // Отладка
            } else {
                console.error('Analysis chart not initialized');
                this.initCharts(); // Пробуем переинициализировать график
            }

            // Расчет статистики
            const stats = {
                mean: this.calculateMean(numbers),
                median: this.calculateMedian(numbers),
                mode: this.calculateMode(numbers),
                stdDev: this.calculateStdDev(numbers),
                min: Math.min(...numbers),
                max: Math.max(...numbers),
                range: Math.max(...numbers) - Math.min(...numbers),
                count: numbers.length
            };

            console.log('Calculated stats:', stats); // Отладка
            this.displayStats(stats);
        } catch (error) {
            console.error('Error in calculateAnalysis:', error);
            alert('Виникла помилка при аналізі даних. Будь ласка, спробуйте ще раз.');
        }
    },

    // Инициализация графиков
    initCharts: function() {
        console.log('Initializing charts'); // Отладка
        
        // Инициализация графика анализа
        const analysisCtx = document.getElementById('analysisChart');
        if (analysisCtx) {
            try {
                this.analysisChart = new Chart(analysisCtx, {
                    type: 'scatter',
                    data: {
                        datasets: [{
                            label: 'Дані',
                            data: [],
                            backgroundColor: this.chartColors.light.primary,
                            borderColor: this.chartColors.light.primary,
                            pointRadius: 5,
                            pointHoverRadius: 7
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'linear',
                                position: 'bottom',
                                grid: {
                                    color: this.chartColors.light.grid
                                },
                                ticks: {
                                    color: this.chartColors.light.text
                                }
                            },
                            y: {
                                grid: {
                                    color: this.chartColors.light.grid
                                },
                                ticks: {
                                    color: this.chartColors.light.text
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: this.chartColors.light.text
                                }
                            }
                        }
                    }
                });
                console.log('Analysis chart initialized successfully'); // Отладка
            } catch (error) {
                console.error('Error initializing analysis chart:', error);
            }
        } else {
            console.error('Analysis chart canvas not found');
        }
        
        // График моделирования
        const modelingCtx = document.getElementById('modelingChart');
        if (modelingCtx) {
            this.modelingChart = new Chart(modelingCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Модель',
                        data: [],
                        borderColor: this.chartColors.light.primary,
                        backgroundColor: this.chartColors.light.background,
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Математична модель',
                            color: this.chartColors.light.text,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            labels: {
                                color: this.chartColors.light.text
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'x',
                                color: this.chartColors.light.text
                            },
                            grid: {
                                color: this.chartColors.light.grid
                            },
                            ticks: {
                                color: this.chartColors.light.text
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'y',
                                color: this.chartColors.light.text
                            },
                            grid: {
                                color: this.chartColors.light.grid
                            },
                            ticks: {
                                color: this.chartColors.light.text
                            }
                        }
                    }
                }
            });
        }
        
        // График оптимизации
        const optimizationCtx = document.getElementById('optimizationChart');
        if (optimizationCtx) {
            this.optimizationChart = new Chart(optimizationCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Цільова функція',
                        data: [],
                        borderColor: this.chartColors.light.primary,
                        backgroundColor: this.chartColors.light.background,
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Оптимізація',
                            color: this.chartColors.light.text,
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            labels: {
                                color: this.chartColors.light.text
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'x',
                                color: this.chartColors.light.text
                            },
                            grid: {
                                color: this.chartColors.light.grid
                            },
                            ticks: {
                                color: this.chartColors.light.text
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'y',
                                color: this.chartColors.light.text
                            },
                            grid: {
                                color: this.chartColors.light.grid
                            },
                            ticks: {
                                color: this.chartColors.light.text
                            }
                        }
                    }
                }
            });
        }
    },

    // Обновление цветов графиков при смене темы
    updateChartColors: function() {
        console.log('Updating chart colors'); // Отладка
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const colors = this.chartColors[theme];

        try {
            if (this.analysisChart && this.analysisChart.options && this.analysisChart.options.scales) {
                this.analysisChart.options.scales.x.grid.color = colors.grid;
                this.analysisChart.options.scales.y.grid.color = colors.grid;
                this.analysisChart.options.scales.x.ticks.color = colors.text;
                this.analysisChart.options.scales.y.ticks.color = colors.text;
                this.analysisChart.options.plugins.legend.labels.color = colors.text;
                this.analysisChart.data.datasets[0].backgroundColor = colors.primary;
                this.analysisChart.data.datasets[0].borderColor = colors.primary;
                this.analysisChart.update('none'); // Обновляем без анимации
                console.log('Chart colors updated successfully'); // Отладка
            }
        } catch (error) {
            console.error('Error updating chart colors:', error);
        }
    },

    // Инициализация приложения
    init: function() {
        console.log('Initializing MathApp'); // Отладка
        this.initCharts();
        
        // Обработчик изменения типа модели
        const modelTypeSelect = document.getElementById('modelType');
        if (modelTypeSelect) {
            modelTypeSelect.addEventListener('change', this.updateModelParams);
        }
        
        // Добавляем обработчики для кнопок
        document.querySelectorAll('[data-bs-toggle="pill"]').forEach(button => {
            button.addEventListener('shown.bs.tab', function (e) {
                // Обновляем размер графиков при переключении вкладок
                window.dispatchEvent(new Event('resize'));
            });
        });

        // Добавляем обработчик для кнопки анализа
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.calculateAnalysis());
            console.log('Analysis button handler added'); // Отладка
        } else {
            console.error('Analysis button not found');
        }
    },

    // Моделирование
    updateModelParams: function() {
        const modelType = document.getElementById('modelType').value;
        const paramsDiv = document.getElementById('modelParams');
        
        let html = '';
        
        switch(modelType) {
            case 'linear':
                html = `
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт a:</label>
                        <input type="number" id="param-a" class="modern-input" value="1" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт b:</label>
                        <input type="number" id="param-b" class="modern-input" value="0" step="0.1">
                    </div>
                `;
                break;
                
            case 'exponential':
                html = `
                    <div class="mb-4">
                        <label class="form-label">Основа (a):</label>
                        <input type="number" id="param-a" class="modern-input" value="2" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Множник (b):</label>
                        <input type="number" id="param-b" class="modern-input" value="1" step="0.1">
                    </div>
                `;
                break;
                
            case 'polynomial':
                html = `
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт a (x²):</label>
                        <input type="number" id="param-a" class="modern-input" value="1" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт b (x):</label>
                        <input type="number" id="param-b" class="modern-input" value="0" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт c:</label>
                        <input type="number" id="param-c" class="modern-input" value="0" step="0.1">
                    </div>
                `;
                break;
                
            case 'logarithmic':
                html = `
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт a:</label>
                        <input type="number" id="param-a" class="modern-input" value="1" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Коефіцієнт b:</label>
                        <input type="number" id="param-b" class="modern-input" value="0" step="0.1">
                    </div>
                `;
                break;
                
            case 'sinusoidal':
                html = `
                    <div class="mb-4">
                        <label class="form-label">Амплітуда (A):</label>
                        <input type="number" id="param-a" class="modern-input" value="1" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Частота (ω):</label>
                        <input type="number" id="param-b" class="modern-input" value="1" step="0.1">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Фаза (φ):</label>
                        <input type="number" id="param-c" class="modern-input" value="0" step="0.1">
                    </div>
                `;
                break;
        }
        
        paramsDiv.innerHTML = html;
    },

    calculateModel: function() {
        const modelType = document.getElementById('modelType').value;
        const a = parseFloat(document.getElementById('param-a').value);
        const b = parseFloat(document.getElementById('param-b').value);
        const c = modelType === 'polynomial' || modelType === 'sinusoidal' ? 
                  parseFloat(document.getElementById('param-c').value) : 0;
        
        let xValues = [];
        let yValues = [];
        
        // Генерация точек в зависимости от типа модели
        switch(modelType) {
            case 'linear':
                for(let x = -10; x <= 10; x += 0.5) {
                    xValues.push(x);
                    yValues.push(a * x + b);
                }
                break;
                
            case 'exponential':
                for(let x = -5; x <= 5; x += 0.2) {
                    xValues.push(x);
                    yValues.push(b * Math.pow(a, x));
                }
                break;
                
            case 'polynomial':
                for(let x = -10; x <= 10; x += 0.5) {
                    xValues.push(x);
                    yValues.push(a * x * x + b * x + c);
                }
                break;
                
            case 'logarithmic':
                for(let x = 0.1; x <= 10; x += 0.2) {
                    xValues.push(x);
                    yValues.push(a * Math.log(x) + b);
                }
                break;
                
            case 'sinusoidal':
                for(let x = -10; x <= 10; x += 0.1) {
                    xValues.push(x);
                    yValues.push(a * Math.sin(b * x + c));
                }
                break;
        }
        
        // Обновление графика
        this.modelingChart.data.labels = xValues;
        this.modelingChart.data.datasets[0].data = yValues;
        this.modelingChart.update();
    },

    // Оптимизация
    optimize: function() {
        const functionStr = document.getElementById('targetFunction').value;
        
        try {
            // Создание безопасной функции из строки
            const f = new Function('x', `return ${functionStr.replace(/\^/g, '**')}`);
            
            let xValues = [];
            let yValues = [];
            
            // Генерация точек
            for(let x = -10; x <= 10; x += 0.5) {
                try {
                    const y = f(x);
                    if (!isNaN(y) && isFinite(y)) {
                        xValues.push(x);
                        yValues.push(y);
                    }
                } catch(e) {
                    console.error('Error calculating point:', e);
                }
            }
            
            // Поиск минимума и максимума
            const min = Math.min(...yValues);
            const max = Math.max(...yValues);
            const minX = xValues[yValues.indexOf(min)];
            const maxX = xValues[yValues.indexOf(max)];
            
            // Обновление графика
            this.optimizationChart.data = {
                labels: xValues,
                datasets: [{
                    label: 'Цільова функція',
                    data: yValues,
                    borderColor: this.chartColors.light.primary,
                    backgroundColor: this.chartColors.light.background,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            };
            this.optimizationChart.update();
            
            // Отображение результатов
            const resultsHtml = `
                <div class="stats-grid mt-3">
                    <div class="stat-item">
                        <span class="stat-label">Мінімум:</span>
                        <span class="stat-value">y = ${min.toFixed(2)} при x = ${minX.toFixed(2)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Максимум:</span>
                        <span class="stat-value">y = ${max.toFixed(2)} при x = ${maxX.toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('optimization-stats').innerHTML = resultsHtml;
            
        } catch(e) {
            alert('Помилка у функції. Перевірте синтаксис.');
            console.error('Error:', e);
        }
    },

    // ИИ Ассистент
    async getAIAnalysis() {
        const problemDescription = document.getElementById('problem-description').value;
        
        if (!problemDescription.trim()) {
            alert('Будь ласка, опишіть вашу задачу');
            return;
        }
        
        const responseDiv = document.getElementById('ai-response');
        responseDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-hourglass-split"></i> Аналізуємо вашу задачу...
            </div>
        `;
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ problem: problemDescription })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            responseDiv.innerHTML = `
                <div class="analysis-result">
                    <h4>Аналіз задачі:</h4>
                    <p>${data.analysis}</p>
                    
                    <h4>Рекомендована модель:</h4>
                    <p>${data.recommendedModel}</p>
                    
                    <h4>Параметри моделі:</h4>
                    <pre>${data.parameters}</pre>
                    
                    <button class="btn-calculate mt-3" onclick="applyRecommendedModel('${data.modelType}', ${JSON.stringify(data.modelParams)})">
                        <i class="bi bi-check2-circle"></i> Застосувати рекомендовану модель
                    </button>
                </div>
            `;
            
        } catch (error) {
            responseDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Помилка при аналізі задачі. Спробуйте пізніше.
                </div>
            `;
            console.error('Error:', error);
        }
    },

    // Применение рекомендованной модели
    applyRecommendedModel(modelType, params) {
        document.getElementById('modelType').value = modelType;
        this.updateModelParams();
        
        // Установка параметров
        Object.keys(params).forEach(key => {
            const input = document.getElementById(`param-${key}`);
            if (input) {
                input.value = params[key];
            }
        });
        
        // Переключение на вкладку моделирования
        document.querySelector('[data-bs-target="#modeling"]').click();
        
        // Расчет модели
        this.calculateModel();
    }
};

// Экспортируем функции в глобальную область видимости
window.calculateAnalysis = () => MathApp.calculateAnalysis();
window.updateChartColors = () => MathApp.updateChartColors();
window.initCharts = () => MathApp.initCharts();
window.updateModelParams = () => MathApp.updateModelParams();
window.calculateModel = () => MathApp.calculateModel();
window.optimize = () => MathApp.optimize();
window.getAIAnalysis = () => MathApp.getAIAnalysis();
window.applyRecommendedModel = (modelType, params) => MathApp.applyRecommendedModel(modelType, params);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => MathApp.init()); 