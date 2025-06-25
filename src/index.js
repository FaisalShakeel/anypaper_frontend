import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { OrderProvider } from './contexts/OrderContext';
import 'react-toastify/dist/ReactToastify.css';
import { StudentSignUpLoginProvider } from './contexts/StudentSignUpLoginContext';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { StudentPriceCalculationProvider } from './contexts/StudentPriceCalculationContext';
import { WriterPriceCalculationProvider } from './contexts/WriterPriceCalculationContext';
import {EditorProvider} from "./contexts/EditorContext";
import {WriterProvider} from "./contexts/WriterContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <OrderProvider>
      <StudentPriceCalculationProvider>
        <WriterPriceCalculationProvider>
          <AuthProvider>
            <StudentSignUpLoginProvider>
              <SocketProvider>
                  <EditorProvider>
                <WriterProvider>
                  <App />
                </WriterProvider>

                </EditorProvider>

                
              </SocketProvider>
            </StudentSignUpLoginProvider>
          </AuthProvider>
        </WriterPriceCalculationProvider>
      </StudentPriceCalculationProvider>
    </OrderProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
