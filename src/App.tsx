import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Terminal from "./components/Terminal/Terminal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Terminal />} />
      </Routes>
    </Router>
  );
}

export default App;
