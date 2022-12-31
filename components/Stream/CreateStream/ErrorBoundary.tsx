import { FallbackContainer } from '~/components/Fallback';

const ErrorBoundary = ({ message }: { message: string }) => {
  return (
    <FallbackContainer>
      <p>{message}</p>
    </FallbackContainer>
  );
};

export default ErrorBoundary;
