# Generated by Django 4.1.7 on 2023-03-11 23:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0006_rename_admin_customuser_developer_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='building',
            name='name',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='is_superuser',
        ),
    ]