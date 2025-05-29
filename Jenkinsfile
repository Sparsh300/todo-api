pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')
    DOCKER_USERNAME = credentials('sparsh30') // Optional: if you want to reference it elsewhere
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        echo '🔧 Building project...'
        sh 'docker build -t todo-api .'
      }
    }

    stage('Test') {
      steps {
        echo '✅ Running tests inside Docker...'
        sh 'docker run --rm todo-api npm test'
      }
    }

    stage('Code Quality') {
      steps {
        echo '🔍 Running SonarCloud analysis...'
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
        echo '🛡️ Running security audit...'
        sh 'docker run --rm todo-api npm audit --audit-level=moderate || true'
      }
    }

    stage('Deploy') {
      steps {
        echo '🚀 Deploying Docker container...'
        sh 'docker rm -f todo-app || true'
        sh 'docker run -d -p 3000:3000 --name todo-app todo-api'
      }
    }

    stage('Release') {
      steps {
        echo '📦 Releasing: Tagging and pushing Docker image to DockerHub...'
        withCredentials([usernamePassword(
          credentialsId: 'sparsh30',
          usernameVariable: 'DOCKER_USERNAME',
          passwordVariable: 'DOCKER_PASSWORD'
        )]) {
          sh '''
            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
            docker tag todo-api "$DOCKER_USERNAME/todo-api:latest"
            docker push "$DOCKER_USERNAME/todo-api:latest"
          '''
        }
      }
    }

    stage('Monitoring') {
      steps {
        echo '📈 Running post-deployment monitoring...'
        script {
          try {
            sh '''
              docker run -d -p 3001:3000 --name todo-monitor todo-api
              sleep 5
              curl --fail http://localhost:3001/tasks
            '''
            echo '✅ Health check passed!'
          } catch (err) {
            echo '❌ Health check failed!'
            sh 'docker logs todo-monitor || true'
            error("🚫 Stopping pipeline due to failed health check.")
          } finally {
            sh 'docker rm -f todo-monitor || true'
          }
        }
      }
    }
  }

  post {
    always {
      echo '🧹 Cleaning up...'
    }
    success {
      echo '🎉 Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed.'
    }
  }
}
