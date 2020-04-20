pipeline {
  agent {
    kubernetes {
      // this label will be the prefix of the generated pod's name
      label 'jenkins-agent-frontend'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    component: ci
spec:
  containers:
    - name: docker
      image: twalter/maven-docker
      command:
        - cat
      tty: true
      volumeMounts:
        - mountPath: /var/run/docker.sock
          name: docker-sock
    - name: kubectl
      image: lachlanevenson/k8s-kubectl:v1.14.0 # use a version that matches your K8s version
      command:
        - cat
      tty: true
  volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
"""
    }
  }

  stages {
    stage('Git Clone') {
      steps {
          checkout scm
      }
    }

    stage('Build image') {
      steps {
        container('docker') {

          sh '''
          env && docker build -t mitalisalvi/webapp-frontend:${GIT_COMMIT} .
          '''
        }
      }
    }

    stage('Push image') {
      steps {
        container('docker') {
          sh '''
          docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}
          docker push mitalisalvi/webapp-frontend:${GIT_COMMIT}
          '''
        }
      }
    }

    stage('Rolling upgrade deployment') {
    steps {
      container('kubectl') {
      sh '''
      kubectl -n ui set image deployment/frontend webapp-frontend=mitalisalvi/webapp-frontend:${GIT_COMMIT} --record
      '''
        }
    }
  }
  }
}
