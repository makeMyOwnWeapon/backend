#!/bin/zsh

# 로컬에서 빌드
echo "Nest 애플리케이션 빌드 중..."
npm run build
if [ $? -ne 0 ]; then
  echo "빌드 과정에서 오류가 발생했습니다."
  exit 1
fi

# 압축 생성
echo "배포용 압축 파일 생성 중..."
zip -r app.zip dist node_modules .env.prod
if [ $? -ne 0 ]; then
  echo "압축 파일 생성 중 오류가 발생했습니다."
  exit 1
fi

# EC2로 파일 전송
echo "EC2 서버로 앱 전송 중..."
scp -i ../namanmu.pem app.zip ec2-user@ec2-54-180-247-241.ap-northeast-2.compute.amazonaws.com:/home/ec2-user/app/
if [ $? -ne 0 ]; then
  echo "EC2 서버로 파일 전송 중 오류가 발생했습니다."
  exit 1
fi

# 로컬에서 압축 파일 삭제
echo "로컬 압축 파일 삭제 중..."
rm app.zip
if [ $? -ne 0 ]; then
  echo "로컬 압축 파일 삭제 중 오류가 발생했습니다."
  exit 1
fi

# EC2 서버에 접속 및 앱 배포
echo "EC2 서버에 접속하여 앱 배포 진행 중..."
ssh -i ../"namanmu.pem" ec2-user@ec2-54-180-247-241.ap-northeast-2.compute.amazonaws.com << 'EOF'
cd app
if [ $? -ne 0 ]; then
  echo "디렉토리 변경 중 오류가 발생했습니다."
  exit 1
fi

unzip -o app.zip
if [ $? -ne 0 ]; then
  echo "압축 해제 중 오류가 발생했습니다."
  exit 1
fi

pm2 kill
if [ $? -ne 0 ]; then
  echo "PM2 프로세스 종료 중 오류가 발생했습니다."
  exit 1
fi

NODE_ENV=prod pm2 start ./dist/main.js --name "loa" -e err.log -o out.log
if [ $? -ne 0 ]; then
  echo "애플리케이션 시작 중 오류가 발생했습니다."
  exit 1
fi

sleep 5

echo "애플리케이션 정상구동 확인중..."
ENV_CHECK=$(curl -s http://localhost:3000/api/env)

if [ "$ENV_CHECK" != "prod" ]; then
  echo "애플리케이션 구동 실패($ENV_CHECK)"
  exit 1
else
  echo "애플리케이션 정상구동 완료."
fi
EOF

if [ $? -ne 0 ]; then
  echo "EC2 서버에서 명령 실행 중 오류가 발생했습니다."
  exit 1
fi

echo "배포 완료!"
