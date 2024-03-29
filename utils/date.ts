export function formatDTS(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
}

export const dateToFormString = (date: Date) => {
  return `${date.getFullYear()}-${
    (date.getMonth() + 1).toString().padStart(2, "0")
  }-${(date.getDate()).toString().padStart(2, "0")}T${
    (date.getHours()).toString().padStart(2, "0")
  }:${(date.getMinutes()).toString().padStart(2, "0")}`;
};
