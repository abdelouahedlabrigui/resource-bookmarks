import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, Link
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import ConceptManager from './components/concepts/ConceptManager';
import DocumentManager from './components/documents/DocumentManager';
import MarksManager from './components/marks/MarksManager';
import CodeManager from './components/codes/CodeManager';
import CommandManager from './components/commands/CommandManager';

function App() {
  return (
    <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/concepts">Concepts</Link>            
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="navbar-brand" to="/documents">Documents</Link>  
              </li>
              <li className="nav-item">
                <Link className="navbar-brand" to="/marks">Marks</Link>  
              </li>
              <li className="nav-item">
                <Link className="navbar-brand" to="/codes">Codes</Link>  
              </li>
              <li className="nav-item">
                <Link className="navbar-brand" to="/commands">Command</Link>  
              </li>
            </ul>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path='/concepts' element={<ConceptManager />} />
            <Route path='/documents' element={<DocumentManager />} />
            <Route path='/marks' element={<MarksManager />} />
            <Route path='/codes' element={<CodeManager />} />
            <Route path='/commands' element={<CommandManager />} />

            <Route
              path="/"
              element={
                <div className="text-center">
                  <h1>Research Web App</h1>
                  <p className="lead">Use the navigation menu to explore information</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
  );
}

export default App;
