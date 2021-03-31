const valueDisplayConvert = (val, decimals, curr) =>
  (val / Math.pow(10, decimals)).toLocaleString("en-US", {
    style: "currency",
    currency: curr
  });

export default valueDisplayConvert;
