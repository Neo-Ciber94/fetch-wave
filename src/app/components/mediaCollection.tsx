"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AudiosCollection } from "./collections/audioCollection";
import { ImagesCollection } from "./collections/imageCollection";
import { VideosCollection } from "./collections/videoCollection";

export function MediaCollection() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold mx-auto w-full">Collection</h3>

      <Tabs defaultValue="audios" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger value="audios">Audios</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="audios">
          <AudiosCollection />
        </TabsContent>

        <TabsContent value="videos">
          <VideosCollection />
        </TabsContent>

        <TabsContent value="images">
          <ImagesCollection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
