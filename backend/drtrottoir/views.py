from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework import viewsets
from .models import Building
from .serializers import BuildingSerializer

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user

    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


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
        #return redirect('home')
    else:
        print("ping")
        # messages.error(request, 'Invalid email or password.')

    # return render(request, 'login.html')
    return response

class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed or edited.
    """
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = []
