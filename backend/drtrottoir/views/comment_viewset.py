from rest_framework import viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drtrottoir.permissions.user_permissions import SuperPermissionOrReadOnly, AnyonePostSuperEditPermission
from drtrottoir.models import VisitComment, ScheduleComment
from drtrottoir.serializers import VisitCommentSerializer, ScheduleCommentSerializer, UserPartialSerializer
from pytz import timezone
from datetime import datetime


class CommentView(viewsets.ModelViewSet):

    def create(self, request):
        if any(x in request.data for x in ('user', 'created_at', 'updated_at')):
            return Response(
                "Can't set user, created_at or updated_at manually, this is automatically extracted in the backend",
                status=status.HTTP_400_BAD_REQUEST
            )

        # Quick hack to enable data changes in request
        if hasattr(request.data, "_mutable"):
            request.data._mutable = True

        user_url = UserPartialSerializer(request.user, context={'request': request}).data['url']
        request.data['user'] = user_url
        request.data['created_at'] = datetime.now(tz=timezone('CET'))

        # call parent to create
        return viewsets.ModelViewSet.create(self, request)

    def partial_update(self, request, pk=None):
        if len(request.data) > 1 or 'text' not in request.data:
            return Response(
                "Can only update text field",
                status=status.HTTP_400_BAD_REQUEST
            )

        # Quick hack to enable data changes in request
        if hasattr(request.data, "_mutable"):
            request.data._mutable = True

        request.data['updated_at'] = datetime.now(tz=timezone('CET'))

        # call parent to update
        return viewsets.ModelViewSet.partial_update(self, request, pk)

    class Meta:
        abstract = True


class ScheduleCommentView(CommentView):
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


class VisitCommentView(CommentView):
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
