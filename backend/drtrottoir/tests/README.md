# Running backend tests

Running tests is different because the project uses Docker:

1. Run all tests:
    `docker exec -it DrTrottoir-be python manage.py test`

2. Run one test file:
    `docker exec -it DrTrottoir-be python manage.py test drtrottoir.tests.<TESTFILE>`

3. Run one test class:
    `docker exec -it DrTrottoir-be python manage.py test drtrottoir.tests.<TESTFILE>:<TESTCLASS>`

4. Run a single test:
    `docker exec -it DrTrottoir-be python manage.py test drtrottoir.tests.<TESTFILE>:<TESTCLASS>.<TESTMETHOD>`