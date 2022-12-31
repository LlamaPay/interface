import { LlamaPay, StreamArrows } from '~/components/Icons';

const AnimatedStream = () => {
  return (
    <div className="relative mx-auto sm:mt-[35%]">
      <StreamArrows />
      <div className="absolute top-0 bottom-0 right-0 left-0 m-auto">
        <LlamaPay />
      </div>
    </div>
  );
};

export default AnimatedStream;
