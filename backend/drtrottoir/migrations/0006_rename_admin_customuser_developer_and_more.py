# Generated by Django 4.1.7 on 2023-03-11 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0005_remove_region_region_region_region_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='admin',
            new_name='developer',
        ),
        migrations.AddField(
            model_name='customuser',
            name='superstudent',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='customuser',
            name='superuser',
            field=models.BooleanField(default=False),
        ),
    ]
