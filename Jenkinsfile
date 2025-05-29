pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        echo 'Building project...'
        sh 'docker build -t todo-api .'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests inside Docker...'
        sh 'docker run --rm todo-api npm test'
      }
    }

    stage('Code Quality') {
      steps {
        echo 'Running SonarCloud analysis...'
        withSonarQubeEnv('My Sonar Server') {
          sh '''
            sonar-scanner \
              -Dsonar.projectKey=Sparsh300_todo-api \
              -Dsonar.organization=parsh300 \
              -Dsonar.sources=. \
              -Dsonar.host.url=https://sonarcloud.io \
              -Dsonar.login=$SONAR_TOKEN
          '''
        }
      }
    }

    stage('Security') {
      steps {
        echo 'Running security audit...'
        sh 'docker run --rm todo-api npm audit --audit-level=moderate || true'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying Docker container...'
        sh 'docker rm -f todo-app || true'
        sh 'docker run -d -p 3000:3000 --name todo-app todo-api'
      }
    }

    stage('Release') {
      steps {
        echo 'Pushing image to DockerHub...'
        script {
          def IMAGE_NAME = "sparsh300/todo-api"
          def IMAGE_TAG = "v1.0"
    
          withCredentials([usernamePassword(credentialsId: 'sparsh30', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh """
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
              docker tag todo-api ${IMAGE_NAME}:${IMAGE_TAG}
              docker tag todo-api ${IMAGE_NAME}:latest
              docker push ${IMAGE_NAME}:${IMAGE_TAG}
              docker push ${IMAGE_NAME}:latest
            """
          }
        }
      }
    }


    stage('Monitoring') {
      steps {
        echo 'Monitoring placeholder: implement Grafana/Prometheus/log alerts here.'
      }
    }
  }

  post {
    always {
      echo 'Cleaning up workspace...'
    }
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed. Please check the logs.'
    }
  }
}
