import { apiInstance } from "@/config/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IGetAllUploadedFilesResponse,
  IGetFileContentResponse,
  IUploadFileResponse,
} from "../_types";
import axios, { AxiosError } from "axios";

export const useUserLibrary = () => {
  const useUploadFiles = useMutation({
    mutationFn: async (payload: any) => {
      console.log("payload", JSON.stringify(payload, null, 2));
      const response = await axios.post<IUploadFileResponse>(
        `http://192.168.1.6:8888/api/user-library/upload-file-for-native`,
        payload
      );
      console.log("response", response);
      return response.data;
    },
    onSuccess: () => {
      // do something globally
    },
    onError: (err: AxiosError<IUploadFileResponse>) => {
      return err;
    },
  });

  const useGetAllUploadedFiles = (userId: string) => {
    return useQuery({
      queryKey: ["GET_ALL_UPLOADED_FILES"],
      queryFn: async () => {
        const response = await apiInstance.get<IGetAllUploadedFilesResponse>(
          `/user-library/all-files?userId=${userId}`
        );

        return response.data;
      },
      enabled: userId ? true : false,
      refetchOnWindowFocus: false,
    });
  };
  const useFileContent = ({
    userId,
    fileId,
  }: {
    userId: string;
    fileId: string;
  }) => {
    return useQuery({
      queryKey: ["GET_FILE_CONTENT"],
      queryFn: async () => {
        const response = await apiInstance.get<IGetFileContentResponse>(
          `/user-library/file/${fileId}?userId=${userId}`
        );
        return response.data;
      },
      enabled: userId ? true : false,
      refetchOnWindowFocus: false,
    });
  };

  return { useUploadFiles, useGetAllUploadedFiles, useFileContent };
};
