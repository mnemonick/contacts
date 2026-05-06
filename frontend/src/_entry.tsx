import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	return <h1>Hello</h1>;
}

let element = document.getElementById('root') as HTMLElement;
let root = ReactDOM.createRoot(element);

root.render(<App/>);

