from rest_framework.permissions import BasePermission, SAFE_METHODS


class SuperPermission(BasePermission):
    """
    Including this permission makes the endpoint only accessible to superintendents or higher.
    """
    def has_permission(self, request, view):
        return request.user.is_super

    def has_object_permission(self, request, view, obj):
        return request.user.is_super


class SuperPermissionOrReadOnly(BasePermission):
    """
    Including this permission allows everyone to do safe methods like GET.
    But requires higher levels for non-safe methods.
    """
    def has_permission(self, request, view):
        return request.user.is_super and request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.user.is_super and request.method in SAFE_METHODS
