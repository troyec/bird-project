import React, { useState } from 'react';
import Store from '../../store';
import api from '../../api/api';
import ImageGallery from '../ImageGallery';
import './index.css';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const FileUploadForm = () => {
    
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [csvfile, setCsvfile] = useState(null);
  const audioRef = React.createRef(null);

// 处理点击事件
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    if(audioRef.current){
      audioRef.current.src = URL.createObjectURL(event.target.files[0]);
    }
  };


  //文件分片大小
  const chunkSize = 20 * 1024

// 处理上传事件
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
      // 生成随机字符串，用于文件名
      const randomString = Math.random().toString().slice(2,8)
      // 设置全局文件名
      Store.setFilename(randomString + '_' + selectedFile.name)
      console.log('Store.filename',Store.filename)
      // 文件分片上传
      const tasks = []
      chunks.forEach((chunk, index)=>{
        const data = new FormData();
        data.set('name', Store.filename + '_' + index);
        data.set('chunks_total', chunks.length)
        data.set('full_name', Store.filename)
        data.append('file', chunk);
        tasks.push(api.post('/upload', data))
      })
      // 执行分片上传
      await Promise.all(tasks);
      // 调用合并接口，合并文件
      api.get('/merge',{
        params: {
          filename: Store.filename,
          chunks_total: chunks.length
        }
      }).then(res=>{
        api.get('/process_data',{
          params: {
            filename: Store.filename,
            chunks_total: chunks.length
          }
        }).then(res=>{
          // 后端返回标签和csv文件
          Store.setLabels(res.data.result)
          console.log('Store.labels',Store.labels)
          setResult(res.data.result)
          setCsvfile(res.data.csv)
        })
      }).catch(err=>{
        console.log(err)
      })

    }
  };

  // 下载csv文件
  const downloadCSVFile = () => {

    // 处理传输编码
    const decodedData = atob(csvfile);
    const utf8Data = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      utf8Data[i] = decodedData.charCodeAt(i);
    }
  
    const blob = new Blob([utf8Data], { type: 'text/csv;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = Store.filename+'.csv';
    link.click();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className='form' >
      <div>
        <input type="file" onChange={handleFileChange}  />
        <button type="submit">上传文件</button>
        
      </div>
      
      
    </form>

    {result && <ImageGallery result={result}/>}

    {/* 播放音频文件selectedFile */}
    {selectedFile && <div key={selectedFile}>
    <audio ref={audioRef} controls>
      <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type}  />
    </audio>
    </div>}

    {result && (<Button icon={<DownloadOutlined />} type="primary"    onClick={downloadCSVFile}>下载结果文件</Button>)}
    </div>

  );
};

export default FileUploadForm;


