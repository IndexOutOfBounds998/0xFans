export type VideoData = {
  url: string;
  alt: string;
  cover: string;
};

export type VideosPreview = (VideoData & {
  id: string;
})[];

export type VideoPreview = VideoData & { id: string };
export type FileWithId = File & { id: string };

export type FilesWithId = (File & {
  id: string;
})[];
