import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import './index.css'

const WaveformWithLabels2 = ({ imageUrl, labels, page }) => {
  const canvasRef = useRef(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = new Image();
    // image.src = `data:image/png;base64,${waveformImageUrl}`;
    image.src = imageUrl;
    labels = labels.slice((page-1)*3,page*3)
    image.onload = () => {
        canvas.width = window.innerWidth;
        canvas.height = 400;
        context.drawImage(image, 0, 0, window.innerWidth, 300);

        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.fillStyle = 'black';
        context.font = '18px Arial';
        // 启用抗锯齿
        context.imageSmoothingEnabled = true;
        // console.log('labels', labels)
        // labels = labels.labels

    labels.forEach((label, index) => {
        if(label !== 0){
        const segmentWidth = canvas.width / labels.length;
        const x = index * segmentWidth; // x 坐标
        const y1 = 0;
        const y2 = canvas.height;

        // 绘制线段
        context.beginPath();
        context.moveTo(x, y1);
        context.lineTo(x, y2);
        context.stroke();
        console.log(index)

        // 时间格式化
        const duration = moment.duration((page-1)*3+index, 'seconds');
        const time = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        context.fillText(label +' '+ time, x + 5, 350);
      }
      });
    };
  }, [imageUrl, labels]);

    return <div className='canvas-container '>
        <canvas ref={canvasRef} />
    </div>

};

export default WaveformWithLabels2;