import React, { useEffect, useState } from 'react';
import { Pagination, Spin } from 'antd';
import WaveformWithLabels2 from '../WaveformWithLabels2';
import Store from '../../store';
import api, {baseURL} from '../../api/api';


// 该组件用于分页展示图片

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  // 获取后端图片
  const fetchImages = async (page = 1, perPage = 1) => {
    setLoading(true);
    await api.get('/images',{
      params: {
        filename: Store.filename,
        page: page,
        perPage: perPage
      }}).then(res => {
        setImages(res.data.images);
        console.log('image',images[0])
        setTotalImages(res.data.total_images);

        setLoading(false);
      }).catch(err => {
        console.log(err)
      });
    
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage,Store.labels]);

  // 单独设置img标签的src
  useEffect(() => {
    setUrl(`${baseURL}/download_image?filename=${images[0]}`);
  }, [images]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) :  images && (
        <>
          {images.map((image, index) => (

            <WaveformWithLabels2 imageUrl={url}  key={index} page={currentPage}/>

          ))}
          <Pagination current={currentPage} total={totalImages} defaultPageSize={1} onChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ImageGallery;