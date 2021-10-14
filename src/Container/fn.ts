export const metaContent = {
  /**
   * 解析meta的content字段
   * @param content
   * @returns
   */
  parse(content: string): Record<string, string | number> {
    content = content.replace(/\s+|,$/g, "");
    if (!content) return {};
    const parts = content.split(",");
    const output: Record<string, string> = {};
    for (let part of parts) {
      const arr = part.split("=");
      output[arr[0]] = arr[1];
    }
    return output;
  },

  /**
   * 生成meta的content字段
   * @param data
   * @returns
   */
  stringify(data: Record<string, string | number>): string {
    const parts: string[] = [];
    for (let key in data) {
      const part = `${key}=${data[key]}`;
      parts.push(part);
    }
    return parts.join(", ");
  },
};
