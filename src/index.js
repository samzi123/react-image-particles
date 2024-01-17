import React, { useRef, useEffect } from "react";

export default function ImageToParticle({ path, width=200, height=200, particleSize=2, numParticles=null }) {
    const canvasAsRef = useRef(null);

    useEffect(() => {
        const canvas = canvasAsRef.current;
        const ctx = canvas.getContext("2d");
        
        // whether to use the number of particles specified in NUM_PARTICLES or the number of pixels in the image
        const IS_NUM_PARTICLES_SET = numParticles !== null;
        const NUM_PARTICLES = numParticles !== null ? numParticles : 1000;

        // if we don't scale back the image back slightly, the particles disappear at the edges of the canvas
        const imageOffsetX = 0.2;
        const imageOffsetY = 0.2;
        
        canvas.width  = width;
        canvas.height = height;
        let particleArr = [];
        let mouseMoved = false;
        
        let mouse = {
            x: null,
            y: null,
            radius: 100,
        }
        
        window.addEventListener('mousemove', function(event){
            // mouse.x = event.x + canvas.clientLeft / 2;
            // mouse.y = event.y + canvas.clientTop / 2;
            const rect = canvas.getBoundingClientRect();

            mouse.x = event.clientX - rect.left
            mouse.y = event.clientY - rect.top
            mouseMoved = true;
        });
        
        function drawImage(data) {
            // set the radius based on the image size because the image may be resized and we want the effect to scale accordingly
            mouse.radius = (width + height) / 12;
            
            class Particle {
                constructor(x, y, color, size) {
                    this.x = x;
                    this.y = y;
                    this.color = color;
                    this.size = size;
                    this.baseX = this.x;
                    this.baseY = this.y;
                    this.density = (Math.random() * 30) + 1;
                }
        
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
        
                update() {
                    // collision detection
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
        
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
        
                    // add force to particle
                    if (distance < mouse.radius + this.size && mouseMoved) {
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        // move particle back to original position
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx / 15;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy / 15;
                        }
                    }
        
                    this.draw()
                }
            }
        
            function init() {
                particleArr = [];
                const numPixelsWithPositiveAlpha = data.data.filter((_, i) => i % 4 === 3 && data.data[i] > 128).length;
        
                for (let y = 0, y2 = data.height; y < y2; y++) {
                    for (let x = 0, x2 = data.width; x < x2; x++) {
                        if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                            // calculate if we wanna show this particle or not to reach the desired number of particles
                            if (IS_NUM_PARTICLES_SET && NUM_PARTICLES < numPixelsWithPositiveAlpha && Math.random() > NUM_PARTICLES / numPixelsWithPositiveAlpha) {
                                continue;
                            }
        
                            const positionX = (canvas.width * (imageOffsetX / 2)) + Math.floor((x / data.width) * canvas.width) * (1 - imageOffsetX);
                            const positionY = (canvas.height * (imageOffsetY / 2)) + Math.floor((y / data.height) * canvas.height) * (1 - imageOffsetY);
                            const index = (y * 4 * data.width) + (x * 4);
        
                            let color = "rgb(" + data.data[index] + "," + data.data[index + 1] + "," + data.data[index + 2] + ")";
                            particleArr.push(new Particle(positionX, positionY, color, particleSize));
                        }
                    }
                }
            }
        
            function animate() {
                requestAnimationFrame(animate);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        
                for (let i = 0; i < particleArr.length; i++) {
                    particleArr[i].update();
                }
        
                mouseMoved = false;
            }
        
            init();
            animate();
        
            // window.addEventListener('resize', function(){
            //     canvas.width = width;
            //     canvas.height = height;
            //     init();
            // });
        }
        
        /** @param {ImageBitmap} bitmap */
        function readImageData (bitmap) {
            const { width: w, height: h } = bitmap
            const _canvas = new OffscreenCanvas(w, h)
            const _ctx = _canvas.getContext('2d')
        
            _ctx.drawImage(bitmap, 0, 0)
            const imageData = _ctx.getImageData(0, 0, w, h)
        
            return imageData;
        }
        
        window.addEventListener('load', function() {        
            fetch(path)
                .then(r => r.blob())
                .then(createImageBitmap)
                .then(readImageData)
                .then(pixels => {
                    drawImage(pixels);
                });
        });
    }, []);

  return (
    <canvas ref={canvasAsRef} />
  );
}