/**
 * Custom uploaders for Editor.js that use Saleor's GraphQL mutations
 * instead of direct HTTP endpoints. This avoids CORS issues.
 */

import { ApolloClient } from "@apollo/client";
import { FileUploadDocument } from "@dashboard/graphql";

/**
 * Image uploader for Editor.js Image Tool
 * Uses Saleor's fileUpload GraphQL mutation
 */
export const createImageUploader = (client: ApolloClient<any>) => ({
  /**
   * Upload image by file
   */
  uploadByFile: async (file: File) => {
    try {
      const { data } = await client.mutate({
        mutation: FileUploadDocument,
        variables: { file },
      });

      if (data?.fileUpload?.errors?.length > 0) {
        const error = data.fileUpload.errors[0];

        throw new Error(error.message || "Upload failed");
      }

      const uploadedFile = data?.fileUpload?.uploadedFile;

      if (!uploadedFile?.url) {
        throw new Error("No URL returned from upload");
      }

      // Return Editor.js expected format
      return {
        success: 1,
        file: {
          url: uploadedFile.url,
        },
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  },

  /**
   * Upload image by URL
   * Note: Saleor's fileUpload only accepts File objects,
   * so we need to fetch the URL and convert to File first
   */
  uploadByUrl: async (url: string) => {
    try {
      // Fetch the image
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();
      const filename = url.split("/").pop() || "image.jpg";
      const file = new File([blob], filename, { type: blob.type });

      // Use the same upload logic
      return await createImageUploader(client).uploadByFile(file);
    } catch (error) {
      console.error("Image URL upload failed:", error);
      throw error;
    }
  },
});

/**
 * File uploader for Editor.js Attaches Tool
 * Uses Saleor's fileUpload GraphQL mutation
 */
export const createFileUploader = (client: ApolloClient<any>) => ({
  /**
   * Upload file
   */
  uploadByFile: async (file: File) => {
    try {
      const { data } = await client.mutate({
        mutation: FileUploadDocument,
        variables: { file },
      });

      if (data?.fileUpload?.errors?.length > 0) {
        const error = data.fileUpload.errors[0];

        throw new Error(error.message || "Upload failed");
      }

      const uploadedFile = data?.fileUpload?.uploadedFile;

      if (!uploadedFile?.url) {
        throw new Error("No URL returned from upload");
      }

      // Return Editor.js Attaches Tool expected format
      return {
        success: 1,
        file: {
          url: uploadedFile.url,
          name: file.name,
          size: file.size,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        },
      };
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  },
});
