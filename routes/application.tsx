import { Fragment } from "preact";
import Header from "../components/Header.tsx";

export default function Application() {
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント開催申請</h2>
        <form method="post" class="mx-auto flex flex-col gap-2">
          <input
            class="ev-input"
            type="text"
            name="title"
            placeholder="イベントタイトルを入力"
          >
          </input>
          <input
            class="ev-input"
            type="text"
            name="description"
            placeholder="詳細を入力"
          >
          </input>
          <input
            class="ev-input"
            type="date"
            name="date"
          >
          </input>
          <input
            class="ev-input"
            type="text"
            name="placement"
            placeholder="場所を入力"
          >
          </input>
          <button class="ev-button">
            申請する
          </button>
        </form>
      </main>
    </Fragment>
  );
}
