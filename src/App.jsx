import { Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Series from './pages/Series';
import { useSelector } from 'react-redux';

function App() {
  const { menuMinimized } = useSelector((state) => state.ui);

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`content ${menuMinimized ? "content-minimized" : "content-expanded"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series/:id" element={<Series />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
