import "./index.scss";
import React, { useRef, useState } from "react";
import { ScrollView } from "@";

export default function () {
  const [list, setList] = useState([1]);
  const isLoading = useRef(false);
  const [showLoading, setShowLoading] = useState(true);

  const loadMore = async () => {
    if (!showLoading) return;

    isLoading.current = true;
    return new Promise((resolve) => {
      window.setTimeout(() => {
        const num = list.length + 1;
        list.push(num);
        setList([...list]);
        resolve();
        isLoading.current = false;
        if (num > 5) {
          setShowLoading(false);
        }
      }, 800);
    });
  };

  return (
    <div className="ScrollView">
      <ScrollView
        onReachTop={(e)=>{
          console.log("reachTop", e);
        }}
        onReachBottom={(e) => {
          console.log("reachBottom", e);
          if (!isLoading.current) {
            loadMore();
          }
        }}
        showLoading={showLoading}
      >
        {list.map((item, index) => {
          return (
            <div className="content" key={index}>
              {item}
            </div>
          );
        })}
      </ScrollView>
    </div>
  );
}
