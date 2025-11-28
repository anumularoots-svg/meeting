apiVersion: apps/v1
kind: Deployment
metadata:
  name: meeting-backend
  namespace: meeting-app-dev
  labels:
    app: meeting-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: meeting-backend
  template:
    metadata:
      labels:
        app: meeting-backend
    spec:
      containers:
      - name: backend
        image: 451870923045.dkr.ecr.us-east-1.amazonaws.com/meeting-app-backend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
        env:
        - name: DEBUG
          value: "True"
        - name: ALLOWED_HOSTS
          value: "*"
        - name: DB_HOST
          value: "mysql-svc"
        - name: DB_PORT
          value: "3306"
        - name: DB_NAME
          value: "SampleDB"
        - name: DB_USER
          value: "sa"
        - name: DB_PASSWORD
          value: "Welcome@123"
        - name: DJANGO_SETTINGS_MODULE
          value: "SampleDB.settings"
        command: ["sh", "-c"]
        args: ["sleep 30 && python manage.py migrate --run-syncdb && python manage.py runserver 0.0.0.0:8000 --noreload"]
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: meeting-backend-svc
  namespace: meeting-app-dev
spec:
  type: ClusterIP
  selector:
    app: meeting-backend
  ports:
  - port: 8000
    targetPort: 8000
    protocol: TCP
