# Generated by Django 4.2.17 on 2025-03-26 19:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='theme_preference',
            field=models.CharField(choices=[('light', 'Світла'), ('dark', 'Темна')], default='light', max_length=10),
        ),
        migrations.CreateModel(
            name='UserStatistics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_analysis_count', models.IntegerField(default=0)),
                ('modeling_count', models.IntegerField(default=0)),
                ('optimization_count', models.IntegerField(default=0)),
                ('ai_assistant_count', models.IntegerField(default=0)),
                ('last_activity', models.DateTimeField(default=django.utils.timezone.now)),
                ('total_calculations', models.IntegerField(default=0)),
                ('favorite_model', models.CharField(default='linear', max_length=20)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='statistics', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Статистика користувача',
                'verbose_name_plural': 'Статистика користувачів',
            },
        ),
    ]
