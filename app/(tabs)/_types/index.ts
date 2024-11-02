import { ISharedAPIResponse } from "../../../interfaces/index";

export interface IFileData {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  userId: string;
  _id: string;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUploadFileResponse extends ISharedAPIResponse {
  data: IFileData;
}
export interface IGetAllUploadedFilesResponse extends ISharedAPIResponse {
  data: IFileData[];
}

export interface IUploadFilePayload {
  id: string;
  url: string;
}

export interface IGetFileContentResponse extends ISharedAPIResponse {
  data: string;
}
