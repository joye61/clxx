/**
 * websocket客户端
 * 1、心跳检测
 * 2、响应超时
 * 3、断线重连
 * 4、首包机制
 */

// 消息遵循以下约定

// 发送方消息格式
// {
//   id: string;
//   data: any;
// }

// 响应方消息格式
// {
//   id: string;
//   data: any;
//   code: number;
//   message: string;
// }

export interface WsClientOption {
  // ws连接的协议
  protocols?: string | string[];
  // 响应超时时间
  timeout?: number;
  // 心跳频率
  pingRate?: number;
  // 消息的二进制数据类型
  binaryType?: BinaryType;
  // 消息是否以二进制格式发送
  sendAsBlob?: boolean;
  // 错误发生时触发
  onError?: (event: CloseEvent) => void;
  // 链接断开
  onDisconnect?: () => void;
}

// 消息发送之后回调
export type MessageCallback = (data: any) => void;

// WebSocket实例的唯一值
let WS_UNIQID = 0;
// 超时code
let TIMEOUT_CODE = -10000;

/**
 * WebSocket实例
 */
export class WsClient {
  // websocket客户端实例
  public ws: WebSocket;

  private messageId = 0;
  private wsKey: string;

  // 消息的发送缓存
  private sendedMap: Map<string, MessageCallback>;
  // 消息的接收缓存
  private listenerSet: Set<MessageCallback>;

  // ping的定时器
  private pingTimer?: number;

  constructor(public url: string, public option?: WsClientOption) {
    // 初始化本次连接的唯一key
    WS_UNIQID += 1;
    this.wsKey = `${Date.now().toString(32)}_${WS_UNIQID}`;

    // 初始化消息的临时存储
    this.sendedMap = new Map();
    this.listenerSet = new Set();

    // 默认参数
    let config: WsClientOption = {
      protocols: [],
      timeout: 30000,
      pingRate: 30000,
      sendAsBlob: false,
    };
    if (typeof option === "object") {
      config = { ...config, ...option };
    }
    this.option = config;
    // 创建websocket实例
    this.ws = new WebSocket(this.url, this.option.protocols);

    // 设置消息二进制类型
    if (this.option.binaryType && typeof this.option.binaryType === "string") {
      this.ws.binaryType = this.option.binaryType;
    }

    // 开始处理websocket的各种事件
    this.handleWsEvent();
  }

  /**
   * 处理websocket的事件
   */
  handleWsEvent() {
    this.ws.onclose = (event) => {
      // 4000代表的是正常断开，除此之外都是非正常断开
      if (event.code !== 4000) {
        this.option?.onDisconnect?.();
      }
      window.clearInterval(this.pingTimer);
      this.pingTimer = undefined;
    };

    // 发生错误时回调
    this.ws.onerror = (event) => {
      this.option?.onError?.(event as any);
    };

    // 接收消息回调
    this.ws.onmessage = async (event) => {
      // 转换数据格式为JSON对象
      const result = await this.data2Json(event.data);

      // 消息不存在，无效的消息
      if (!result.id) {
        return;
      }
      // 消息的code定义不存在，认为是服务端主动推送的
      if (typeof result.code === "undefined") {
        // 可能会存在多个监听器，逐一处理
        this.listenerSet.forEach((callback) => {
          callback(result);
        });
        return;
      }
      // 流程到此，则认为消息是响应
      this.sendedMap.get(result.id)?.(result);
      // 响应回调结束后，删除此发送记录
      this.sendedMap.delete(result.id);
    };

    // 发送ping包
    this.ws.onopen = () => {
      this.pingTimer = window.setInterval(() => {
        this.pingCheck();
      }, this.option?.pingRate);
    };
  }

  // 心跳检测
  async pingCheck() {
    const result = await this.sendMessage("ping");
    if (result.code === TIMEOUT_CODE) {
      this.close();
    }
  }

  /**
   * 关闭websocket链接
   */
  close(code = 4000) {
    this.ws.close(code);
  }

  /**
   * 监听消息
   * @param callback
   */
  listen(callback: MessageCallback) {
    if (typeof callback === "function") {
      this.listenerSet.add(callback);
    }
  }

  /**
   * 取消监听消息
   * @param callback
   */
  unlisten(callback?: MessageCallback) {
    if (typeof callback === "function") {
      this.listenerSet.delete(callback);
    }
    if (typeof callback === "undefined") {
      this.listenerSet.clear();
    }
  }

  /**
   * 创建唯一的消息ID，针对于发送
   * @returns
   */
  createMessageId() {
    this.messageId += 1;
    return `${this.wsKey}_${this.messageId}`;
  }

  /**
   * 将数据转换为JSON对象
   * @param data
   */
  async data2Json(data: string | Blob | ArrayBuffer) {
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    if (data instanceof Blob) {
      const result = await data.text();
      return JSON.parse(result);
    }
    if (data instanceof ArrayBuffer) {
      return new Promise((resolve) => {
        const blob = new Blob([data]);
        const reader = new FileReader();
        reader.readAsText(blob);
        reader.onload = () => {
          resolve(JSON.parse(reader.result as string));
        };
      });
    }
  }

  /**
   * 发送消息
   * @param message
   * @param callback
   * @returns
   */
  sendMessage(message: any, callback?: MessageCallback): Promise<any> {
    const id = this.createMessageId();
    const data = JSON.stringify({
      id,
      data: message,
    });

    if (this.option?.sendAsBlob) {
      // 如果消息以二进制格式发送
      this.ws.send(
        new Blob([data], {
          type: "application/json",
        })
      );
    } else {
      // 非二进制格式发送时默认发送JSON字符串
      this.ws.send(data);
    }

    // 超时的timer，如果未超时，则会被清理
    let timer: number | undefined = undefined;

    return Promise.race([
      // 超时逻辑
      new Promise((resolve) => {
        // 流程能走到定时器这里，说明一定没有被消耗
        timer = window.setTimeout(() => {
          // 首先删除未被消耗的回调
          this.sendedMap.delete(id);
          const response = {
            id,
            code: TIMEOUT_CODE,
            message: "Request Timeout",
          };
          callback?.(response);
          resolve(response);
        }, this.option?.timeout);
      }),

      // 非超时逻辑
      new Promise((resolve) => {
        if (typeof callback === "function") {
          this.sendedMap.set(id, (data) => {
            window.clearTimeout(timer);
            callback(data);
            resolve(data);
          });
        } else {
          this.sendedMap.set(id, (data) => {
            window.clearTimeout(timer);
            resolve(data);
          });
        }
      }),
    ]);
  }
}
