import { sangte } from "../lib/sangte";
import { useSangte } from "../hooks/useSangte";
import { useSangteActions } from "../hooks/useSangteActions";
import { useSangteValue } from "../hooks/useSangteValue";
import { SangteProvider } from "../contexts/SangteProvider";

const counterSangte = sangte(0, (prev) => ({
  increase() {
    return prev + 1;
  },
  decrease() {
    return prev - 1;
  },
}));

const textSangte = sangte("", undefined, {
  global: true,
});

const toggleSangte = sangte(false, (prev) => ({
  toggle() {
    console.log("setting to", !prev);
    prev = !prev;
  },
}));

function Counter() {
  const count = useSangteValue(counterSangte);
  const actions = useSangteActions(counterSangte);

  return (
    <div>
      <h3>Counter</h3>
      <p>{count}</p>
      <button onClick={actions.increase}>+1</button>
      <button onClick={actions.decrease}>-1</button>
    </div>
  );
}

function Input() {
  const [text, setText] = useSangte(textSangte);
  return (
    <div>
      <h3>Input</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

function Toggle() {
  const value = useSangteValue(toggleSangte);
  const actions = useSangteActions(toggleSangte);

  return (
    <div>
      <h3>Toggle</h3>
      <button onClick={actions.toggle}>{value ? "ON" : "OFF"}</button>
    </div>
  );
}

function Inheritance() {
  const boxStyle = {
    marginTop: "2rem",
    marginLeft: "2rem",
    border: "1px solid black",
    padding: "1rem",
  };

  return (
    <div>
      <Counter />
      <Counter />
      <Input />
      <Toggle />
      <div style={boxStyle}>
        <SangteProvider inheritSangtes={[toggleSangte]}>
          <Counter />
          <Counter />
          <Input />
          <Toggle />
          <div style={boxStyle}>
            <SangteProvider>
              <Counter />
              <Counter />
              <Input />
              <Toggle />
            </SangteProvider>
          </div>
        </SangteProvider>
      </div>
    </div>
  );
}

export default Inheritance;
