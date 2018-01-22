pipeline {
  agent any
  parameters {
    string(defaultValue: '', description: 'kfir', name: 'THE_VERSION')
  }
  stages {
    stage('first+stage') {
      parallel {
        stage('first+stage') {
          steps {
            sh 'echo "helo 1"'
          }
        }
        stage('') {
          steps {
            sh 'echo "2"'
          }
        }
      }
    }
    stage('third') {
      steps {
        echo 'yesssss'
      }
    }
  }
  environment {
    lol = '1'
  }
}
