import { Interpolation, Theme } from "@emotion/react";

export const style: Record<string, Interpolation<Theme>> = {
  container: {
    overflow: "auto",
    height: "100%",
    WebkitOverflowScrolling: "touch",
  },
  loading: [
    {
      paddingTop: '.15rem',
      paddingBottom: '.15rem',
    },
    {
      "> div": {
        width: '.3rem',
        height: '.3rem',
      },
      "> p": [
        {
          color: "#666",
          lineHeight: 1,
        },
        {
          marginLeft: '.16rem',
          fontSize: '.24rem',
        },
      ],
    },
  ],
};
