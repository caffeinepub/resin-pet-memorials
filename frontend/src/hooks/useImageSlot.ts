import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useImageSlot(key: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string | undefined>({
    queryKey: ['imageSlot', key],
    queryFn: async () => {
      if (!actor) return undefined;
      const slot = await actor.getBlobByKey(key);
      if (!slot) return undefined;
      return slot.blob.getDirectURL();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
