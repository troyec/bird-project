import React, { useState } from 'react';
import axios from 'axios';
import WaveformWithLabels from './components/WaveformWithLabels';
import './index.css';

const FileUploadForm = () => {
    
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  //文件分片大小
  const chunkSize = 20 * 1024


  const handleSubmit = async function(event){
    event.preventDefault();

    if (selectedFile) {
      console.log(selectedFile);
      const chunks = [];
      let startPos = 0;
      while(startPos < selectedFile.size){
        chunks.push(selectedFile.slice(startPos, startPos+chunkSize));
        startPos += chunkSize;
      }

      const randomStr = Math.random().toString().slice(2,8)
      const tasks = []
      chunks.map((chunk, index)=>{
        const data = new FormData();
        data.set('name', randomStr + '_' + selectedFile.name + '_' + index);
        data.set('chunks_total', chunks.length)
        data.set('full_name', randomStr + '_' +selectedFile.name)
        data.append('file', chunk);
        console.log(selectedFile.name + '_' + index)
        tasks.push(axios.post('/upload', data))
      })
      await Promise.all(tasks);
      axios.get('/merge',{
        params: {
          filename: randomStr + '_' +selectedFile.name,
          chunks_total: chunks.length
        }
      }).then(res=>{
        axios.get('/process_data',{
          params: {
            filename: randomStr + '_' +selectedFile.name,
            chunks_total: chunks.length
          }
        }).then(res=>{
          setResult(res.data.result)
          setImage(res.data.image)
        })
      }).catch(err=>{
        console.log(err)
      })

    }
  };

  return (
    <form onSubmit={handleSubmit} className='form'>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">上传文件</button>
      </div>
      
      {/* 绘制base64编码的image图片 */}
      
        {image && <WaveformWithLabels waveformImageUrl={image} labels={result} />}
        {/* 播放音频文件selectedFile */}
        {selectedFile && <audio controls>
          <source src={URL.createObjectURL(selectedFile)}  />
        </audio>}
      
    </form>
  );
};

export default FileUploadForm;