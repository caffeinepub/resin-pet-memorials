import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

export function useUploadImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: async ({ key, file, name }: { key: string; file: File; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      setUploadProgress(0);
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
      await actor.uploadBlob(key, blob, name);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['imageSlot', variables.key] });
      queryClient.invalidateQueries({ queryKey: ['imageSlots'] });
      setUploadProgress(0);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  return { ...mutation, uploadProgress };
}
