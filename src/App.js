
import './App.css';


import Dashboard from './components/Dashboard';
import ResponsiveAppBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <Dashboard/>
    </div>
  );
}

export default App;
