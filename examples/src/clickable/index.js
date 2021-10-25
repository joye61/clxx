import './index.scss';
import React from 'react';
import { Clickable } from '@';

export default function Index () {
  return (
    <div className="Touchable">
      <Clickable className="btntest">
        可点击元素
        <Clickable>内嵌可点击元素</Clickable>
        <Clickable bubble={false}>内嵌可点击元素 bubble=false</Clickable>
        <Clickable activeStyle={{ backgroundColor: 'green', color: 'cyan' }}>
          内嵌 activeStyle
        </Clickable>
        <Clickable
          bubble={false}
          activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
        >
          内嵌 activeStyle bubble=false
        </Clickable>
      </Clickable>

      <Clickable
        className="as"
        activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
      >
        activeStyle
      </Clickable>

      <Clickable
        disable
        className="as"
        activeStyle={{ backgroundColor: 'green', color: 'cyan' }}
      >
        activeStyle(禁用) disable=true
      </Clickable>
    </div>
  );
}
