import { useCallback } from "react";
import { router } from "expo-router";
import { DoorScene } from "@/components/DoorScene";
import { rememberDoor } from "@/lib/store";

export default function Door() {
  const done = useCallback(() => {
    rememberDoor();
    router.replace({ pathname: "/(tabs)", params: { fromDoor: "1" } });
  }, []);
  return <DoorScene onDone={done} />;
}
