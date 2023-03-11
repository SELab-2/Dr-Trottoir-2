# Generated by Django 4.1.7 on 2023-03-09 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0002_building_location_alter_customuser_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='building',
            name='manual',
            field=models.FileField(null=True, upload_to='files/', verbose_name='manual'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='buildings',
            field=models.ManyToManyField(to='drtrottoir.building'),
        ),
    ]