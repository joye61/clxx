import Ticker from "../ticker";

const movement = {
  /**
   * Scroll的上下文
   */
  context: null,

  /**
   * 帧频计时器
   * @type {Ticker}
   */
  ticker: null,

  /**
   * 当前滚动速度
   * @type {number}
   */
  speed: null,

  /**
   * 当前弹力
   * @type {number}
   */
  elastic: 0,

  /**
   * 当前位置
   * @type {number}
   */
  position: 0,

  /**
   * 状态定义，只有内容超出正常容器滚动范围才会出现反向弹力
   * @type {number}
   *
   * 0：完全静止状态：不受控，速度为0，无弹力,
   * 1：手指滑动状态: 受控，无弹力
   * 2：滑动结束，惯性滚动状态：不受控，速度不为0，无弹力
   * 3：手指滑动状态: 受控，有弹力
   * 4: 滑动结束，惯性滚动状态：不受控，有弹力
   */
  state: 0,

  /**
   * 初始化逻辑
   * @param context ScrollView
   */
  initialize(context, onUpdate = () => {}) {
    this.context = context;
    this.onUpdate = onUpdate;
    this.ticker = new Ticker();
    this.moveHandler = this.move.bind(this);
    this.ticker.add(this.moveHandler);
    return this;
  },

  /**
   * 销毁运动实例
   */
  destroy() {
    this.ticker.remove(this.moveHandler);
    this.ticker.destroy();
  },

  /**
   * 滚动逻辑
   */
  move() {
    this.checkState();
    switch (this.state) {
      case 0:
        // 静止状态什么都不需要做
        // this.state0();
        break;
      case 1:
        this.state1();
        break;
      case 2:
        this.state2();
        break;
      case 3:
        this.state3();
        break;
      case 4:
        this.state4();
        break;
      default:
        break;
    }
  },

  /**
   * 更新当前位置
   */
  update() {
    // 新位置等于当前位置加上速度的值
    this.position += this.speed;

    // 惯性状态(非受控状态)不能突破临界值
    if (this.state === 2) {
      if (this.position > this.context.scrollRange[1]) {
        this.position = this.context.scrollRange[1];
      }
      if (this.position < this.context.scrollRange[0]) {
        this.position = this.context.scrollRange[0];
      }
    }
    if (this.state === 4) {
      if (this.position <= this.context.scrollRange[1]) {
        this.position = this.context.scrollRange[1];
      }
      if (this.position >= this.context.scrollRange[0]) {
        this.position = this.context.scrollRange[0];
      }
    }

    // 更新弹力
    if (this.position > this.context.scrollRange[1]) {
      this.elastic = this.context.scrollRange[1] - this.position;
    } else if (this.position < this.context.scrollRange[0]) {
      this.elastic = this.context.scrollRange[0] - this.position;
    } else {
      this.elastic = 0;
    }

    // 更新DOM
    this.onUpdate(this.position);
  },

  state0() {
    // nothing todo
  },

  state1() {
    this.speed =
      this.context.handler.currentCoordinate -
      this.context.handler.lastCoordinate;
    this.context.handler.updatePoint();
    this.update();
  },

  state2() {},
  state3() {},
  state4() {},

  /**
   * 判断是否有弹力
   */
  hasElastic() {
    if (
      this.position < this.context.scrollRange[0] ||
      this.position > this.context.scrollRange[1]
    ) {
      return true;
    }

    return false;
  },

  /**
   * 获取当前的状态
   */
  checkState() {
    // state = 0
    if (
      !this.hasElastic() &&
      !this.context.handler.isControl &&
      this.speed === 0
    ) {
      this.state = 0;
    }

    // state = 1
    else if (!this.hasElastic() && this.context.handler.isControl) {
      this.state = 1;
    }

    // state = 2
    else if (
      !this.hasElastic() &&
      !this.context.handler.isControl &&
      this.speed !== 0
    ) {
      this.state = 2;
    }

    // state = 3
    else if (this.hasElastic() && this.context.handler.isControl) {
      this.state = 3;
    }

    // state = 4
    else if (this.hasElastic() && !this.context.handler.isControl) {
      this.state = 4;
    }
  }
};

export default movement;
