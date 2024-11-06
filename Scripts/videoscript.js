let video = document.getElementById('videoInput');
        let canvasOutput = document.getElementById('canvasOutput');
        let errorMsg = document.getElementById('errorMsg');
        let majorMelody = document.getElementById('majorMelody');
        let minorMelody = document.getElementById('minorMelody');
        let cap = null;
        let lastCategory = null;

        function onOpenCvReady() {
            console.log("OpenCV.js is ready");
            startCamera();
        }

        function onOpenCvError() {
            errorMsg.innerHTML = "Failed to load OpenCV.js. Check the console for more details.";
        }

        function startCamera() {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function(stream) {
                    video.srcObject = stream;
                    video.play();
                    video.onloadedmetadata = function(e) {
                        setTimeout(processVideo, 1000);
                    };
                })
                .catch(function(err) {
                    errorMsg.innerHTML = "Camera error: " + err.name + ": " + err.message;
                });
        }

        function processVideo() {
            if (!cv || !cv.Mat) {
                console.error("OpenCV.js is not fully loaded yet");
                return;
            }

            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let dst = new cv.Mat(video.height, video.width, cv.CV_8UC3);
            cap = new cv.VideoCapture(video);

            function processFrame() {
                try {
                    cap.read(src);
                    cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
                    
                    let coolCount = 0;
                    let warmCount = 0;
                    let totalPixels = dst.rows * dst.cols;

                    for (let i = 0; i < totalPixels; i++) {
                        let r = dst.data[i * 3];
                        let g = dst.data[i * 3 + 1];
                        let b = dst.data[i * 3 + 2];

                        // Simple hue calculation
                        let max = Math.max(r, g, b);
                        let min = Math.min(r, g, b);
                        let hue;

                        if (max === min) {
                            hue = 0; // achromatic
                        } else {
                            let d = max - min;
                            if (max === r) {
                                hue = (g - b) / d + (g < b ? 6 : 0);
                            } else if (max === g) {
                                hue = (b - r) / d + 2;
                            } else {
                                hue = (r - g) / d + 4;
                            }
                            hue /= 6;
                        }

                        // Classify as cool or warm
                        if (hue > 0.5 && hue < 0.83) { // Blue to Green
                            coolCount++;
                        } else {
                            warmCount++;
                        }
                    }

                    let category = coolCount > warmCount ? "Cool Colors" : "Warm Colors";
                    let color = coolCount > warmCount ? [255, 0, 0, 255] : [0, 0, 255, 255];

                    cv.putText(dst, category, new cv.Point(10, 50), cv.FONT_HERSHEY_SIMPLEX, 1, color, 2);
                    cv.imshow('canvasOutput', dst);

                    // Play audio based on category
                    if (category !== lastCategory) {
                        if (category === "Warm Colors") {
                            majorMelody.play();
                            minorMelody.pause();
                            minorMelody.currentTime = 0;
                        } else {
                            minorMelody.play();
                            majorMelody.pause();
                            majorMelody.currentTime = 0;
                        }
                        lastCategory = category;
                    }

                    requestAnimationFrame(processFrame);
                } catch (err) {
                    console.error("Error processing frame:", err);
                }
            }

            processFrame();
        }