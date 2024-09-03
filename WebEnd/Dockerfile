# Dockerfile
FROM python:3.8
ENV PYTHONUNBUFFERED 1
WORKDIR /WebEnd
COPY requirements.txt /WebEnd/
RUN pip install -r requirements.txt
COPY . /WebEnd/
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
