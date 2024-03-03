import { collect } from "$fresh/src/dev/mod.ts";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { dateToFormString } from "../utils/date.ts";

export default function ApplicationForm() {
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prevEventId, setPrevEventId] = useState<string>("");
  const [date, setDate] = useState<string>(dateToFormString(new Date()));
  const [placement, setPlacement] = useState<string>("");
  const [joinDeadline, setJoinDeadline] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const onChangeImage = async (
    { currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    setImage("");

    if (!currentTarget.files || currentTarget.files.length < 1) {
      return;
    }

    const file = currentTarget.files[0];
    if (!file.type.match("image.*")) return;

    const imageData = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("getContext failed: can't resize image");
      alert("画像の読み込みに失敗しました");
      return;
    }
    const landscape = canvas.width > canvas.height;
    const scale = landscape
      ? canvas.width / imageData.width
      : canvas.height / imageData.height;
    ctx.drawImage(
      imageData,
      0,
      0,
      imageData.width,
      imageData.height,
      landscape ? 0 : (canvas.width - imageData.width * scale) / 2,
      landscape ? (canvas.height - imageData.height * scale) / 2 : 0,
      landscape ? canvas.width : imageData.width * scale,
      landscape ? imageData.height * scale : canvas.height,
    );
    console.log(
      scale,
      landscape ? 0 : (canvas.width - imageData.width * scale) / 2,
      landscape ? (canvas.height - imageData.height * scale) / 2 : 0,
      landscape ? canvas.width : imageData.width * scale,
      landscape ? imageData.height * scale : canvas.height,
    );
    const resizedImageData = canvas.toDataURL("image/png");
    setImage(resizedImageData);
  };

  const submitApplication = async () => {
    setIsBusy(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("prevEventId", prevEventId);
    formData.set("date", date);
    formData.set("placement", placement);
    formData.set("joinDeadline", joinDeadline);
    formData.set("thumbnail", await (await fetch(image)).blob());

    const responce = await fetch("/api/event", {
      method: "POST",
      body: formData,
    });

    setIsBusy(false);
    if ((await responce.json()).success) {
      alert("イベント申請が完了しました");
    } else {
      alert("イベント申請が失敗しました");
    }
  };

  return (
    <form class="mx-auto flex flex-col gap-2">
      <label>
        イベントタイトル<br />
        <input
          class="ev-input"
          type="text"
          name="title"
          placeholder="イベントタイトルを入力"
          value={title}
          onInput={(e) => setTitle(e.currentTarget.value)}
          required
        />
      </label>
      <label>
        イベント詳細<br />
        <textarea
          class="w-full border-solid border-2 border-gray-500 px-4 py-2 rounded-2xl"
          type="text"
          name="description"
          cols={40}
          rows={5}
          placeholder="詳細を入力"
          value={description}
          onInput={(e) => setDescription(e.currentTarget.value)}
        >
        </textarea>
      </label>
      <label>
        前回のイベントID<br />
        <input
          class="ev-input"
          type="text"
          name="prevEventId"
          placeholder="(任意)前回のイベントid"
          value={prevEventId}
          onInput={(e) => setPrevEventId(e.currentTarget.value)}
        >
        </input>
      </label>
      <label>
        開催日時<br />
        <input
          class="ev-input"
          type="datetime-local"
          name="date"
          required
          value={date}
          onInput={(e) => setDate(e.currentTarget.value)}
        />
      </label>
      <label>
        開催場所<br />
        <input
          class="ev-input"
          type="text"
          name="placement"
          placeholder="場所を入力"
          value={placement}
          onInput={(e) => setPlacement(e.currentTarget.value)}
          required
        />
      </label>
      <label>
        参加締め切り日時<br />
        <input
          class="ev-input"
          type="datetime-local"
          name="joinDeadline"
          value={joinDeadline}
          onInput={(e) => {
            console.log(e.currentTarget.value);
            setJoinDeadline(e.currentTarget.value);
          }}
        />
      </label>
      <label>
        サムネイル写真<br />
        <div class="flex items-center justify-start">
          <div
            class="tooltip mr-4"
            data-tooltip="画像は1200x630ピクセルでリサイズされます"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z">
              </path>
              <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z">
              </path>
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            name="thumbnail"
            onInput={(event) => onChangeImage(event)}
          />
        </div>
        {image
          ? <img class="w-full my-4 object-contain object-center" src={image} />
          : ""}
      </label>
      <button
        type="button"
        class="ev-button"
        onClick={submitApplication}
        disabled={isBusy}
      >
        申請する
      </button>
    </form>
  );
}
