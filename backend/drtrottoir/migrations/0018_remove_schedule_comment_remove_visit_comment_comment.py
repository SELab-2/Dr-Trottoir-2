# Generated by Django 4.1.7 on 2023-04-19 22:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0017_alter_photo_created_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='visit',
            name='comment',
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(null=True, verbose_name='time of creation')),
                ('updated_at', models.DateTimeField(null=True, verbose_name='time of last update')),
                ('text', models.TextField(verbose_name='Comment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='user who wrote comment')),
            ],
        ),
    ]
