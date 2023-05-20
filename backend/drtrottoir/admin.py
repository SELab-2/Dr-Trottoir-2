from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .forms import UserChangeForm, UserCreationForm

from .models import (
    CustomUser,
    Region,
    Building,
    Photo,
    Visit,
    Tour,
    Schedule,
    BuildingInTour,
    Waste,
    Template,
    VisitComment,
    ScheduleComment
)


class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'role')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': (
            'email',
            'password',
            'first_name',
            'last_name',
            'phone',
            'is_active',
            'deleted'
        )}),
        ('Permissions', {'fields': ('role',)}),
        ('Region', {'fields': ('region',)})
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(CustomUser, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)
# Register other moments
models = [
    Region,
    Building,
    Photo,
    Visit,
    Tour,
    Schedule,
    BuildingInTour,
    Waste,
    Template,
    VisitComment,
    ScheduleComment
]
admin.site.register(models)
