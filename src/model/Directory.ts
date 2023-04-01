import { File } from "./File";

export type Directory = {
  children: File[];
  fileDomain: string;
  targetDire: string;
};
