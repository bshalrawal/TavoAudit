import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useReviews() {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews');
      return response.data;
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });

  return { reviewsQuery, createReviewMutation };
}
