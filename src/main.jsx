import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './index.css'
import App from './App.jsx'

const stripePromise=loadStripe("pk_test_51RoOQJ4DaJCyFJBaDJ1YNYOBsBsyLTGaLLLuUsF4hKjZfC7RqvhmA6eq6xn0TRxtr7L4GzTDfkxTupnqkjzNHl1w00J8vQep1U")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
       <App />
    </Elements>
  </StrictMode>,
)
