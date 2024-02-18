from rest_framework import permissions


class IsConsumerSelf(permissions.BasePermission):
    """
    Allow the current consumer to access the endpoint.
    """

    def has_permission(self, request, view):
        # retrieve the user from the request
        user = request.user
        
        # ensure the user is authenticated
        if not user or not user.is_authenticated:
            return False
        # take the email from query parameters if it exists
        
        email = request.query_params.get("email") 

        # check if the authenticated user is the consumer specified by email
        if hasattr(user, "consumer_profile") and str(user.email) == email:
            return True

        # if neither, deny permission
        return False


class IsProvider(permissions.BasePermission):
    """
    Allow any provider to access the endpoint.
    """

    def has_permission(self, request, view):
        # retrieve the user from the request
        user = request.user

        # ensure the user is authenticated
        if not user or not user.is_authenticated:
            return False

        # check if the authenticated user is a provider
        if hasattr(user, "provider_profile"):
            return True

        # if neither, deny permission
        return False


class IsConsumerSelfOrProvider(permissions.BasePermission):
    """
    Allow the current consumer or any provider to access the endpoint.
    """

    def has_permission(self, request, view):
        # retrieve the user from the request
        user = request.user

        # ensure the user is authenticated
        if not user or not user.is_authenticated:
            return False

        # take the email from query parameters if it exists
        email = request.query_params.get("email")

        # check if the authenticated user is the consumer specified by email
        if hasattr(user, "consumer_profile") and str(user.email) == email:
            return True

        # check if the authenticated user is a provider
        if hasattr(user, "provider_profile"):
            return True

        # if neither, deny permission
        return False


class IsSelfUser(permissions.BasePermission):
    """
    Allow the current user to access the endpoint.
    """

    def has_permission(self, request, view):
        # retrieve the user from the request
        user = request.user

        # ensure the user is authenticated
        if not user or not user.is_authenticated:
            return False

        # take the email from query parameters if it exists
        email = request.query_params.get("email")

        # check if the authenticated user is the user specified by email
        if str(user.email) == email:
            return True

        # if neither, deny permission
        return False