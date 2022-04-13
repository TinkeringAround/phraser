export const copyToClipboard = (text: string) => {
  const clipBoardElement = document.querySelector(
    "#selection"
  ) as HTMLSpanElement;
  clipBoardElement.innerText = text;
};

export const copyFromClipboard = () => {
  const clipBoardElement = document.querySelector(
    "#selection"
  ) as HTMLSpanElement;
  return clipBoardElement.innerText;
};
