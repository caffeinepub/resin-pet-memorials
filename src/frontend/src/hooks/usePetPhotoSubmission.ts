import { useState } from 'react';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function usePetPhotoSubmission() {
  const { actor } = useActor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const submitPhoto = async (file: File) => {
    if (!actor) {
      setErrorMessage('Unable to connect to the service. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      // Convert file to bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with upload progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Submit to backend
      await actor.storePhoto(file.name, blob);

      setSuccessMessage('Your pet\'s photo has been uploaded successfully! We\'ll be in touch soon to discuss your memorial design.');
      setUploadProgress(100);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrorMessage('Failed to upload photo. Please try again or contact support if the problem persists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetState = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setUploadProgress(0);
  };

  return {
    submitPhoto,
    isSubmitting,
    successMessage,
    errorMessage,
    uploadProgress,
    resetState
  };
}
