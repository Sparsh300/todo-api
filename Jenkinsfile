pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')  // optional if using SonarCloud later
        DOCKER_IMAGE = 'todo-api'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building project...'
                sh 'docker build -t $DOCKER_IMAGE .'
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
                echo 'Running SonarQube Analysis...'
                withSonarQubeEnv('MySonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Security') {
            steps {
                echo 'Scanning for vulnerabilities...'
                sh 'npm install -g snyk'
                sh 'snyk test || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Docker (local)...'
                sh 'docker stop todo-api || true && docker rm todo-api || true'
                sh 'docker run -d -p 3000:3000 --name todo-api $DOCKER_IMAGE'
            }
        }

        stage('Release') {
            steps {
                echo 'Tagging release...'
                sh 'git tag v1.0.0 || true'
                sh 'git push origin v1.0.0 || true'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Pretending to monitor the app...'
                sh 'curl -f http://localhost:3000/tasks || true'
            }
        }
    }
}
