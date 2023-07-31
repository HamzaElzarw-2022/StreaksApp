import ReactDOM from 'react-dom/client';
import App from './app';
import "bootstrap/dist/css/bootstrap.css";
import { UserProvider } from './contexts/userContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <UserProvider>
        <App />
    </UserProvider>
    
);