// 自增回调索引
let callbackIndex = 0;

export default function(namespace, api, param) {
  let url = `chelunJSBridge://${namespace}/${api}`;

  // 如果没有参数选项，直接发送请求
  if (!param || typeof param !== "object") {
    sendRequest(url);
    return;
  }

  let hashIndex = undefined;
  let pairs = [];

  for (let key in param) {
    if (!param.hasOwnProperty(key)) {
      continue;
    }
    if (typeof param[key] === "function") {
      let callbackIndex = generateIndex(param[key]);
      if (key === "callback") {
        hashIndex = callbackIndex;
      } else {
        pairs.push(`${encodeURIComponent(key)}=${callbackIndex}`);
      }
      continue;
    }

    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
  }

  // 判断是否有参数
  if (pairs.length > 0) {
    url += `?${pairs.join("&")}`;
  }

  // 判断是否有hash统一回调
  if (hashIndex !== undefined && typeof hashIndex === "number") {
    url += `#${hashIndex}`;
  }

  sendRequest(url);
}

function generateIndex(callback) {
  window[`__MCL_CALLBACK_${callbackIndex}`] = callback;
  return (callbackIndex += 1);
}

function sendRequest(url) {
  const temp = document.createElement("iframe");
  document.body.appendChild(temp);
  temp.style.display = "none";
  temp.src = url;
  temp.onload = () => {
    temp.remove();
  };
  window.setTimeout(() => {
    temp.remove();
  }, 0);
}
