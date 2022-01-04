export const сalculateAspectRatio = (
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight
) => {
  let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
};
