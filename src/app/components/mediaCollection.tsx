"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AudiosCollection } from "./collections/audioCollection";
import { ImagesCollection } from "./collections/imageCollection";
import { VideosCollection } from "./collections/videoCollection";
import { useMediaCollectionTab } from "@/lib/core";
import { SupportedMediaType } from "@/lib/models";

export function MediaCollection() {
  const [mediaCollectionTab, setMediaCollectionTab] = useMediaCollectionTab();

  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold mx-auto w-full">Collection</h3>

      <Tabs
        value={mediaCollectionTab}
        onValueChange={(tab) =>
          setMediaCollectionTab(tab as SupportedMediaType)
        }
        className="w-full h-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="audio">Audios</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="audio">
          <AudiosCollection />
        </TabsContent>

        <TabsContent value="video">
          <VideosCollection />
        </TabsContent>

        <TabsContent value="image">
          <ImagesCollection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
