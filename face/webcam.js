const video = document.getElementById('video')

//face-api불러오면 웹캠 실행 함수 샐행
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startVideo)

//웹캠 실행
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

// 얼굴 인식 및 표시
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const page1Div = document.getElementById('page1');
    page1Div.appendChild(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, detections);
    }, 100);
});

// "얼굴 추출" 버튼 클릭 이벤트 리스너
document.getElementById('to_img').addEventListener('click', async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    if (detections.length > 0) {
        const detection = detections[0];
        const { x, y, width, height } = detection.box;
        const faceCanvas = document.createElement('canvas');
        faceCanvas.width = width;
        faceCanvas.height = height;
        const faceCanvasCtx = faceCanvas.getContext('2d');
        faceCanvasCtx.drawImage(video, x, y, width, height, 0, 0, width, height);

        // 추출된 이미지를 표시
        const extractedImageDataURL = faceCanvas.toDataURL();
        const imgElement = document.createElement('img');
        imgElement.src = extractedImageDataURL;
        const extractImg = document.getElementById('img_data');
        extractImg.appendChild(imgElement);
    }
});