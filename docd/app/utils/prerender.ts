export const addPrerenderPath = (path: string) => {
  const event = useRequestEvent();
  const res = event?.node?.res;
  if (res) {
    res.setHeader(
      "x-nitro-prerender",
      [res.getHeader("x-nitro-prerender"), path].filter(Boolean).join(",")
    );
  }
};
