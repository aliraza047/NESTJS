import { GraphQLError } from 'graphql';

export function formatGraphQLError(error: GraphQLError) {
  const originalError: any = error.extensions?.exception;

  // Extract messages (for example from validation errors)
  const message = Array.isArray(originalError?.response?.message)
    ? originalError.response.message.join(', ')
    : originalError?.message || error.message;

  // Compose consistent error response structure
  return {
    success: false,
    message,
    errorCode: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
    // locations: error.locations,
    // path: error.path,
  };
}
