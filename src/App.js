import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Button,  Divider, Layout} from 'antd';
import FileUploadForm from './FileUploadForm';


const { Header, Footer, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: 'red',
  // height: 64,
  // lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '400px',
  color: 'red',
  // backgroundColor: '#0958d9',
};
const footerStyle = {
  textAlign: 'center',
  color: 'red',
  // backgroundColor: '#4096ff',
};
const containerStyle = {
  minHeight: '100vh' ,
  // backgroundColor:'#4096ff'
};
const uploadStyle = {
  height:'200px'
}




function App() {

  return (
    <div className="App">
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={headerStyle}>header</Header>
        <Divider/>
        <Content style={contentStyle}>
  
          <FileUploadForm />
        </Content>
        <Divider/>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
      
    </div>
  );
}

export default App;
