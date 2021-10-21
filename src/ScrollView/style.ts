import { Interpolation, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";

export const style: Record<string, Interpolation<Theme>> = {
  container: {
    overflow: "auto",
    height: "100%",
    WebkitOverflowScrolling: "touch",
  },
  loading: [
    adaptive({
      paddingTop: 15,
      paddingBottom: 15,
    }),
    {
      "> div": adaptive({
        width: 30,
        height: 30,
      }),
      "> p": [
        {
          color: "#666",
          lineHeight: 1,
        },
        adaptive({
          marginLeft: 16,
          fontSize: 24,
        }),
      ],
    },
  ],
};
