pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '379322108224'
        ECR_FRONTEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/meeting-app-frontend"
        ECR_BACKEND = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/meeting-app-backend"
        EKS_CLUSTER = 'meeting-app-cluster'
        NAMESPACE = 'meeting-app-dev'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'ls -la'
            }
        }
        
        stage('ECR Login') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                '''
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('meeting-frontend') {
                    sh '''
                        echo "Building Frontend..."
                        docker build -t ${ECR_FRONTEND}:${BUILD_NUMBER} -t ${ECR_FRONTEND}:latest .
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('meeting-backend') {
                    sh '''
                        echo "Building Backend..."
                        docker build -t ${ECR_BACKEND}:${BUILD_NUMBER} -t ${ECR_BACKEND}:latest .
                    '''
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                sh '''
                    echo "Pushing Frontend..."
                    docker push ${ECR_FRONTEND}:${BUILD_NUMBER}
                    docker push ${ECR_FRONTEND}:latest
                    
                    echo "Pushing Backend..."
                    docker push ${ECR_BACKEND}:${BUILD_NUMBER}
                    docker push ${ECR_BACKEND}:latest
                '''
            }
        }
        
        stage('Update Kubeconfig') {
            steps {
                sh '''
                    aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER}
                '''
            }
        }
        
        stage('Deploy to EKS') {
            steps {
                sh '''
                    echo "Deploying to EKS..."
                    
                    # Apply namespace
                    kubectl apply -f k8s/namespace.yaml
                    
                    # Deploy MySQL first
                    kubectl apply -f k8s/mysql-deployment.yaml
                    
                    # Wait for MySQL to be ready
                    echo "Waiting for MySQL to start..."
                    sleep 60
                    
                    # Deploy backend and frontend
                    kubectl apply -f k8s/backend-deployment.yaml
                    kubectl apply -f k8s/frontend-deployment.yaml
                    
                    # Update images
                    kubectl set image deployment/meeting-frontend \
                        frontend=${ECR_FRONTEND}:${BUILD_NUMBER} \
                        -n ${NAMESPACE} || true
                    
                    kubectl set image deployment/meeting-backend \
                        backend=${ECR_BACKEND}:${BUILD_NUMBER} \
                        -n ${NAMESPACE} || true
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "Waiting for rollout..."
                    sleep 60
                    
                    echo "=== Pods Status ==="
                    kubectl get pods -n ${NAMESPACE}
                    
                    echo "=== Services ==="
                    kubectl get svc -n ${NAMESPACE}
                    
                    echo "=== Frontend URL ==="
                    kubectl get svc meeting-frontend-svc -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
                    echo ""
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f || true'
        }
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}
