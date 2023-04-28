from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly, AnyonePostSuperEditPermission
from drtrottoir.models import VisitComment, ScheduleComment
from drtrottoir.serializers import VisitCommentSerializer, ScheduleCommentSerializer


class ScheduleCommentView(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a comment on a schedule to be retrieved. Authentication required.

    list:
    API endpoint that allows all comments on schedules to be retrieved. Authentication required.

    create:
    API endpoint that allows a comment on a schedule to be created. Superstudent role or above required.

    update:
    API endpoint that allows a comment on a schedule to be updated. Superstudent role or above required.

    partial_update:
    API endpoint that allows a comment on a schedule to be updated. Superstudent role or above required.

    destroy:
    API endpoint that allows a comment on a schedule to be deleted. Superstudent role or above required.
    """

    queryset = ScheduleComment.objects.all()
    permission_classes = [IsAuthenticated & SuperPermissionOrReadOnly]
    serializer_class = ScheduleCommentSerializer


class VisitCommentView(viewsets.ModelViewSet):
    """
    retrieve:
    API endpoint that allows a comment on a visit to be retrieved.
    Authentication required.

    list:
    API endpoint that allows all comments on visits to be retrieved.
    Authentication required.

    create:
    API endpoint that allows a comment on a schedule to be created.
    Authentication required.

    update:
    API endpoint that allows a comment on a schedule to be updated.
    Owner of Comment or Superstudent role or above required.

    partial_update:
    API endpoint that allows a comment on a schedule to be updated.
    Owner of Comment or Superstudent role or above required.

    destroy:
    API endpoint that allows a comment on a schedule to be deleted.
    Owner of Comment or Superstudent role or above required.
    """

    queryset = VisitComment.objects.all()
    permission_classes = [IsAuthenticated & AnyonePostSuperEditPermission]
    serializer_class = VisitCommentSerializer
