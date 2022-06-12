import { SangteProvider } from "../contexts/SangteProvider";
import { useSangte } from "../hooks/useSangte";
import { useSangteSelector } from "../hooks/useSangteSelector";
import { useSangteValue } from "../hooks/useSangteValue";
import { sangte } from "../lib/sangte";

const counterSangte = sangte(0, undefined, {
  key: "counter",
});

const userSangte = sangte(
  {
    id: 1,
    username: "velopert",
  },
  undefined,
  {
    key: "user",
  }
);

function Child() {
  const [counter, setCounter] = useSangte(counterSangte);
  const username = useSangteSelector(userSangte, (user) => user.username);

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter((prev) => prev + 1)}>+1</button>
      <div>{username}</div>
    </div>
  );
}

function Hydration() {
  return (
    <SangteProvider
      dehydratedState={{
        counter: 5,
        user: {
          id: 2,
          username: "velopert2",
        },
      }}
    >
      <Child />
    </SangteProvider>
  );
}

export default Hydration;
