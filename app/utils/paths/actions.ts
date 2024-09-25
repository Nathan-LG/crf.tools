import { usePathname } from "next/navigation";

export default function getPageType(): string {
  const array = usePathname().split("/");
  return array[array.length - 1];
}
