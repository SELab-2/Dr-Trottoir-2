# Generated by Django 4.1.7 on 2023-03-16 19:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0014_photo_image_alter_photo_visit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='buildings',
            field=models.ManyToManyField(related_name='owners', to='drtrottoir.building'),
        ),
    ]
