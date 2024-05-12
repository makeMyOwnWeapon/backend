#!/bin/bash

# 대상 폴더 지정
folder_path="./test_images"

# 파일에 번호 붙여서 이름 변경
counter=1
for file in "$folder_path"/*; do
    mv "$file" "$folder_path/test-image-$counter.${file##*.}"
    ((counter++))
done

echo "파일 이름 변경 작업 완료."
