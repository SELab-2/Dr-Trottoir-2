# Generated by Django 4.1.7 on 2023-04-18 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0016_visit_schedule_waste_action_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='created_at',
            field=models.DateTimeField(null=True, verbose_name='time of creation'),
        ),
    ]
