import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

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
    <div>
      <input
        type="file"
        accept="image/*"
        name={props.name}
        onInput={(event) => onChangeImage(event)}
      />
      {image
        ? <img class="w-full my-4 object-contain object-center" src={image} />
        : ""}
    </div>
  );
}
