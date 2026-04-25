export default defineNuxtPlugin(() => {
  const router = useRouter();
  const direction = useState<"forward" | "back">("nav-direction", () => "forward");

  let currentPosition = window?.history?.state?.position ?? 0;

  router.beforeEach(() => {
    const nextPosition = window?.history?.state?.position ?? 0;
    direction.value = nextPosition < currentPosition ? "back" : "forward";
  });

  router.afterEach(() => {
    currentPosition = window?.history?.state?.position ?? 0;
  });
});
