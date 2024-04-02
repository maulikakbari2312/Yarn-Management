const PanelContainer = {
  baseStyle: {
    p: "30px 15px",
    minHeight: "calc(100vh - 123px)",
    '@media (max-width: 768px)': {
      p: "30px 0px",
    },
  },
};

export const PanelContainerComponent = {
  components: {
    PanelContainer,
  },
};
