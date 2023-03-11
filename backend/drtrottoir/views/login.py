import json

from django.contrib.auth import authenticate
from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['POST'])
def login(request):
    response = JsonResponse(json.loads(request.body))
    data = json.loads(request.body)
    print(data)
    print(data["email"])
    print(data["password"])
    user = authenticate(request, email=data["email"], password=data["password"])
    if user is not None:
        login(request, user)
        print("Success guardian, Success")
        # return redirect('home')
    else:
        print("ping")
        # messages.error(request, 'Invalid email or password.')

    # return render(request, 'login.html')
    return response
