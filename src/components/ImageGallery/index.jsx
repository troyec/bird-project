import React, { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import axios from 'axios';
import WaveformWithLabels2 from '../WaveformWithLabels2';


const duration = 3;

const ImageGallery = (props) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);



  const fetchImages = async (page = 1, perPage = 1) => {
    setLoading(true);
    await axios.get('http://192.168.1.200:5000/images',{
      params: {
        filename: props.filename,
        page: page,
        perPage: perPage
      }}).then(res => {
        setImages(res.data.images);
        console.log('image',images[0])
        setTotalImages(res.data.total_images);
        console.log('Pagination',totalImages)
        // setUrl(`http://192.168.1.200:5000/download_image?filename=${images[0]}`);
        // console.log('url',url)

        setLoading(false);
      }).catch(err => {
        console.log(err)
      });
    
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setUrl(`http://192.168.1.200:5000/download_image?filename=${images[0]}`);
    console.log('url',url)
  }, [images]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : images && (
        <>
          {images.map((image, index) => (
            // <img key={index} src={url} alt={`Image ${index}`} style={{ maxWidth: '100%' }} />
            // labels
            <WaveformWithLabels2 imageUrl={url} labels={props.labels} key={index} page={currentPage}/>
            // <WaveformWithLabels2 imageUrl={url} labels={result.slice(index*duration,(index+1)*duration)} />
          ))}
          <Pagination current={currentPage} total={totalImages} defaultPageSize={1} onChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ImageGallery;