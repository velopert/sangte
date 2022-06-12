import { SangteProvider } from "../contexts/SangteProvider";
import { useSangteValue } from "../hooks/useSangteValue";
import { sangte } from "../lib/sangte";

const textSangte = sangte("default text");

function Child() {
  const text = useSangteValue(textSangte);
  return <h1>{text}</h1>;
}

function Initial() {
  return (
    <SangteProvider
      initialize={(initializer) => {
        initializer.set(textSangte, "Hello World");
      }}
    >
      <Child />
    </SangteProvider>
  );
}

export default Initial;
