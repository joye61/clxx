import './index.scss';
import React from 'react';
import { PrivacyContent } from '@';

export default function () {
  return (
    <div className="Privacy">
      <div className="item">
        <p>
          134<strong>56567</strong>657（手机号）
          <br />
          <i>包含模式：从第3位到第7位</i>
        </p>
        <p>
          <PrivacyContent start={3} end={7} type="include">
            13456567657
          </PrivacyContent>
        </p>
      </div>
      <div className="item">
        <p>
          <strong>42028</strong>1199509164<strong>579</strong>（身份证号）
          <br />
          <i>排除模式：排除开头5位和结尾3位</i>
        </p>
        <p>
          <PrivacyContent start={5} end={3} type="exclude">
            420281199509164579
          </PrivacyContent>
        </p>
      </div>
    </div>
  );
}
