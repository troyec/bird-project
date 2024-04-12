import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
    
  const [selectedFile, setSelectedFile] = useState(null);

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
        tasks.push(axios.post('/process_data', data))
      })
      await Promise.all(tasks);
      // axios.get('/merge',{
      //   params: {
      //     filename: randomStr + '_' +selectedFile.name,
      //     chunks_total: chunks.lengthß
      //   }
      // })

      // const formData = new FormData();
      // formData.append('file', selectedFile);
      

      // try {
      //   const res = await axios.post('/process_data',formData);
      //   console.log(res);
      // } catch (error) {
      //   console.error(error);
      // }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">上传文件</button>
    </form>
  );
};

export default FileUploadForm;