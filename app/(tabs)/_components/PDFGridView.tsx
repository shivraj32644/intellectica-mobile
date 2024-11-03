import { Link, router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface PDFFile {
  _id: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
}

const ModernPDFLibrary: React.FC<{ pdfFiles?: PDFFile[] }> = ({ pdfFiles }) => {
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // In a real application, you would generate actual thumbnails here
    const placeholderThumbnails = pdfFiles?.reduce((acc, file) => {
      acc[file._id] = `https://picsum.photos/300/400?random=${file._id}`;
      return acc;
    }, {} as { [key: string]: string });
    setThumbnails(placeholderThumbnails ?? {});
  }, [pdfFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderItem = ({ item }: { item: PDFFile }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // Implement PDF viewing logic here
        router.push("/view-pdf");
        console.log("View PDF:", item.fileUrl);
      }}
    >
      <Link href={`/view-pdf`}>View PDF</Link>

      <>
        <Image
          source={{ uri: thumbnails[item._id] }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.gradient}>
          <Text className="font-semibold text-3xl text-white" numberOfLines={2}>
            {item.fileName}
          </Text>
          <Text style={styles.fileInfo}>
            {formatFileSize(item.fileSize)} • {formatDate(item.uploadDate)}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              // Implement PDF download logic here
              console.log("Download PDF:", item.fileUrl);
            }}
          >
            <Icon name="download" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Your Digital Library</Text>
      </View>
      <FlatList
        data={pdfFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const cardWidth = (windowWidth - 48) / 2; // 2 columns with 16px padding on each side and 16px gap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    padding: 16,
    paddingTop: Number(StatusBar?.currentHeight ?? 0) + 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  gridContainer: {
    padding: 16,
  },
  card: {
    width: cardWidth,
    aspectRatio: 3 / 4,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
    justifyContent: "flex-end",
    padding: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  fileInfo: {
    fontSize: 12,
    color: "#CCCCCC",
  },
  iconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  iconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
});

export default ModernPDFLibrary;
