from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Fill the database with dummy data'

    def handle(self, *args, **options):

        self.stdout.write("abc")