# Generated by Django 4.1.7 on 2023-03-16 12:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0011_alter_waste_building'),
    ]

    operations = [
        migrations.AlterField(
            model_name='waste',
            name='building',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='drtrottoir.building', verbose_name='building of waste collection'),
        ),
    ]
