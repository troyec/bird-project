import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import WaveformWithLabels from './components/WaveformWithLabels';
import ImageGallery from './components/ImageGallery';
import './index.css';
import { Header } from 'antd/es/layout/layout';
import { Pagination, Spin } from 'antd';



const FileUploadForm = () => {
    
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  // const [images, setImages] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalImages, setTotalImages] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [csvfile, setCsvfile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [randomStr, setRandomStr] = useState(null);
  const audioRef = React.createRef(null);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    if(audioRef.current){
      audioRef.current.src = URL.createObjectURL(event.target.files[0]);
    }
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
      setRandomStr(randomStr)
      const tasks = []
      setFilename(randomStr + '_' + selectedFile.name)
      chunks.map((chunk, index)=>{
        const data = new FormData();
        data.set('name', randomStr + '_' + selectedFile.name + '_' + index);
        data.set('chunks_total', chunks.length)
        data.set('full_name', randomStr + '_' +selectedFile.name)
        data.append('file', chunk);
        console.log(selectedFile.name + '_' + index)
        tasks.push(axios.post('http://192.168.1.200:5000/upload', data))
      })
      await Promise.all(tasks);
      axios.get('http://192.168.1.200:5000/merge',{
        params: {
          filename: randomStr + '_' +selectedFile.name,
          chunks_total: chunks.length
        }
      }).then(res=>{
        axios.get('http://192.168.1.200:5000/process_data',{
          params: {
            filename: randomStr + '_' +selectedFile.name,
            chunks_total: chunks.length
          }
        }).then(res=>{
          setResult(res.data.result)
          console.log('-------------------------------------------')
          console.log('result',result)
          // setImage(res.data.image)
          setCsvfile(res.data.csv)
          // console.log(res.data.csv)
        })
      }).catch(err=>{
        console.log(err)
      })

    }
  };


  const downloadCSVFile = () => {


    const decodedData = atob(csvfile);
    const utf8Data = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      utf8Data[i] = decodedData.charCodeAt(i);
    }
  

    const blob = new Blob([utf8Data], { type: 'text/csv;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename+'.csv';
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
    {/* 绘制base64编码的image图片 */}
      
    {/* {image && <WaveformWithLabels waveformImageUrl={image} labels={result} />} */}
    {result && <ImageGallery filename={filename} labels={result}/>}
        {/* 播放音频文件selectedFile */}
        {selectedFile && <div key={selectedFile}>
        <audio ref={audioRef} controls>
          <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type}  />
        </audio>
        </div>}
    {result && (<button onClick={downloadCSVFile}>下载结果文件</button>)}
    </div>

  );
};

export default FileUploadForm;


