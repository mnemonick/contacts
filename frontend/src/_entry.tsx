import ReactDOM from "react-dom/client";
import search from "./search.png?inline";
import { useCounterStore } from "./state";

function App() {
	const { count, increment, decrement } = useCounterStore();

	const perem = 22;

	return (
		<div style={{ background: "green" }}>
			<img src={search} />
		</div>
	);
}

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);
