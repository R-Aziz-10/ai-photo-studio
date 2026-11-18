import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Catatan: sengaja tanpa <React.StrictMode> karena MediaPipe FaceMesh (WASM) bermasalah bila diinisialisasi dua kali.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
