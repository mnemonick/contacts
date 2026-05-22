import ReactDOM from "react-dom/client";
import search from "./search.png?inline";
import { useCounterStore } from "./state";
import {Switch, Route} from 'wouter';

function Home() {
	return (
		<div>HOME</div>
	)
}

function App() {
	const perem = 22;

	return (
		<Switch>
	 		<Route path="/home" component={Home} />
	 		<Route>here</Route>
	 	</Switch>
	);
}

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);
