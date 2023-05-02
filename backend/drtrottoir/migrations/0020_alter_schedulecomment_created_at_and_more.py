# Generated by Django 4.1.7 on 2023-05-02 11:15

from django.db import migrations, models
from datetime import datetime
from pytz import timezone


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0019_schedulecomment_visitcomment_delete_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedulecomment',
            name='created_at',
            field=models.DateTimeField(default=datetime.now(tz=timezone('CET')), verbose_name='time of creation'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='visitcomment',
            name='created_at',
            field=models.DateTimeField(default=datetime.now(tz=timezone('CET')), verbose_name='time of creation'),
            preserve_default=False,
        ),
    ]