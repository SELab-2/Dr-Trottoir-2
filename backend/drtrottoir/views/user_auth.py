from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
import json
from django.http import HttpResponse

@api_view(['POST'])
def user_auth(request):
    data = json.loads(request.body)
    user = authenticate(request, email=data["email"], password=data["password"])
    
    if user is not None:
        login(request, user)
        # redirect to home page of api
        return redirect('/api/')
    else:
        return HttpResponse("Invalid Email or Password", status=401)
