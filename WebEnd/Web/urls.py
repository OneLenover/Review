from django.contrib import admin
from django.urls import path, include
from core.user.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', FeedbackViewSet.as_view(), name='Feedback'),
    path('api/', include('core.user.urls')),
    path('Images/<int:feedback_id>/', ImageAttachmentViewSet.as_view(), name='ImageAttachmentByFeedback'),
    path('FeedbackResponse/', FeedbackResponseViewSet.as_view(), name='FeedbackResponse'),
    path('Feedback/ID/<int:id>/', get_feedback_by_id, name='FeedbackByID'),
    path('Feedback/IN_PROGRESS/<int:id>/', IN_PROGRESS, name='IN_PROGRESS'),
    path('Feedback/COMPLETED/<int:id>/', COMPLETED, name='COMPLETED'),
    path('Feedback/REJECTED/<int:id>/', REJECTED, name='REJECTED'),
    path('FeedbackKey/<str:verification_key>/', get_feedback_by_verification_key, name='FeedbackByKey'),
    path('Feedback/status/<str:status>/', get_feedback_by_status, name='FeedbackByStatus'),
    path('FeedbackResponse/<int:feedback_id>/', get_feedbackresponse_by_feedback_id, name='FeedbackResponseByKey'),
    path('FeedbackResponse/create/', create_feedback_response, name='CreateFeedbackResponse'),
    path('FeedbackResponse/update/<int:feedback_id>/', update_feedback_response, name='UpdateFeedbackResponse'),
    path('FeedbackResponse_Images/<int:response_id>/', ResponseImageViewSet.as_view(), name='ImageAttachmentByResponse'),
    path('manager_by_feedbackresponse/<int:feedbackresponse_id>/', get_manager_by_feedbackresponse, name='ManagerByFeedbackResponse'),
    path('CategoryCount/', get_category_counts, name='get_category_counts'),
    path('get_selected_feedbacks/', get_selected_feedbacks, name='get_selected_feedbacks'),
    path('Feedback/cluster/', get_clustered_feedbacks, name='get_clustered_feedbacks')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
