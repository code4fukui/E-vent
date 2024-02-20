import { useSignal } from "@preact/signals";
import Header from "../components/Header.tsx";
import { Fragment } from "preact";

export default function Home() {
  const count = useSignal(3);
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント一覧</h2>
      </main>
    </Fragment>
  );
}
