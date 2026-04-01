import { Navigate, Route, Routes } from 'react-router-dom';
import Convo from './Convo.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat/:threadId?" element={<Convo />} />
    </Routes>
  )
}

export default App;