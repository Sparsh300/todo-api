pipeline {
  agent any

  environment {
    SONAR_TOKEN = credentials('sonar-token')  
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
            docker run --rm todo-api npm run test -- --coverage
            docker run --rm todo-api npx sonarqube-scanner \
              -Dsonar.projectKey=Sparsh300_todo-api \
              -Dsonar.organization=parsh300 \
              -Dsonar.sources=. \
              -Dsonar.exclusions=**/tests/** \
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
              -Dsonar.host.url=https://sonarcloud.io \
              -Dsonar.token=$SONAR_TOKEN
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
        echo 'Release step (e.g., versioning, tagging, pushing image to Docker Hub)...'
        // Add release logic here
      }
    }

    stage('Monitoring') {
      steps {
        echo 'Monitoring stub (Add Prometheus/Grafana, logs, alerts, etc.)'
        // Add actual monitoring logic here if needed
      }
    }
  }

  post {
    always {
      echo 'Cleaning up...'
    }
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
 
