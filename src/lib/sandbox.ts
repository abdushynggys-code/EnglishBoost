let active = false;
export function setSandboxMode(value: boolean) {
  active = value;
}
export function assertLiveMutation() {
  if (active) throw Error("This action is disabled in the developer sandbox.");
}

export const isSandboxMode = () => active;
