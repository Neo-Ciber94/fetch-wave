import { MediaCollection } from "./components/mediaCollection";
import { MediaSearcher } from "./components/mediaSearcher";

export const runtime = "edge";

export default function Home() {
  return (
    <div className="h-screen w-full container mx-auto p-4 space-y-4">
      <MediaSearcher />
      <hr />
      <MediaCollection />
    </div>
  );
}
