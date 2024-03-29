# Generated by Django 4.1.7 on 2023-03-16 19:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("drtrottoir", "0013_remove_visit_building_visit_building_in_tour"),
    ]

    operations = [
        migrations.AddField(
            model_name="photo",
            name="image",
            field=models.ImageField(
                null=True, upload_to="images/", verbose_name="image"
            ),
        ),
        migrations.AlterField(
            model_name="photo",
            name="visit",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="drtrottoir.visit",
                verbose_name="id of visit",
            ),
        ),
    ]
