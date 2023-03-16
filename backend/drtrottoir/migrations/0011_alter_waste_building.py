# Generated by Django 4.1.7 on 2023-03-15 22:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0010_merge_20230315_1717'),
    ]

    operations = [
        migrations.AlterField(
            model_name='waste',
            name='building',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='drtrottoir.building', verbose_name='building of waste collection'),
        ),
    ]
