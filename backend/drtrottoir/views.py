from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['POST'])
def login(request):
    response = JsonResponse({'foo': 'bar'})
    return response
