import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useReviews } from '@/hooks/useReviews';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters')
});

export default function ReviewForm() {
  const { createReviewMutation } = useReviews();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: any) => {
    createReviewMutation.mutate(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input {...register('title')} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea {...register('content')} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        {errors.content && <span className="text-red-500 text-sm">{errors.content.message as string}</span>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Review</button>
    </form>
  );
}
