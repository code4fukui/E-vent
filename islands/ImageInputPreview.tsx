import { useState } from "preact/hooks";
import { Fragment, JSX } from "preact/jsx-runtime";

export default function ImageInputPreview(props: { name: string }) {
  const [image, setImage] = useState<string>(
    "",
  );

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

  return (
    <Fragment>
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
          name={props.name}
          onInput={(event) => onChangeImage(event)}
        />
      </div>
      {image
        ? <img class="w-full my-4 object-contain object-center" src={image} />
        : ""}
    </Fragment>
  );
}
