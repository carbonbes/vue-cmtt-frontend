const сalculateSizes = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio),
  };
};

export default сalculateSizes;
