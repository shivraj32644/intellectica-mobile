import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useUserLibrary } from "./_hooks/useUploadFile";
import { apiInstance } from "@/config/axios-config";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import axios from "axios";
import PDFGridView from "./_components/PDFGridView";

// Define the FileInfo type as the success result
type FileInfo = DocumentPicker.DocumentPickerSuccessResult;

const HomeScreen: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { useUploadFiles, useGetAllUploadedFiles } = useUserLibrary();
  const { data: uploadedFiles, refetch: refetchUploadedFiles } =
    useGetAllUploadedFiles("670a56913770a95eed49fd5a");

  const pickDocument = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.canceled) {
        setLoading(false);
        return;
      }
      const assets = result.assets;
      if (!assets) return;
      const file = assets[0];

      const formData = new FormData();

      const response = await fetch(file.uri);
      const blob = await response.blob();

      formData.append("pdf", blob, file.name);
      formData.append("userId", "670a56913770a95eed49fd5a");
      useUploadFiles.mutate(formData, {
        onSuccess: (data) => {
          console.log("data", data);
          setFileInfo(null);
          setError("");
          refetchUploadedFiles();
        },
        onError: (err) => {
          console.log("err", err);
          setError("Error uploading the file");
          setFileInfo(null);
        },
      });

      const data = await response.json();
      setLoading(false);
      console.log("Upload response:", data);
    } catch (err) {
      setError("Error picking the document");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Upload Your PDF</Text>
          <Text style={styles.subtitle}>
            Select a PDF file to start reading
          </Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickDocument}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="cloud-upload" size={24} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>Choose File</Text>
              </>
            )}
          </TouchableOpacity>

          {fileInfo && (
            <View style={styles.fileInfo}>
              <MaterialIcons name="description" size={24} color="#4CAF50" />
              {/* <Text style={styles.fileName}>{fileInfo.name}</Text> */}
            </View>
          )}

          {error !== "" && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error" size={24} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <PDFGridView pdfFiles={uploadedFiles?.data} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 3,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
  },
  errorText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#F44336",
  },
});

export default HomeScreen;
