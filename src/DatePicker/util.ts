export function prefix0(numLike: number | string) {
  let num: number;
  if (typeof numLike === "number") {
    num = numLike;
  } else {
    num = parseInt(numLike, 10);
  }

  return num < 10 ? `0${num}` : num;
}
