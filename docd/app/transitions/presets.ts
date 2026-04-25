export type DocdTransitionName =
  | "fade"
  | "rightToLeft"
  | "leftToRight"
  | "upToDown"
  | "downToUp"
  | "rightToLeftWithFade"
  | "leftToRightWithFade"
  | "zoom"
  | "zoomOut"
  | "cupertino"
  | "cupertinoDialog"
  | "none";

export interface TransitionStates {
  initial: Record<string, string | number>;
  exit: Record<string, string | number>;
}

export const transitionPresets: Record<DocdTransitionName, TransitionStates> = {
  fade: {
    initial: { opacity: 0 },
    exit: { opacity: 0 },
  },
  rightToLeft: {
    initial: { x: "100%", opacity: 0 },
    exit: { x: "-30%", opacity: 0 },
  },
  leftToRight: {
    initial: { x: "-100%", opacity: 0 },
    exit: { x: "30%", opacity: 0 },
  },
  upToDown: {
    initial: { y: "-100%", opacity: 0 },
    exit: { y: "30%", opacity: 0 },
  },
  downToUp: {
    initial: { y: "100%", opacity: 0 },
    exit: { y: "-30%", opacity: 0 },
  },
  rightToLeftWithFade: {
    initial: { x: "60%", opacity: 0 },
    exit: { x: "-60%", opacity: 0 },
  },
  leftToRightWithFade: {
    initial: { x: "-60%", opacity: 0 },
    exit: { x: "60%", opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.85, opacity: 0 },
    exit: { scale: 1.1, opacity: 0 },
  },
  zoomOut: {
    initial: { scale: 1.15, opacity: 0 },
    exit: { scale: 0.85, opacity: 0 },
  },
  cupertino: {
    initial: { x: "2%", opacity: 0 },
    exit: { x: "-2%", opacity: 0 },
  },
  cupertinoDialog: {
    initial: { y: "2%", scale: 0.95, opacity: 0 },
    exit: { y: "2%", opacity: 0 },
  },
  none: {
    initial: {},
    exit: {},
  },
};

export const ANIMATE_IDENTITY = { x: 0, y: 0, scale: 1, opacity: 1 } as const;
