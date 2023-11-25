import React, { useState, useEffect } from 'react';
import { Button, Spin, Switch } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewPage from './NewPage';
import './App.css';

function App() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const switchStyle = {
    background: isSwitchOn ? 'white' : 'black',
    color: isSwitchOn ? 'black' : 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };
  const switchButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
    background: isSwitchOn ? 'black' : 'grey',
    color: isSwitchOn ? 'white' : 'black',
  };

  return (
    <Router>
      <div style={switchStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newpage" element={<NewPage />} />
        </Routes>

        <Switch
          style={switchButtonStyle}
          defaultChecked={isSwitchOn}
          onChange={(checked) => setIsSwitchOn(checked)}
        />
      </div>
    </Router>
  );
}

function Home() {
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (dataFetched) {
      navigate('/newpage');
    }
  }, [dataFetched, navigate]);

  const fetchData = () => {
    if (!dataFetched) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setDataFetched(true);
      }, 2000);
    }
  };

  return (
    <>
      <h1 className={`fade-in`}>
        <BarChartOutlined style={{ color: 'orange' }} /> Trendyol Verileri
      </h1>
      <Button
        type="primary"
        onClick={fetchData}
        disabled={loading}
        style={{ position: 'relative' }}
      >
        Verileri Getir
        <Spin
          spinning={loading}
          tip="..."
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Button>
    </>
  );
}

export default App;
