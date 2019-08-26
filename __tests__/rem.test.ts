import {rem} from "../src/rem";

test("验证当前自适应正确性", ()=>{
  rem(750);
  
  expect(document.documentElement.style).not.toBeNull();
})