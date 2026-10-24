import colors from "#/utils/colors.ts";

export default function () {
  const styles = `
		* {
			box-sizing: border-box;
		}

		body {
			background: ${colors.main};
		}

		::-webkit-scrollbar {
		  width: 8px;
		}
		
		@media (pointer: coarse) {
			* {
				scrollbar-width: thin;						
			}
		}

		::-webkit-scrollbar-track {
			background: ${colors.scroll.background};
		}

		@media (max-width: 1023px) {
			::-webkit-scrollbar {
				width: 4px;
			}
		}

		::-webkit-scrollbar-thumb {
			background: ${colors.scroll.thumb};
			border-radius: 4px;
		}

		section {
			opacity: 0;
			transform: translateY(60px) scale(0.96);
			transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
			will-change: opacity, transform;
		}

		/* Custom tags are inline by default: make everything block except real inline elements. */
		:not(html):not(head):not(script):not(b):not(span):not(i):not(a):not(em):not(strong):not(del):not(li):not(table):not(thead):not(tr):not(td):not(th):not(tbody):not(term) {
			display: block;
		}
		
		term {
			display: inline-block;
			border-radius: 5px;
			background: ${colors.term.background};
			border: 1px solid ${colors.border.strong};
			color: ${colors.term.text};
			padding: 0 4px;
			margin-bottom: 2px;
			margin-bottom: 2px;
		}

		a {
			color: ${colors.link.text};
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		@keyframes appear {
			to {
				opacity: 1;
			}
		}

		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes electron-v {
			0% { transform: translateY(-16px); opacity: 0; }
			4% { opacity: 0.55; }
			96% { opacity: 0.55; }
			100% { transform: translateY(calc(100cqh + 16px)); opacity: 0; }
		}

		@keyframes electron-h {
			0% { transform: translateX(-16px); opacity: 0; }
			4% { opacity: 0.45; }
			96% { opacity: 0.45; }
			100% { transform: translateX(calc(100cqw + 16px)); opacity: 0; }
		}
	`;

  return (
    <style href="global-styles" precedence="reset">
      {styles}
    </style>
  );
}
