// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import Button from '@mui/material/Button';
import { useState } from 'react';
import buttonImage from './assets/IceCappSolo.png';
//import { pink } from '@mui/material/colors';

function MyButton() {

  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    alert('I told you not to press me! This is thee ' + count + ' time you pressed me!');
  }

  return (
    <Button variant="contained" color="primary" onClick={handleClick}> 
    <img src = {buttonImage} alt = "Button Icon" style={{ width: '150px', height: '100px'}}/>
    Ice Cappucino </Button>
  );
}

function AboutPage() {
  return (
    <div>
      <h1>Drinks:</h1>
      <p>Order to your hearts desire, just as long you have enough cash *insert smiley face*</p>
    </div>
  );
}

export default function MyApp() {
  return (

    <div style={{backgroundColor: 'lightblue', padding: '20px'}}>
      <h1>Hermes (Not to be confused with Hermes Express)</h1>
      <AboutPage/>
      <MyButton />
    </div>
  );
}
