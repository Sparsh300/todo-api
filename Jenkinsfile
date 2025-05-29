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
        echo 'Pushing Docker image to DockerHub...'
        script {
          def image = "sparsh30/todo-api:latest"
          sh """
            echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
            docker tag todo-api ${image}
            docker push ${image}
          """
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
