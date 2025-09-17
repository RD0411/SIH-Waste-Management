// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import './App.css';


// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/*" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StateAnalysisDashboard from './components/StateAnalystDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/state-analysis-dashboard"
            element={
              <ProtectedRoute>
                <StateAnalysisDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}


// inside <Routes>:

export default App;
