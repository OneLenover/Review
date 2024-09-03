from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import managerSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from core.user.models import Feedback
from django_pandas.io import read_frame
from django.db.models import Count
import numpy as np
import nltk
import re
from nltk.stem.snowball import SnowballStemmer
from sklearn.cluster import DBSCAN
from sentence_transformers import SentenceTransformer, util
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.views.decorators.csrf import csrf_exempt

class FeedbackViewSet(APIView):
    # permission_classes = (IsAuthenticatedOrReadOnly, )
    def get(self, request):
        output = [
            {
                "id": output.id,
                "Feedback_date": output.Feedback_date,
                "Feedback_name": output.Feedback_name,
                "Feedback_txt": output.Feedback_txt,
                "verification_key": output.verification_key,
                "status": output.status,
            }for output in Feedback.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            feedback = serializer.save()
            return Response({'id': feedback.id, 'verification_key': feedback.verification_key})


def get_feedback_by_verification_key(request, verification_key):
    try:
        feedback = Feedback.objects.get(verification_key=verification_key)
        return JsonResponse({
            'id': feedback.id,
            'Feedback_date': feedback.Feedback_date,
            'Feedback_name': feedback.Feedback_name,
            'Feedback_txt': feedback.Feedback_txt,
            'verification_key': feedback.verification_key,
            'status': feedback.status,
        })
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

from django.utils.dateparse import parse_date

def get_feedback_by_status(request, status):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    feedbacks = Feedback.objects.filter(status=status)

    if start_date and end_date:
        feedbacks = feedbacks.filter(Feedback_date__range=[start_date, end_date])

    serializer = FeedbackSerializer(feedbacks, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def IN_PROGRESS(request, id):
    try:
        feedback = Feedback.objects.get(id=id)
        feedback.status = 'IN_PROGRESS'
        feedback.save()
        return JsonResponse({'status': 'Status updated'}, status=200)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

@api_view(['POST'])
def COMPLETED(request, id):
    try:
        feedback = Feedback.objects.get(id=id)
        feedback.status = 'COMPLETED'
        feedback.save()
        return JsonResponse({'status': 'Status updated'}, status=200)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

@api_view(['POST'])
def REJECTED(request, id):
    try:
        feedback = Feedback.objects.get(id=id)
        feedback.status = 'REJECTED'  # Обновляем статус на 'COMPLETED'
        feedback.save()
        return JsonResponse({'status': 'Status updated'}, status=200)
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

def get_feedback_by_id(request, id):
    try:
        feedback = Feedback.objects.get(id=id)
        return JsonResponse({
            'id': feedback.id,
            'Feedback_date': feedback.Feedback_date,
            'Feedback_name': feedback.Feedback_name,
            'Feedback_txt': feedback.Feedback_txt,
            'verification_key': feedback.verification_key,
            'status': feedback.status,
        })
    except Feedback.DoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

class ImageAttachmentViewSet(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        feedback_id = request.data.get('feedback')
        images = request.FILES.getlist('image')
        for image in images:
            ImageAttachment.objects.create(feedback_id=feedback_id, image=image)
        return Response({'message': 'Images uploaded successfully'}, status=status.HTTP_201_CREATED)

    def get(self, request, feedback_id, *args, **kwargs):
        images = ImageAttachment.objects.filter(feedback_id=feedback_id)
        serializer = ImageAttachmentSerializer(images, many=True)
        return Response(serializer.data)

class FeedbackResponseViewSet(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "FeedbackResponse": output.Response_txt,
                "Response_theme": output.Response_theme,
                "feedback": output.feedback_id,
                "Response_date": output.Response_date,
                "Edited": output.Edited,
                "Category": output.Category,
            }for output in FeedbackResponse.objects.all()
        ]
        return Response(output)

class ResponseImageViewSet(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        response_id = request.data.get('responseID')
        images = request.FILES.getlist('image')
        for image in images:
            ImageResponse.objects.create(response_id=response_id, image=image)
        return Response({'message': 'Images uploaded successfully'}, status=status.HTTP_201_CREATED)

    def get(self, request, response_id, *args, **kwargs):
        images = ImageResponse.objects.filter(response_id=response_id)
        serializer = ImageResponseSerializer(images, many=True)
        return Response(serializer.data)
@api_view(['POST'])
def create_feedback_response(request):
    serializer = FeedbackResponseSerializer(data=request.data)
    if serializer.is_valid():
        response = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_feedback_response(request, feedback_id):
    print(f"Update request received for feedback_id: {feedback_id}")
    try:
        feedback_response = FeedbackResponse.objects.get(feedback_id=feedback_id)
        print(f"Feedback response found: {feedback_response}")
        serializer = FeedbackResponseSerializer(feedback_response, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except FeedbackResponse.DoesNotExist:
        print(f"FeedbackResponse with id {feedback_id} does not exist")
        return JsonResponse({'error': 'FeedbackResponse does not exist'}, status=404)

def get_feedbackresponse_by_feedback_id(request, feedback_id):
    try:
        feedback_response = FeedbackResponse.objects.get(feedback_id=feedback_id)
        return JsonResponse({
            'Response_theme': feedback_response.Response_theme,
            'Response_txt': feedback_response.Response_txt,
            'feedback_id': feedback_response.feedback.id,
            'Response_date': feedback_response.Response_date,
            'manager_id': feedback_response.manager.id,
            'Category': feedback_response.Category,
        })
    except FeedbackResponse.DoesNotExist:
        return JsonResponse({'error': 'FeedbackResponse does not exist'}, status=404)

@api_view(['POST'])
def update_category_response(request, feedback_id):
    try:
        feedback_response = FeedbackResponse.objects.get(pk=feedback_id)
        feedback_response.Category = request.data.get('Category')
        feedback_response.save()
        return Response(status=status.HTTP_200_OK)
    except FeedbackResponse.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_category_counts(request):
    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')

    feedback_responses = FeedbackResponse.objects.all()

    if start_date and end_date:
        feedback_responses = feedback_responses.filter(Response_date__range=[start_date, end_date])

    category_counts = feedback_responses.values('Category').annotate(count=Count('Category'))

    return JsonResponse(list(category_counts), safe=False)

@api_view(['GET'])
def get_selected_feedbacks(request):
    ids = request.GET.getlist('ids')  # Get list of ids from query parameters
    try:
        feedbacks = Feedback.objects.filter(id__in=ids)  # Get Feedback objects with ids in the list
        output = [
            {
                "id": feedback.id,
                "Feedback_date": feedback.Feedback_date,
                "Feedback_name": feedback.Feedback_name,
                "Feedback_txt": feedback.Feedback_txt,
                "verification_key": feedback.verification_key,
                "status": feedback.status,
            } for feedback in feedbacks
        ]
        return JsonResponse(output, safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Feedback does not exist'}, status=404)

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = managerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = None
        if '@' in username:
            try:
                user = manager.objects.get(email=username)
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    if request.method == 'POST':
        try:
            # Delete the user's token to logout
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_manager_id(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION').split()[1]
        user = Token.objects.get(key=token).user
        return Response({'managerID': user.id}, status=status.HTTP_200_OK)


def get_manager_by_feedbackresponse(request, feedbackresponse_id):
    feedbackresponse = get_object_or_404(FeedbackResponse, id=feedbackresponse_id)
    manager_data = {
        "username": feedbackresponse.manager.username,
        "email": feedbackresponse.manager.email,
    }
    return JsonResponse(manager_data)

nltk.download('punkt')
nltk.download('stopwords')

def preprocess_text(text):
    tokens = [word.lower() for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)]
    filtered_tokens = [token for token in tokens if re.search('[а-яА-Я]', token)]
    return ' '.join(filtered_tokens)

def cluster_feedbacks():
    feedbacks = Feedback.objects.filter(status='NEW')
    if not feedbacks.exists():
        return []

    df = read_frame(feedbacks)
    df['processed_text'] = df['Feedback_txt'].apply(preprocess_text)
    model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
    embeddings = model.encode(df['processed_text'].tolist(), convert_to_tensor=True)

    clustering_model = DBSCAN(eps=0.5, min_samples=2, metric='cosine').fit(embeddings.cpu())
    df['cluster'] = clustering_model.labels_

    largest_cluster_label = df['cluster'].value_counts().idxmax()
    largest_cluster_df = df[df['cluster'] == largest_cluster_label]

    all_texts = ' '.join(largest_cluster_df['processed_text'])
    words = all_texts.split()
    common_terms = set(words)

    return {
        'records': largest_cluster_df.to_dict(orient='records'),
        'keywords': list(common_terms)
    }

@receiver(post_save, sender=Feedback)
@receiver(post_delete, sender=Feedback)
def update_clusters(sender, **kwargs):
    cluster_feedbacks()

# Run clustering on server start
cluster_feedbacks()

@csrf_exempt
def get_clustered_feedbacks(request):
    results = cluster_feedbacks()
    return JsonResponse(results, safe=False)


