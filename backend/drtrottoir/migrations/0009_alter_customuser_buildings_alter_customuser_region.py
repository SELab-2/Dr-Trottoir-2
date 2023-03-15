# Generated by Django 4.1.7 on 2023-03-15 13:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drtrottoir', '0008_remove_customuser_developer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='buildings',
            field=models.ManyToManyField(related_name='users', to='drtrottoir.building'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='region',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='drtrottoir.region', verbose_name='Region of the user'),
        ),
    ]
