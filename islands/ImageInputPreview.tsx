import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export default function ImageInputPreview(props: { name: string }) {
  const [image, setImage] = useState<string | ArrayBuffer | null | undefined>(
    undefined,
  );

  const onChangeImage = (
    { currentTarget }: JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    setImage(undefined);

    if (!currentTarget.files || currentTarget.files.length < 1) {
      return;
    }

    const file = currentTarget.files[0];
    if (!file.type.match("image.*")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result);
    };
    reader.readAsDataURL(file);
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
        ? <img class="w-full object-contain object-center" src={image} />
        : ""}
    </div>
  );
}
