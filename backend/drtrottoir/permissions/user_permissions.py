from rest_framework.permissions import BasePermission, SAFE_METHODS

from drtrottoir.models.custom_user import Roles


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
        return request.user.is_super or request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.user.is_super or request.method in SAFE_METHODS


class AdminPermissionOrReadOnly(BasePermission):
    """
    Including this permission allows everyone to do safe methods like GET.
    But requires higher levels for non-safe methods.
    """

    def has_permission(self, request, view):
        return request.user.role <= Roles.SUPERADMIN or request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.user.role <= Roles.SUPERADMIN or request.method in SAFE_METHODS


class SuperStudentPermissionOrReadOnly(BasePermission):
    """
    Including this permission allows everyone to do safe methods like GET.
    But requires higher levels for non-safe methods.
    """

    def has_permission(self, request, view):
        return request.user.role <= Roles.SUPERSTUDENT or request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.user.role <= Roles.SUPERSTUDENT or request.method in SAFE_METHODS


class AnyonePostSuperEditPermission(BasePermission):
    """
    Including this permission allows everyone to do safe methods like GET.
    Anyone can post new entries, only the owner of the record and users with higher permissions can edit.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.is_super or request.method in SAFE_METHODS or obj.user == request.user


class PhotoPermission(BasePermission):
    """
    Including this permission allows everyone to do safe methods like GET.
    Anyone can post new entries, only the owner of the record and users with higher permissions can edit.
    """

    def has_object_permission(self, request, view, obj):
        return request.user.is_super or request.method in SAFE_METHODS or obj.visit.user == request.user


class UserViewSetPermission(BasePermission):
    """
    Including this permission allows only super permissions to GET index page.
    Only Users that own the record and super permissions can view and edit that record.
    """

    def has_permission(self, request, view):
        return (request.user.is_super and request.method in SAFE_METHODS) or 'pk' in view.kwargs

    def has_object_permission(self, request, view, obj):
        return request.user.is_super or (obj == request.user and request.method in SAFE_METHODS)
