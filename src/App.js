import './App.css';
import React from 'react';
import { Layout} from 'antd';
import FileUploadForm from './components/FileUploadForm';


const { Header, Footer } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: 'red',
  // height: 64,
  // lineHeight: '64px',
  backgroundColor: '#efefef',
};
const contentStyle = {
  margin: '10px',
  borderRadius: '10px',
  // 边框颜色
  border: '2px solid #efefef',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'stretch',

  textAlign: 'center',
  minHeight: '600px',
  color: 'red',
  // backgroundColor: '#0958d9',
};
const footerStyle = {
  textAlign: 'center',
  color: 'red',
  // backgroundColor: '#4096ff',
};




function App() {
  return (
    <div className="App">
      <Header style={headerStyle}>鸟鸣检测与识别</Header>
      <div style={contentStyle}>
        <FileUploadForm />
      </div>
      <Footer style={footerStyle}>川大声学</Footer>
      
    </div>
  );
}

export default App;
