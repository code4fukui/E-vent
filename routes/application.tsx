import { Fragment } from "preact";
import Header from "../components/Header.tsx";
import ImageInputPreview from "../islands/ImageInputPreview.tsx";
import ApplicationForm from "../islands/ApplicationForm.tsx";

export default function Application() {
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント開催申請</h2>
        <ApplicationForm />
      </main>
    </Fragment>
  );
}
