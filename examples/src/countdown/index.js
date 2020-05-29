import React, { useEffect, useState } from 'react';
import { Countdown } from '@';

export default function () {
  const [show1, setShow1] = useState('');
  const [show2, setShow2] = useState('');
  const [show2Closed, setShow2Close] = useState(false);
  const [show3, setShow3] = useState('');

  useEffect(() => {
    const cd1 = new Countdown({
      remain: 1000,
      format: 'his',
      onUpdate(result) {
        setShow1(() => `${result.h}时${result.i}分${result.s}秒`);
      },
    });
    cd1.start();

    const cd2 = new Countdown({
      remain: 10,
      format: 's',
      onUpdate(result) {
        setShow2(() => `${result.s}秒`);
      },
      onEnd() {
        setShow2Close(() => true);
      },
    });
    cd2.start();

    const cd3 = new Countdown({
      remain: 259205,
      format: 'dhis',
      onUpdate(result) {
        setShow3(() => `${result.d}天${result.h}时${result.i}分${result.s}秒`);
      },
    });
    cd3.start();

    return ()=>{
      cd1.stop();
      cd2.stop();
      cd3.stop();
    }
  }, []);

  return (
    <div>
      <p>格式：his，总时长：1000秒</p>
      <p style={{ color: 'red' }}>{show1}</p>
      <p>格式：s，总时长：10秒</p>
      <p style={{ color: 'red' }}>
        {show2Closed ? (
          <span style={{ color: 'green' }}> 已触发结束事件</span>
        ) : (
          show2
        )}
      </p>
      <p>格式：s，总时长：259200秒</p>
      <p style={{ color: 'red' }}>{show3}</p>
    </div>
  );
}
